"use client"

import { useState } from "react"

import NewAction from "@/components/ui/new-action"
import { Input } from "@/components/ui/input"
import { useCreateKeyword } from "@/queries/keywords"

export function NewKeywordAction() {
  const create = useCreateKeyword()
  const [error, setError] = useState<string | null>(null)

  return (
    <NewAction
      name="Keyword"
      dialogBodyClassName="py-4"
      error={error}
      onErrorChange={setError}
      onSubmit={async (fd) => {
        const name = String(fd.get("name") || "").trim()
        if (!name) return
        try {
          await create.mutateAsync({ name })
        } catch (err) {
          // Error will be caught and handled by NewAction component
          // The optimistic item will be removed by the mutation's onError handler
          throw err
        }
      }}
    >
      <Input
        size="creating"
        variant="creating"
        placeholder="Keyword"
        name="name"
      />
    </NewAction>
  )
}
