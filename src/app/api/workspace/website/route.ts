import { type NextRequest, NextResponse } from "next/server"
import { promises as dns } from "dns"
import { fetchJson } from "@/lib/http/server"

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
      // Use GET to allow CORS redirect/content-type detection; keep low timeout
      await fetchJson<string>(normalizedWebsite, { method: "GET", timeoutMs: 3000, redirect: "follow" })
    } catch (error: any) {
      if (error.name === "AbortError") {
        return NextResponse.json(
          { ok: false, message: "Website took too long to respond" },
          { status: 400 }
        )
      }

      // Try with GET request as fallback (some servers don't support HEAD)
      try {
        await fetchJson<string>(normalizedWebsite, { method: "GET", timeoutMs: 5000, redirect: "follow" })
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


