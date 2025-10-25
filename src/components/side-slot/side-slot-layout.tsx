"use client"

import { AnimatePresence, motion } from "framer-motion"
import type { ReactElement, ReactNode } from "react"

import { useSideSlot } from "./side-slot-context"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

export function SideSlotLayout({
  children,
}: {
  children: ReactNode
}): ReactElement {
  const { config, openMobile, setOpenMobile } = useSideSlot()
  const isMobile = useIsMobile()

  if (!config?.content) {
    return <>{children}</>
  }

  if (isMobile) {
    return (
      <div className={cn("flex-1 min-h-0 flex flex-col h-full")}>
        <section className={cn("flex h-full", config.containerClassName)}>
          <div
            className={cn(
              "flex flex-col min-w-0 flex-grow h-full",
              config.mainClassName
            )}
          >
            {children}
          </div>
        </section>
        <AnimatePresence>
          {openMobile && (
            <>
              <motion.div
                data-slot="side-slot-overlay"
                className="fixed inset-0 z-40 bg-black/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "linear" }}
                onClick={() => setOpenMobile(false)}
              />
              <motion.aside
                data-slot="side-slot"
                className={cn(
                  "fixed inset-y-0 right-0 z-50 h-full w-[17rem] p-2 bg-background border-l-[0.5px]",
                  config.asideClassName
                )}
                role="dialog"
                aria-modal="true"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{
                  type: "tween",
                  duration: 0.25,
                  ease: "easeInOut",
                }}
              >
                <div className="flex h-full w-full flex-col">
                  {config.content}
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div className={cn("flex-1 min-h-0 flex flex-col h-full")}>
      <section className={cn("flex h-full w-full", config.containerClassName)}>
        <div
          className={cn(
            "flex flex-col min-w-0 flex-grow-2 basis-[80ch] h-full",
            config.mainClassName
          )}
        >
          {children}
        </div>
        <aside
          className={cn(
            "flex flex-col border-l-[0.5px] max-w-[270px] min-w-[220px] w-[30%] flex-grow-1 h-full",
            config.asideClassName
          )}
        >
          {config.content}
        </aside>
      </section>
    </div>
  )
}

export default SideSlotLayout
