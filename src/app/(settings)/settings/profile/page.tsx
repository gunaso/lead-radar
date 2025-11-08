"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { toast } from "sonner"

import { DeleteAccountDialog } from "@/components/settings/DeleteAccountDialog"
import { AlertDialogTrigger, AlertDialog } from "@/components/ui/alert-dialog"
import { ProfileAvatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  SettingsContainerElem,
  SettingsContainer,
} from "@/components/ui/settings-container"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

import type { ApiError } from "@/lib/api/client"
import {
  useChangePasswordMutation,
  useDeleteAccountMutation,
  useUpdateProfileMutation,
  useProfileQuery,
} from "@/queries/profile"

export default function ProfilePage() {
  const changePassword = useChangePasswordMutation()
  const updateProfile = useUpdateProfileMutation()
  const deleteAccount = useDeleteAccountMutation()
  const { data } = useProfileQuery()

  // Full name state and behavior
  const initialName = useMemo(() => data?.profile?.name ?? "", [data])
  const [nameInputError, setNameInputError] = useState<string | null>(null)
  const lastSavedNameRef = useRef<string>("")
  const [name, setName] = useState("")
  const initializedRef = useRef(false)

  useEffect(() => {
    if (!initializedRef.current && data) {
      initializedRef.current = true
      const startName = data.profile?.name ?? ""
      lastSavedNameRef.current = startName
      setName(startName)
    }
  }, [data])

  // Debounced autosave for name (500ms)
  useEffect(() => {
    if (!initializedRef.current) return
    if (name.trim() === lastSavedNameRef.current.trim()) return
    // Do not send empty names to the backend
    if (name.trim().length === 0) {
      return
    }
    setNameInputError(null)
    const t = setTimeout(() => {
      updateProfile.mutate(
        { name: name.trim() },
        {
          onSuccess: () => {
            lastSavedNameRef.current = name.trim()
            toast.success("Name saved")
          },
          onError: (e: ApiError) => {
            if (e?.status === 400) {
              // Keep showing chosen name and surface validation error
              setNameInputError(e.message)
            } else {
              toast.error(e?.message || "Failed to update name")
              setName(lastSavedNameRef.current)
            }
          },
        }
      )
    }, 500)
    return () => clearTimeout(t)
  }, [name, updateProfile])

  // Password section state
  const [confirmPasswordError, setConfirmPasswordError] = useState(false)
  const [currentPasswordError, setCurrentPasswordError] = useState(false)
  const [newPasswordError, setNewPasswordError] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [newPassword, setNewPassword] = useState("")

  const canChangePassword =
    currentPassword.length > 0 &&
    newPassword.length >= 8 &&
    newPassword === confirmPassword

  const submitPasswordChange = () => {
    if (!canChangePassword) return
    setCurrentPasswordError(false)
    setNewPasswordError(false)
    setConfirmPasswordError(false)
    changePassword.mutate(
      { currentPassword, newPassword, confirmPassword },
      {
        onSuccess: () => {
          toast.success("Password changed")
          setCurrentPassword("")
          setNewPassword("")
          setConfirmPassword("")
          setPasswordOpen(false)
        },
        onError: (e: any) => {
          const message: string = e?.message || "Failed to update password"
          const lower = message.toLowerCase()
          if (e?.status === 401 || lower.includes("current password")) {
            setCurrentPasswordError(true)
          } else if (lower.includes("new password")) {
            setNewPasswordError(true)
          } else if (lower.includes("confirm") || lower.includes("match")) {
            setNewPasswordError(true)
            setConfirmPasswordError(true)
          }
          toast.error(message)
        },
      }
    )
  }

  return (
    <section className="settings-section">
      <SettingsContainer>
        <SettingsContainerElem title="Profile picture" commingSoon>
          <ProfileAvatar image={null} name={initialName || ""} />
        </SettingsContainerElem>
        <SettingsContainerElem title="Full name">
          <div className="grid gap-2 max-w-64">
            <Input
              className="max-w-40 text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
            />
            {nameInputError ? (
              <p className="text-xs text-destructive">{nameInputError}</p>
            ) : null}
          </div>
        </SettingsContainerElem>
        <SettingsContainerElem title="Password">
          <Collapsible open={passwordOpen} onOpenChange={setPasswordOpen}>
            {!passwordOpen && (
              <CollapsibleTrigger asChild className="flex items-center">
                <div className="flex justify-end items-center h-9">
                  <Button size="sm" variant="outline">
                    Change password
                  </Button>
                </div>
              </CollapsibleTrigger>
            )}
            <CollapsibleContent>
              <div className="grid gap-3 max-w-sm">
                <div className="grid gap-2">
                  <Label htmlFor="current-password">Current password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  {currentPasswordError && (
                    <p className="text-xs text-destructive">
                      Current password is incorrect
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="new-password">New password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  {newPasswordError && (
                    <p className="text-xs text-destructive">
                      New password must be at least 8 characters
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirm-password">Confirm new password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  {confirmPasswordError && (
                    <p className="text-xs text-destructive">
                      Passwords do not match
                    </p>
                  )}
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPasswordOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={submitPasswordChange}
                    disabled={!canChangePassword}
                  >
                    Change password
                  </Button>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </SettingsContainerElem>
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
            <DeleteAccountDialog deleteAccount={deleteAccount} />
          </AlertDialog>
        </SettingsContainerElem>
      </SettingsContainer>
    </section>
  )
}
