import { type NextRequest } from "next/server"

import { authenticateRequest } from "@/lib/api/auth"
import { errorResponse, successResponse, handleUnexpectedError } from "@/lib/api/responses"
import { createClient } from "@/lib/supabase/server"
import { type ScoreType } from "@/types/reddit"

async function getWorkspaceId(supabase: Awaited<ReturnType<typeof createClient>>, userId: string): Promise<string | null> {
  const { data: profile } = await supabase
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
    default: return 0
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

    const supabase = await createClient()
    const workspaceId = await getWorkspaceId(supabase, authResult.userId)
    if (!workspaceId) {
      return errorResponse("User has no workspace", 400)
    }

    // Check if entry exists for comments
    const { data: existingEntry } = await supabase
      .from("workspaces_reddit_comments")
      .select("id")
      .eq("workspace", workspaceId)
      .eq("comment", id)
      .single()

    const scoreValue = mapScoreToNumber(score)

    if (existingEntry) {
      const { error } = await supabase
        .from("workspaces_reddit_comments")
        .update({ score: scoreValue })
        .eq("id", existingEntry.id)

      if (error) throw error
    } else {
      // Default status 0
      const { error } = await supabase
        .from("workspaces_reddit_comments")
        .insert({
          workspace: workspaceId,
          comment: id,
          score: scoreValue,
          status: 0
        })

      if (error) throw error
    }

    return successResponse({ success: true })

  } catch (error) {
    return handleUnexpectedError(error, "POST /api/comments/[id]/score")
  }
}
