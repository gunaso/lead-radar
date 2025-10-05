"use client"
import { useActionState, useState } from "react"

import { AuthToggleLink } from "@/components/auth/auth-toggle-link"
import { SubmitButton } from "@/components/ui/submit-button"
import { AuthHeader } from "@/components/auth/auth-header"
import { FormField } from "@/components/auth/form-field"

import { signup, type AuthFormState } from "@/app/(auth)/login/actions"
import { validateEmailFormat } from "@/lib/validations/email"
import { cn } from "@/lib/utils"

export function SignupForm({
  className,
  initialEmail = "",
  ...props
}: React.ComponentProps<"form"> & { initialEmail?: string }) {
  const initialState: AuthFormState = { errors: {}, message: null }
  const [state, formAction] = useActionState(signup, initialState)
  const [emailValue, setEmailValue] = useState(initialEmail)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const isEmailValid = emailValue && validateEmailFormat(emailValue)
  const passwordsMatch = !confirmPassword || password === confirmPassword
  const isFormValid =
    isEmailValid && passwordsMatch && password && confirmPassword
  return (
    <form
      action={formAction}
      className={cn("p-6 md:p-8", className)}
      {...props}
    >
      <div className="flex flex-col gap-6">
        <AuthHeader title="Sign Up to" />
        <FormField
          id="email"
          name="email"
          type="email"
          label="Email"
          placeholder="m@example.com"
          value={emailValue}
          onChange={(e) => setEmailValue(e.target.value)}
          error={state?.errors?.email?.[0]}
          required
        />
        <FormField
          id="password"
          name="password"
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={state?.errors?.password?.[0]}
          required
        />
        <FormField
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={state?.errors?.confirmPassword?.[0]}
          required
        />
        {state?.message ? (
          <p className="text-sm text-destructive">{state.message}</p>
        ) : null}
        <SubmitButton
          type="submit"
          className="w-full"
          disabled={!isFormValid}
          loadingText="Creating account..."
        >
          Create account
        </SubmitButton>
        <AuthToggleLink
          text="Already have an account?"
          linkText="Log in"
          targetPath="/login"
          emailValue={emailValue}
          className="text-center text-sm"
        />
      </div>
    </form>
  )
}
