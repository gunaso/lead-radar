import { type NextRequest } from "next/server"

import { authenticateRequest } from "@/lib/api/auth"
import { errorResponse, successResponse, handleUnexpectedError } from "@/lib/api/responses"
import { createClient } from "@/lib/supabase/server"
import { type StatusType } from "@/types/reddit"

async function getWorkspaceId(supabase: Awaited<ReturnType<typeof createClient>>, userId: string): Promise<string | null> {
  const { data: profile } = await supabase
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

    const supabase = await createClient()
    const workspaceId = await getWorkspaceId(supabase, authResult.userId)
    if (!workspaceId) {
      return errorResponse("User has no workspace", 400)
    }

    // Check if entry exists in workspaces_reddit_posts
    const { data: existingEntry } = await supabase
      .from("workspaces_reddit_posts")
      .select("id")
      .eq("workspace", workspaceId)
      .eq("post", id)
      .single()

    const statusValue = statusMap[status]

    if (existingEntry) {
      // Update existing
      const { error } = await supabase
        .from("workspaces_reddit_posts")
        .update({ status: statusValue })
        .eq("id", existingEntry.id)

      if (error) {
        throw error
      }
    } else {
      // Create new
      // "If the creation invoked by chaning the status then it should use the score that is set on the reddit_posts entry"
      
      // Fetch original post score
      const { data: originalPost, error: postError } = await supabase
        .from("reddit_posts")
        .select("score")
        .eq("id", id)
        .single()
      
      if (postError || !originalPost) {
        return errorResponse("Post not found", 404)
      }

      const { error } = await supabase
        .from("workspaces_reddit_posts")
        .insert({
          workspace: workspaceId,
          post: id,
          status: statusValue,
          score: originalPost.score,
          created_by: authResult.userId
        })

      if (error) {
        throw error
      }
    }

    return successResponse({ success: true })

  } catch (error) {
    return handleUnexpectedError(error, "POST /api/posts/[id]/status")
  }
}
