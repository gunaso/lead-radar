import { type NextRequest } from "next/server"

import { createClient } from "@/lib/supabase/server"
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
    const supabase = await createClient()
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("onboarding, workspace, name, role")
      .eq("user_id", authResult.userId)
      .single()

    if (profileError || !profile) {
      return errorResponse("Profile not found", 404)
    }

    // Fetch workspace data if it exists
    let workspaceData = null
    if (profile.workspace) {
      const { data: workspace } = await supabase
        .from("workspaces")
        .select("id, name, company, website, employees, keywords_suggested")
        .eq("id", profile.workspace)
        .single()

      // Fetch linked keywords for this workspace
      let linkedKeywords: string[] = []
      // Fetch linked subreddits (names) and enrich with metadata
      let linkedSubreddits: Array<{ name: string; title?: string | null; description?: string | null; description_reddit?: string | null; created_at?: string | null; total_members?: number | null }> = []
      // Fetch competitors linked to this workspace
      let linkedCompetitors: Array<{ name: string; website?: string | null }> = []
      try {
        const { data: linkRows } = await supabase
          .from("workspaces_keywords")
          .select("keyword")
          .eq("workspace", profile.workspace)

        const keywordIds = (linkRows || [])
          .map((r: { keyword?: number }) => r.keyword)
          .filter((id: unknown): id is number => typeof id === "number")

        if (keywordIds.length > 0) {
          const { data: keywordRows } = await supabase
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
        const { data: subLinks } = await supabase
          .from("workspaces_subreddits")
          .select("subreddit")
          .eq("workspace", profile.workspace)

        const subredditIds = (subLinks || [])
          .map((r: { subreddit?: number }) => r.subreddit)
          .filter((id: unknown): id is number => typeof id === "number")

        if (subredditIds.length > 0) {
          const { data: subRows } = await supabase
            .from("subreddits")
            .select("name, title, description, description_reddit, created_at, total_members")
            .in("id", subredditIds)

          linkedSubreddits = (subRows || []).map((s: {
            name?: string | null
            title?: string | null
            description?: string | null
            description_reddit?: string | null
            created_at?: string | null
            total_members?: number | null
          }) => ({
            name: s?.name || "",
            title: s?.title ?? null,
            description: s?.description ?? null,
            description_reddit: s?.description_reddit ?? null,
            created_at: s?.created_at ?? null,
            total_members: typeof s?.total_members === 'number' ? s.total_members : null,
          })).filter((s) => (s.name || "").length > 0)
        }
      } catch (e) {
        // Non-fatal; ignore fetch issues
      }

      // Load competitors
      try {
        const { data: competitorsRows } = await supabase
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
    const supabase = await createClient()
    const { error: updateError } = await supabase
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

