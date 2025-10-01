import { type NextRequest } from "next/server"

import { createAdminClient } from "@/lib/supabase/admin"
import { authenticateRequest } from "@/lib/api/auth"
import { errorResponse, successResponse, handleUnexpectedError } from "@/lib/api/responses"

export async function PATCH(request: NextRequest) {
  try {
    const authResult = await authenticateRequest()
    if (!authResult.success) {
      return authResult.response
    }

    // Parse request body
    const body = await request.json()
    const { step } = body

    // Validate step
    if (typeof step !== "number" || step < 0 || step > 5) {
      return errorResponse("Invalid step value", 400)
    }

    // Update profile's onboarding step
    const adminClient = createAdminClient()
    const { error: updateError } = await adminClient
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

