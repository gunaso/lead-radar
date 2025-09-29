"use client"

import type { ReactElement } from "react"

import { Label } from "@/components/ui/label"
import { TagInput } from "@/components/tag-input"

type KeywordsStepProps = {
  keywords: string[]
  setKeywords: (value: string[]) => void
}

export default function KeywordsStep({
  keywords,
  setKeywords,
}: KeywordsStepProps): ReactElement {
  return (
    <section className="space-y-3">
      <Label>Which keywords should we track?</Label>
      <TagInput
        placeholder="Add keyword and press Enter"
        value={keywords}
        onChange={setKeywords}
        suggestions={[
          "crm",
          "sales pipeline",
          "lead scoring",
          "sales process",
          "hubspot alternatives",
          "salesforce integration",
        ]}
      />
      <p className="text-xs text-muted-foreground">
        We'll monitor new posts and comments containing these phrases.
      </p>
    </section>
  )
}
