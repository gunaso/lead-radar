"use client"

import { type ReactElement } from "react"

import { Button } from "@/components/ui/button"

type Props = {
  onDeleteClick: () => void
}

export function DangerZone({ onDeleteClick }: Props): ReactElement {
  return (
    <section className="space-y-3">
      <div className="text-sm font-medium text-red-600">Danger zone</div>
      <div className="flex items-center gap-2">
        <p className="text-sm text-muted-foreground">
          Deleting your account is permanent. If you are the workspace owner,
          the workspace will also be deleted.
        </p>
        <Button variant="destructive" type="button" onClick={onDeleteClick}>
          Delete account
        </Button>
      </div>
    </section>
  )
}
