"use client"

import { type ReactElement } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Props = {
  name: string
  setName: (value: string) => void
  canSaveName: boolean
  isUpdatingName: boolean
  editingName: boolean
  initialName: string
  startEditingName: () => void
  saveName: () => void
  nameInputRef: React.RefObject<HTMLInputElement | null>
}

export function NameSection({
  name,
  setName,
  canSaveName,
  isUpdatingName,
  editingName,
  initialName,
  startEditingName,
  saveName,
  nameInputRef,
}: Props): ReactElement {
  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between gap-4">
        <div className="grid gap-2 flex-1">
          <Label htmlFor="full-name">Full Name</Label>
          <Input
            id="full-name"
            ref={nameInputRef}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            disabled={!editingName}
            className="disabled:opacity-100! disabled:border-none! disabled:ring-0! disabled:shadow-none!"
          />
        </div>
        <Button
          type="button"
          variant={editingName ? "default" : "secondary"}
          disabled={
            editingName
              ? !canSaveName ||
                isUpdatingName ||
                name.trim() === initialName.trim()
              : false
          }
          onClick={() => {
            if (!editingName) {
              startEditingName()
            } else {
              saveName()
            }
          }}
        >
          {editingName ? (isUpdatingName ? "Saving..." : "Save") : "Change"}
        </Button>
      </div>
    </section>
  )
}
