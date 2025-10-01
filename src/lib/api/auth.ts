import { NextResponse } from "next/server"

import { createClient } from "@/lib/supabase/server"

export type AuthResult = 
  | { success: true; userId: string }
  | { success: false; response: NextResponse }

/**
 * Authenticates the current request and returns the user ID
 * @returns Either a success with userId or a failure with an error response
 */
export async function authenticateRequest(): Promise<AuthResult> {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return {
      success: false,
      response: NextResponse.json(
        { ok: false, message: "Unauthorized" },
        { status: 401 }
      ),
    }
  }

  return { success: true, userId: user.id }
}

