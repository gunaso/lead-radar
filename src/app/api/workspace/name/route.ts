import { type NextRequest } from "next/server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { validateWorkspaceNameFormat } from "@/lib/validations/workspace"
import { errorResponse, successResponse, handleUnexpectedError } from "@/lib/api/responses"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const rawName = searchParams.get("name") || ""
  const name = rawName.trim()

  if (!name) {
    return errorResponse("Workspace name is required", 400)
  }

  // Validate format before checking database
  const formatValidation = validateWorkspaceNameFormat(name)
  if (!formatValidation.ok) {
    return errorResponse(formatValidation.message || "Invalid workspace name format", 200)
  }

  try {
    // Get authenticated user and their workspace
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Get user's current workspace if authenticated
    let userWorkspaceId: number | null = null
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("workspace")
        .eq("user_id", user.id)
        .single()

      userWorkspaceId = profile?.workspace ?? null
    }

    // Check if name is taken by another workspace (excluding user's own)
    const admin = createAdminClient()
    let query = admin
      .from("workspaces" as const)
      .select("id", { count: "exact", head: true })
      .ilike("name", name)

    // Exclude user's own workspace from the check
    if (userWorkspaceId) {
      query = query.neq("id", userWorkspaceId)
    }

    const { count, error } = await query

    if (error) {
      return errorResponse("Failed to validate name", 500)
    }

    const isTaken = (count ?? 0) > 0
    if (isTaken) {
      return errorResponse("Workspace name is already taken", 200)
    }

    return successResponse()
  } catch (error) {
    return handleUnexpectedError(error, "GET /api/workspace/name")
  }
}


