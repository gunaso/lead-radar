"use client"

import { MotionConfig } from "framer-motion"
import type { ReactNode } from "react"

import { defaultTransition } from "@/lib/motion-config"

interface MotionConfigProviderProps {
  children: ReactNode
}

/**
 * Global motion configuration provider
 * Sets default transition values for all motion components
 */
export function MotionConfigProvider({ children }: MotionConfigProviderProps) {
  return <MotionConfig transition={defaultTransition}>{children}</MotionConfig>
}
