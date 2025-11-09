"use client"

import { useEffect, useState } from "react"

type UseSubredditSearchOptions = {
  active: boolean
}

export type UseSubredditSearchResult = {
  query: string
  setQuery: (value: string) => void
  results: SubredditResult[]
  searching: boolean
}

export type SubredditResult = {
  name: string
  iconUrl: string | null
  members: number
  title?: string | null
  description?: string | null
  description_reddit?: string | null
  created_utc?: number | null
}

export function useSubredditSearch({
  active,
}: UseSubredditSearchOptions): UseSubredditSearchResult {
  const [query, setQuery] = useState<string>("")
  const [results, setResults] = useState<SubredditResult[]>([])
  const [searching, setSearching] = useState<boolean>(false)

  useEffect(() => {
    if (!active) return
    if (!query) {
      setResults([])
      setSearching(false)
      return
    }

    // Show loading immediately on input
    setSearching(true)
    setResults([])

    let cancelled = false
    const controller = new AbortController()

    const timeoutId = setTimeout(async () => {
      try {
        // Use Reddit's public JSON autocomplete endpoint (supports CORS)
        const encodedQuery = encodeURIComponent(query)
        const redditUrl = `https://www.reddit.com/api/subreddit_autocomplete_v2.json?query=${encodedQuery}&include_over_18=off&include_profiles=false&limit=10`

        const res = await fetch(redditUrl, {
          signal: controller.signal,
          mode: "cors",
          credentials: "omit",
          headers: { Accept: "application/json" },
        })
        if (!res.ok) {
          throw new Error(`Reddit search failed: ${res.status} ${res.statusText}`)
        }
        const json = await res.json()

        // Extract subreddit entries
        const children: any[] = Array.isArray(json?.data?.children)
          ? json.data.children
          : []
        const mapped: SubredditResult[] = children.map((c: any) => {
          const d = c?.data ?? {}
          const iconRaw: string | null =
            d.community_icon || d.icon_img || d.header_img || null
          const iconUrl = typeof iconRaw === "string" ? iconRaw.split("?")[0] : null
          const name: string =
            d.display_name_prefixed || (d.display_name ? `r/${d.display_name}` : "")
          const members: number =
            typeof d.subscribers === "number"
              ? d.subscribers
              : typeof d.subscriber_count === "number"
              ? d.subscriber_count
              : 0
          const title: string | null = typeof d.title === "string" ? d.title : null
          const description: string | null =
            typeof d.public_description === "string" ? d.public_description : null
          const description_reddit: string | null =
            typeof d.description === "string" ? d.description : null
          const created_utc: number | null =
            typeof d.created_utc === "number" ? d.created_utc : null
          return { name, iconUrl, members, title, description, description_reddit, created_utc }
        })
        if (!cancelled) setResults(mapped)
      } catch (error) {
        if ((error as any)?.name === "AbortError") return
        console.error("Error fetching Reddit communities:", error)
      } finally {
        if (!cancelled) setSearching(false)
      }
    }, 400)

    return () => {
      cancelled = true
      controller.abort()
      clearTimeout(timeoutId)
      setSearching(false)
    }
  }, [active, query])

  return { query, setQuery, results, searching }
}


