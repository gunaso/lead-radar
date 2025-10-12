import type { SubredditDetailsInput } from "@/lib/api/workspace-entities"

export function normalizeSubreddits(list: string[]): string[] {
  return list.map((s) => s.replace(/^r\//i, "").trim()).filter(Boolean)
}

export function buildSubredditDetails(
  normalizedNames: string[],
  detailsByName: Record<string, SubredditDetailsInput>
): SubredditDetailsInput[] {
  return normalizedNames.map((n) => {
    const key = (n.startsWith("r/") ? n.slice(2) : n).toLowerCase()
    const d = detailsByName[key]
    if (!d) return { name: `r/${n}` }
    return { ...d, name: d.name.startsWith("r/") ? d.name : `r/${d.name}` }
  })
}


