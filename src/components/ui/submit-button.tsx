"use client"

import type { ComponentProps, ReactNode } from "react"
import { useFormStatus } from "react-dom"

import { Button } from "@/components/ui/button"

type ButtonProps = ComponentProps<typeof Button>

interface SubmitButtonProps extends ButtonProps {
  children: ReactNode
  loadingText?: string
}

export function SubmitButton({
  children,
  loadingText,
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <Button disabled={pending} aria-disabled={pending} {...props}>
      {pending ? (
        <>
          <svg
            viewBox="0 0 24 24"
            className="size-4 animate-spin"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          <span>{loadingText || "Loading..."}</span>
        </>
      ) : (
        children
      )}
    </Button>
  )
}
