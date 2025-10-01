"use client"

import type { ReactElement } from "react"

import { Label } from "@/components/ui/label"
import { TagInput } from "@/components/tag-input"

type CompetitorsStepProps = {
  competitors: string[]
  setCompetitors: (value: string[]) => void
}

export default function CompetitorsStep({
  competitors,
  setCompetitors,
}: CompetitorsStepProps): ReactElement {
  return (
    <section className="space-y-3">
      <Label>Who are your competitors?</Label>
      <TagInput
        placeholder="Add competitor brands or products"
        value={competitors}
        onChange={setCompetitors}
        suggestions={[
          "Salesforce",
          "HubSpot",
          "Pipedrive",
          "Zoho CRM",
          "Freshsales",
          "Close",
        ]}
      />
      <p className="text-xs text-muted-foreground">
        We'll highlight threads where they are mentioned so you can respond.
      </p>
    </section>
  )
}
