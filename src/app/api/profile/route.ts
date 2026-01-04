import { type NextRequest } from "next/server"

import { createRLSClient } from "@/lib/supabase/server"
import { authenticateRequest } from "@/lib/api/auth"
import { errorResponse, successResponse, handleUnexpectedError } from "@/lib/api/responses"
import { updateProfileSchema } from "@/lib/validations/profile"

export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateRequest()
    if (!authResult.success) {
      return authResult.response
    }

    // Fetch user profile with onboarding status
    const rlsClient = await createRLSClient()
    const { data: profile, error: profileError } = await rlsClient
      .from("profiles")
      .select("onboarding, onboarded, workspace, name, role")
      .eq("user_id", authResult.userId)
      .single()

    if (profileError || !profile) {
      return errorResponse("Profile not found", 404)
    }

    // Fetch workspace data if it exists
    let workspaceData = null
    if (profile.workspace) {
      const { data: workspace } = await rlsClient
        .from("workspaces")
        .select("id, name, company, website, employees, keywords_suggested, source, goal")
        .eq("id", profile.workspace)
        .single()

      // Fetch linked keywords for this workspace
      let linkedKeywords: string[] = []
      // Fetch linked subreddits (names) and enrich with metadata
      let linkedSubreddits: Array<{ name: string; title?: string | null; description?: string | null; description_reddit?: string | null; created_at?: string | null; total_members?: number | null }> = []
      // Fetch competitors linked to this workspace
      let linkedCompetitors: Array<{ name: string; website?: string | null }> = []
      try {
        const { data: linkRows } = await rlsClient
          .from("workspaces_keywords")
          .select("keyword")
          .eq("workspace", profile.workspace)

        const keywordIds = (linkRows || [])
          .map((r: { keyword?: string }) => r.keyword)
          .filter((id: unknown): id is string => typeof id === "string")

        if (keywordIds.length > 0) {
          const { data: keywordRows } = await rlsClient
            .from("keywords")
            .select("name")
            .in("id", keywordIds)

          linkedKeywords = (keywordRows || [])
            .map((k: { name?: string }) => (k.name || "").trim())
            .filter((n) => n.length > 0)
        }
      } catch (e) {
        // Non-fatal; ignore fetch issues and leave linkedKeywords empty
      }

      try {
        const { data: subLinks } = await rlsClient
          .from("workspaces_subreddits")
          .select("subreddit")
          .eq("workspace", profile.workspace)

        const subredditIds = (subLinks || [])
          .map((r: { subreddit?: string }) => r.subreddit)
          .filter((id: unknown): id is string => typeof id === "string")

        if (subredditIds.length > 0) {
          const { data: subRows } = await rlsClient
            .from("subreddits")
            .select("name, title, description, description_reddit, imported_at")
            .in("id", subredditIds)

          linkedSubreddits = (subRows || []).map((s: {
            name?: string | null
            title?: string | null
            description?: string | null
            description_reddit?: string | null
            imported_at?: string | null
          }) => ({
            name: s?.name || "",
            title: s?.title ?? null,
            description: s?.description ?? null,
            description_reddit: s?.description_reddit ?? null,
            created_at: s?.imported_at ?? null,
            total_members: null,
          })).filter((s) => (s.name || "").length > 0)
        }
      } catch (e) {
        // Non-fatal; ignore fetch issues
      }

      // Load competitors
      try {
        const { data: competitorsRows } = await rlsClient
          .from("competitors")
          .select("name, website")
          .eq("workspace", profile.workspace)

        linkedCompetitors = (competitorsRows || [])
          .map((c: { name?: string | null; website?: string | null }) => ({
            name: (c?.name || "").trim(),
            website: (c?.website || "").trim() || null,
          }))
          .filter((c) => (c.name || "").length > 0)
      } catch (e) {
        // Non-fatal; ignore fetch issues
      }

      workspaceData = workspace ? { ...workspace, keywords: linkedKeywords, subreddits: linkedSubreddits, competitors: linkedCompetitors } : null
    }

    return successResponse({
      profile: {
        onboarding: profile.onboarding ?? 0,
        onboarded: Boolean(profile.onboarded),
        workspace: workspaceData,
        name: profile.name || "",
        role: profile.role || "",
      },
    })
  } catch (error) {
    return handleUnexpectedError(error, "GET /api/profile")
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const authResult = await authenticateRequest()
    if (!authResult.success) {
      return authResult.response
    }

    // Parse and validate request body
    const parsed = updateProfileSchema.safeParse(await request.json())
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0]?.message ?? "Invalid input", 400)
    }
    const { name, role } = parsed.data
    
    // Build update object
    const updateData: Record<string, string> = {}
    if (name !== undefined) updateData.name = name.trim()
    if (role !== undefined) updateData.role = role.trim()
    
    if (Object.keys(updateData).length === 0) {
      return errorResponse("No valid fields to update", 400)
    }

    // Update profile
    const rlsClient = await createRLSClient()
    const { error: updateError } = await rlsClient
      .from("profiles")
      .update(updateData)
      .eq("user_id", authResult.userId)

    if (updateError) {
      console.error("Error updating profile:", updateError)
      return errorResponse("Failed to update profile", 500)
    }

    return successResponse()
  } catch (error) {
    return handleUnexpectedError(error, "PATCH /api/profile")
  }
}

