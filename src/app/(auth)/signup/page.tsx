"use client"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

import { SignupForm } from "@/components/auth/signup-form"

function SignupPageContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""

  return <SignupForm initialEmail={email} />
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupPageContent />
    </Suspense>
  )
}
