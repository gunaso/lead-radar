"use client"

import {
  type ReactElement,
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

import { useIsMobile } from "@/hooks/use-mobile"

export type SideSlotConfig = {
  content?: ReactNode
  containerClassName?: string
  mainClassName?: string
  asideClassName?: string
}

type SideSlotContextValue = {
  config: SideSlotConfig
  setConfig: (config: SideSlotConfig) => void
  reset: () => void
  openMobile: boolean
  setOpenMobile: (open: boolean | ((prev: boolean) => boolean)) => void
}

const SideSlotContext = createContext<SideSlotContextValue | undefined>(
  undefined
)

export function SideSlotProvider({
  children,
}: {
  children: ReactNode
}): ReactElement {
  const [config, setConfigState] = useState<SideSlotConfig>({})
  const [openMobile, setOpenMobile] = useState(false)
  const isMobile = useIsMobile()

  const setConfig = useCallback((next: SideSlotConfig) => {
    setConfigState(next)
  }, [])

  const reset = useCallback(() => {
    setConfigState({})
  }, [])

  useEffect(() => {
    if (!isMobile && openMobile) {
      setOpenMobile(false)
    }
  }, [isMobile, openMobile])

  const value = useMemo<SideSlotContextValue>(
    () => ({ config, setConfig, reset, openMobile, setOpenMobile }),
    [config, setConfig, reset, openMobile]
  )

  return (
    <SideSlotContext.Provider value={value}>
      {children}
    </SideSlotContext.Provider>
  )
}

export function useSideSlot(): SideSlotContextValue {
  const ctx = useContext(SideSlotContext)
  if (!ctx) {
    throw new Error("useSideSlot must be used within a SideSlotProvider")
  }
  return ctx
}

export function SideSlotConfig({
  config,
  children,
}: {
  config: SideSlotConfig
  children?: ReactNode
}): ReactElement {
  const { setConfig, reset } = useSideSlot()

  useEffect(() => {
    setConfig(config)
    return () => {
      reset()
    }
  }, [
    setConfig,
    reset,
    config.containerClassName,
    config.mainClassName,
    config.asideClassName,
    !!config.content,
  ])

  return <>{children}</>
}
