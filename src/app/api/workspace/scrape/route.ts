import { type NextRequest, NextResponse } from "next/server"

import { authenticateRequest } from "@/lib/api/auth"
import { errorResponse, successResponse, handleUnexpectedError } from "@/lib/api/responses"
import { scrape } from "@/lib/firecrawl"
import { sendMessage } from "@/lib/openai"
import { createClient } from "@/lib/supabase/server"

type ScrapePayload = {
  workspaceId: number
  website: string
}

type AIAnalysisResult = {
  valid: boolean
  summary?: string
  keywords?: string[]
}

/**
 * POST /api/workspace/scrape
 * Scrapes a website using Firecrawl to gather content for personalization
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const authResult = await authenticateRequest()
    if (!authResult.success) {
      return authResult.response
    }

    const body: ScrapePayload = await request.json()
    const { workspaceId, website } = body

    if (!workspaceId || !website) {
      return errorResponse("Workspace ID and website are required", 400)
    }

    const trimmedWebsite = website.trim()
    if (!trimmedWebsite) {
      return errorResponse("Website cannot be empty", 400)
    }

    // Normalize URL
    let normalizedUrl: string
    try {
      const url = new URL(trimmedWebsite.startsWith("http") ? trimmedWebsite : `https://${trimmedWebsite}`)
      normalizedUrl = url.href
    } catch {
      return errorResponse("Invalid website URL", 400)
    }

    // Scrape the website using Firecrawl
    const scrapeResult = await scrape({ url: normalizedUrl })

    // Extract markdown content from scrape result
    const markdownContent = scrapeResult?.markdown || ""
    
    if (!markdownContent) {
      console.warn("No markdown content found in scrape result")
      return successResponse({ 
        message: "Website scraped but no content found",
        url: normalizedUrl
      })
    }

    // Process the scraped content with OpenAI
    const aiAnalysis = await sendMessage(markdownContent) as AIAnalysisResult

    // Store scraped data and AI analysis in workspace if valid
    if (aiAnalysis?.valid) {
      try {
        const supabase = await createClient()
        
        const updateData: {
          website_md: string
          website_ai?: string
          keywords_suggested?: string[]
        } = {
          website_md: markdownContent,
          website_ai: aiAnalysis.summary,
        }
        
        if (aiAnalysis.keywords && aiAnalysis.keywords.length > 0)
          updateData.keywords_suggested = aiAnalysis.keywords

        const { error: updateError } = await supabase
          .from("workspaces")
          .update(updateData)
          .eq("id", workspaceId)

        if (updateError) {
          console.error("Error updating workspace with scraped data:", updateError)
        }
      } catch (storeError) {
        console.error("Error storing scraped data:", storeError)
        // Continue execution even if storing data fails
      }
    }

    return successResponse({ 
      message: "Website scraped and analyzed successfully",
      url: normalizedUrl,
      analysis: aiAnalysis,
      dataStored: aiAnalysis?.valid || false
    })
  } catch (error) {
    console.error(error)
    return handleUnexpectedError(error, "POST /api/workspace/scrape")
  }
}