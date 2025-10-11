"use client"
import { useActionState, useState } from "react"
import { ArrowLeft } from "lucide-react"

import { useAuthNavigation } from "@/components/auth/auth-container"
import { AuthToggleLink } from "@/components/auth/auth-toggle-link"
import { SubmitButton } from "@/components/ui/submit-button"
import { AuthHeader } from "@/components/auth/auth-header"
import { FormField } from "@/components/auth/form-field"
import { Button } from "@/components/ui/button"

import { login, type AuthFormState } from "../../app/(auth)/login-email/actions"
import { validateEmailFormat } from "@/lib/validations/email"

interface EmailLoginFormProps {
  email: string
  onBack: () => void
}

/**
 * Email and password login form with validation
 */
export function EmailLoginForm({ email, onBack }: EmailLoginFormProps) {
  const initialState: AuthFormState = { errors: {}, message: null }
  const [state, formAction] = useActionState(login, initialState)
  const { navigateWithAnimation } = useAuthNavigation()

  const [emailValue, setEmailValue] = useState(email)
  const [passwordValue, setPasswordValue] = useState("")

  const isFormValid =
    validateEmailFormat(emailValue) && passwordValue.length > 0

  return (
    <form action={formAction} className="p-6 md:p-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center text-center relative">
          <Button
            type="button"
            variant="ghost"
            size="goBack"
            className="absolute left-0 top-[3px]"
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <AuthHeader title="Welcome to" />
        </div>

        <FormField
          id="email"
          name="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          value={emailValue}
          onChange={(e) => setEmailValue(e.target.value)}
          error={state?.errors?.email?.[0]}
          required
          labelClassName="text-muted-foreground"
        />

        <FormField
          id="password"
          name="password"
          type="password"
          label="Password"
          value={passwordValue}
          onChange={(e) => setPasswordValue(e.target.value)}
          error={state?.errors?.password?.[0]}
          required
          labelClassName="text-muted-foreground"
          autoFocus
          extraContent={
            <button
              type="button"
              onClick={() => {
                const params = emailValue
                  ? `?email=${encodeURIComponent(emailValue)}`
                  : ""
                navigateWithAnimation(`/forgot-password${params}`)
              }}
              className="ml-auto text-sm text-muted-foreground underline-offset-2 hover:underline"
            >
              Forgot your password?
            </button>
          }
        />

        {state?.message ? (
          <p className="text-sm text-destructive">{state.message}</p>
        ) : null}

        <SubmitButton type="submit" className="w-full" disabled={!isFormValid}>
          Login
        </SubmitButton>

        <AuthToggleLink
          text="Don't have an account?"
          linkText="Sign up"
          targetPath="/signup"
          emailValue={emailValue}
        />
      </div>
    </form>
  )
}
