import { type NextRequest, NextResponse } from "next/server"

import { createAdminClient } from "@/lib/supabase/admin"
import { authenticateRequest } from "@/lib/api/auth"
import { errorResponse, successResponse, handleUnexpectedError } from "@/lib/api/responses"
import { 
  linkEntitiesToWorkspace, 
  linkCompetitorsToWorkspace 
} from "@/lib/api/workspace-entities"
import { normalizeWebsiteUrl } from "@/lib/api/url-utils"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const name = (searchParams.get("name") || "").trim()
  const website = (searchParams.get("website") || "").trim()

  if (!name) {
    return errorResponse("Name is required", 400)
  }

  try {
    const supabase = createAdminClient()
    // Count workspaces whose name matches case-insensitively
    const { count, error } = await supabase
      .from("workspaces")
      .select("id", { count: "exact", head: true })
      .ilike("name", name)

    if (error) {
      return errorResponse("Failed to validate name", 500)
    }

    const isTaken = (count ?? 0) > 0
    if (isTaken) {
      return errorResponse("Workspace name is already taken", 200)
    }

    // Optional website normalization; respond with normalized website if provided
    let normalizedWebsite: string | null = null
    if (website) {
      normalizedWebsite = normalizeWebsiteUrl(website)
      if (!normalizedWebsite) {
        return errorResponse("Invalid website URL", 400)
      }
    }

    return successResponse({ website: normalizedWebsite })
  } catch (error) {
    return handleUnexpectedError(error, "GET /api/workspace")
  }
}

type CreateWorkspacePayload = {
  companyName: string
  workspaceName: string
  website?: string | null
  employees: string
}

type UpdateWorkspacePayload = {
  workspaceId: number
  companyName?: string
  workspaceName?: string
  website?: string | null
  employees?: string
  keywords?: string[]
  subreddits?: string[]
  competitors?: string[]
  onboardingComplete?: boolean
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const authResult = await authenticateRequest()
    if (!authResult.success) {
      return authResult.response
    }

    // Parse request body
    const body: CreateWorkspacePayload = await request.json()
    const { companyName, workspaceName, website, employees } = body

    // Validate required fields
    if (!companyName?.trim() || !workspaceName?.trim() || !employees) {
      return errorResponse(
        "Company name, workspace name, and employees are required",
        400
      )
    }

    const adminClient = createAdminClient()

    // Check if user already has a workspace
    const { data: profile } = await adminClient
      .from("profiles")
      .select("workspace")
      .eq("user_id", authResult.userId)
      .single()

    const existingWorkspaceId = profile?.workspace

    let workspace: { id: number; name: string; company: string }

    if (existingWorkspaceId) {
      // User already has a workspace - update it instead of creating a new one
      const { data: updatedWorkspace, error: updateError } = await adminClient
        .from("workspaces")
        .update({
          company: companyName.trim(),
          name: workspaceName.trim(),
          website: website?.trim() || null,
          employees: employees.trim() || null,
        })
        .eq("id", existingWorkspaceId)
        .select()
        .single()

      if (updateError || !updatedWorkspace) {
        console.error("Error updating existing workspace:", updateError)
        return errorResponse("Failed to update workspace", 500)
      }

      workspace = updatedWorkspace
    } else {
      // User doesn't have a workspace - create a new one
      const { data: newWorkspace, error: workspaceError } = await adminClient
        .from("workspaces")
        .insert({
          owner: authResult.userId,
          company: companyName.trim(),
          name: workspaceName.trim(),
          website: website?.trim() || null,
          employees: employees.trim() || null,
        })
        .select()
        .single()

      if (workspaceError || !newWorkspace) {
        console.error("Error creating workspace:", workspaceError)
        return errorResponse("Failed to create workspace", 500)
      }

      workspace = newWorkspace

      // Link workspace to user profile
      const { error: profileError } = await adminClient
        .from("profiles")
        .update({
          workspace: workspace.id,
          onboarding: 1,
        })
        .eq("user_id", authResult.userId)

      if (profileError) {
        console.error("Error updating profile:", profileError)
      }
    }

    return successResponse({
      workspace: {
        id: workspace.id,
        name: workspace.name,
        company: workspace.company,
      },
    })
  } catch (error) {
    return handleUnexpectedError(error, "POST /api/workspace")
  }
}

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  try {
    const authResult = await authenticateRequest()
    if (!authResult.success) {
      return authResult.response
    }

    // Parse request body
    const body: UpdateWorkspacePayload = await request.json()
    const {
      workspaceId,
      companyName,
      workspaceName,
      website,
      employees,
      keywords,
      subreddits,
      competitors,
      onboardingComplete,
    } = body

    if (!workspaceId) {
      return errorResponse("Workspace ID is required", 400)
    }

    const adminClient = createAdminClient()

    // Verify workspace belongs to user
    const { data: workspace, error: fetchError } = await adminClient
      .from("workspaces")
      .select("id, owner")
      .eq("id", workspaceId)
      .single()

    if (fetchError || !workspace || workspace.owner !== authResult.userId) {
      return errorResponse("Workspace not found or access denied", 404)
    }

    // Update workspace basic fields if provided
    if (companyName || workspaceName || website !== undefined || employees !== undefined) {
      const updates: Record<string, unknown> = {}
      updates.company = companyName?.trim() || null
      updates.name = workspaceName?.trim() || null
      updates.website = website?.trim() || null
      updates.employees = employees?.trim() || null

      const { error: updateError } = await adminClient
        .from("workspaces")
        .update(updates)
        .eq("id", workspaceId)

      if (updateError) {
        console.error("Error updating workspace:", updateError)
      }
    }

    // Link keywords, subreddits, and competitors using helper functions
    await linkEntitiesToWorkspace('keywords', workspaceId, keywords || [], authResult.userId)
    await linkEntitiesToWorkspace('subreddits', workspaceId, subreddits || [], authResult.userId)
    await linkCompetitorsToWorkspace(workspaceId, competitors || [], authResult.userId)

    // Mark onboarding as complete if requested
    if (onboardingComplete === true) {
      const { error: profileError } = await adminClient
        .from("profiles")
        .update({ onboarding: -1 })
        .eq("user_id", authResult.userId)

      if (profileError) {
        console.error("Error updating profile onboarding status:", profileError)
      }
    }

    return successResponse()
  } catch (error) {
    return handleUnexpectedError(error, "PATCH /api/workspace")
  }
}


