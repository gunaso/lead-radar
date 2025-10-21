"use client"
import { useActionState, useState } from "react"

import { ArrowLeft, CheckCircle } from "lucide-react"

import { useAuthNavigation } from "@/components/auth/auth-container"
import { SubmitButton } from "@/components/ui/submit-button"
import { AuthHeader } from "@/components/auth/auth-header"
import { FormField } from "@/components/auth/form-field"
import { Button } from "@/components/ui/button"

import { validateEmailFormat } from "@/lib/validations/email"
import {
  type ForgotPasswordFormState,
  sendPasswordResetEmail,
} from "@/app/(auth)/forgot-password/actions"

export function ForgotPasswordForm({
  className,
  initialEmail = "",
  ...props
}: React.ComponentProps<"form"> & { initialEmail?: string }) {
  const initialState: ForgotPasswordFormState = { errors: {}, message: null }
  const [state, formAction] = useActionState(
    sendPasswordResetEmail,
    initialState
  )
  const [emailValue, setEmailValue] = useState(initialEmail)
  const { navigateWithAnimation } = useAuthNavigation()

  const isFormValid = validateEmailFormat(emailValue)

  // Show success state
  if (state?.success) {
    return (
      <div className="p-6 md:p-8">
        <div className="flex flex-col gap-6 items-center text-center">
          <div className="rounded-full bg-primary/10 p-3">
            <CheckCircle className="h-12 w-12 text-primary" />
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">Check your email</h2>
            <p className="text-sm text-muted-foreground">
              We've sent a password reset link to{" "}
              <span className="font-medium text-foreground">{emailValue}</span>
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            Click the link in the email to reset your password. The link will
            expire in 60 minutes.
          </p>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            size="loginSm"
            onClick={() => {
              const params = emailValue
                ? `?email=${encodeURIComponent(emailValue)}`
                : ""
              navigateWithAnimation(`/login${params}`)
            }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form action={formAction} className="p-6 md:p-8" {...props}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center text-center relative">
          <Button
            type="button"
            variant="ghost"
            size="goBack"
            className="absolute left-0 top-[3px]"
            onClick={() => {
              const params = emailValue
                ? `?email=${encodeURIComponent(emailValue)}&view=email`
                : "?view=email"
              navigateWithAnimation(`/login${params}`)
            }}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <AuthHeader title="Reset your password" hideName />
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

        {state?.message && !state?.success ? (
          <p className="text-sm text-destructive">{state.message}</p>
        ) : null}

        <SubmitButton
          type="submit"
          className="w-full"
          size="loginSm"
          disabled={!isFormValid}
          loadingText="Sending reset link..."
        >
          Send reset link
        </SubmitButton>

        <div className="text-center text-sm text-muted-foreground">
          Remember your password?{" "}
          <button
            type="button"
            onClick={() => {
              const params = emailValue
                ? `?email=${encodeURIComponent(emailValue)}&view=email`
                : "?view=email"
              navigateWithAnimation(`/login${params}`)
            }}
            className="underline underline-offset-4 hover:text-foreground transition-colors"
          >
            Log in
          </button>
        </div>
      </div>
    </form>
  )
}
