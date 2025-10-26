"use client"

import {
  type SetStateAction,
  type ReactElement,
  type Dispatch,
  useState,
  useMemo,
} from "react"

import { X, Pencil, Plus } from "lucide-react"

import LabeledInput from "@/components/ui/labeled-input"
import AsyncInput from "@/components/ui/input-async"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { useWorkspaceWebsiteValidation } from "@/queries/workspace"
import type { CompetitorInput } from "@/types/onboarding"

type CompetitorsStepProps = {
  competitors: CompetitorInput[]
  setCompetitors: Dispatch<SetStateAction<CompetitorInput[]>>
}

export default function CompetitorsStep({
  competitors,
  setCompetitors,
}: CompetitorsStepProps): ReactElement {
  const [name, setName] = useState("")
  const [website, setWebsite] = useState("")
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [websiteValid, setWebsiteValid] = useState(true)

  const canAdd = useMemo(() => name.trim().length > 0, [name])

  const websiteValidation = useWorkspaceWebsiteValidation()

  const resetForm = (): void => {
    setName("")
    setWebsite("")
    setEditingIndex(null)
    setWebsiteValid(true)
  }

  const handleAdd = (): void => {
    const trimmedName = name.trim()
    const trimmedWebsite = website.trim()
    if (!trimmedName) return
    if (website.trim() && !websiteValid) return

    setCompetitors(((prev: CompetitorInput[]) => {
      // Prevent duplicates by name (case-insensitive)
      const target = trimmedName.toLowerCase()
      const existsIndex = prev.findIndex(
        (c: CompetitorInput) => c.name.trim().toLowerCase() === target
      )

      const next: CompetitorInput[] = [...prev]
      const payload: CompetitorInput = {
        name: trimmedName,
        website: trimmedWebsite ? trimmedWebsite : null,
      }

      if (
        editingIndex !== null &&
        editingIndex >= 0 &&
        editingIndex < next.length
      ) {
        next[editingIndex] = payload
      } else if (existsIndex >= 0) {
        next[existsIndex] = payload
      } else {
        next.push(payload)
      }
      return next
    }) as unknown as CompetitorInput[])

    resetForm()
  }

  const handleRemove = (index: number): void => {
    setCompetitors(competitors.filter((_, i) => i !== index))
    if (editingIndex === index) resetForm()
  }

  const handleEdit = (index: number): void => {
    const target = competitors[index]
    if (!target) return
    setName(target.name)
    setWebsite(target.website || "")
    setEditingIndex(index)
  }

  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <span className="flex text-md font-semibold text-muted-foreground">
          Who are your competitors?
        </span>
        {/* Existing competitors as badges (compact, scroll if overflow) */}
        {competitors && (
          <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto pr-1">
            {competitors.map((c, i) => (
              <CompetitorBadge
                key={`${c.name}-${i}`}
                competitor={c}
                index={i}
                handleEdit={handleEdit}
                handleRemove={handleRemove}
              />
            ))}
          </div>
        )}
      </div>

      {/* Single competitor form */}
      <div className="space-y-2">
        <LabeledInput
          label="Competitor name"
          placeholder="e.g. HubSpot"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <AsyncInput
          label="Website (optional)"
          placeholder="e.g. company.com"
          valueState={[website, setWebsite]}
          setValid={setWebsiteValid}
          validate={async (val, signal) => {
            const trimmed = val.trim()
            if (!trimmed) return { ok: true }
            return websiteValidation.mutateAsync({ website: trimmed, signal })
          }}
        />
        <div>
          <Button
            type="button"
            onClick={handleAdd}
            size="onboarding"
            disabled={!canAdd || (Boolean(website.trim()) && !websiteValid)}
            className="inline-flex items-center gap-2"
          >
            <Plus className="size-4" />{" "}
            {editingIndex !== null ? "Save" : "Add competitor"}
          </Button>
          {editingIndex !== null && (
            <Button
              type="button"
              variant="ghost"
              size="onboarding"
              className="ml-2"
              onClick={resetForm}
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}

function CompetitorBadge({
  competitor,
  index,
  handleEdit,
  handleRemove,
}: {
  competitor: CompetitorInput
  index: number
  handleEdit: (index: number) => void
  handleRemove: (index: number) => void
}): ReactElement {
  return (
    <Badge
      variant="secondary"
      className="inline-flex items-center gap-1 py-1 px-2"
    >
      <span className="truncate max-w-16" title={competitor.name}>
        {competitor.name}
      </span>
      <button
        type="button"
        aria-label="Edit competitor"
        className="opacity-60 hover:opacity-100 transition"
        onClick={() => handleEdit(index)}
      >
        <Pencil className="size-3" />
      </button>
      <button
        type="button"
        aria-label="Remove competitor"
        className="opacity-60 hover:opacity-100 transition"
        onClick={() => handleRemove(index)}
      >
        <X className="size-3" />
      </button>
    </Badge>
  )
}
