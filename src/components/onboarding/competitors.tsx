"use client"

import {
  useEffect,
  useMemo,
  useState,
  type ReactElement,
  type Dispatch,
  type SetStateAction,
} from "react"

import { X, Pencil, Plus } from "lucide-react"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { CompetitorInput } from "@/types/onboarding"
import { useWorkspaceWebsiteValidation } from "@/queries/workspace"
import AsyncInput from "@/components/input-async"

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
        <Label>Who are your competitors?</Label>
        {/* Existing competitors as badges (compact, scroll if overflow) */}
        <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto pr-1">
          {competitors.map((c, i) => (
            <Badge
              key={`${c.name}-${i}`}
              variant="secondary"
              className="inline-flex items-center gap-1 py-1 px-2"
            >
              <span className="truncate max-w-16" title={c.name}>
                {c.name}
              </span>
              <button
                type="button"
                aria-label="Edit competitor"
                className="opacity-60 hover:opacity-100 transition"
                onClick={() => handleEdit(i)}
              >
                <Pencil className="size-3" />
              </button>
              <button
                type="button"
                aria-label="Remove competitor"
                className="opacity-60 hover:opacity-100 transition"
                onClick={() => handleRemove(i)}
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Single competitor form */}
      <div className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="competitor-name">Competitor name</Label>
          <Input
            id="competitor-name"
            placeholder="e.g. HubSpot"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="competitor-website">Website (optional)</Label>
          <AsyncInput
            id="competitor-website"
            placeholder="e.g. company.com"
            valueState={[website, setWebsite]}
            setValid={setWebsiteValid}
            validate={async (val, signal) => {
              const trimmed = val.trim()
              if (!trimmed) return { ok: true }
              return websiteValidation.mutateAsync({ website: trimmed, signal })
            }}
          />
        </div>
        <div>
          <Button
            type="button"
            onClick={handleAdd}
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
