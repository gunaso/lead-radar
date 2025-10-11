"use client"
import { useEffect, useRef, useState, createContext, useContext } from "react"
import { motion, AnimatePresence, LayoutGroup } from "framer-motion"
import { usePathname, useRouter } from "next/navigation"
import type { ReactNode } from "react"
import Link from "next/link"

import { Card, CardContent } from "@/components/ui/card"

import {
  slideNavigationVariants,
  slideNavigationVariantsNoFade,
} from "@/lib/motion-config"
import { cn } from "@/lib/utils"

import PromptedLogo from "@/assets/img/logo-name.webp"
import { QuoteIcon } from "@/assets/Icons"

type AuthContainerProps = {
  children: ReactNode
  className?: string
}

type AuthNavigationContextType = {
  navigateWithAnimation: (path: string) => void
  isNavigating: boolean
}

const AuthNavigationContext = createContext<AuthNavigationContextType | null>(
  null
)

export function useAuthNavigation() {
  const context = useContext(AuthNavigationContext)
  if (!context) {
    throw new Error("useAuthNavigation must be used within AuthContainer")
  }
  return context
}

// Auth pages that share the same container
const AUTH_PAGES = [
  "/login",
  "/login-email",
  "/signup",
  "/forgot-password",
  "/reset-password",
]

export function AuthContainer({ children, className }: AuthContainerProps) {
  const pathname = usePathname()
  const router = useRouter()
  const previousPathRef = useRef<string | null>(null)
  const isInitialMount = useRef(true)
  const [isNavigating, setIsNavigating] = useState(false)
  const [pendingPath, setPendingPath] = useState<string | null>(null)

  // Determine if we should show initial animation
  const shouldAnimateContainer =
    isInitialMount.current &&
    !AUTH_PAGES.includes(previousPathRef.current || "")

  useEffect(() => {
    // After first render, mark as not initial mount
    isInitialMount.current = false
    // Store current path for next navigation
    return () => {
      previousPathRef.current = pathname
    }
  }, [pathname])

  // Handle navigation after exit animation completes
  useEffect(() => {
    if (isNavigating && pendingPath && pendingPath !== pathname) {
      const timer = setTimeout(() => {
        router.push(pendingPath)
        setIsNavigating(false)
        setPendingPath(null)
      }, 210) // Match animation duration

      return () => clearTimeout(timer)
    }
  }, [isNavigating, pendingPath, pathname, router])

  const navigateWithAnimation = (path: string) => {
    if (path !== pathname) {
      setPendingPath(path)
      setIsNavigating(true)
    }
  }

  return (
    <AuthNavigationContext.Provider
      value={{ navigateWithAnimation, isNavigating }}
    >
      <LayoutGroup>
        <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10 background-gradient">
          <div className="w-full max-w-sm md:max-w-3xl">
            <div className={cn("flex flex-col gap-2", className)}>
              <motion.div
                layoutId="auth-card"
                initial={shouldAnimateContainer ? { opacity: 0, y: 20 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  layout: { duration: 0.2, ease: "easeOut" },
                  opacity: { duration: 0.2 },
                  y: { duration: 0.2 },
                }}
              >
                <Card className="overflow-hidden p-0 flex flex-col min-h-[50dvh] shadow-xl">
                  <CardContent className="grid p-0 md:grid-cols-2 flex-1">
                    <div className="relative flex flex-col min-h-full overflow-hidden">
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                          key={pathname}
                          initial={
                            shouldAnimateContainer
                              ? slideNavigationVariants.enterFromRight
                              : slideNavigationVariantsNoFade.enterFromRight
                          }
                          animate={slideNavigationVariantsNoFade.center}
                          exit={slideNavigationVariantsNoFade.exitToLeft}
                          className="absolute inset-0 w-full"
                        >
                          {children}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                    <div className="flex-col items-center justify-center gap-4 bg-muted relative hidden md:flex">
                      <img
                        src={PromptedLogo.src}
                        alt="Prompted Logo"
                        className="size-[50%]"
                      />
                      <span className="relative text-center text-md font-semibold text-primary opacity-40">
                        <QuoteIcon
                          size={26}
                          className="absolute left-[-32px] top-[-12px] opacity-30"
                        />
                        Where Leads meet intelligence.
                        <QuoteIcon
                          size={26}
                          className="absolute right-[-32px] bottom-[-8px] opacity-30 rotate-180"
                        />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div
                initial={shouldAnimateContainer ? { opacity: 0, y: 10 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.2,
                  delay: shouldAnimateContainer ? 0.1 : 0,
                }}
                className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4 *:[a]:transition-all"
              >
                By signing in, you agree to our{" "}
                <Link href="#">Terms of Service</Link> &{" "}
                <Link href="#">Privacy Policy</Link>.
              </motion.div>
            </div>
          </div>
        </div>
      </LayoutGroup>
    </AuthNavigationContext.Provider>
  )
}
