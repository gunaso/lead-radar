import { type NextRequest, NextResponse } from "next/server"
import { promises as dns } from "dns"

// Validate website format, DNS, and reachability
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const rawWebsite = searchParams.get("website") || ""
  const website = rawWebsite.trim()

  if (!website) {
    // Treat empty as valid (optional field)
    return NextResponse.json({ ok: true })
  }

  try {
    // Step 1: Validate URL format and normalize
    let normalizedWebsite: string
    let hostname: string
    
    try {
      const url = new URL(website.startsWith("http") ? website : `https://${website}`)
      normalizedWebsite = url.origin
      hostname = url.hostname
    } catch {
      return NextResponse.json(
        { ok: false, message: "Invalid website URL format" },
        { status: 400 }
      )
    }

    // Step 2: DNS Lookup - verify domain exists
    try {
      await dns.resolve(hostname)
    } catch (error) {
      return NextResponse.json(
        { ok: false, message: "Domain does not exist or cannot be resolved" },
        { status: 400 }
      )
    }

    // Step 3: HTTP Request - verify website is reachable
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000) // 5 second timeout

      const response = await fetch(normalizedWebsite, {
        method: "HEAD",
        signal: controller.signal,
        redirect: "follow",
      })

      clearTimeout(timeoutId)

      // Check if response is successful (2xx or 3xx status codes)
      if (!response.ok && response.status >= 400) {
        return NextResponse.json(
          { ok: false, message: "Website is not reachable or returned an error" },
          { status: 400 }
        )
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        return NextResponse.json(
          { ok: false, message: "Website took too long to respond" },
          { status: 400 }
        )
      }

      // Try with GET request as fallback (some servers don't support HEAD)
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000)

        const response = await fetch(normalizedWebsite, {
          method: "GET",
          signal: controller.signal,
          redirect: "follow",
        })

        clearTimeout(timeoutId)

        if (!response.ok && response.status >= 400) {
          return NextResponse.json(
            { ok: false, message: "Website is not reachable or returned an error" },
            { status: 400 }
          )
        }
      } catch {
        return NextResponse.json(
          { ok: false, message: "Website is not reachable" },
          { status: 400 }
        )
      }
    }

    return NextResponse.json({ ok: true, website: normalizedWebsite })
  } catch (error) {
    console.error("Website validation error:", error)
    return NextResponse.json(
      { ok: false, message: "Unexpected server error" },
      { status: 500 }
    )
  }
}


