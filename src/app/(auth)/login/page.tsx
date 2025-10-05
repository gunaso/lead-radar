"use client"
import { useSearchParams } from "next/navigation"

import LoginForm from "@/components/auth/login-form"

export default function LoginPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  const view = searchParams.get("view") as "providers" | "email" | null

  return <LoginForm initialEmail={email} initialView={view || "providers"} />
}
