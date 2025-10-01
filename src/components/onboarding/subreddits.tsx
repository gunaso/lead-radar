"use client"

import type { ReactElement } from "react"
import { Loader2 } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TagInput } from "@/components/tag-input"

type SubredditsStepProps = {
  query: string
  setQuery: (value: string) => void
  results: string[]
  searching: boolean
  subreddits: string[]
  setSubreddits: (value: string[]) => void
  addSubreddit: (name: string) => void
}

export default function SubredditsStep({
  query,
  setQuery,
  results,
  searching,
  subreddits,
  setSubreddits,
  addSubreddit,
}: SubredditsStepProps): ReactElement {
  return (
    <section className="space-y-3">
      <Label>Which subreddits matter to you?</Label>
      <div className="relative">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && results.length > 0) {
              e.preventDefault()
              addSubreddit(results[0])
            }
          }}
          placeholder="Search subreddits (e.g. startups)"
          aria-expanded={(searching || results.length > 0) && !!query}
          aria-controls="subreddit-results"
          aria-haspopup="listbox"
        />
        {(searching || results.length > 0) && query && (
          <div
            id="subreddit-results"
            role="listbox"
            className="absolute z-50 mt-2 w/full overflow-hidden rounded-md border bg-background shadow-md"
          >
            <ul className="max-h-64 overflow-auto py-1 text-sm">
              {results.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between px-3 py-2 text-left hover:bg-accent"
                    onClick={() => addSubreddit(s)}
                  >
                    <span>{s}</span>
                  </button>
                </li>
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
        onChange={setSubreddits}
        suggestions={
          results.length
            ? results
            : ["r/sales", "r/CustomerSuccess", "r/martech", "r/marketing"]
        }
      />
      {searching && (
        <p className="text-xs text-muted-foreground inline-flex items-center gap-2">
          <Loader2 className="size-3 animate-spin" /> Searching subreddits…
        </p>
      )}
      <p className="text-xs text-muted-foreground">
        We'll prioritize activity from these communities.
      </p>
    </section>
  )
}
