"use client"

import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"
import type { VariantProps } from "class-variance-authority"
import { motion, AnimatePresence } from "framer-motion"
import * as React from "react"

import { buttonVariants } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"

import { dialogVariants, animationVariants } from "@/lib/motion-config"
import { cn } from "@/lib/utils"

const AlertDialogContext = React.createContext<{
  open: boolean
  onOpenChange: (open: boolean) => void
}>({
  open: false,
  onOpenChange: () => {},
})

function AlertDialog({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Root>) {
  const [internalOpen, setInternalOpen] = React.useState(false)

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const onOpenChange = controlledOnOpenChange || setInternalOpen

  return (
    <AlertDialogContext.Provider value={{ open, onOpenChange }}>
      <AlertDialogPrimitive.Root
        data-slot="alert-dialog"
        open={open}
        onOpenChange={onOpenChange}
        {...props}
      />
    </AlertDialogContext.Provider>
  )
}

function AlertDialogTrigger({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
  return (
    <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
  )
}

function AlertDialogPortal({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Portal>) {
  return (
    <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
  )
}

function AlertDialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>) {
  const { open } = React.useContext(AlertDialogContext)

  return (
    <AnimatePresence>
      {open && (
        <AlertDialogPrimitive.Overlay
          data-slot="alert-dialog-overlay"
          forceMount
          asChild
          className={cn("fixed inset-0 z-50 bg-black/50", className)}
          {...props}
        >
          <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={animationVariants.fade}
          />
        </AlertDialogPrimitive.Overlay>
      )}
    </AnimatePresence>
  )
}

function AlertDialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content>) {
  const { open } = React.useContext(AlertDialogContext)
  const { state: sidebarState, isMobile } = useSidebar()

  return (
    <AnimatePresence>
      {open && (
        <AlertDialogPrimitive.Portal forceMount>
          <AlertDialogOverlay />
          <AlertDialogPrimitive.Content
            data-slot="alert-dialog-content"
            forceMount
            asChild
            className={cn(
              "bg-card fixed top-[30%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-30%] outline-none rounded-md border sm:max-w-lg",
              !isMobile &&
                sidebarState === "expanded" &&
                "md:left-[calc(50%+var(--sidebar-width-2)/2)]",
              className
            )}
            {...props}
          >
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={dialogVariants}
            >
              {children}
            </motion.div>
          </AlertDialogPrimitive.Content>
        </AlertDialogPrimitive.Portal>
      )}
    </AnimatePresence>
  )
}

function AlertDialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn(
        "flex gap-0.5 text-left pl-8 pr-16 py-4 border-b",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-body"
      className={cn("flex flex-col gap-2 py-6 px-8", className)}
      {...props}
    />
  )
}

function AlertDialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end px-8 pb-6",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn("text-base font-semibold", className)}
      {...props}
    />
  )
}

function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function AlertDialogAction({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action> &
  VariantProps<typeof buttonVariants>) {
  return (
    <AlertDialogPrimitive.Action
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}

function AlertDialogCancel({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel> &
  VariantProps<typeof buttonVariants>) {
  const finalVariant = variant ?? "outline"
  return (
    <AlertDialogPrimitive.Cancel
      className={cn(buttonVariants({ variant: finalVariant, size }), className)}
      {...props}
    />
  )
}

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogBody,
}
