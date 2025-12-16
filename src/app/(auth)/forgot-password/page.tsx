"use client"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"

function ForgotPasswordPageContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""

  return <ForgotPasswordForm initialEmail={email} />
}

export default function ForgotPasswordPage() {
  return (
    <Suspense>
      <ForgotPasswordPageContent />
    </Suspense>
  )
}
