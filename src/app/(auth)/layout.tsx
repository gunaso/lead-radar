import type { ReactNode } from "react"

import { AuthContainer } from "@/components/auth/auth-container"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <AuthContainer>{children}</AuthContainer>
}
