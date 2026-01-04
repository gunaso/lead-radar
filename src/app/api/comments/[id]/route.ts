import { NextResponse } from "next/server"

import { createClient, createRLSClient } from "@/lib/supabase/server"

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

  const rlsClient = await createRLSClient()
  const { data: profile } = await rlsClient
    .from("profiles")
    .select("workspace")
    .eq("user_id", user.id)
    .single()

  const workspaceId = profile?.workspace

  if (!workspaceId) {
    return NextResponse.json({ error: "No workspace" }, { status: 403 })
  }

  const { data: commentData, error } = await rlsClient
    .from("reddit_comments")
    .select(`
      *,
      reddit_users (*),
      reddit_comments_keywords (
        keywords (
          value
        )
      ),
      workspaces_reddit_comments (
        status,
        score
      ),
      post!inner (
        *,
        subreddits (*),
        reddit_users (*)
      )
    `)
    .eq("id", commentId)
    // Removed the .eq("workspaces_reddit_comments.workspace", workspaceId) to avoid forcing an INNER JOIN.
    // We rely on RLS to ensure `workspaces_reddit_comments` returns only the user's workspace data.
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!commentData) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  // Check if workspace-specific data exists
  const workspaceComments = commentData.workspaces_reddit_comments as any[]
  
  // If no workspace data found (array is empty), inject default values
  if (!workspaceComments || workspaceComments.length === 0) {
    const defaultStatus = "0" // Needs Review
    const defaultScore = commentData.score // from reddit_comments table
    
    // Inject synthetic record
    ;(commentData as any).workspaces_reddit_comments = [{
      status: defaultStatus,
      score: defaultScore
    }]
  }

  return NextResponse.json(commentData)
}
