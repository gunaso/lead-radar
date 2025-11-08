import { UseMutationResult } from "@tanstack/react-query"
import { useState } from "react"
import { toast } from "sonner"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  AlertDialogDescription,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogTitle,
  AlertDialogBody,
} from "@/components/ui/alert-dialog"

function DeleteAccountDialog({
  deleteAccount,
}: {
  deleteAccount: UseMutationResult<{ ok: boolean }, unknown, void, unknown>
}) {
  const [confirmDeleteText, setConfirmDeleteText] = useState("")
  const canDelete = confirmDeleteText === "DELETE"

  const handleConfirm = async () => {
    deleteAccount.mutate(undefined, {
      onSuccess: () => {
        toast.success("Account deleted")
        window.location.href = "/signup"
      },
      onError: (e: any) =>
        toast.error(e?.message || "Failed to delete account"),
    })
  }

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle className="text-destructive">
          Delete account
        </AlertDialogTitle>
      </AlertDialogHeader>
      <AlertDialogBody>
        <AlertDialogDescription>
          This will permanently delete your account. If you own a workspace, it
          will also be deleted. Type "DELETE" to confirm.
        </AlertDialogDescription>
        <div className="grid gap-2">
          <Label htmlFor="confirm-delete">Type DELETE to confirm</Label>
          <Input
            id="confirm-delete"
            value={confirmDeleteText}
            onChange={(e) => setConfirmDeleteText(e.target.value)}
          />
        </div>
      </AlertDialogBody>
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end px-8 pb-6">
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          variant="destructive"
          disabled={!canDelete}
          onClick={handleConfirm}
        >
          Confirm delete
        </AlertDialogAction>
      </div>
    </AlertDialogContent>
  )
}

export { DeleteAccountDialog }
