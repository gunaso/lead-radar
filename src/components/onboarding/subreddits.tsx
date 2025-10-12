"use client"

import {
  type SetStateAction,
  type ReactElement,
  type Dispatch,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"

import { Loader2, Check, CircleAlert } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TagInput } from "@/components/tag-input"
import { Input } from "@/components/ui/input"

import type { SubredditResult } from "@/hooks/use-subreddit-search"

type SubredditsStepProps = {
  query: string
  setQuery: (value: string) => void
  results: SubredditResult[]
  searching: boolean
  subreddits: string[]
  setSubreddits: Dispatch<SetStateAction<string[]>>
  addSubreddit: (name: string) => void
  upsertDetails: (
    input: Partial<{
      name: string
      title?: string | null
      description?: string | null
      description_reddit?: string | null
      created_utc?: number | null
      total_members?: number | null
    }>
  ) => void
}

export default function SubredditsStep({
  query,
  setQuery,
  results,
  searching,
  subreddits,
  setSubreddits,
  addSubreddit,
  upsertDetails,
}: SubredditsStepProps): ReactElement {
  const [validationError, setValidationError] = useState<string | null>(null)
  const [pendingTags, setPendingTags] = useState<string[]>([])
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [open, setOpen] = useState<boolean>(false)

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!containerRef.current) return
      if (!containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const onAdd = useCallback(
    async (tag: string) => {
      setValidationError(null)

      const { normalizedName, displayTag } = normalizeSubredditTag(tag)
      setPendingTags((prev) =>
        prev.includes(displayTag) ? prev : [...prev, displayTag]
      )

      // Optimistically add to the list while we validate and canonicalize
      setSubreddits((prev) => insertDisplayTagDedup(prev, tag, displayTag))

      try {
        const res = await fetch(
          `https://www.reddit.com/r/${encodeURIComponent(
            normalizedName
          )}/about.json`,
          { mode: "cors", credentials: "omit" }
        )
        if (!res.ok) throw new Error("Not found")
        const json = await res.json()
        if (!json?.data?.display_name) throw new Error("Invalid subreddit")

        const { canonicalName, details } =
          extractAboutDetailsFromRedditResponse(json, displayTag)

        // Replace temporary tag with canonical and dedupe
        setSubreddits((prev) =>
          replaceTempWithCanonical(prev, displayTag, canonicalName)
        )

        // Store metadata so we don't need to refetch later
        upsertDetails(details)
      } catch (e) {
        // Rollback optimistic insert on failure
        setSubreddits((prev) => prev.filter((t) => t !== displayTag))
        setValidationError(`Subreddit ${displayTag} doesn't exist.`)
      } finally {
        setPendingTags((prev: string[]) =>
          prev.filter((t: string) => t !== displayTag)
        )
      }
    },
    [setSubreddits, upsertDetails]
  )

  return (
    <section className="space-y-3">
      <span className="flex text-md font-semibold text-muted-foreground">
        Which subreddits matter to you?
      </span>
      <div className="relative" ref={containerRef}>
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => {
            if (query) setOpen(true)
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && results.length > 0) {
              e.preventDefault()
              addSubreddit(results[0].name)
              setOpen(true)
            }
          }}
          placeholder="Search subreddits (e.g. startups)"
          aria-expanded={open && !!query}
          aria-controls="subreddit-results"
          aria-haspopup="listbox"
        />
        {open && query && (
          <SubredditResultsDropdown
            results={results}
            searching={searching}
            subreddits={subreddits}
            addSubreddit={addSubreddit}
            upsertDetails={upsertDetails}
            setOpen={setOpen}
          />
        )}
      </div>
      <TagInput
        placeholder="e.g. r/sales"
        value={subreddits}
        onChange={(next) => setSubreddits(next)}
        onAdd={onAdd}
        pendingTags={pendingTags}
      />
      {validationError && (
        <span className="flex items-center gap-1 pl-1 text-sm text-destructive">
          <CircleAlert className="size-4" />
          {validationError}
        </span>
      )}
    </section>
  )
}

function SubredditResultsDropdown({
  results,
  searching,
  subreddits,
  addSubreddit,
  upsertDetails,
  setOpen,
}: {
  results: SubredditResult[]
  searching: boolean
  subreddits: string[]
  addSubreddit: (name: string) => void
  upsertDetails: (
    input: Partial<{
      name: string
      title?: string | null
      description?: string | null
      description_reddit?: string | null
      created_utc?: number | null
      total_members?: number | null
    }>
  ) => void
  setOpen: (open: boolean) => void
}) {
  return (
    <div
      id="subreddit-results"
      role="listbox"
      className="absolute z-50 mt-2 w-full p-1 overflow-hidden rounded-md border bg-background shadow-md"
    >
      <ul className="flex flex-col gap-1 max-h-45 overflow-auto text-sm">
        {results.map((s) => (
          <Subreddit
            key={s.name}
            addSubreddit={addSubreddit}
            subreddits={subreddits}
            setOpen={setOpen}
            subreddit={s}
            upsertDetails={upsertDetails}
          />
        ))}
        {searching && results.length === 0 && (
          <li className="px-3 py-2 text-muted-foreground inline-flex items-center gap-2">
            <Loader2 className="size-3 animate-spin" /> Searching subreddits…
          </li>
        )}
        {!searching && results.length === 0 && (
          <li className="px-3 py-2 text-muted-foreground">No results</li>
        )}
      </ul>
    </div>
  )
}

function Subreddit({
  subreddit,
  addSubreddit,
  setOpen,
  subreddits,
  upsertDetails,
}: {
  subreddit: SubredditResult
  addSubreddit: (name: string) => void
  setOpen: (open: boolean) => void
  subreddits: string[]
  upsertDetails: (
    input: Partial<{
      name: string
      title?: string | null
      description?: string | null
      description_reddit?: string | null
      created_utc?: number | null
      total_members?: number | null
    }>
  ) => void
}) {
  return (
    <li key={subreddit.name}>
      <button
        type="button"
        className="flex w-full items-center justify-between px-3 py-2 rounded-md text-left hover:bg-accent transition-colors active:scale-95"
        onClick={() => {
          addSubreddit(subreddit.name)
          // Persist details from search result so we can avoid refetch later
          upsertDetails({
            name: subreddit.name,
            title: subreddit.title ?? null,
            description: subreddit.description ?? null,
            description_reddit: subreddit.description_reddit ?? null,
            created_utc: subreddit.created_utc ?? null,
            total_members:
              typeof subreddit.members === "number" ? subreddit.members : null,
          })
          setOpen(true)
        }}
      >
        <span className="inline-flex items-center gap-2">
          <Avatar className="size-6">
            <AvatarImage
              src={subreddit.iconUrl || undefined}
              alt={subreddit.name}
            />
            <AvatarFallback>r/</AvatarFallback>
          </Avatar>
          {subreddit.name}
        </span>
        {subreddits.some(
          (s) => s.toLowerCase() === subreddit.name.toLowerCase()
        ) ? (
          <Check className="size-4 text-green-600" />
        ) : (
          <span className="text-muted-foreground text-sm opacity-50 italic">
            {formatMembersCount(subreddit.members)} members
          </span>
        )}
      </button>
    </li>
  )
}

function normalizeSubredditTag(tag: string): {
  normalizedName: string
  displayTag: string
} {
  const normalizedName = tag.replace(/^r\//i, "").trim()
  const displayTag = normalizedName ? `r/${normalizedName}` : tag.trim()
  return { normalizedName, displayTag }
}

function insertDisplayTagDedup(
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

function replaceTempWithCanonical(
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

type SubredditAboutDetails = {
  name: string
  title: string | null
  description: string | null
  description_reddit: string | null
  created_utc: number | null
  total_members: number | null
}

function extractAboutDetailsFromRedditResponse(
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

function formatMembersCount(members?: number | null): string {
  if (!members || members <= 0) return "0"
  if (members >= 1000) return `${Math.round(members / 1000)}k`
  return String(members)
}
