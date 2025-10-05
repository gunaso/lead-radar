'use server'

import { createClient } from "@/lib/supabase/server"

type FieldErrors = {
  email?: string[]
}

export type ForgotPasswordFormState = {
  errors?: FieldErrors
  message?: string | null
  success?: boolean
}

/**
 * Sends a password reset email to the user
 * Uses Supabase's built-in password reset functionality
 */
export async function sendPasswordResetEmail(
  _prevState: ForgotPasswordFormState,
  formData: FormData
): Promise<ForgotPasswordFormState> {
  const supabase = await createClient()

  const email = (formData.get("email") as string) || ""

  const errors: FieldErrors = {}
  if (!email) {
    errors.email = ["Email is required"]
    return { errors, message: "Please fix the errors below." }
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
  })

  if (error) {
    const message = error.message || "Unable to send reset email"
    return { message }
  }

  return {
    success: true,
    message: "Check your email for the password reset link.",
  }
}

type ResetPasswordFieldErrors = {
  password?: string[]
  confirmPassword?: string[]
}

export type ResetPasswordFormState = {
  errors?: ResetPasswordFieldErrors
  message?: string | null
  success?: boolean
}

/**
 * Updates the user's password after they click the reset link
 * This is called from the reset password page
 */
export async function updatePassword(
  _prevState: ResetPasswordFormState,
  formData: FormData
): Promise<ResetPasswordFormState> {
  const supabase = await createClient()

  const data = {
    password: (formData.get("password") as string) || "",
    confirmPassword: (formData.get("confirmPassword") as string) || "",
  }

  const errors: ResetPasswordFieldErrors = {}
  if (!data.password) errors.password = ["Password is required"]
  if (!data.confirmPassword)
    errors.confirmPassword = ["Please confirm your password"]
  if (
    data.password &&
    data.confirmPassword &&
    data.password !== data.confirmPassword
  ) {
    errors.confirmPassword = ["Passwords do not match"]
  }
  if (errors.password || errors.confirmPassword) {
    return { errors, message: "Please fix the errors below." }
  }

  const { error } = await supabase.auth.updateUser({
    password: data.password,
  })

  if (error) {
    const message = error.message || "Unable to update password"
    if (/password/i.test(message)) {
      return {
        errors: { password: [message] },
        message: null,
      }
    }
    return { message }
  }

  return {
    success: true,
    message: "Password updated successfully. Redirecting to login...",
  }
}

