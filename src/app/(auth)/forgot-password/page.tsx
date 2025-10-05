"use client"
import { useSearchParams } from "next/navigation"

import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"

export default function ForgotPasswordPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""

  return <ForgotPasswordForm initialEmail={email} />
}
