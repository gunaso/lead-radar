"use client"

import { useState } from "react"

import { ProfileAvatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  SettingsContainerElem,
  SettingsContainer,
} from "@/components/ui/settings-container"
import {
  AlertDialogDescription,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogTitle,
  AlertDialogBody,
  AlertDialog,
} from "@/components/ui/alert-dialog"

export default function ProfilePage() {
  return (
    <section className="settings-section">
      <SettingsContainer>
        <SettingsContainerElem title="Profile picture" commingSoon>
          <ProfileAvatar image={null} name="John Doe" />
        </SettingsContainerElem>
        <SettingsContainerElem title="Full name">
          <Input className="max-w-40" />
        </SettingsContainerElem>
        <SettingsContainerElem title="Password">{null}</SettingsContainerElem>
      </SettingsContainer>
      <SettingsContainer title="Danger zone">
        <SettingsContainerElem
          title="Delete account"
          description="Delete your account and any workspaces that you own."
        >
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                Delete account
              </Button>
            </AlertDialogTrigger>
            <DeleteDialog />
          </AlertDialog>
        </SettingsContainerElem>
      </SettingsContainer>
    </section>
  )
}

function DeleteDialog() {
  const [confirmDeleteText, setConfirmDeleteText] = useState("")
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
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction variant="destructive">
          Confirm delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}
