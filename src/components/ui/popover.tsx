"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { motion, AnimatePresence } from "framer-motion"

import { popoverVariants } from "@/lib/motion-config"
import { cn } from "@/lib/utils"

const PopoverContext = React.createContext<{
  open: boolean
  onOpenChange: (open: boolean) => void
}>({
  open: false,
  onOpenChange: () => {},
})

function Popover({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  const [internalOpen, setInternalOpen] = React.useState(false)

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const onOpenChange = controlledOnOpenChange || setInternalOpen

  return (
    <PopoverContext.Provider value={{ open, onOpenChange }}>
      <PopoverPrimitive.Root
        data-slot="popover"
        open={open}
        onOpenChange={onOpenChange}
        {...props}
      />
    </PopoverContext.Provider>
  )
}

function PopoverTrigger({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  style,
  children,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  const { open } = React.useContext(PopoverContext)

  return (
    <AnimatePresence>
      {open && (
        <PopoverPrimitive.Portal forceMount>
          <PopoverPrimitive.Content
            data-slot="popover-content"
            align={align}
            sideOffset={sideOffset}
            forceMount
            asChild
            style={style}
            className={cn(
              "bg-popover text-popover-foreground z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border p-2 shadow-xs outline-hidden",
              className
            )}
            {...props}
          >
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={popoverVariants}
              style={{
                transformOrigin:
                  "var(--radix-popover-content-transform-origin)",
              }}
            >
              {children}
            </motion.div>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      )}
    </AnimatePresence>
  )
}

function PopoverAnchor({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor }
