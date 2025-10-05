"use client"
import { useSearchParams } from "next/navigation"

import { SignupForm } from "@/components/auth/signup-form"

export default function SignupPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""

  return <SignupForm initialEmail={email} />
}
