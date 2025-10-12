"use client"

import { type ReactElement } from "react"

import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Dialog,
} from "@/components/ui/dialog"

import { ConfirmDeleteDialog } from "./confirm-delete-dialog"
import { PasswordSection } from "./password-section"
import { NameSection } from "./name-section"
import { DangerZone } from "./danger-zone"

import { useAccountSettings } from "@/hooks/header/use-account-settings"

type AccountSettingsProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function AccountSettings({
  open,
  onOpenChange,
}: AccountSettingsProps): ReactElement {
  const state = useAccountSettings(open, onOpenChange)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl w-full gap-10">
        <DialogHeader>
          <DialogTitle className="mx-auto">Account Settings</DialogTitle>
        </DialogHeader>

        <NameSection
          name={state.name}
          setName={state.setName}
          canSaveName={state.canSaveName}
          isUpdatingName={state.isUpdatingName}
          editingName={state.editingName}
          initialName={state.initialName}
          startEditingName={state.startEditingName}
          saveName={state.saveName}
          nameInputRef={state.nameInputRef}
        />

        <PasswordSection
          editingPassword={state.editingPassword}
          setEditingPassword={state.setEditingPassword}
          currentPassword={state.currentPassword}
          setCurrentPassword={state.setCurrentPassword}
          newPassword={state.newPassword}
          setNewPassword={state.setNewPassword}
          confirmPassword={state.confirmPassword}
          setConfirmPassword={state.setConfirmPassword}
          canSavePassword={state.canSavePassword}
          currentPasswordError={state.currentPasswordError}
          newPasswordError={state.newPasswordError}
          confirmPasswordError={state.confirmPasswordError}
          isChangingPassword={state.isChangingPassword}
          cancelPasswordEditing={state.cancelPasswordEditing}
          savePassword={state.savePassword}
          setCurrentPasswordError={state.setCurrentPasswordError}
          setNewPasswordError={state.setNewPasswordError}
          setConfirmPasswordError={state.setConfirmPasswordError}
        />

        <DangerZone onDeleteClick={() => state.setConfirmDeleteOpen(true)} />

        <DialogFooter />
      </DialogContent>

      <ConfirmDeleteDialog
        open={state.confirmDeleteOpen}
        onOpenChange={state.setConfirmDeleteOpen}
        confirmDeleteText={state.confirmDeleteText}
        setConfirmDeleteText={state.setConfirmDeleteText}
        canDelete={state.canDelete}
        isDeletingAccount={state.isDeletingAccount}
        onConfirm={state.confirmDelete}
      />
    </Dialog>
  )
}
