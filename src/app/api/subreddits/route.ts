import { type NextRequest } from "next/server"

import { errorResponse, successResponse, handleUnexpectedError } from "@/lib/api/responses"
import { authenticateRequest } from "@/lib/api/auth"
import { createClient } from "@/lib/supabase/server"
import type { TablesInsert } from "@/lib/db.types"

type SubredditResponse = {
  id: string
  name: string
  image: string | null
  owner: {
    name: string
    image: string | null
  }
  posts: number
  comments: number
  createdAt: string
}

async function getWorkspaceId(supabase: Awaited<ReturnType<typeof createClient>>, userId: string): Promise<string | null> {
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("workspace")
    .eq("user_id", userId)
    .maybeSingle<{ workspace: string | null }>()
  if (error) {
    // Propagate unexpected errors (e.g., DB issues or >1 row)
    throw error
  }
  return profile?.workspace ?? null
}

export async function GET(_request: NextRequest) {
  try {
    const authResult = await authenticateRequest()
    if (!authResult.success) return authResult.response

    const supabase = await createClient()
    const workspaceId = await getWorkspaceId(supabase, authResult.userId)
    if (!workspaceId) {
      return successResponse<{ subreddits: SubredditResponse[] }>({ subreddits: [] })
    }

    // Fetch subreddit links for this workspace, including subreddit entity
    const { data: links, error: linksError } = await supabase
      .from("workspaces_subreddits")
      .select("created_at, created_by, subreddit:subreddit ( id, name, image )")
      .eq("workspace", workspaceId)

    if (linksError) {
      return errorResponse("Failed to load subreddits", 500)
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

    // Map post -> subreddit for posts scoped to the workspace
    const postIdToSubredditId = new Map<string, string>()
    if (workspacePostIds.length > 0) {
      const { data: postRows } = await supabase
        .from("reddit_posts")
        .select("id, subreddit")
        .in("id", workspacePostIds)
      for (const row of postRows || []) {
        const id = (row as any)?.id as string
        const sub = (row as any)?.subreddit as string
        if (id && sub) postIdToSubredditId.set(id, sub)
      }
    }

    // For comments, get comment -> post mapping then ensure we know the post's subreddit
    const commentIdToPostId = new Map<string, string>()
    let commentPostIds: string[] = []
    if (workspaceCommentIds.length > 0) {
      const { data: commentRows } = await supabase
        .from("reddit_comments")
        .select("id, post")
        .in("id", workspaceCommentIds)
      for (const row of commentRows || []) {
        const id = (row as any)?.id as string
        const post = (row as any)?.post as string
        if (id && post) {
          commentIdToPostId.set(id, post)
          commentPostIds.push(post)
        }
      }
    }
    // Fetch any missing posts (from comments) to resolve subreddit mapping
    const missingPostIds = commentPostIds.filter((pid) => !postIdToSubredditId.has(pid))
    if (missingPostIds.length > 0) {
      const { data: extraPosts } = await supabase
        .from("reddit_posts")
        .select("id, subreddit")
        .in("id", missingPostIds)
      for (const row of extraPosts || []) {
        const id = (row as any)?.id as string
        const sub = (row as any)?.subreddit as string
        if (id && sub) postIdToSubredditId.set(id, sub)
      }
    }

    // Compute counts per subreddit
    const postsCountBySubreddit = new Map<string, number>()
    for (const [, subId] of postIdToSubredditId) {
      postsCountBySubreddit.set(subId, (postsCountBySubreddit.get(subId) ?? 0) + 1)
    }
    const commentsCountBySubreddit = new Map<string, number>()
    for (const [, postId] of commentIdToPostId) {
      const subId = postIdToSubredditId.get(postId)
      if (!subId) continue
      commentsCountBySubreddit.set(subId, (commentsCountBySubreddit.get(subId) ?? 0) + 1)
    }

    const items: SubredditResponse[] = (links || [])
      .map((l: any) => {
        const s = (l?.subreddit as any) || {}
        const subredditId = String(s?.id || "")
        if (!subredditId) return null
        const owner =
          ownersById.get(String(l?.created_by || "")) ||
          { name: "Unknown", image: null }
        const rawName = String(s?.name || "")
        return {
          id: subredditId,
          name: rawName ? `r/${rawName}` : "",
          image: (s?.image as string) ?? null,
          owner,
          posts: postsCountBySubreddit.get(subredditId) ?? 0,
          comments: commentsCountBySubreddit.get(subredditId) ?? 0,
          createdAt: String(l?.created_at || ""),
        } as SubredditResponse
      })
      .filter(Boolean) as SubredditResponse[]

    return successResponse({ subreddits: items })
  } catch (error) {
    return handleUnexpectedError(error, "GET /api/subreddits")
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
    if (!rawName) return errorResponse("Name is required", 400)
    const canonical = rawName.replace(/^r\//i, "")

    // Find existing subreddit (case-insensitive)
    const { data: existing } = await supabase
      .from("subreddits")
      .select("id, name, image")
      .ilike("name", canonical)
      .maybeSingle<{ id: string; name: string; image: string | null }>()

    let subredditId: string
    let subredditImage: string | null = existing?.image ?? null

    if (existing?.id) {
      subredditId = existing.id
      // Optionally update metadata if provided
      const details = body?.details as Partial<{ title?: string | null; description?: string | null; description_reddit?: string | null; community_icon?: string | null }> | undefined
      const updatePayload: Record<string, unknown> = {}
      if (details) {
        if (typeof details.title === "string") updatePayload.title = details.title
        if (typeof details.description === "string") updatePayload.description = details.description
        if (typeof details.description_reddit === "string") updatePayload.description_reddit = details.description_reddit
        if (typeof details.community_icon === "string" && details.community_icon.length > 0) {
          const sanitized = details.community_icon.split("?")[0]
          if (sanitized && sanitized !== (existing?.image ?? null)) {
            updatePayload.image = sanitized
            subredditImage = sanitized
          }
        }
      }
      if (Object.keys(updatePayload).length > 0) {
        await supabase.from("subreddits").update(updatePayload).eq("id", subredditId)
      }
    } else {
      // Create new subreddit row (best-effort metadata)
      const details = body?.details as Partial<{ title?: string | null; description?: string | null; description_reddit?: string | null; community_icon?: string | null }> | undefined
      const insertPayload: TablesInsert<"subreddits"> = { name: canonical.toLowerCase() }
      if (details) {
        if (typeof details.title === "string") insertPayload.title = details.title
        if (typeof details.description === "string") insertPayload.description = details.description
        if (typeof details.description_reddit === "string") insertPayload.description_reddit = details.description_reddit
        if (typeof details.community_icon === "string" && details.community_icon.length > 0) {
          const sanitized = details.community_icon.split("?")[0]
          insertPayload.image = sanitized
          subredditImage = sanitized
        }
      }
      const { data: newRow, error } = await supabase
        .from("subreddits")
        .insert(insertPayload)
        .select("id")
        .single()
      if (error || !newRow) return errorResponse("Failed to create subreddit", 500)
      subredditId = newRow.id
    }

    // Link to workspace (ignore if already linked)
    const { data: existingLink } = await supabase
      .from("workspaces_subreddits")
      .select("id")
      .eq("workspace", workspaceId)
      .eq("subreddit", subredditId)
      .maybeSingle<{ id: string }>()
    if (!existingLink?.id) {
      const { error: linkError } = await supabase.from("workspaces_subreddits").insert({
        workspace: workspaceId,
        subreddit: subredditId,
        created_by: authResult.userId,
      })
      if (linkError) return errorResponse("Failed to link subreddit", 500)
    }

    // Build response payload (counts default to 0; client uses optimistic UI)
    return successResponse<SubredditResponse>({
      id: subredditId,
      name: `r/${canonical}`,
      image: subredditImage,
      owner: { name: "You", image: null },
      posts: 0,
      comments: 0,
      createdAt: new Date().toISOString(),
    })
  } catch (error) {
    return handleUnexpectedError(error, "POST /api/subreddits")
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
    const subredditId = String((body?.id ?? "") as string).trim()
    if (!subredditId) return errorResponse("Subreddit id is required", 400)

    const { error: delError } = await supabase
      .from("workspaces_subreddits")
      .delete()
      .eq("workspace", workspaceId)
      .eq("subreddit", subredditId)
    if (delError) return errorResponse("Failed to remove subreddit", 500)

    return successResponse()
  } catch (error) {
    return handleUnexpectedError(error, "DELETE /api/subreddits")
  }
}


