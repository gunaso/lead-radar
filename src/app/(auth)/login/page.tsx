"use client"
import { useSearchParams } from "next/navigation"
import { useState, Suspense } from "react"

import { ProvidersView } from "@/components/auth/providers-view"
import { useAuthNavigation } from "@/components/auth/auth-container"

function LoginPageContent() {
  const searchParams = useSearchParams()
  const initialEmail = searchParams.get("email") || ""
  const [email, setEmail] = useState(initialEmail)
  const { navigateWithAnimation } = useAuthNavigation()

  return (
    <ProvidersView
      email={email}
      onEmailChange={setEmail}
      onContinue={() => {
        const params = email ? `?email=${encodeURIComponent(email)}` : ""
        navigateWithAnimation(`/login-email${params}`)
      }}
    />
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageContent />
    </Suspense>
  )
}
