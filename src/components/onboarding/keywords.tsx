"use client"

import { useEffect, useState, type ReactElement } from "react"

import { TagInput } from "@/components/tag-input"

import { useProfileQuery } from "@/queries/profile"

type KeywordsStepProps = {
  keywords: string[]
  setKeywords: (value: string[]) => void
}

export default function KeywordsStep({
  keywords,
  setKeywords,
}: KeywordsStepProps): ReactElement {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const { data } = useProfileQuery()

  useEffect(() => {
    if (!data) return
    const list: string[] = Array.isArray(
      data.profile?.workspace?.keywords_suggested
    )
      ? (data.profile.workspace?.keywords_suggested as string[])
      : []
    setSuggestions(list)
  }, [data])

  return (
    <section className="space-y-3">
      <span className="flex text-md font-semibold text-muted-foreground">
        Which keywords should we track?
      </span>
      <TagInput
        placeholder="Add keyword and press Enter"
        value={keywords}
        onChange={setKeywords}
        suggestions={suggestions}
      />
      <p className="text-xs text-muted-foreground">
        We'll monitor new posts and comments containing these keywords.
      </p>
    </section>
  )
}
