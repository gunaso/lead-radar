"use client"

import { useMemo, useState } from "react"
import Autocomplete from "@mui/material/Autocomplete"

import { SubredditAvatar } from "@/components/ui/avatar"
import NewAction from "@/components/ui/new-action"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  useSubredditSearch,
  type SubredditResult,
} from "@/hooks/use-subreddit-search"
import { useCreateSubreddit } from "@/queries/subreddits"

function NewSubredditForm({
  setFormError,
  setCanSubmit,
}: {
  setFormError: (e: string | null) => void
  setCanSubmit: (v: boolean) => void
}) {
  const { query, setQuery, results, searching } = useSubredditSearch({
    active: true,
  })
  const [selected, setSelected] = useState<SubredditResult | null>(null)

  const options = results
  const getLabel = (o: SubredditResult) => o?.name ?? ""

  const detailsJson = useMemo(() => {
    if (!selected) return ""
    const payload = {
      title: selected.title ?? null,
      description: selected.description ?? null,
      description_reddit: selected.description_reddit ?? null,
      // route accepts community_icon; use iconUrl sanitized by the hook
      community_icon: selected.iconUrl ?? null,
    }
    return JSON.stringify(payload)
  }, [selected])

  return (
    <>
      <Autocomplete
        disablePortal
        options={options}
        loading={searching}
        value={selected}
        onChange={(_e, value) => {
          setSelected(value)
          if (value && !value.name) {
            setFormError("Invalid subreddit selection.")
            setCanSubmit(false)
          } else {
            setFormError(null)
            setCanSubmit(!!value?.name)
          }
        }}
        inputValue={query}
        onInputChange={(_e, value) => {
          setQuery(value)
          if (!value || value.trim() === "") {
            setCanSubmit(false)
          }
        }}
        getOptionLabel={getLabel}
        slotProps={{
          listbox: { style: { padding: "0.25rem" } },
          paper: { style: { padding: 0 } },
          popper: { style: { marginTop: 0 } },
        }}
        renderInput={(params) => {
          // Use custom Input styling (variant/size) instead of MUI label
          // We must forward MUI Autocomplete input props and ref
          return (
            <div ref={params.InputProps.ref} className="w-full">
              <Input
                {...params.inputProps}
                placeholder="Search subreddits (e.g. startups)"
                aria-label="Search subreddits"
                variant="creating"
                size="creating"
              />
            </div>
          )
        }}
        renderOption={(props, option) => {
          const { key, className, ...liProps } = props as any
          return (
            <li
              key={key}
              {...liProps}
              className={cn(
                "focus:bg-accent focus:text-accent-foreground hover:bg-accent/50 relative flex w-full cursor-default items-center gap-2 rounded-sm py-1 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                className
              )}
            >
              <SubredditAvatar
                image={option.iconUrl}
                name={option.name}
                className="size-6"
                classFallback="text-[10px]"
              />
              <span className="truncate">{option.name}</span>
            </li>
          )
        }}
        isOptionEqualToValue={(a, b) =>
          a.name.toLowerCase() === (b?.name ?? "").toLowerCase()
        }
      />
      {/* Hidden inputs consumed by NewAction form submit */}
      <input type="hidden" name="name" value={selected?.name ?? ""} />
      <input type="hidden" name="details" value={detailsJson} />
    </>
  )
}

export function NewSubredditAction({
  onStateChange,
}: {
  onStateChange?: (canSubmit: boolean) => void
}) {
  const create = useCreateSubreddit()
  const [formError, setFormError] = useState<string | null>(null)
  const [canSubmit, setCanSubmit] = useState<boolean>(false)

  return (
    <NewAction
      name="Subreddit"
      dialogBodyClassName="py-4 overflow-visible"
      error={formError}
      submitDisabled={!canSubmit}
      onErrorChange={setFormError}
      onSubmit={async (fd) => {
        const nameRaw = String(fd.get("name") || "").trim()
        const detailsRaw = String(fd.get("details") || "").trim()
        if (!nameRaw) {
          throw new Error("Please select a valid subreddit from the list.")
        }
        let details: any = undefined
        if (detailsRaw) {
          try {
            details = JSON.parse(detailsRaw)
          } catch {
            // ignore parse errors; server accepts minimal payload
          }
        }
        // Optimistic UI handled in hook; this will also upsert existing subreddits
        await create.mutateAsync({ name: nameRaw, details })
      }}
    >
      <NewSubredditForm
        setFormError={setFormError}
        setCanSubmit={(val) => {
          setCanSubmit(val)
          onStateChange?.(val)
        }}
      />
    </NewAction>
  )
}
