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
import { Label } from "@/components/ui/label"
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
  const [open, setOpen] = useState<boolean>(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [pendingTags, setPendingTags] = useState<string[]>([])
  const [validationError, setValidationError] = useState<string | null>(null)

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
      // Normalize display tag to always include "r/" prefix for UX consistency
      const normalizedName = tag.replace(/^r\//i, "").trim()
      const displayTag = normalizedName ? `r/${normalizedName}` : tag.trim()
      setPendingTags((prev) =>
        prev.includes(displayTag) ? prev : [...prev, displayTag]
      )
      // Canonicalize the just-added tag and ensure no case-insensitive duplicates
      setSubreddits((prev) => {
        // Replace raw tag with normalized display tag if needed
        let next = prev.map((t) => (t === tag ? displayTag : t))
        // Keep only the first case-insensitive occurrence
        const target = displayTag.toLowerCase()
        const firstIdx = next.findIndex((t) => t.toLowerCase() === target)
        if (firstIdx === -1) {
          next = [...next, displayTag]
        }
        next = next.filter(
          (t, idx) => t.toLowerCase() !== target || idx === firstIdx
        )
        return next
      })
      try {
        const res = await fetch(
          `https://www.reddit.com/r/${encodeURIComponent(
            normalizedName
          )}/about.json`,
          { mode: "cors", credentials: "omit" }
        )
        const ok = res.ok
        if (!ok) {
          throw new Error("Not found")
        }
        const json = await res.json()
        if (!json?.data?.display_name) {
          throw new Error("Invalid subreddit")
        }
        // Use Reddit's canonical prefixed name for display (e.g., r/Startups)
        const canonical: string =
          typeof json?.data?.display_name_prefixed === "string"
            ? json.data.display_name_prefixed
            : displayTag

        // Replace the temporary displayTag with the canonical one and dedupe (case-insensitive)
        setSubreddits((prev) => {
          const targetLower = displayTag.toLowerCase()
          const canonicalLower = canonical.toLowerCase()

          // Replace the first occurrence of the temp tag with canonical
          let replaced = false
          let next = prev.map((t) => {
            if (!replaced && t.toLowerCase() === targetLower) {
              replaced = true
              return canonical
            }
            return t
          })

          // Ensure only one canonical instance remains
          const seen = new Set<string>()
          next = next.filter((t) => {
            const k = t.toLowerCase()
            if (k === canonicalLower) {
              if (seen.has(k)) return false
              seen.add(k)
              return true
            }
            return true
          })

          return next
        })

        // Store metadata so we don't need to refetch later
        const d = json?.data ?? {}
        upsertDetails({
          name: canonical,
          title: typeof d.title === "string" ? d.title : null,
          description:
            typeof d.public_description === "string"
              ? d.public_description
              : null,
          description_reddit:
            typeof d.description === "string" ? d.description : null,
          created_utc: typeof d.created_utc === "number" ? d.created_utc : null,
          total_members:
            typeof d.subscribers === "number" ? d.subscribers : null,
        })
      } catch (e) {
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
      <Label>Which subreddits matter to you?</Label>
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
                  <Loader2 className="size-3 animate-spin" /> Searching
                  subreddits…
                </li>
              )}
              {!searching && results.length === 0 && (
                <li className="px-3 py-2 text-muted-foreground">No results</li>
              )}
            </ul>
          </div>
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
        className="flex w-full items-center justify-between px-3 py-2 rounded-md text-left hover:bg-accent transition-colors"
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
            {subreddit.members >= 1000
              ? `${Math.round(subreddit.members / 1000)}k`
              : subreddit.members}{" "}
            members
          </span>
        )}
      </button>
    </li>
  )
}
