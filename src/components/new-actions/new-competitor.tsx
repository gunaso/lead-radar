"use client"

import { useState } from "react"

import NewAction from "@/components/ui/new-action"
import { Input } from "@/components/ui/input"
import AsyncBareInput from "@/components/ui/input-async-bare"
import { useCreateCompetitor } from "@/queries/competitors"
import { useWorkspaceWebsiteValidation } from "@/queries/workspace"

export function NewCompetitorAction() {
  const create = useCreateCompetitor()
  const [error, setError] = useState<string | null>(null)
  const websiteValidation = useWorkspaceWebsiteValidation()

  return (
    <NewAction
      name="Competitor"
      dialogBodyClassName="py-4 space-y-2"
      error={error}
      onErrorChange={setError}
      onSubmit={async (fd) => {
        const name = String(fd.get("name") || "").trim()
        const rawWebsite = String(fd.get("website") || "").trim()
        if (!name) return
        try {
          let website: string | null = rawWebsite || null
          if (website) {
            const res = await websiteValidation.mutateAsync({
              website,
            })
            if (!res.ok) {
              throw new Error(res.message || "Invalid website")
            }
            if (typeof res.website === "string") {
              website = res.website
            }
          }
          await create.mutateAsync({
            name,
            website,
          })
        } catch (err) {
          throw err
        }
      }}
    >
      <Input
        size="creating"
        variant="creating"
        placeholder="Competitor name"
        name="name"
      />
      <AsyncBareInput
        name="website"
        placeholder="e.g. company.com"
        validate={async (val, signal) => {
          const trimmed = val.trim()
          if (!trimmed) return { ok: true }
          return websiteValidation.mutateAsync({
            website: trimmed,
            signal,
          })
        }}
      />
    </NewAction>
  )
}
