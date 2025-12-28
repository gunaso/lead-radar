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

  const { data: postData, error } = await supabase
    .from("reddit_posts")
    .select(`
      *,
      subreddits (*),
      reddit_users (*),
      reddit_posts_keywords (
        keywords (
          value
        )
      ),
      reddit_comments (
        *,
        reddit_users (*),
        workspaces_reddit_comments (
          status,
          score
        )
      ),
      workspaces_reddit_posts (
        status,
        score
      )
    `)
    .eq("id", postId)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!postData) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  // Handle Post Workspace Data Fallback
  const workspacePosts = postData.workspaces_reddit_posts as any[]
  if (!workspacePosts || workspacePosts.length === 0) {
    ;(postData as any).workspaces_reddit_posts = [{
      status: "0",
      score: postData.score
    }]
  }

  // Handle Comments Workspace Data Fallback
  if (postData.reddit_comments && Array.isArray(postData.reddit_comments)) {
    postData.reddit_comments.forEach((comment: any) => {
      const workspaceComments = comment.workspaces_reddit_comments as any[]
      if (!workspaceComments || workspaceComments.length === 0) {
        comment.workspaces_reddit_comments = [{
          status: "0",
          score: comment.score
        }]
      }
    })
  }

  return NextResponse.json(postData)
}
