"use client"

import { useActionState } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signup, type AuthFormState } from "@/app/login/actions"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const initialState: AuthFormState = { errors: {}, message: null }
  const [state, formAction] = useActionState(signup, initialState)
  return (
    <form
      action={formAction}
      className={cn("p-6 md:p-8", className)}
      {...props}
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground text-balance">
            Sign up to get started
          </p>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
          />
          {state?.errors?.email?.length ? (
            <p className="text-sm text-destructive">{state.errors.email[0]}</p>
          ) : null}
        </div>
        <div className="grid gap-3">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required />
          {state?.errors?.password?.length ? (
            <p className="text-sm text-destructive">
              {state.errors.password[0]}
            </p>
          ) : null}
        </div>
        {state?.message ? (
          <p className="text-sm text-destructive">{state.message}</p>
        ) : null}
        <Button type="submit" className="w-full">
          Create account
        </Button>
        <div className="text-center text-sm">
          Already have an account?{" "}
          <a href="/login" className="underline underline-offset-4">
            Log in
          </a>
        </div>
      </div>
    </form>
  )
}
