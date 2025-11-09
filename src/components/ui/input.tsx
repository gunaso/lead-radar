import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

type InputProps = Omit<React.ComponentProps<"input">, "size"> &
  VariantProps<typeof inputVariants>

const inputVariants = cva(
  "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 w-full min-w-0 border border-input/70 hover:border-input bg-transparent transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50  aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-colors duration-150",
  {
    variants: {
      variant: {
        default: "rounded-sm focus-visible:border-primary",
        onboarding:
          "rounded-md text-base md:text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        creating:
          "bg-transparent border-none text-base font-semibold text-foreground placeholder:text-muted-foreground/70",
      },
      size: {
        default: "h-8 px-3 py-1.5",
        onboarding: "h-9 px-3 py-1",
        creating: "h-7 px-0.5 py-1.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, size, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        data-slot="input"
        className={cn(inputVariants({ variant, size, className }))}
        {...props}
      />
    )
  }
)

Input.displayName = "Input"

export { Input, type InputProps }
