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

    const { error: deleteError } = await admin.auth.admin.deleteUser(authResult.userId)
    if (deleteError) {
      return errorResponse(deleteError.message || "Failed to delete account", 400)
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


