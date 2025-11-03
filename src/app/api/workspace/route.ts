import { type NextRequest, NextResponse } from "next/server"

import { errorResponse, successResponse, handleUnexpectedError } from "@/lib/api/responses"
import { createWorkspaceSchema, updateWorkspaceSchema } from "@/lib/validations/workspace"
import { normalizeWebsiteUrl } from "@/lib/api/url-utils"
import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import { authenticateRequest } from "@/lib/api/auth"
import { 
  linkCompetitorsToWorkspace,
  type SubredditDetailsInput,
  linkSubredditsToWorkspace,
  linkEntitiesToWorkspace,
} from "@/lib/api/workspace-entities"
import type { Database } from "@/lib/db.types"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const name = (searchParams.get("name") || "").trim()
  const website = (searchParams.get("website") || "").trim()

  if (!name) {
    return errorResponse("Name is required", 400)
  }

  try {
    // Use admin client for global name availability check (RLS restricts user visibility)
    const admin = createAdminClient()
    const { count, error } = await admin
      .from("workspaces" as const)
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

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const authResult = await authenticateRequest()
    if (!authResult.success) {
      return authResult.response
    }

    // Parse and validate request body
    const parsed = createWorkspaceSchema.safeParse(await request.json())
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0]?.message ?? "Invalid input", 400)
    }
    const { companyName, workspaceName, website, employees } = parsed.data

    // Validate required fields
    if (!companyName?.trim() || !workspaceName?.trim() || !employees) {
      return errorResponse(
        "Company name, workspace name, and employees are required",
        400
      )
    }

    const supabase = await createClient()

    // Check if user already has a workspace
    const { data: profile } = await supabase
      .from("profiles" as const)
      .select("workspace")
      .eq("user_id", authResult.userId)
      .single<{ workspace: string | null }>()

    const existingWorkspaceId = profile?.workspace

    let workspace: { id: string; name: string; company: string }

    if (existingWorkspaceId) {
      // Fetch current website to detect changes
      const { data: currentWs } = await supabase
        .from("workspaces" as const)
        .select("website")
        .eq("id", existingWorkspaceId)
        .single<{ website: string | null }>()

      const incomingWebsite = (website?.trim() || null) as string | null
      const normalizedIncoming = incomingWebsite ? normalizeWebsiteUrl(incomingWebsite) : null
      const normalizedCurrent = currentWs?.website ? normalizeWebsiteUrl(currentWs.website) : null
      const websiteChanged = website !== undefined && (normalizedCurrent ?? null) !== (normalizedIncoming ?? null)

      // Build updates object; reset derived fields if website changed
      const updates: Database['public']['Tables']['workspaces']['Update'] = {
        company: companyName.trim(),
        name: workspaceName.trim(),
        website: normalizedIncoming,
        employees: employees.trim() || null,
      }
      if (websiteChanged) {
        updates.website_md = null
        updates.website_ai = null
        updates.keywords_suggested = null
      }

      // User already has a workspace - update it instead of creating a new one
      const { data: updatedWorkspace, error: updateError } = await supabase
        .from("workspaces" as const)
        .update<Database['public']['Tables']['workspaces']['Update']>(updates)
        .eq("id", existingWorkspaceId)
        .select()
        .single<Database['public']['Tables']['workspaces']['Row']>()

      if (updateError || !updatedWorkspace) {
        console.error("Error updating existing workspace:", updateError)
        return errorResponse("Failed to update workspace", 500)
      }

      workspace = updatedWorkspace
    } else {
      // User doesn't have a workspace - create a new one
      const { data: newWorkspace, error: workspaceError } = await supabase
        .from("workspaces" as const)
        .insert<Database['public']['Tables']['workspaces']['Insert']>({
          owner: authResult.userId,
          company: companyName.trim(),
          name: workspaceName.trim(),
          website: (website ? normalizeWebsiteUrl(website.trim()) : null) || null,
          employees: employees.trim() || null,
        })
        .select()
        .single<Database['public']['Tables']['workspaces']['Row']>()

      if (workspaceError || !newWorkspace) {
        console.error("Error creating workspace:", workspaceError)
        return errorResponse("Failed to create workspace", 500)
      }

      workspace = newWorkspace

      // Link workspace to user profile
      const { error: profileError } = await supabase
        .from("profiles" as const)
        .update<Database['public']['Tables']['profiles']['Update']>({
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

    // Parse and validate request body
    const parsed = updateWorkspaceSchema.safeParse(await request.json())
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0]?.message ?? "Invalid input", 400)
    }
    const {
      workspaceId,
      companyName,
      workspaceName,
      website,
      employees,
      source,
      goal,
      keywords,
      subreddits,
      subredditsDetails,
      competitors,
      onboardingComplete,
    } = parsed.data

    if (!workspaceId) {
      return errorResponse("Workspace ID is required", 400)
    }

    const supabase = await createClient()

    // Verify workspace belongs to user
    const { data: workspace, error: fetchError } = await supabase
      .from("workspaces" as const)
      .select("id, owner, website")
      .eq("id", workspaceId)
      .single<{ id: string; owner: string; website: string | null }>()

    if (fetchError || !workspace || workspace.owner !== authResult.userId) {
      return errorResponse("Workspace not found or access denied", 404)
    }

    // Update workspace basic fields if provided
    if (companyName || workspaceName || website !== undefined || employees !== undefined || source !== undefined || goal !== undefined) {
      const updates: Database['public']['Tables']['workspaces']['Update'] = {}
      if (companyName !== undefined) updates.company = companyName.trim()
      if (workspaceName !== undefined) updates.name = workspaceName.trim()
      if (website !== undefined) {
        const incomingWebsite = website?.trim() || null
        const normalizedIncoming = incomingWebsite ? normalizeWebsiteUrl(incomingWebsite) : null
        const normalizedCurrent = workspace.website ? normalizeWebsiteUrl(workspace.website) : null
        updates.website = normalizedIncoming
        // Reset derived fields if website changed
        const websiteChanged = (normalizedCurrent ?? null) !== (normalizedIncoming ?? null)
        if (websiteChanged) {
          updates.website_md = null
          updates.website_ai = null
          updates.keywords_suggested = null
        }
      }
      if (employees !== undefined) updates.employees = employees?.trim() || null
      if (source !== undefined) updates.source = source ?? null
      if (goal !== undefined) updates.goal = goal ?? null

      const { error: updateError } = await supabase
        .from("workspaces" as const)
        .update<Database['public']['Tables']['workspaces']['Update']>(updates)
        .eq("id", workspaceId)

      if (updateError) {
        console.error("Error updating workspace:", updateError)
      }
    }

    // Only update each entity type if the corresponding payload was provided
    if (Array.isArray(keywords)) {
      await linkEntitiesToWorkspace('keywords', workspaceId, keywords, authResult.userId, supabase)
    }

    if (Array.isArray(subreddits)) {
      await linkSubredditsToWorkspace(
        workspaceId,
        subreddits,
        (subredditsDetails || []) as SubredditDetailsInput[],
        authResult.userId,
        supabase
      )
    }

    if (Array.isArray(competitors)) {
      await linkCompetitorsToWorkspace(workspaceId, competitors, authResult.userId, supabase)
    }

    // Mark onboarding as complete if requested
    if (onboardingComplete === true) {
      const { error: profileError } = await supabase
        .from("profiles" as const)
        .update<Database['public']['Tables']['profiles']['Update']>({ onboarding: -1, onboarded: true })
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


