"use client"
import { useState } from "react"
import { useSearchParams } from "next/navigation"

import { ProvidersView } from "@/components/auth/providers-view"
import { useAuthNavigation } from "@/components/auth/auth-container"

export default function LoginPage() {
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
