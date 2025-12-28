import { NextResponse } from "next/server"

import { createClient } from "@/lib/supabase/server"

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params
  const commentId = params.id
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("workspace")
    .eq("user_id", user.id)
    .single()

  const workspaceId = profile?.workspace

  if (!workspaceId) {
    return NextResponse.json({ error: "No workspace" }, { status: 403 })
  }

  // Parallel checks
  // 1. Comment is tracked by keywords in this workspace
  const keywordCheck = supabase
    .from("reddit_comments_keywords")
    .select(
      "keyword, keywords!inner(id, workspaces_keywords!inner(workspace))"
    )
    .eq("comment", commentId)
    .eq("keywords.workspaces_keywords.workspace", workspaceId)
    .limit(1)
    .maybeSingle()

  // 2. Comment matches a tracked subreddit in this workspace (via its Post)
  // We need to check if the comment's post is in a tracked subreddit.
  // Complex join: comment -> post -> subreddit -> workspace_subreddits
  const subredditCheck = supabase
      .from("reddit_comments")
      .select(`
        post!inner (
          subreddit,
          subreddits!inner (
             id,
             workspaces_subreddits!inner (workspace)
          )
        )
      `)
      .eq("id", commentId)
      .eq("post.subreddits.workspaces_subreddits.workspace", workspaceId)
      .limit(1)
      .maybeSingle()

  // 3. Comment is manually tracked/interacted with in this workspace?
  // Check workspaces_reddit_comments
  const trackingCheck = supabase
      .from("workspaces_reddit_comments")
      .select("workspace")
      .eq("comment", commentId)
      .eq("workspace", workspaceId)
      .limit(1)
      .maybeSingle()

  const [keywordRes, subredditRes, trackingRes] = await Promise.all([
    keywordCheck,
    subredditCheck,
    trackingCheck,
  ])

  const hasAccess = !!(
    keywordRes.data ||
    subredditRes.data ||
    trackingRes.data
  )

  return NextResponse.json({ access: hasAccess })
}
