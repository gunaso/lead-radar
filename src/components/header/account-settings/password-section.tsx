"use client"

import { type ReactElement } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Props = {
  editingPassword: boolean
  setEditingPassword: (value: boolean) => void
  currentPassword: string
  setCurrentPassword: (v: string) => void
  newPassword: string
  setNewPassword: (v: string) => void
  confirmPassword: string
  setConfirmPassword: (v: string) => void
  canSavePassword: boolean
  currentPasswordError: boolean
  newPasswordError: boolean
  confirmPasswordError: boolean
  isChangingPassword: boolean
  cancelPasswordEditing: () => void
  savePassword: () => void
  setCurrentPasswordError: (v: boolean) => void
  setNewPasswordError: (v: boolean) => void
  setConfirmPasswordError: (v: boolean) => void
}

export function PasswordSection({
  editingPassword,
  setEditingPassword,
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  canSavePassword,
  currentPasswordError,
  newPasswordError,
  confirmPasswordError,
  isChangingPassword,
  cancelPasswordEditing,
  savePassword,
  setCurrentPasswordError,
  setNewPasswordError,
  setConfirmPasswordError,
}: Props): ReactElement {
  return (
    <section className="space-y-3">
      {!editingPassword ? (
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Password</p>
            <p className="font-medium pl-3 py-1">••••••••</p>
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setEditingPassword(true)}
          >
            Change
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid gap-2">
            <Label htmlFor="current-password">Current password</Label>
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value)
                if (currentPasswordError) setCurrentPasswordError(false)
              }}
              aria-invalid={currentPasswordError || undefined}
              disabled={isChangingPassword}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="new-password">New password</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value)
                if (newPasswordError) setNewPasswordError(false)
              }}
              aria-invalid={newPasswordError || undefined}
              disabled={isChangingPassword}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirm-password">Confirm new password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                if (confirmPasswordError) setConfirmPasswordError(false)
              }}
              aria-invalid={confirmPasswordError || undefined}
              disabled={isChangingPassword}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={cancelPasswordEditing}
              disabled={isChangingPassword}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={!canSavePassword || isChangingPassword}
              onClick={savePassword}
            >
              {isChangingPassword ? "Updating..." : "Update password"}
            </Button>
          </div>
        </div>
      )}
    </section>
  )
}
