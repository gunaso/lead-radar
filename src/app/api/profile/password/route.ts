import { NextResponse, type NextRequest } from "next/server"

import { createClient as createServerSupabase } from "@/lib/supabase/server"
import { authenticateRequest } from "@/lib/api/auth"
import { errorResponse, successResponse, handleUnexpectedError } from "@/lib/api/responses"
import { changePasswordSchema } from "@/lib/validations/profile"
import { createClient as createAnonClient } from "@supabase/supabase-js"

export async function POST(request: NextRequest) {
  try {
    const authResult = await authenticateRequest()
    if (!authResult.success) return authResult.response

    const parsed = changePasswordSchema.safeParse(await request.json())
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0]?.message ?? "Invalid input", 400)
    }

    const { currentPassword, newPassword } = parsed.data

    const ssr = await createServerSupabase()
    const {
      data: { user },
    } = await ssr.auth.getUser()

    const email = user?.email
    if (!email) return errorResponse("Unable to resolve user email", 400)

    // Verify current password by attempting a sign-in with anon client (no cookie side-effects)
    const neutral = createAnonClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { error: verifyErr } = await neutral.auth.signInWithPassword({ email, password: currentPassword })
    if (verifyErr) {
      return errorResponse("Current password is incorrect", 401)
    }

    const { error: updateErr } = await ssr.auth.updateUser({ password: newPassword })
    if (updateErr) return errorResponse(updateErr.message || "Failed to update password", 400)

    return successResponse()
  } catch (error) {
    return handleUnexpectedError(error, "POST /api/profile/password")
  }
}


