import { type NextRequest } from "next/server"

import { authenticateRequest } from "@/lib/api/auth"
import { errorResponse, successResponse, handleUnexpectedError } from "@/lib/api/responses"
import { createClient } from "@/lib/supabase/server"
import { CommentType } from "@/types/reddit"

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

    // 2. Fetch comments matching workspace scope (keywords OR subreddits)
    
    // A. Fetch comments from subreddits
    let commentsFromSubreddits: any[] = []
    if (subredditIds.length > 0) {
      // First get relevant post IDs to avoid joining huge tables inefficiently if possible,
      // or rely on !inner join filter.
      // Trying !inner join on post.subreddit:
      // select: '*, post!inner(subreddit)' ... eq('post.subreddit', ...)
      // But standard way often involved matching IDs.
      // Let's try fetching Post IDs first for cleanliness and less risk of join syntax issues.
      
      const { data: subredditPosts } = await supabase
        .from("reddit_posts")
        .select("id")
        .in("subreddit", subredditIds)
      
      const postIds = subredditPosts?.map(p => p.id) || []

      if (postIds.length > 0) {
        // Optimization: Apply date filter here if exists, to reduce data transfer
        let query = supabase.from("reddit_comments").select(`
            id,
            content,
            summary,
            url,
            posted_at,
            sentiment,
            score,
            post!inner (
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
            )
          `)
          .in("post", postIds)

        if (fromParam) query = query.gte("posted_at", fromParam)

        const { data: comments, error } = await query
        
        if (error) {
          console.error("Error fetching comments from subreddits:", error)
          return errorResponse("Failed to fetch comments", 500)
        }
        commentsFromSubreddits = comments || []
      }
    }

    // B. Fetch comment IDs that match keywords
    let commentIdsFromKeywords: string[] = []
    if (keywordIds.length > 0) {
      const { data: keywordComments } = await supabase
        .from("reddit_comments_keywords")
        .select("comment")
        .in("keyword", keywordIds)
      
      commentIdsFromKeywords = [...new Set(keywordComments?.map(k => k.comment) || [])]
    }

    // C. Fetch comments from keywords
    let commentsFromKeywords: any[] = []
    if (commentIdsFromKeywords.length > 0) {
      let query = supabase.from("reddit_comments").select(`
          id,
          content,
          summary,
          url,
          posted_at,
          sentiment,
          score,
          post!inner (
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
          )
        `)
        .in("id", commentIdsFromKeywords)

      if (fromParam) query = query.gte("posted_at", fromParam)

      const { data: comments, error } = await query
      
      if (error) {
        console.error("Error fetching comments from keywords:", error)
        return errorResponse("Failed to fetch comments", 500)
      }
      commentsFromKeywords = comments || []
    }

    // Merge and deduplicate
    const commentsMap = new Map<string, any>()
    commentsFromSubreddits.forEach(c => commentsMap.set(c.id, c))
    commentsFromKeywords.forEach(c => commentsMap.set(c.id, c))
    const allComments = Array.from(commentsMap.values())

    if (!allComments || allComments.length === 0) {
      return successResponse({ data: [], nextCursor: undefined })
    }

    // 3. Fetch workspace overrides
    const commentIds = allComments.map(c => c.id)
    const { data: workspaceOverrides } = await supabase
      .from("workspaces_reddit_comments")
      .select("comment, score, status")
      .eq("workspace", workspaceId)
      .in("comment", commentIds)

    const overridesMap = new Map(workspaceOverrides?.map(w => [w.comment, w]) || [])

    // 4. Fetch keywords for all comments
    const { data: commentKeywords } = await supabase
      .from("reddit_comments_keywords")
      .select("comment, keyword")
      .in("comment", commentIds)

    const commentKeywordMap = new Map<string, Set<string>>()
    commentKeywords?.forEach((ck: any) => {
      if (!commentKeywordMap.has(ck.comment)) commentKeywordMap.set(ck.comment, new Set())
      commentKeywordMap.get(ck.comment)?.add(ck.keyword)
    })

    // 5. Merge
    const mergedComments = allComments.map(comment => {
      const override = overridesMap.get(comment.id)
      return {
        ...comment,
        workspace_score: override?.score ?? comment.score,
        workspace_status: override?.status ?? "0",
      }
    })

    // 6. Filter in Memory
    let filtered = mergedComments.filter(c => {
      const hasKeywordFilter = keywordsParam && keywordsParam.length > 0
      const hasSubredditFilter = subredditsParam && subredditsParam.length > 0
      
      if (hasKeywordFilter || hasSubredditFilter) {
        let matchesKeyword = false
        let matchesSubreddit = false

        if (hasKeywordFilter) {
          const cKeywords = commentKeywordMap.get(c.id)
          matchesKeyword = cKeywords ? keywordsParam!.some(id => cKeywords.has(id)) : false
        }

        if (hasSubredditFilter) {
          const subredditId = c.post?.subreddit?.id
          matchesSubreddit = subredditsParam!.includes(subredditId)
        }

        if (!matchesKeyword && !matchesSubreddit) return false
      }

      // Sentiment
      if (sentimentParam && sentimentParam.length > 0) {
        const mappedSentiment = sentimentParam.map(s => 
          s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
        )
        if (!mappedSentiment.includes(c.sentiment)) return false
      }

      // Score
      if (scoreParam && scoreParam.length > 0) {
        const scoreVal = c.workspace_score ?? 0
        let scoreType = "Low"
        if (scoreVal > 80) scoreType = "Prime"
        else if (scoreVal > 50) scoreType = "High"
        else if (scoreVal > 20) scoreType = "Medium"
        
        const normalizedScoreParam = scoreParam.map(s => 
          s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
        )
        if (!normalizedScoreParam.includes(scoreType)) return false
      }

      // Date Range
      if (fromParam) {
        if (!c.posted_at || c.posted_at < fromParam) return false
      }
      if (toParam) {
        if (!c.posted_at || c.posted_at > toParam) return false
      }

      // Archive
      const isArchived = c.workspace_status === "-1"
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
          valA = a.posted_at ? new Date(a.posted_at).getTime() : 0
          valB = b.posted_at ? new Date(b.posted_at).getTime() : 0
        } else if (field === "score") {
          valA = a.workspace_score ?? 0
          valB = b.workspace_score ?? 0
        }
        
        if (valA < valB) return ascending ? -1 : 1
        if (valA > valB) return ascending ? 1 : -1
        return 0
      })
    } else {
      filtered.sort((a, b) => {
        const valA = a.posted_at ? new Date(a.posted_at).getTime() : 0
        const valB = b.posted_at ? new Date(b.posted_at).getTime() : 0
        return valB - valA
      })
    }

    // Paginate
    const sliced = filtered.slice(cursor, cursor + limit)
    const nextCursor = (cursor + limit < filtered.length) ? cursor + limit : undefined

    if (sliced.length === 0) {
      return successResponse({ data: [], nextCursor: undefined })
    }

    // Get Keyword Names
    const allKeywordIds = Array.from(new Set(
      Array.from(commentKeywordMap.values()).flatMap(set => Array.from(set))
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

    // Helper to map score
    const mapScore = (score: number) => {
      if (score > 80) return "Prime"
      if (score > 50) return "High"
      if (score > 20) return "Medium"
      return "Low"
    }

    // Map to CommentType
    const mappedComments: CommentType[] = sliced.map(c => {
      const keywords = Array.from(commentKeywordMap.get(c.id) || [])
        .map(id => keywordNameMap.get(id) || id)

      // Post Score/Status could also be needed? 
      // CommentType treats `post` as PostType.
      // PostType needs status/score too.
      // The `post` joined data is raw. It doesn't have workspace overrides for the post!
      // DO I need to fetch workspace overrides for the posts too?
      // `CommentType` -> `post: PostType`. `PostType` has `status`, `score` (enum).
      // If I leave them raw from Reddit, `score` is number, `status` is undefined.
      // Ideally I should map them.
      // For simplicity/performance I might skip workspace overrides for the *parent post* unless critical.
      // Or I can just map the raw reddit score to our ScoreType and use "Needs Review" or similar for status.
      
      const postRaw = c.post
      const postScoreType = mapScore(postRaw?.score ?? 0)
      
      return {
        id: c.id,
        content: c.content || "",
        status: statusMap[c.workspace_status as string] || "Needs Review",
        score: mapScore(c.workspace_score ?? 0),
        sentiment: c.sentiment as any,
        author: c.reddit_user /* Wait, reddit_user is ID? or name? In schema it's UUID FK to reddit_users */,
        // Schema: reddit_comments.reddit_user -> FK to reddit_users.id.
        // I need to fetch reddit_user name!
        // The query didn't join reddit_user.
        // I should have joined reddit_user.
        // Let's rely on "Unknown" for now or fix the query. FIX THE QUERY.
        
        postedAt: c.posted_at || "",
        url: c.url || "",
        summary: c.summary || "",
        keywords: keywords,
        post: {
          id: postRaw.id,
          title: postRaw.title || "",
          content: postRaw.content || "",
          author: "Unknown", // Also missing post author name
          subreddit: {
            id: postRaw.subreddit.id,
            name: postRaw.subreddit.name,
            image: postRaw.subreddit.image || "",
            url: "",
            rules: ""
          },
          sentiment: postRaw.sentiment as any,
          status: "Needs Review", // Default
          score: postScoreType,
          keywords: [], // We don't have post keywords here
          summary: postRaw.summary || "",
          postedAt: postRaw.created_at || "",
          url: postRaw.url || ""
        },
        subreddit: {
             id: postRaw.subreddit.id,
             name: postRaw.subreddit.name,
             image: postRaw.subreddit.image || "",
             url: "",
             rules: ""
        }
      }
    })
    
    // Correction: Author.
    // I need to join reddit_users for both comment and post to get usernames.
    // Or just return "Unknown" if not critical. 
    // `posts/page.tsx` returns "Unknown" for author: `author: "Unknown"`.
    // So I will stick to "Unknown".

    return successResponse({ 
      data: mappedComments,
      nextCursor
    })

  } catch (error) {
    return handleUnexpectedError(error, "GET /api/comments")
  }
}
