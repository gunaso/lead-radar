import { type NextRequest } from "next/server"

import { authenticateRequest } from "@/lib/api/auth"
import { errorResponse, successResponse, handleUnexpectedError } from "@/lib/api/responses"
import { createRLSClient } from "@/lib/supabase/server"
import { type StatusType } from "@/types/reddit"

async function getWorkspaceId(rlsClient: Awaited<ReturnType<typeof createRLSClient>>, userId: string): Promise<string | null> {
  const { data: profile } = await rlsClient
    .from("profiles")
    .select("workspace")
    .eq("user_id", userId)
    .single<{ workspace: string | null }>()
  return profile?.workspace ?? null
}

const statusMap: Record<StatusType, "-1" | "0" | "1" | "2" | "3"> = {
  "Archived": "-1",
  "Needs Review": "0",
  "Ready to Engage": "1",
  "Engaging": "2",
  "Engaged": "3",
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const authResult = await authenticateRequest()
    if (!authResult.success) return authResult.response

    const body = await request.json()
    const { status } = body as { status: StatusType }

    if (!status || statusMap[status] === undefined) {
      return errorResponse("Valid status is required", 400)
    }

    const rlsClient = await createRLSClient()
    const workspaceId = await getWorkspaceId(rlsClient, authResult.userId)
    if (!workspaceId) {
      return errorResponse("User has no workspace", 400)
    }

    const { data: existingEntry } = await rlsClient
      .from("workspaces_reddit_comments")
      .select("id")
      .eq("workspace", workspaceId)
      .eq("comment", id)
      .single()

    const statusValue = statusMap[status]

    if (existingEntry) {
      const { error } = await rlsClient
        .from("workspaces_reddit_comments")
        .update({ status: statusValue })
        .eq("id", existingEntry.id)

      if (error) throw error
    } else {
      // Fetch original comment score
      const { data: originalComment, error: commentError } = await rlsClient
        .from("reddit_comments")
        .select("score")
        .eq("id", id)
        .single()
      
      if (commentError || !originalComment) {
        return errorResponse("Comment not found", 404)
      }

      const { error } = await rlsClient
        .from("workspaces_reddit_comments")
        .insert({
          workspace: workspaceId,
          comment: id,
          status: statusValue,
          score: originalComment.score,
          created_by: authResult.userId
        })

      if (error) throw error
    }

    return successResponse({ success: true })

  } catch (error) {
    return handleUnexpectedError(error, "POST /api/comments/[id]/status")
  }
}
