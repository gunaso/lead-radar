import { type NextRequest } from "next/server"

import { authenticateRequest } from "@/lib/api/auth"
import { errorResponse, successResponse, handleUnexpectedError } from "@/lib/api/responses"
import { createClient } from "@/lib/supabase/server"
import { PostType } from "@/types/reddit"

async function getWorkspaceId(supabase: Awaited<ReturnType<typeof createClient>>, userId: string): Promise<string | null> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("workspace")
    .eq("user_id", userId)
    .single<{ workspace: string | null }>()
  return profile?.workspace ?? null
}

export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateRequest()
    if (!authResult.success) return authResult.response

    const supabase = await createClient()
    const workspaceId = await getWorkspaceId(supabase, authResult.userId)
    if (!workspaceId) {
      return successResponse({ data: [], nextCursor: undefined })
    }

    const searchParams = request.nextUrl.searchParams
    const cursor = parseInt(searchParams.get("cursor") || "0", 10)
    const limit = parseInt(searchParams.get("limit") || "20", 10)
    
    // Filters
    const keywordsParam = searchParams.get("keywords")?.split(",").filter(Boolean)
    const subredditsParam = searchParams.get("subreddits")?.split(",").filter(Boolean)
    const sentimentParam = searchParams.get("sentiment")?.split(",").filter(Boolean)
    const scoreParam = searchParams.get("score")?.split(",").filter(Boolean)
    const fromParam = searchParams.get("from")
    const toParam = searchParams.get("to")
    const sortParam = searchParams.get("sort")
    const archiveParam = searchParams.get("archive")
    const matchTypeParam = searchParams.get("matchType") || "any"

    // 1. Get workspace's tracked keywords and subreddits
    const { data: wsKeywords } = await supabase
      .from("workspaces_keywords")
      .select("keyword")
      .eq("workspace", workspaceId)

    const { data: wsSubreddits } = await supabase
      .from("workspaces_subreddits")
      .select("subreddit")
      .eq("workspace", workspaceId)

    const keywordIds = wsKeywords?.map(k => k.keyword) || []
    const subredditIds = wsSubreddits?.map(s => s.subreddit) || []

    // If no keywords or subreddits are tracked, return empty
    if (keywordIds.length === 0 && subredditIds.length === 0) {
      return successResponse({ data: [], nextCursor: undefined })
    }

    // 2. Fetch posts matching workspace scope (keywords OR subreddits)
    // Fetch posts from subreddits
    let postsFromSubreddits: any[] = []
    if (subredditIds.length > 0) {
      const { data: subredditPosts, error: subredditError } = await supabase
        .from("reddit_posts")
        .select(`
          id,
          title,
          content,
          summary,
          url,
          created_at,
          sentiment,
          score,
          subreddit!inner (
            id,
            name,
            image
          )
        `)
        .in("subreddit", subredditIds)
      
      if (subredditError) {
        console.error("Error fetching posts from subreddits:", subredditError)
        return errorResponse("Failed to fetch posts", 500)
      }
      postsFromSubreddits = subredditPosts || []
    }

    // Fetch post IDs that match keywords
    let postIdsFromKeywords: string[] = []
    if (keywordIds.length > 0) {
      const { data: keywordPosts } = await supabase
        .from("reddit_posts_keywords")
        .select("post")
        .in("keyword", keywordIds)
      
      postIdsFromKeywords = [...new Set(keywordPosts?.map(kp => kp.post) || [])]
    }

    // Fetch posts from keywords
    let postsFromKeywords: any[] = []
    if (postIdsFromKeywords.length > 0) {
      const { data: keywordPostsData, error: keywordError } = await supabase
        .from("reddit_posts")
        .select(`
          id,
          title,
          content,
          summary,
          url,
          created_at,
          sentiment,
          score,
          subreddit!inner (
            id,
            name,
            image
          )
        `)
        .in("id", postIdsFromKeywords)
      
      if (keywordError) {
        console.error("Error fetching posts from keywords:", keywordError)
        return errorResponse("Failed to fetch posts", 500)
      }
      postsFromKeywords = keywordPostsData || []
    }

    // Merge and deduplicate posts (a post might match both keywords and subreddits)
    const postsMap = new Map<string, any>()
    postsFromSubreddits.forEach(p => postsMap.set(p.id, p))
    postsFromKeywords.forEach(p => postsMap.set(p.id, p))
    const allPosts = Array.from(postsMap.values())

    if (!allPosts || allPosts.length === 0) {
      return successResponse({ data: [], nextCursor: undefined })
    }

    // 3. Fetch workspace overrides (score, status) for these posts
    const postIds = allPosts.map(p => p.id)
    const { data: workspaceOverrides } = await supabase
      .from("workspaces_reddit_posts")
      .select("post, score, status")
      .eq("workspace", workspaceId)
      .in("post", postIds)

    const overridesMap = new Map(workspaceOverrides?.map(w => [w.post, w]) || [])

    // 4. Fetch keywords for all posts
    const { data: postKeywords } = await supabase
      .from("reddit_posts_keywords")
      .select("post, keyword")
      .in("post", postIds)

    const postKeywordMap = new Map<string, Set<string>>()
    postKeywords?.forEach((pk: any) => {
      if (!postKeywordMap.has(pk.post)) postKeywordMap.set(pk.post, new Set())
      postKeywordMap.get(pk.post)?.add(pk.keyword)
    })

    // 5. Merge posts with workspace overrides
    const mergedPosts = allPosts.map(post => {
      const override = overridesMap.get(post.id)
      return {
        ...post,
        workspace_score: override?.score ?? post.score,
        workspace_status: override?.status ?? "0", // Default: Needs Review
      }
    })

    // 2. Filter and Sort in Memory
    let filtered = mergedPosts.filter(p => {
      // Keywords and Subreddits Filter (OR logic when both are selected)
      const hasKeywordFilter = keywordsParam && keywordsParam.length > 0
      const hasSubredditFilter = subredditsParam && subredditsParam.length > 0

      if (hasKeywordFilter || hasSubredditFilter) {
        let matchesKeyword = false
        let matchesSubreddit = false

        // Check keyword match
        if (hasKeywordFilter) {
          const pKeywords = postKeywordMap.get(p.id)
          matchesKeyword = pKeywords ? keywordsParam!.some(id => pKeywords.has(id)) : false
        }

        // Check subreddit match
        if (hasSubredditFilter) {
          const postSubredditId = typeof p.subreddit === 'string' ? p.subreddit : p.subreddit.id
          matchesSubreddit = subredditsParam!.includes(postSubredditId)
        }

        if (matchTypeParam === "all") {
          // Intersection: Must match ALL active filters
          if (hasKeywordFilter && !matchesKeyword) return false
          if (hasSubredditFilter && !matchesSubreddit) return false
        } else {
          // Union: Must match ANY of the active filters
          if (!matchesKeyword && !matchesSubreddit) return false
        }
      }

      // 3. Sentiment, Score, Date, Archive Filters (AND logic with all previous filters)

      // Sentiment (OR within - matches any selected sentiment)
      if (sentimentParam && sentimentParam.length > 0) {
        const mappedSentiment = sentimentParam.map(s => 
          s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
        )
        if (!mappedSentiment.includes(p.sentiment)) return false
      }

      // Score (OR within - matches any selected score range)
      // Use workspace_score (workspace override or reddit score)
      if (scoreParam && scoreParam.length > 0) {
        const scoreVal = p.workspace_score ?? 0
        let scoreType = "Low"
        if (scoreVal > 80) scoreType = "Prime"
        else if (scoreVal > 50) scoreType = "High"
        else if (scoreVal > 20) scoreType = "Medium"
        
        // Normalize scoreParam to capital case for comparison
        const normalizedScoreParam = scoreParam.map(s => 
          s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
        )
        if (!normalizedScoreParam.includes(scoreType)) return false
      }

      // Date Range (AND - post must be within the selected date range)
      if (fromParam) {
        if (!p.created_at || p.created_at < fromParam) return false
      }
      if (toParam) {
        if (!p.created_at || p.created_at > toParam) return false
      }

      // Archive Filter (based on workspace status)
      const isArchived = p.workspace_status === "-1"
      if (archiveParam === "true") {
        if (!isArchived) return false
      } else {
        if (isArchived) return false
      }
      
      return true
    })

    // Sort
    if (sortParam) {
      const [field, direction] = sortParam.split(":")
      const ascending = direction === "asc"
      
      filtered.sort((a, b) => {
        let valA: any, valB: any
        if (field === "date" || field === "postedAt") {
          valA = a.created_at ? new Date(a.created_at).getTime() : 0
          valB = b.created_at ? new Date(b.created_at).getTime() : 0
        } else if (field === "score") {
          valA = a.workspace_score ?? 0
          valB = b.workspace_score ?? 0
        }
        
        if (valA < valB) return ascending ? -1 : 1
        if (valA > valB) return ascending ? 1 : -1
        return 0
      })
    } else {
      // Default sort: Date Desc
      filtered.sort((a, b) => {
        const valA = a.created_at ? new Date(a.created_at).getTime() : 0
        const valB = b.created_at ? new Date(b.created_at).getTime() : 0
        return valB - valA
      })
    }

    // 3. Paginate
    const sliced = filtered.slice(cursor, cursor + limit)
    const nextCursor = (cursor + limit < filtered.length) ? cursor + limit : undefined

    if (sliced.length === 0) {
      return successResponse({ data: [], nextCursor: undefined })
    }

    // 4. Fetch ALL Keyword Names for posts (not just workspace-tracked keywords)
    // Posts can have keywords that aren't tracked by the workspace
    const allKeywordIds = Array.from(new Set(
      Array.from(postKeywordMap.values()).flatMap(set => Array.from(set))
    ))

    const keywordNameMap = new Map<string, string>()
    
    if (allKeywordIds.length > 0) {
      const { data: keywordsData } = await supabase
        .from("keywords")
        .select("id, name")
        .in("id", allKeywordIds)

      keywordsData?.forEach((k: any) => {
        if (k.id && k.name) {
          keywordNameMap.set(k.id, k.name)
        }
      })
    }

    const statusMap: Record<string, any> = {
      "-1": "Archived",
      "0": "Needs Review",
      "1": "Ready to Engage",
      "2": "Engaging",
      "3": "Engaged"
    }

    // 5. Map to PostType
    const mappedPosts: PostType[] = sliced.map(p => {
      const subredditData = typeof p.subreddit === 'string' 
        ? { id: p.subreddit, name: "", image: "" }
        : p.subreddit

      const keywords = Array.from(postKeywordMap.get(p.id) || [])
        .map(id => keywordNameMap.get(id) || id)

      const scoreVal = p.workspace_score ?? 0
      let scoreType: any = "Low"
      if (scoreVal > 80) scoreType = "Prime"
      else if (scoreVal > 50) scoreType = "High"
      else if (scoreVal > 20) scoreType = "Medium"

      return {
        id: p.id,
        title: p.title || "",
        content: p.content || "",
        author: "Unknown",
        subreddit: {
          id: subredditData.id,
          name: subredditData.name,
          image: subredditData.image || "",
          url: "",
          rules: ""
        },
        sentiment: p.sentiment as any,
        status: statusMap[p.workspace_status as string] || "Needs Review",
        score: scoreType,
        keywords: keywords,
        summary: p.summary || "",
        postedAt: p.created_at || "",
        url: p.url || ""
      }
    })

    return successResponse({ 
      data: mappedPosts,
      nextCursor
    })

  } catch (error) {
    return handleUnexpectedError(error, "GET /api/posts")
  }
}
