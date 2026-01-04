import { type NextRequest } from "next/server"

import { authenticateRequest } from "@/lib/api/auth"
import { errorResponse, successResponse, handleUnexpectedError } from "@/lib/api/responses"
import { createRLSClient } from "@/lib/supabase/server"
import { type ScoreType } from "@/types/reddit"

async function getWorkspaceId(rlsClient: Awaited<ReturnType<typeof createRLSClient>>, userId: string): Promise<string | null> {
  const { data: profile } = await rlsClient
    .from("profiles")
    .select("workspace")
    .eq("user_id", userId)
    .single<{ workspace: string | null }>()
  return profile?.workspace ?? null
}

const mapScoreToNumber = (score: ScoreType): number => {
  switch (score) {
    case "Prime": return 100
    case "High": return 75
    case "Medium": return 45
    case "Low": return 10
    default: return 0 // Provide a default for safety, though type ensures one of the above
  }
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
    const { score } = body as { score: ScoreType }

    if (!score) {
      return errorResponse("Score is required", 400)
    }

    const rlsClient = await createRLSClient()
    const workspaceId = await getWorkspaceId(rlsClient, authResult.userId)
    if (!workspaceId) {
      return errorResponse("User has no workspace", 400)
    }

    // Check if entry exists in workspaces_reddit_posts
    const { data: existingEntry } = await rlsClient
      .from("workspaces_reddit_posts")
      .select("id")
      .eq("workspace", workspaceId)
      .eq("post", id)
      .single()

    const scoreValue = mapScoreToNumber(score)

    if (existingEntry) {
      // Update existing
      const { error } = await rlsClient
        .from("workspaces_reddit_posts")
        .update({ score: scoreValue })
        .eq("id", existingEntry.id)

      if (error) {
        throw error
      }
    } else {
      // Create new
      // "When creating a new entry, if the creation is invoked by changing the score, then it should use the default status which is 0"
      const { error } = await rlsClient
        .from("workspaces_reddit_posts")
        .insert({
          workspace: workspaceId,
          post: id,
          score: scoreValue,
          status: "0", // Default status: Needs Review
          created_by: authResult.userId
        })

      if (error) {
        throw error
      }
    }

    return successResponse({ success: true })

  } catch (error) {
    return handleUnexpectedError(error, "POST /api/posts/[id]/score")
  }
}
