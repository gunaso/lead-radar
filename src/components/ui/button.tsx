import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "@radix-ui/react-slot"
import * as React from "react"

import { PlusIcon } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-150 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:cursor-default",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 shadow-[oklch(0_0_0_/_0.02)_0px_3px_6px_-2px,_lch(0_0_0_/_0.044)_0px_1px_1px]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-7 px-3.5 has-[>svg]:px-2.5",
        onboarding: "h-9 px-4 py-2 has-[>svg]:px-3",
        loginSm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        sm: "h-6 rounded-sm gap-1.5 pl-1.5 pr-2 text-xs",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-7",
        iconSm: "size-6 rounded-sm",
        goBack: "size-6 p-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

const NewButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button> & { name: string }
>(({ name, ...props }, ref) => {
  return (
    <Button ref={ref} variant="outline" size="sm" {...props}>
      <PlusIcon className="size-4" />
      New {name}
    </Button>
  )
})
NewButton.displayName = "NewButton"

export { Button, NewButton, buttonVariants }
