import type { ReactElement } from "react"
import { SignupForm } from "@/components/signup-form"
import { AuthContainer } from "@/components/auth-container"

export default function SignupPage(): ReactElement {
  return (
    <AuthContainer>
      <SignupForm />
    </AuthContainer>
  )
}
