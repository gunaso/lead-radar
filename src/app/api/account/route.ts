import { NextResponse, type NextRequest } from "next/server"

import { authenticateRequest } from "@/lib/api/auth"
import { errorResponse, successResponse, handleUnexpectedError } from "@/lib/api/responses"
import { createAdminClient } from "@/lib/supabase/admin"
import { createClient as createServerSupabase } from "@/lib/supabase/server"

export async function DELETE(_request: NextRequest) {
  try {
    const authResult = await authenticateRequest()
    if (!authResult.success) return authResult.response

    const admin = createAdminClient()

    // Proactively remove dependent rows, then delete user once to avoid initial failure logs
    const { error: wsErr } = await admin.from("workspaces").delete().eq("owner", authResult.userId)
    if (wsErr) {
      console.error("Error deleting dependent workspaces:", wsErr)
      return errorResponse(
        `Database error deleting workspace data${wsErr.message ? `: ${wsErr.message}` : ""}`,
        500
      )
    }
    const { error: profileErr } = await admin.from("profiles").delete().eq("user_id", authResult.userId)
    if (profileErr) {
      console.error("Error deleting dependent profile:", profileErr)
      return errorResponse(
        `Database error deleting profile data${profileErr.message ? `: ${profileErr.message}` : ""}`,
        500
      )
    }

    // Now delete the user from auth
    const { error: deleteError } = await admin.auth.admin.deleteUser(authResult.userId)
    if (deleteError) {
      console.error("Error deleting user from auth:", deleteError)
      return errorResponse(
        `Database error deleting user${deleteError.message ? `: ${deleteError.message}` : ""}`,
        500
      )
    }

    // Best-effort: clear cookies for the session
    try {
      const ssr = await createServerSupabase()
      await ssr.auth.signOut({ scope: "global" })
    } catch {
      // ignore
    }

    return successResponse()
  } catch (error) {
    return handleUnexpectedError(error, "DELETE /api/account")
  }
}


