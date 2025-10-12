"use client"

import { type ReactElement } from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  AlertDialogDescription,
  AlertDialogContent,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialog,
} from "@/components/ui/alert-dialog"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  confirmDeleteText: string
  setConfirmDeleteText: (v: string) => void
  canDelete: boolean
  isDeletingAccount: boolean
  onConfirm: () => void
}

export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  confirmDeleteText,
  setConfirmDeleteText,
  canDelete,
  isDeletingAccount,
  onConfirm,
}: Props): ReactElement {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent overlayProps={{ className: "bg-black/70" }}>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">
            Delete account
          </AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete your account. If you own a workspace,
            it will also be deleted. Type "DELETE" to confirm.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-2">
          <Label htmlFor="confirm-delete">Type DELETE to confirm</Label>
          <Input
            id="confirm-delete"
            value={confirmDeleteText}
            onChange={(e) => setConfirmDeleteText(e.target.value)}
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeletingAccount}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={!canDelete || isDeletingAccount}
            onClick={onConfirm}
          >
            Confirm delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
