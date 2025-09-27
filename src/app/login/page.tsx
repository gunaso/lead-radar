import type { ReactElement } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { LoginForm } from "@/components/login-form"
import { AuthContainer } from "@/components/auth-container"

export default function LoginPage(): ReactElement {
  return (
    <AuthContainer>
      <LoginForm />
    </AuthContainer>
  )
}
