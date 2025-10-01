import { NextResponse } from "next/server"

type ApiResponse<T = unknown> = {
  ok: boolean
  message?: string
} & T

/**
 * Creates a standardized error response
 */
export function errorResponse(
  message: string,
  status: number = 500
): NextResponse<ApiResponse> {
  return NextResponse.json({ ok: false, message }, { status })
}

/**
 * Creates a standardized success response
 */
export function successResponse<T extends Record<string, unknown> = Record<string, never>>(
  data?: T
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ ok: true, ...data } as ApiResponse<T>)
}

/**
 * Handles unexpected errors with consistent logging and response
 */
export function handleUnexpectedError(
  error: unknown,
  context: string
): NextResponse<ApiResponse> {
  console.error(`Unexpected error in ${context}:`, error)
  return errorResponse("Unexpected server error", 500)
}

