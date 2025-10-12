"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { toast } from "sonner"

import {
  useChangePasswordMutation,
  useDeleteAccountMutation,
  useUpdateProfileMutation,
  useProfileQuery,
} from "@/queries/profile"

export function useAccountSettings(open: boolean, onOpenChange: (open: boolean) => void) {
  const { data } = useProfileQuery()

  const initialName = useMemo(() => data?.profile?.name ?? "", [data])

  const [confirmPasswordError, setConfirmPasswordError] = useState(false)
  const [currentPasswordError, setCurrentPasswordError] = useState(false)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [newPasswordError, setNewPasswordError] = useState(false)
  const [confirmDeleteText, setConfirmDeleteText] = useState("")
  const [editingPassword, setEditingPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const nameInputRef = useRef<HTMLInputElement | null>(null)
  const [editingName, setEditingName] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [name, setName] = useState("")

  const changePassword = useChangePasswordMutation()
  const updateProfile = useUpdateProfileMutation()
  const deleteAccount = useDeleteAccountMutation()

  useEffect(() => {
    if (open) {
      setName(initialName)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setCurrentPasswordError(false)
      setNewPasswordError(false)
      setConfirmPasswordError(false)
      setConfirmDeleteText("")
      setEditingName(false)
      setEditingPassword(false)
    }
  }, [open, initialName])

  const canSaveName = name.trim().length >= 2
  const canSavePassword =
    currentPassword.length > 0 && newPassword.length >= 8 && newPassword === confirmPassword
  const canDelete = confirmDeleteText === "DELETE"

  const startEditingName = () => {
    setEditingName(true)
    requestAnimationFrame(() => nameInputRef.current?.focus())
  }

  const saveName = () => {
    if (!canSaveName) return
    updateProfile.mutate(
      { name: name.trim() },
      {
        onSuccess: () => {
          toast.success("Name updated")
          setEditingName(false)
        },
        onError: (e: any) => toast.error(e?.message ?? "Failed to update name"),
      }
    )
  }

  const cancelPasswordEditing = () => {
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setCurrentPasswordError(false)
    setNewPasswordError(false)
    setConfirmPasswordError(false)
    setEditingPassword(false)
  }

  const savePassword = () => {
    if (!canSavePassword) return
    setCurrentPasswordError(false)
    setNewPasswordError(false)
    setConfirmPasswordError(false)
    changePassword.mutate(
      { currentPassword, newPassword, confirmPassword },
      {
        onSuccess: () => {
          toast.success("Password updated")
          setCurrentPassword("")
          setNewPassword("")
          setConfirmPassword("")
          setEditingPassword(false)
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

  const confirmDelete = () => {
    if (!canDelete) return
    deleteAccount.mutate(undefined, {
      onSuccess: () => {
        toast.success("Account deleted")
        setConfirmDeleteOpen(false)
        onOpenChange(false)
        window.location.href = "/signup"
      },
      onError: (e: any) => toast.error(e?.message ?? "Failed to delete account"),
    })
  }

  return {
    // data
    name,
    setName,
    initialName,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    confirmDeleteText,
    setConfirmDeleteText,
    // ui state
    editingName,
    setEditingName,
    editingPassword,
    setEditingPassword,
    confirmDeleteOpen,
    setConfirmDeleteOpen,
    nameInputRef,
    // derived
    canSaveName,
    canSavePassword,
    canDelete,
    // errors
    currentPasswordError,
    newPasswordError,
    confirmPasswordError,
    setCurrentPasswordError,
    setNewPasswordError,
    setConfirmPasswordError,
    // mutations state
    isUpdatingName: updateProfile.isPending,
    isChangingPassword: changePassword.isPending,
    isDeletingAccount: deleteAccount.isPending,
    // actions
    startEditingName,
    saveName,
    cancelPasswordEditing,
    savePassword,
    confirmDelete,
  }
}


