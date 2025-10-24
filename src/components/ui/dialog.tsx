"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { motion, AnimatePresence } from "framer-motion"
import { XIcon } from "lucide-react"

import { dialogVariants, animationVariants } from "@/lib/motion-config"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/components/ui/sidebar"

const DialogContext = React.createContext<{
  open: boolean
  onOpenChange: (open: boolean) => void
}>({
  open: false,
  onOpenChange: () => {},
})

function Dialog({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  const [internalOpen, setInternalOpen] = React.useState(false)

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const onOpenChange = controlledOnOpenChange || setInternalOpen

  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      <DialogPrimitive.Root
        data-slot="dialog"
        open={open}
        onOpenChange={onOpenChange}
        {...props}
      />
    </DialogContext.Provider>
  )
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  const { open } = React.useContext(DialogContext)

  return (
    <AnimatePresence>
      {open && (
        <DialogPrimitive.Overlay
          data-slot="dialog-overlay"
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
        </DialogPrimitive.Overlay>
      )}
    </AnimatePresence>
  )
}

function DialogContent({
  className,
  children,
  closeButtonClassName,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  closeButtonClassName?: string
  showCloseButton?: boolean
}) {
  const { open } = React.useContext(DialogContext)
  const { state: sidebarState, isMobile } = useSidebar()

  return (
    <AnimatePresence>
      {open && (
        <DialogPrimitive.Portal forceMount>
          <DialogOverlay />
          <DialogPrimitive.Content
            data-slot="dialog-content"
            forceMount
            asChild
            className={cn(
              "bg-background fixed top-[30%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-30%] rounded-md border shadow-xs sm:max-w-lg",
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
              {showCloseButton && (
                <DialogPrimitive.Close
                  data-slot="dialog-close"
                  className={cn(
                    "absolute top-1.5 right-1.5 p-1 rounded-sm bg-transparent hover:bg-accent focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                    closeButtonClassName
                  )}
                >
                  <XIcon />
                  <span className="sr-only">Close</span>
                </DialogPrimitive.Close>
              )}
            </motion.div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      )}
    </AnimatePresence>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex gap-2 px-3 pt-3 pb-1.5", className)}
      {...props}
    />
  )
}

function DialogBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-body"
      className={cn("flex flex-col px-3", className)}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex items-center justify-end gap-2 p-3 border-t",
        className
      )}
      {...props}
    />
  )
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-sm leading-none font-semibold", className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  DialogBody,
}
