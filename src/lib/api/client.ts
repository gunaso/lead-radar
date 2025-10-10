// Centralized browser/client-side HTTP helper for JSON APIs
// - Adds JSON headers
// - Parses JSON
// - Normalizes errors

export type ApiError = Error & {
  status?: number
  data?: unknown
}

export async function request<TResponse>(
  input: string,
  init?: RequestInit & { signal?: AbortSignal }
): Promise<TResponse> {
  const response = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  })

  const contentType = response.headers.get("Content-Type") || ""

  if (!response.ok) {
    let data: unknown
    try {
      data = contentType.includes("application/json")
        ? await response.json()
        : await response.text()
    } catch {
      // ignore parse error
    }

    const error: ApiError = new Error(
      (typeof data === "object" && data && (data as any).message) ||
        response.statusText ||
        "Request failed"
    )
    error.status = response.status
    error.data = data
    throw error
  }

  if (!contentType.includes("application/json")) {
    return (await response.text()) as TResponse
  }

  return (await response.json()) as TResponse
}



