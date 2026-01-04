import { NextResponse } from "next/server"

type ApiResponse<T = unknown> = {
  ok: boolean
  message?: string
  details?: unknown
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
  const isProd = process.env.NODE_ENV === "production"

  if (!isProd) {
    const message = error instanceof Error ? error.message : "Unexpected server error"
    const details =
      error instanceof Error
        ? { name: error.name, message: error.message, stack: error.stack }
        : error
    return NextResponse.json({ ok: false, message, details }, { status: 500 })
  }

  return errorResponse("Unexpected server error", 500)
}

