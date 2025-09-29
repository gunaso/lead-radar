"use client"

import { useEffect, useState } from "react"

type UseSubredditSearchOptions = {
  active: boolean
}

export type UseSubredditSearchResult = {
  query: string
  setQuery: (value: string) => void
  results: string[]
  searching: boolean
}

export function useSubredditSearch({
  active,
}: UseSubredditSearchOptions): UseSubredditSearchResult {
  const [query, setQuery] = useState<string>("")
  const [results, setResults] = useState<string[]>([])
  const [searching, setSearching] = useState<boolean>(false)

  useEffect(() => {
    if (!active) return
    if (!query) {
      setResults([])
      setSearching(false)
      return
    }

    setSearching(true)
    setResults([])

    const all = [
      "r/sales",
      "r/CustomerSuccess",
      "r/martech",
      "r/marketing",
      "r/AskMarketing",
      "r/CRM",
      "r/SaaS",
      "r/startups",
      "r/SmallBusiness",
      "r/salesforce",
      "r/HubSpot",
      "r/zoho",
    ]

    const filtered = all.filter((s) =>
      s.toLowerCase().includes(query.toLowerCase())
    )

    const q = query.toLowerCase().replace(/[^a-z0-9]/g, "")
    const suffixes = [
      "crm",
      "prospecting",
      "revops",
      "automation",
      "playbooks",
      "pipeline",
      "stack",
      "leaders",
      "ops",
    ]
    const prefixes = ["sales", "crm", "revops", "marketingops", "growth", "cs"]
    const randoms: string[] = []
    for (let i = 0; i < 8; i++) {
      const suffix = suffixes[Math.floor(Math.random() * suffixes.length)]
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
      const pattern = Math.random() > 0.5 ? `r/${q}${suffix}` : `r/${prefix}${q}`
      if (q && !randoms.includes(pattern)) randoms.push(pattern)
    }

    const combined = Array.from(new Set([...filtered, ...randoms])).slice(0, 12)
    let i = 0
    const interval = setInterval(() => {
      setResults((prev) => {
        if (i >= combined.length) {
          clearInterval(interval)
          setSearching(false)
          return prev
        }
        const next = [...prev, combined[i]]
        i += 1
        return next
      })
    }, 160)

    return () => {
      clearInterval(interval)
      setSearching(false)
    }
  }, [active, query])

  return { query, setQuery, results, searching }
}


