"use client"
import { AnimatePresence } from "framer-motion"
import { useState } from "react"

import { EmailLoginForm } from "@/components/auth/email-login-form"
import { ProvidersView } from "@/components/auth/providers-view"

type LoginView = "providers" | "email"
type Direction = "forward" | "backward"

interface LoginFormProps {
  initialEmail?: string
  initialView?: LoginView
}

/**
 * Main login form orchestrator that manages view transitions
 * between OAuth providers and email/password login
 */
export default function LoginForm({
  initialEmail = "",
  initialView = "providers",
}: LoginFormProps) {
  const [direction, setDirection] = useState<Direction>("forward")
  const [view, setView] = useState<LoginView>(initialView)
  const [email, setEmail] = useState(initialEmail)

  const goToEmail = () => {
    setDirection("forward")
    setView("email")
  }

  const goBack = () => {
    setDirection("backward")
    setView("providers")
  }

  return (
    <div className="relative overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        {view === "providers" ? (
          <ProvidersView
            key="providers"
            email={email}
            onEmailChange={setEmail}
            onContinue={goToEmail}
            direction={direction}
          />
        ) : (
          <EmailLoginForm
            key="email"
            email={email}
            onBack={goBack}
            direction={direction}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
