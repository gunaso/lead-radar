"use client"

import type { ReactElement } from "react"
import { cn } from "@/lib/utils"

export default function LoadingDots({
  className,
  label = "Loading",
}: {
  className?: string
  label?: string
}): ReactElement {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)}>
      <span>{label}</span>
      <span className="relative inline-block w-4">
        <span className="absolute left-0 animate-[dot_1.2s_ease-in-out_infinite]">
          .
        </span>
        <span className="absolute left-1.5 animate-[dot_1.2s_ease-in-out_infinite_0.2]">
          .
        </span>
        <span className="absolute left-3 animate-[dot_1.2s_ease-in-out_infinite_0.4]">
          .
        </span>
      </span>
      <style jsx>{`
        @keyframes dot {
          0%,
          20% {
            opacity: 0;
          }
          30%,
          60% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
        .animate-[dot_1.2s_ease-in-out_infinite] {
          animation: dot 1.2s ease-in-out infinite;
        }
        .animate-[dot_1.2s_ease-in-out_infinite_0.2] {
          animation: dot 1.2s ease-in-out infinite;
          animation-delay: 0.2s;
        }
        .animate-[dot_1.2s_ease-in-out_infinite_0.4] {
          animation: dot 1.2s ease-in-out infinite;
          animation-delay: 0.4s;
        }
      `}</style>
    </span>
  )
}
