"use client"
import { useActionState, useState, useEffect } from "react"

import { CheckCircle } from "lucide-react"

import { useAuthNavigation } from "@/components/auth/auth-container"
import { SubmitButton } from "@/components/ui/submit-button"
import { AuthHeader } from "@/components/auth/auth-header"
import { FormField } from "@/components/auth/form-field"
import { Button } from "@/components/ui/button"

import {
  type ResetPasswordFormState,
  updatePassword,
} from "@/app/(auth)/forgot-password/actions"
import { cn } from "@/lib/utils"

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const initialState: ResetPasswordFormState = { errors: {}, message: null }
  const [state, formAction] = useActionState(updatePassword, initialState)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const { navigateWithAnimation } = useAuthNavigation()

  const passwordsMatch = !confirmPassword || password === confirmPassword
  const isFormValid = passwordsMatch && password && confirmPassword

  // Redirect to login after successful password reset
  useEffect(() => {
    if (state?.success) {
      const timer = setTimeout(() => {
        navigateWithAnimation("/login?view=email")
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [state?.success, navigateWithAnimation])

  // Show success state
  if (state?.success) {
    return (
      <div className="p-6 md:p-8">
        <div className="flex flex-col gap-6 items-center text-center">
          <div className="rounded-full bg-primary/10 p-3">
            <CheckCircle className="h-12 w-12 text-primary" />
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">Password updated!</h2>
            <p className="text-sm text-muted-foreground">
              Your password has been successfully reset.
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            You'll be redirected to the login page in a few seconds...
          </p>
          <Button
            type="button"
            className="w-full"
            onClick={() => navigateWithAnimation("/login?view=email")}
          >
            Go to login now
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form
      action={formAction}
      className={cn("p-6 md:p-8", className)}
      {...props}
    >
      <div className="flex flex-col gap-6">
        <AuthHeader title="Create new password" hideName />

        <FormField
          id="password"
          name="password"
          type="password"
          label="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={state?.errors?.password?.[0]}
          required
          labelClassName="text-muted-foreground"
        />

        <FormField
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={state?.errors?.confirmPassword?.[0]}
          required
          labelClassName="text-muted-foreground"
        />

        {state?.message && !state?.success ? (
          <p className="text-sm text-destructive">{state.message}</p>
        ) : null}

        <SubmitButton
          type="submit"
          className="w-full"
          disabled={!isFormValid}
          loadingText="Updating password..."
        >
          Update password
        </SubmitButton>
      </div>
    </form>
  )
}
