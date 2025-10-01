import { type NextRequest } from "next/server"

import { createAdminClient } from "@/lib/supabase/admin"
import { authenticateRequest } from "@/lib/api/auth"
import { errorResponse, successResponse, handleUnexpectedError } from "@/lib/api/responses"

export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateRequest()
    if (!authResult.success) {
      return authResult.response
    }

    // Fetch user profile with onboarding status
    const adminClient = createAdminClient()
    const { data: profile, error: profileError } = await adminClient
      .from("profiles")
      .select("onboarding, workspace")
      .eq("user_id", authResult.userId)
      .single()

    if (profileError || !profile) {
      return errorResponse("Profile not found", 404)
    }

    // Fetch workspace data if it exists
    let workspaceData = null
    if (profile.workspace) {
      const { data: workspace } = await adminClient
        .from("workspaces")
        .select("id, name, company, website, employees")
        .eq("id", profile.workspace)
        .single()

      workspaceData = workspace
    }

    return successResponse({
      profile: {
        onboarding: profile.onboarding ?? 0,
        workspace: workspaceData,
      },
    })
  } catch (error) {
    return handleUnexpectedError(error, "GET /api/profile")
  }
}

