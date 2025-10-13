"use client"

import {
  type ReactElement,
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
  useMemo,
  useEffect,
} from "react"

export type HeaderAction = {
  key: string
  element: ReactElement
}

export type HeaderConfig = {
  title?: string
  titleActions?: HeaderAction[]
  actions?: HeaderAction[]
}

type HeaderContextValue = {
  config: HeaderConfig
  setConfig: (config: HeaderConfig) => void
  reset: () => void
}

const HeaderContext = createContext<HeaderContextValue | undefined>(undefined)

export function HeaderProvider({
  children,
}: {
  children: ReactNode
}): ReactElement {
  const [config, setConfigState] = useState<HeaderConfig>({})

  const setConfig = useCallback((next: HeaderConfig) => {
    setConfigState(next)
  }, [])

  const reset = useCallback(() => {
    setConfigState({})
  }, [])

  const value = useMemo<HeaderContextValue>(
    () => ({ config, setConfig, reset }),
    [config, setConfig, reset]
  )

  return (
    <HeaderContext.Provider value={value}>{children}</HeaderContext.Provider>
  )
}

export function useHeaderConfig(): HeaderContextValue {
  const ctx = useContext(HeaderContext)
  if (!ctx) {
    throw new Error("useHeaderConfig must be used within a HeaderProvider")
  }
  return ctx
}

export function HeaderConfig({
  config,
  children,
}: {
  config: HeaderConfig
  children?: ReactNode
}): ReactElement {
  const { setConfig, reset } = useHeaderConfig()
  // Apply on mount and cleanup on unmount
  // We intentionally avoid deps on config children; callers should re-render this component to update
  // config as needed.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setConfig(config)
    return () => {
      reset()
    }
  }, [
    setConfig,
    reset,
    config.title,
    JSON.stringify(config.titleActions?.map((a) => a.key)),
    JSON.stringify(config.actions?.map((a) => a.key)),
  ])

  return <>{children}</>
}
