import { type NextRequest } from "next/server"

import { createClient } from "@/lib/supabase/server"
import { authenticateRequest } from "@/lib/api/auth"
import { errorResponse, successResponse, handleUnexpectedError } from "@/lib/api/responses"
import { profileStepSchema } from "@/lib/validations/profile"

export async function PATCH(request: NextRequest) {
  try {
    const authResult = await authenticateRequest()
    if (!authResult.success) {
      return authResult.response
    }

    // Parse and validate request body
    const parsed = profileStepSchema.safeParse(await request.json())
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0]?.message ?? "Invalid input", 400)
    }
    const { step } = parsed.data

    // Update profile's onboarding step
    const supabase = await createClient()
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ onboarding: step })
      .eq("user_id", authResult.userId)

    if (updateError) {
      console.error("Error updating onboarding step:", updateError)
      return errorResponse("Failed to update onboarding step", 500)
    }

    return successResponse()
  } catch (error) {
    return handleUnexpectedError(error, "PATCH /api/profile/step")
  }
}

