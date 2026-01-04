import { type NextRequest, NextResponse } from "next/server"

import { authenticateRequest } from "@/lib/api/auth"
import { checkAndConsumeTicketRateLimit } from "@/lib/api/rate-limit"
import { errorResponse, handleUnexpectedError, successResponse } from "@/lib/api/responses"
import { sendFeedbackTicketEmail } from "@/lib/email/tickets"
import { createClient, createRLSClient } from "@/lib/supabase/server"
import { feedbackTicketSchema } from "@/lib/validations/tickets"

function getString(formData: FormData, key: string): string {
  const v = formData.get(key)
  return typeof v === "string" ? v : ""
}

function getInt(formData: FormData, key: string): number | undefined {
  const raw = getString(formData, key).trim()
  if (!raw) return undefined
  const n = Number.parseInt(raw, 10)
  return Number.isFinite(n) ? n : undefined
}

function getAttachmentMeta(formData: FormData): {
  name: string
  type?: string
  size?: number
} | null {
  const v = formData.get("attachment")
  if (!v || typeof v === "string") return null
  const file = v as File
  if (!file.name || file.size === 0) return null
  return { name: file.name, type: file.type || undefined, size: file.size }
}

async function getAttachmentFileBase64(formData: FormData): Promise<{
  filename: string
  contentBase64: string
} | null> {
  const v = formData.get("attachment")
  if (!v || typeof v === "string") return null
  const file = v as File
  if (!file.name || file.size === 0) return null

  const maxBytes = 10 * 1024 * 1024
  if (file.size > maxBytes) {
    throw new Error("Attachment too large")
  }

  const buf = Buffer.from(await file.arrayBuffer())
  return { filename: file.name, contentBase64: buf.toString("base64") }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await authenticateRequest()
    if (!authResult.success) {
      return authResult.response
    }

    const supabase = await createClient()
    const rlsClient = await createRLSClient()
    
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return errorResponse("Unauthorized", 401)
    }

    // Fetch user profile to get full name
    const { data: profile } = await rlsClient
      .from("profiles")
      .select("name")
      .eq("user_id", user.id)
      .single()

    const userFullName = profile?.name ?? null

    const formData = await request.formData()

    const contactEmail = (getString(formData, "email") || user.email || "").trim()
    const category = getString(formData, "category").trim()

    const raw = {
      category: category.length > 0 ? category : undefined,
      rating: getInt(formData, "rating"),
      feedback: getString(formData, "feedback").trim(),
      email: contactEmail,
      context_path: getString(formData, "context_path").trim() || undefined,
      attachment: getAttachmentMeta(formData) || undefined,
    }

    const parsed = feedbackTicketSchema.safeParse(raw)
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0]?.message ?? "Invalid input", 400)
    }

    const limit = await checkAndConsumeTicketRateLimit({
      supabase,
      userId: user.id,
      ticketType: "feedback",
    })

    if (!limit.allowed) {
      return NextResponse.json(
        {
          ok: false,
          message: "Too many feedback submissions. Please try again later.",
          retryAfterSeconds: limit.retryAfterSeconds,
        },
        { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
      )
    }

    const { data: inserted, error: insertError } = await rlsClient
      .from("feedback_tickets")
      .insert({
        user_id: user.id,
        email: parsed.data.email,
        category: parsed.data.category,
        rating: parsed.data.rating,
        feedback: parsed.data.feedback,
      })
      .select("id")
      .single()

    if (insertError || !inserted) {
      console.error("Failed to insert feedback ticket:", insertError)
      if (process.env.NODE_ENV !== "production") {
        return errorResponse(insertError?.message ?? "Failed to create feedback ticket", 500)
      }
      return errorResponse("Failed to create feedback ticket", 500)
    }

    let attachmentFile: { filename: string; contentBase64: string } | null = null
    try {
      attachmentFile = await getAttachmentFileBase64(formData)
    } catch {
      return errorResponse("Attachment too large (max 10MB)", 400)
    }

    await sendFeedbackTicketEmail({
      ticketType: "feedback",
      ticketId: inserted.id,
      userId: user.id,
      userEmail: parsed.data.email,
      userFullName,
      contextPath: parsed.data.context_path ?? null,
      attachment: parsed.data.attachment ?? null,
      attachmentFile,
      category: parsed.data.category,
      rating: parsed.data.rating,
      feedback: parsed.data.feedback,
    })

    return successResponse({ ticketId: inserted.id })
  } catch (error) {
    return handleUnexpectedError(error, "POST /api/tickets/feedback")
  }
}

