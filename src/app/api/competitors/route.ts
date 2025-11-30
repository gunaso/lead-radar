import { type NextRequest, NextResponse } from "next/server"

import { authenticateRequest } from "@/lib/api/auth"
import {
  errorResponse,
  successResponse,
  handleUnexpectedError,
} from "@/lib/api/responses"
import { createClient } from "@/lib/supabase/server"

type CompetitorResponse = {
  id: string
  name: string
  website: string | null
  owner: {
    name: string
    image: string | null
  }
  createdAt: string
}

async function getWorkspaceId(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
): Promise<string | null> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("workspace")
    .eq("user_id", userId)
    .single<{ workspace: string | null }>()
  return profile?.workspace ?? null
}

export async function GET(_request: NextRequest) {
  try {
    const authResult = await authenticateRequest()
    if (!authResult.success) return authResult.response

    const supabase = await createClient()
    const workspaceId = await getWorkspaceId(supabase, authResult.userId)
    if (!workspaceId) {
      return successResponse<{ competitors: CompetitorResponse[] }>({
        competitors: [],
      })
    }

    const { data, error } = await supabase
      .from("competitors")
      .select("id, name, website, created_at, created_by")
      .eq("workspace", workspaceId)
      .order("created_at", { ascending: false })

    if (error) {
      return errorResponse("Failed to load competitors", 500)
    }

    const createdByIds = Array.from(
      new Set(
        (data || [])
          .map((r: any) => r?.created_by)
          .filter((v: unknown): v is string => typeof v === "string" && !!v)
      )
    )
    const ownersById = new Map<string, { name: string; image: string | null }>()
    if (createdByIds.length > 0) {
      const { data: owners } = await supabase
        .from("profiles")
        .select("user_id, name")
        .in("user_id", createdByIds)
      for (const row of owners || []) {
        const uid = (row as any)?.user_id as string
        ownersById.set(uid, {
          name: String((row as any)?.name || "Unknown"),
          image: null,
        })
      }
    }

    const items: CompetitorResponse[] = (data || []).map((r: any) => ({
      id: String(r?.id || ""),
      name: String(r?.name || ""),
      website: (r?.website as string | null) ?? null,
      owner: ownersById.get(String(r?.created_by || "")) || {
        name: "Unknown",
        image: null,
      },
      createdAt: String(r?.created_at || ""),
    }))

    return successResponse({ competitors: items })
  } catch (error) {
    return handleUnexpectedError(error, "GET /api/competitors")
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await authenticateRequest()
    if (!authResult.success) return authResult.response

    const supabase = await createClient()
    const workspaceId = await getWorkspaceId(supabase, authResult.userId)
    if (!workspaceId) return errorResponse("Workspace not found", 404)

    const body = await request.json().catch(() => ({}))
    const rawName = String((body?.name ?? "") as string).trim()
    const rawWebsite = String((body?.website ?? "") as string).trim()
    if (!rawName) return errorResponse("Name is required", 400)

    const { data, error } = await supabase
      .from("competitors")
      .insert({
        workspace: workspaceId,
        name: rawName,
        website: rawWebsite || null,
        created_by: authResult.userId,
      })
      .select("id, name, website, created_at, created_by")
      .single()

    if (error || !data) {
      return errorResponse("Failed to create competitor", 500)
    }

    const owner =
      (
        await supabase
          .from("profiles")
          .select("name")
          .eq("user_id", authResult.userId)
          .maybeSingle<{ name: string | null }>()
      ).data || null

    return successResponse<CompetitorResponse>({
      id: String((data as any).id),
      name: String((data as any).name),
      website: ((data as any).website as string | null) ?? null,
      owner: { name: String(owner?.name || "You"), image: null },
      createdAt: String((data as any).created_at),
    })
  } catch (error) {
    return handleUnexpectedError(error, "POST /api/competitors")
  }
}

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  try {
    const authResult = await authenticateRequest()
    if (!authResult.success) return authResult.response

    const supabase = await createClient()
    const workspaceId = await getWorkspaceId(supabase, authResult.userId)
    if (!workspaceId) return errorResponse("Workspace not found", 404)

    const body = await request.json().catch(() => ({}))
    const id = String((body?.id ?? "") as string).trim()
    if (!id) return errorResponse("Competitor id is required", 400)
    const name =
      typeof body?.name === "string" ? String(body.name).trim() : undefined
    const website =
      typeof body?.website === "string"
        ? String(body.website).trim() || null
        : undefined

    const updates: Record<string, unknown> = {
      updated_by: authResult.userId,
      updated_at: new Date().toISOString(),
    }
    if (typeof name === "string") updates.name = name
    if (typeof website !== "undefined") updates.website = website

    const { data, error } = await supabase
      .from("competitors")
      .update(updates)
      .eq("id", id)
      .eq("workspace", workspaceId)
      .select("id, name, website, created_at, created_by")
      .single()

    if (error || !data) {
      return errorResponse("Failed to update competitor", 500)
    }

    const owner =
      (
        await supabase
          .from("profiles")
          .select("name")
          .eq("user_id", (data as any).created_by as string)
          .maybeSingle<{ name: string | null }>()
      ).data || null

    return successResponse<CompetitorResponse>({
      id: String((data as any).id),
      name: String((data as any).name),
      website: ((data as any).website as string | null) ?? null,
      owner: { name: String(owner?.name || "Unknown"), image: null },
      createdAt: String((data as any).created_at),
    })
  } catch (error) {
    return handleUnexpectedError(error, "PATCH /api/competitors")
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authResult = await authenticateRequest()
    if (!authResult.success) return authResult.response

    const supabase = await createClient()
    const workspaceId = await getWorkspaceId(supabase, authResult.userId)
    if (!workspaceId) return errorResponse("Workspace not found", 404)

    const body = await request.json().catch(() => ({}))
    const id = String((body?.id ?? "") as string).trim()
    if (!id) return errorResponse("Competitor id is required", 400)

    const { error } = await supabase
      .from("competitors")
      .delete()
      .eq("id", id)
      .eq("workspace", workspaceId)

    if (error) {
      return errorResponse("Failed to delete competitor", 500)
    }

    return successResponse()
  } catch (error) {
    return handleUnexpectedError(error, "DELETE /api/competitors")
  }
}


