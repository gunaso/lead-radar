import { ReactNode } from "react"

import { cn } from "@/lib/utils"

interface EmptyStateProps {
  name: string
  children?: ReactNode
  className?: string
}

export function EmptyState({ name, children, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex h-[450px] shrink-0 items-center justify-center",
        className
      )}
    >
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <h3 className="mt-4 text-lg font-semibold">No {name}s</h3>
        <p className="mb-4 mt-2 text-sm text-muted-foreground">
          You haven&apos;t added any {name} yet. Add one to get started.
        </p>
        {children}
      </div>
    </div>
  )
}
