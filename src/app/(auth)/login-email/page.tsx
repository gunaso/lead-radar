"use client"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

import { EmailLoginForm } from "@/components/auth/email-login-form"
import { useAuthNavigation } from "@/components/auth/auth-container"

function LoginEmailPageContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  const { navigateWithAnimation } = useAuthNavigation()

  return (
    <EmailLoginForm
      email={email}
      onBack={() => {
        const params = email ? `?email=${encodeURIComponent(email)}` : ""
        navigateWithAnimation(`/login${params}`)
      }}
    />
  )
}

export default function LoginEmailPage() {
  return (
    <Suspense>
      <LoginEmailPageContent />
    </Suspense>
  )
}
