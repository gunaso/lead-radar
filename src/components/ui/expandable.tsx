"use client"

import React from "react"

import { ChevronsUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

type ExpandableProps = {
  children: React.ReactNode
  collapsedHeight?: number
  className?: string
  showHint?: boolean
  bgTo?: "background" | "card"
  bigDiv?: boolean
}

function Expandable({
  children,
  collapsedHeight = 350,
  className,
  showHint = true,
  bgTo = "background",
  bigDiv = false,
}: ExpandableProps) {
  const [isOverflowing, setIsOverflowing] = React.useState<boolean>(false)
  const [measuredHeight, setMeasuredHeight] = React.useState<number>(0)
  const [isExpanded, setIsExpanded] = React.useState<boolean>(false)
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const isMobile = useIsMobile()

  React.useEffect(() => {
    const element = containerRef.current
    if (!element) return

    const updateMeasurements = () => {
      const scrollHeight = element.scrollHeight
      setMeasuredHeight(scrollHeight)
      setIsOverflowing(scrollHeight > collapsedHeight)
    }

    updateMeasurements()

    const resizeObserver = new ResizeObserver(() => {
      updateMeasurements()
    })
    resizeObserver.observe(element)

    return () => {
      resizeObserver.disconnect()
    }
  }, [collapsedHeight])

  const shouldCollapse = isOverflowing && !isExpanded
  const maxHeight = shouldCollapse
    ? collapsedHeight
    : measuredHeight || collapsedHeight

  return (
    <div className={cn("relative group", className)}>
      <div
        ref={containerRef}
        aria-expanded={!shouldCollapse}
        className={cn(
          "overflow-hidden transition-[max-height] duration-200 ease-in-out"
        )}
        style={{ maxHeight }}
      >
        {children}
      </div>

      {isOverflowing && (
        <>
          <div
            className={cn(
              "absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent transition-opacity duration-200",
              !shouldCollapse && "opacity-0",
              bgTo === "background" ? "to-background" : "to-card",
              isMobile && shouldCollapse
                ? "pointer-events-auto cursor-pointer"
                : "pointer-events-none"
            )}
            role={isMobile && shouldCollapse ? "button" : undefined}
            tabIndex={isMobile && shouldCollapse ? 0 : undefined}
            aria-label={
              isMobile && shouldCollapse ? "Expand content" : undefined
            }
            onClick={
              isMobile && shouldCollapse ? () => setIsExpanded(true) : undefined
            }
            onKeyDown={
              isMobile && shouldCollapse
                ? (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      setIsExpanded(true)
                    }
                  }
                : undefined
            }
          />
          {showHint && !isExpanded && (
            <div
              className={cn(
                "absolute w-full flex justify-center transition-opacity duration-200",
                isMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100",
                bigDiv ? "bottom-4" : "bottom-0"
              )}
            >
              <Button
                size="sm"
                variant="outline"
                className="gap-1!"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setIsExpanded(true)
                }}
              >
                <ChevronsUpDown className="size-3.5" />
                Expand
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export { Expandable }
