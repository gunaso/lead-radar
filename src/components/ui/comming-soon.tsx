import React from "react"

import { cn } from "@/lib/utils"

function CommingSoon({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "text-3xs text-primary uppercase bg-primary/10 px-1.5 py-1 rounded-md",
        className
      )}
    >
      Coming soon
    </span>
  )
}

export { CommingSoon }
