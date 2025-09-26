"use client"
import * as React from "react"
import { addDays, format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import * as Popover from "@radix-ui/react-popover"
import type { DateRange } from "react-day-picker"
import { CalendarIcon, X } from "lucide-react"

export type DateRangePickerProps = {
  value?: DateRange
  onChange?: (range: DateRange | undefined) => void
  className?: string
}

export function DateRangePicker({
  value,
  onChange,
  className,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false)

  const label = React.useMemo(() => {
    if (!value?.from && !value?.to) return "Pick a date range"
    const from = value?.from
    const to = value?.to
    if (from && !to) return `${format(from, "LLL dd, y")} — ...`
    if (from && to) {
      const sameMonth =
        from.getMonth() === to.getMonth() &&
        from.getFullYear() === to.getFullYear()
      if (sameMonth) return `${format(from, "LLL dd")}–${format(to, "dd, y")}`
      return `${format(from, "LLL dd, y")} — ${format(to, "LLL dd, y")}`
    }
    return "Pick a date range"
  }, [value])

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "w-full justify-between text-left font-normal pr-2 hover:cursor-pointer",
            className
          )}
        >
          <span className="inline-flex items-center min-w-0">
            <CalendarIcon className="mr-2 size-4 shrink-0" />
            <span className="truncate">{label}</span>
          </span>
          {value?.from && value?.to ? (
            <span
              role="button"
              aria-label="Clear date range"
              className="ml-2 inline-flex items-center rounded hover:bg-accent px-1"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onChange?.(undefined)
              }}
            >
              <X className="size-3.5 text-muted-foreground" />
            </span>
          ) : null}
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          sideOffset={8}
          className="z-50 rounded-md border bg-popover p-2 shadow-md"
        >
          <Calendar
            mode="range"
            numberOfMonths={1}
            showOutsideDays
            defaultMonth={value?.from ?? new Date()}
            selected={value}
            onSelect={(r) => {
              onChange?.(r)
              if (r?.from && r?.to && r.to.getTime() !== r.from.getTime()) {
                setOpen(false)
              }
            }}
          />
          <div className="flex items-center justify-between px-2 pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onChange?.(undefined)}
            >
              Clear
            </Button>
            <div className="text-xs text-muted-foreground">
              {value?.from && value?.to
                ? `${format(value.from, "LLL dd, y")} — ${format(
                    value.to,
                    "LLL dd, y"
                  )}`
                : "No range selected"}
            </div>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

export default DateRangePicker
