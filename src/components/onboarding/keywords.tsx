"use client"

import { useEffect, useRef, useState, type ReactElement } from "react"

import { Label } from "@/components/ui/label"
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
  const fetchedRef = useRef(false)
  const { data } = useProfileQuery()

  useEffect(() => {
    if (fetchedRef.current) return
    if (!data) return
    const list: string[] = Array.isArray(
      data.profile?.workspace?.keywords_suggested
    )
      ? (data.profile.workspace?.keywords_suggested as string[])
      : []
    setSuggestions(list)
    fetchedRef.current = true
  }, [data])

  return (
    <section className="space-y-3">
      <Label>Which keywords should we track?</Label>
      <TagInput
        placeholder="Add keyword and press Enter"
        value={keywords}
        onChange={setKeywords}
        suggestions={suggestions}
      />
      <p className="text-xs text-muted-foreground">
        We'll monitor new posts and comments containing these phrases.
      </p>
    </section>
  )
}
