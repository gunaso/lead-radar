"use client"
import * as React from "react"
import { addDays, format } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { popoverVariants } from "@/lib/motion-config"
import * as Popover from "@radix-ui/react-popover"
import type { DateRange } from "react-day-picker"
import { CalendarIcon, X } from "lucide-react"

export type DateRangePickerProps = {
  value?: DateRange
  onChange?: (range: DateRange | undefined) => void
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false)

  const label = React.useMemo(() => {
    if (!value?.from && !value?.to) return "Date"
    const from = value?.from
    const to = value?.to
    if (from && !to) return `${format(from, "LLL dd, yy")} — ...`
    if (from && to) {
      const sameMonth =
        from.getMonth() === to.getMonth() &&
        from.getFullYear() === to.getFullYear()
      if (sameMonth) return `${format(from, "LLL dd")}–${format(to, "dd, yy")}`
      return `${format(from, "LLL dd, yy")} — ${format(to, "LLL dd, yy")}`
    }
    return "Date"
  }, [value])

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="bg-muted active:scale-100!"
        >
          <span className="inline-flex items-center min-w-0 gap-1">
            <span className="truncate">{label}</span>
            {value?.from && value?.to ? (
              <span
                role="button"
                aria-label="Clear date range"
                className="flex items-center justify-center size-4 rounded hover:bg-primary"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onChange?.(undefined)
                }}
              >
                <X className="size-3.5 shrink-0" strokeWidth={1.5} />
              </span>
            ) : (
              <span className="flex items-center justify-center size-4">
                <CalendarIcon className="size-3.5 shrink-0" strokeWidth={1.5} />
              </span>
            )}
          </span>
        </Button>
      </Popover.Trigger>
      <AnimatePresence>
        {open && (
          <Popover.Portal forceMount>
            <Popover.Content
              sideOffset={4}
              className="z-50 origin-(--radix-popover-content-transform-origin) rounded-sm border bg-popover p-1 shadow-md"
              align="start"
              forceMount
              asChild
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
                <Calendar
                  mode="range"
                  numberOfMonths={1}
                  // showOutsideDays
                  defaultMonth={value?.from ?? new Date()}
                  selected={value}
                  onSelect={(r) => {
                    onChange?.(r)
                    if (
                      r?.from &&
                      r?.to &&
                      r.to.getTime() !== r.from.getTime()
                    ) {
                      setOpen(false)
                    }
                  }}
                />
                <div className="flex items-center justify-between px-1.5 py-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onChange?.(undefined)}
                  >
                    Clear
                  </Button>
                  <div className="text-xs text-muted-foreground">
                    {value?.from && value?.to
                      ? `${format(value.from, "LLL dd, yy")} — ${format(
                          value.to,
                          "LLL dd, yy"
                        )}`
                      : "No range selected"}
                  </div>
                </div>
              </motion.div>
            </Popover.Content>
          </Popover.Portal>
        )}
      </AnimatePresence>
    </Popover.Root>
  )
}

export default DateRangePicker
