import { type NextRequest, NextResponse } from "next/server"

import { authenticateRequest } from "@/lib/api/auth"
import { errorResponse, successResponse, handleUnexpectedError } from "@/lib/api/responses"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import {
  findOrCreateKeywordId,
  markKeywordProcessFalseIfUnlinked,
  markKeywordProcessTrue,
} from "@/lib/api/keywords-utils"

type KeywordResponse = {
  id: string
  name: string
  owner: {
    name: string
    image: string | null
  }
  posts: number
  comments: number
  createdAt: string
}

async function getWorkspaceId(supabase: Awaited<ReturnType<typeof createClient>>, userId: string): Promise<string | null> {
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
      return successResponse<{ keywords: KeywordResponse[] }>({ keywords: [] })
    }

    // Fetch keyword links for this workspace, including keyword entity
    const { data: links, error: linksError } = await supabase
      .from("workspaces_keywords")
      .select("created_at, created_by, keyword:keyword ( id, name )")
      .eq("workspace", workspaceId)

    if (linksError) {
      return errorResponse("Failed to load keywords", 500)
    }

    const createdByIds = Array.from(
      new Set((links || [])
        .map((l: any) => l?.created_by)
        .filter((v: unknown): v is string => typeof v === "string" && v.length > 0))
    )

    // Load owner names (no avatar field available in profiles schema)
    const ownersById = new Map<string, { name: string; image: string | null }>()
    if (createdByIds.length > 0) {
      const { data: owners } = await supabase
        .from("profiles")
        .select("user_id, name")
        .in("user_id", createdByIds)
      for (const row of owners || []) {
        const uid = (row as any)?.user_id as string
        ownersById.set(uid, { name: String((row as any)?.name || "Unknown"), image: null })
      }
    }

    // Collect workspace-scoped post and comment IDs to compute counts
    const [{ data: wsPosts }, { data: wsComments }] = await Promise.all([
      supabase.from("workspaces_reddit_posts").select("post").eq("workspace", workspaceId),
      supabase.from("workspaces_reddit_comments").select("comment").eq("workspace", workspaceId),
    ])
    const workspacePostIds = (wsPosts || [])
      .map((r: { post?: string }) => r.post)
      .filter((id: unknown): id is string => typeof id === "string")
    const workspaceCommentIds = (wsComments || [])
      .map((r: { comment?: string }) => r.comment)
      .filter((id: unknown): id is string => typeof id === "string")

    // Compute counts per keyword (scoped to workspace if possible)
    const keywordIds = (links || [])
      .map((l: any) => (l?.keyword as any)?.id)
      .filter((id: unknown): id is string => typeof id === "string")

    const postsCountByKeyword = new Map<string, number>()
    const commentsCountByKeyword = new Map<string, number>()

    await Promise.all(
      keywordIds.map(async (kid) => {
        // Posts count
        if (workspacePostIds.length > 0) {
          const { count: pCount } = await supabase
            .from("reddit_posts_keywords")
            .select("id", { count: "exact", head: true })
            .eq("keyword", kid)
            .in("post", workspacePostIds)
          postsCountByKeyword.set(kid, pCount ?? 0)
        } else {
          postsCountByKeyword.set(kid, 0)
        }
        // Comments count
        if (workspaceCommentIds.length > 0) {
          const { count: cCount } = await supabase
            .from("reddit_comments_keywords")
            .select("id", { count: "exact", head: true })
            .eq("keyword", kid)
            .in("comment", workspaceCommentIds)
          commentsCountByKeyword.set(kid, cCount ?? 0)
        } else {
          commentsCountByKeyword.set(kid, 0)
        }
      })
    )

    const items: KeywordResponse[] = (links || [])
      .map((l: any) => {
        const k = (l?.keyword as any) || {}
        const keywordId = String(k?.id || "")
        if (!keywordId) return null
        const owner =
          ownersById.get(String(l?.created_by || "")) ||
          { name: "Unknown", image: null }
        return {
          id: keywordId,
          name: String(k?.name || ""),
          owner,
          posts: postsCountByKeyword.get(keywordId) ?? 0,
          comments: commentsCountByKeyword.get(keywordId) ?? 0,
          createdAt: String(l?.created_at || ""),
        } as KeywordResponse
      })
      .filter(Boolean) as KeywordResponse[]

    return successResponse({ keywords: items })
  } catch (error) {
    return handleUnexpectedError(error, "GET /api/keywords")
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await authenticateRequest()
    if (!authResult.success) return authResult.response

    const supabase = await createClient()
    const admin = createAdminClient()
    const workspaceId = await getWorkspaceId(supabase, authResult.userId)
    if (!workspaceId) return errorResponse("Workspace not found", 404)

    const body = await request.json().catch(() => ({}))
    const rawName = String((body?.name ?? "") as string).trim()
    if (!rawName) return errorResponse("Name is required", 400)

    // Find or create keyword using admin (RLS-safe)
    const keywordId = await findOrCreateKeywordId(admin, rawName)

    // Link to workspace (idempotent-ish: ignore duplicate error by checking existing)
    const { data: existingLink } = await supabase
      .from("workspaces_keywords")
      .select("id")
      .eq("workspace", workspaceId)
      .eq("keyword", keywordId)
      .maybeSingle<{ id: string }>()

    if (!existingLink?.id) {
      const { error: linkError } = await supabase.from("workspaces_keywords").insert({
        workspace: workspaceId,
        keyword: keywordId,
        created_by: authResult.userId,
      })
      if (linkError) {
        return errorResponse("Failed to link keyword", 500)
      }
    }

    // Ensure keyword is active when linked
    await markKeywordProcessTrue(admin, keywordId)

    // Build response payload (counts default to 0; client usually optimistically updates)
    return successResponse<KeywordResponse>({
      id: keywordId,
      name: rawName,
      owner: { name: "You", image: null },
      posts: 0,
      comments: 0,
      createdAt: new Date().toISOString(),
    })
  } catch (error) {
    return handleUnexpectedError(error, "POST /api/keywords")
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authResult = await authenticateRequest()
    if (!authResult.success) return authResult.response

    const supabase = await createClient()
    const admin = createAdminClient()
    const workspaceId = await getWorkspaceId(supabase, authResult.userId)
    if (!workspaceId) return errorResponse("Workspace not found", 404)

    const body = await request.json().catch(() => ({}))
    const keywordId = String((body?.id ?? "") as string).trim()
    if (!keywordId) return errorResponse("Keyword id is required", 400)

    const { error: delError } = await supabase
      .from("workspaces_keywords")
      .delete()
      .eq("workspace", workspaceId)
      .eq("keyword", keywordId)

    if (delError) {
      return errorResponse("Failed to remove keyword", 500)
    }

    // Use admin to check cross-workspace usage and update process flag
    await markKeywordProcessFalseIfUnlinked(admin, keywordId)

    return successResponse()
  } catch (error) {
    return handleUnexpectedError(error, "DELETE /api/keywords")
  }
}


