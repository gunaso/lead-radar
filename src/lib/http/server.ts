import { type NextRequest } from "next/server"

// Server-side fetch helper with timeout and JSON handling
export async function fetchJson<TResponse>(
  input: string,
  init?: RequestInit & { timeoutMs?: number }
): Promise<TResponse> {
  const controller = new AbortController()
  const timeoutMs = init?.timeoutMs ?? 5000
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const res = await fetch(input, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers || {}),
      },
      signal: controller.signal,
    })

    const contentType = res.headers.get("Content-Type") || ""
    const isJson = contentType.includes("application/json")

    if (!res.ok) {
      const errBody = isJson ? await res.json() : await res.text()
      const err = new Error(
        (typeof errBody === "object" && errBody && (errBody as any).message) ||
          res.statusText ||
          "Request failed"
      ) as Error & { status?: number; data?: unknown }
      err.status = res.status
      err.data = errBody
      throw err
    }

    return (isJson ? await res.json() : await res.text()) as TResponse
  } finally {
    clearTimeout(timeoutId)
  }
}



