// Shared subreddit helpers used across onboarding and subreddits page
// Keep functions minimal and focused for reuse (DRY).

export function normalizeSubredditTag(tag: string): {
  normalizedName: string
  displayTag: string
} {
  const normalizedName = tag.replace(/^r\//i, "").trim()
  const displayTag = normalizedName ? `r/${normalizedName}` : tag.trim()
  return { normalizedName, displayTag }
}

export function insertDisplayTagDedup(
  previousTags: string[],
  originalTag: string,
  displayTag: string
): string[] {
  // Replace raw tag with normalized display tag if needed
  let next = previousTags.map((tag) => (tag === originalTag ? displayTag : tag))
  // Keep only the first case-insensitive occurrence
  const targetLower = displayTag.toLowerCase()
  const firstIdx = next.findIndex((tag) => tag.toLowerCase() === targetLower)
  if (firstIdx === -1) {
    next = [...next, displayTag]
  }
  next = next.filter(
    (tag, idx) => tag.toLowerCase() !== targetLower || idx === firstIdx
  )
  return next
}

export function replaceTempWithCanonical(
  previousTags: string[],
  tempDisplayTag: string,
  canonicalDisplayTag: string
): string[] {
  const tempLower = tempDisplayTag.toLowerCase()
  const canonicalLower = canonicalDisplayTag.toLowerCase()

  // Replace the first occurrence of the temp tag with canonical
  let replaced = false
  let next = previousTags.map((tag) => {
    if (!replaced && tag.toLowerCase() === tempLower) {
      replaced = true
      return canonicalDisplayTag
    }
    return tag
  })

  // Ensure only one canonical instance remains
  const seen = new Set<string>()
  next = next.filter((tag) => {
    const key = tag.toLowerCase()
    if (key === canonicalLower) {
      if (seen.has(key)) return false
      seen.add(key)
      return true
    }
    return true
  })

  return next
}

export type SubredditAboutDetails = {
  name: string
  title: string | null
  description: string | null
  description_reddit: string | null
  created_utc: number | null
  total_members: number | null
}

export function extractAboutDetailsFromRedditResponse(
  json: unknown,
  fallbackName: string
): { canonicalName: string; details: SubredditAboutDetails } {
  const data = (json as any)?.data ?? {}
  const canonicalName: string =
    typeof data?.display_name_prefixed === "string"
      ? data.display_name_prefixed
      : fallbackName
  const details: SubredditAboutDetails = {
    name: canonicalName,
    title: typeof data.title === "string" ? data.title : null,
    description:
      typeof data.public_description === "string"
        ? data.public_description
        : null,
    description_reddit:
      typeof data.description === "string" ? data.description : null,
    created_utc: typeof data.created_utc === "number" ? data.created_utc : null,
    total_members:
      typeof data.subscribers === "number" ? data.subscribers : null,
  }
  return { canonicalName, details }
}

export function formatMembersCount(members?: number | null): string {
  if (!members || members <= 0) return "0"
  if (members >= 1000) return `${Math.round(members / 1000)}k`
  return String(members)
}


