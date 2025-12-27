import { NextResponse } from "next/server"

import { createClient } from "@/lib/supabase/server"

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params
  const postId = params.id
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
  const [keywordCheck, subredditCheck, commentCheck] = await Promise.all([
    supabase
      .from("reddit_posts_keywords")
      .select(
        "keyword, keywords!inner(id, workspaces_keywords!inner(workspace))"
      )
      .eq("post", postId)
      .eq("keywords.workspaces_keywords.workspace", workspaceId)
      .limit(1)
      .maybeSingle(),

    supabase
      .from("reddit_posts")
      .select(
        "subreddit, subreddits!inner(id, workspaces_subreddits!inner(workspace))"
      )
      .eq("id", postId)
      .eq("subreddits.workspaces_subreddits.workspace", workspaceId)
      .limit(1)
      .maybeSingle(),

    supabase
      .from("reddit_comments")
      .select("id, workspaces_reddit_comments!inner(workspace)")
      .eq("post", postId)
      .eq("workspaces_reddit_comments.workspace", workspaceId)
      .limit(1)
      .maybeSingle(),
  ])

  const hasAccess = !!(
    keywordCheck.data ||
    subredditCheck.data ||
    commentCheck.data
  )

  return NextResponse.json({ access: hasAccess })
}
