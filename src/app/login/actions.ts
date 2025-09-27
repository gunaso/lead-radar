'use server'

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server"

type FieldErrors = {
  email?: string[]
  password?: string[]
}

export type AuthFormState = {
  errors?: FieldErrors
  message?: string | null
}

const emptyState: AuthFormState = { errors: {}, message: null }

export async function login(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const supabase = await createClient()

  const data = {
    email: (formData.get("email") as string) || "",
    password: (formData.get("password") as string) || "",
  }

  const errors: FieldErrors = {}
  if (!data.email) errors.email = ["Email is required"]
  if (!data.password) errors.password = ["Password is required"]
  if (errors.email || errors.password) {
    return { errors, message: "Please fix the errors below." }
  }

  const { error } = await supabase.auth.signInWithPassword(data)
  if (error) {
    const message = error.message || "Unable to sign in"
    // Map common auth errors to field-specific messages
    if (/invalid login credentials/i.test(message)) {
      return {
        errors: { password: ["Incorrect email or password."] },
        message: null,
      }
    }
    if (/email not confirmed|confirm your email/i.test(message)) {
      return {
        errors: { email: ["Please verify your email before logging in."] },
        message: null,
      }
    }
    return { message }
  }

  revalidatePath("/", "layout")
  redirect("/")
}

export async function signup(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const supabase = await createClient()

  const data = {
    email: (formData.get("email") as string) || "",
    password: (formData.get("password") as string) || "",
  }

  const errors: FieldErrors = {}
  if (!data.email) errors.email = ["Email is required"]
  if (!data.password) errors.password = ["Password is required"]
  if (errors.email || errors.password) {
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


