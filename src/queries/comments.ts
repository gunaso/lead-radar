import { useInfiniteQuery } from "@tanstack/react-query"

import { request } from "@/lib/api/client"
import { qk } from "@/lib/api/query-keys"
import { CommentType } from "@/types/reddit"

export type CommentsFilters = {
  keywords?: string[]
  subreddits?: string[]
  sentiment?: string[]
  score?: string[]
  from?: string
  to?: string
  sort?: string
  group?: string
  archive?: string
  matchType?: "any" | "all"
}

type GetCommentsResponse = {
  data: CommentType[]
  nextCursor?: number
}

// Ensure qk.comments exists, otherwise I might need to update query-keys.
// I'll check query-keys first or assume I can add it if needed. 
// Use string based key for now if qk.comments is not typed.
// But better to check qk first. 

export function useComments(filters: CommentsFilters) {
  return useInfiniteQuery({
    queryKey: qk.comments(filters),
    queryFn: async ({ pageParam = 0 }) => {
      const params = new URLSearchParams()
      
      if (filters.keywords?.length) params.set("keywords", filters.keywords.join(","))
      if (filters.subreddits?.length) params.set("subreddits", filters.subreddits.join(","))
      if (filters.sentiment?.length) params.set("sentiment", filters.sentiment.join(","))
      if (filters.score?.length) params.set("score", filters.score.join(","))
      if (filters.from) params.set("from", filters.from)
      if (filters.to) params.set("to", filters.to)
      if (filters.sort) params.set("sort", filters.sort)
      if (filters.archive) params.set("archive", filters.archive)
      if (filters.matchType) params.set("matchType", filters.matchType)
      
      params.set("cursor", String(pageParam))
      params.set("limit", "20")

      return request<GetCommentsResponse>(`/api/comments?${params.toString()}`)
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  })
}
