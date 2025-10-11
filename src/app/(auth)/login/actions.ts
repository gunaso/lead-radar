'use server'

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server"

type FieldErrors = {
  email?: string[]
  password?: string[]
  confirmPassword?: string[]
}

export type AuthFormState = {
  errors?: FieldErrors
  message?: string | null
}

export async function signup(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const supabase = await createClient()

  const data = {
    email: (formData.get("email") as string) || "",
    password: (formData.get("password") as string) || "",
    confirmPassword: (formData.get("confirmPassword") as string) || "",
  }

  const errors: FieldErrors = {}
  if (!data.email) errors.email = ["Email is required"]
  if (!data.password) errors.password = ["Password is required"]
  if (!data.confirmPassword) errors.confirmPassword = ["Please confirm your password"]
  if (data.password && data.confirmPassword && data.password !== data.confirmPassword) {
    errors.confirmPassword = ["Passwords do not match"]
  }
  if (errors.email || errors.password || errors.confirmPassword) {
    return { errors, message: "Please fix the errors below." }
  }

  const { error } = await supabase.auth.signUp(data)
  if (error) {
    const message = error.message || "Unable to sign up"
    if (/user already registered/i.test(message)) {
      return {
        errors: { email: ["An account with this email already exists."] },
        message: null,
      }
    }
    if (/password/i.test(message)) {
      return {
        errors: { password: [message] },
        message: null,
      }
    }
    return { message }
  }

  revalidatePath("/", "layout")
  redirect("/")
}


