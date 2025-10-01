import { type NextRequest } from "next/server"

import { validateCompanyNameFormat } from "@/lib/validations/workspace"
import { errorResponse, successResponse } from "@/lib/api/responses"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const companyName = searchParams.get("companyName") || ""
  const name = companyName.trim()

  if (!name) {
    return errorResponse("Company name is required", 400)
  }

  // Validate format
  const formatValidation = validateCompanyNameFormat(name)
  if (!formatValidation.ok) {
    return errorResponse(formatValidation.message || "Invalid company name format", 200)
  }

  return successResponse()
}