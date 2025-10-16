"use client"

import * as React from "react"

import {
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  ArrowUpDown,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  Command,
} from "@/components/ui/command"
import {
  PopoverContent,
  PopoverTrigger,
  Popover,
} from "@/components/ui/popover"

export type SortField = "score" | "sentiment" | "date"
export type SortDirection = "asc" | "desc"
export type SortValue = { field: SortField; direction: SortDirection }

export type SortProps = {
  value?: SortValue
  onChange?: (next: SortValue) => void
  defaultField?: SortField
}

function getNextSortState(
  current: SortValue,
  selectedField: SortField,
  defaultField: SortField
): SortValue {
  if (selectedField !== current.field) {
    return { field: selectedField, direction: "desc" }
  }
  if (current.direction === "desc") {
    return { field: current.field, direction: "asc" }
  }
  if (current.field !== defaultField) {
    return { field: defaultField, direction: "desc" }
  }
  return { field: defaultField, direction: "desc" }
}

const SORT_OPTIONS: { value: SortField; label: string }[] = [
  { value: "score", label: "Score" },
  { value: "sentiment", label: "Sentiment" },
  { value: "date", label: "Date" },
]

/**
 * Sort popover component.
 *
 * Usage:
 * const [sort, setSort] = React.useState<SortValue>({ field: 'score', direction: 'desc' })
 * <Sort value={sort} onChange={setSort} />
 */
function Sort({ value, onChange, defaultField = "score" }: SortProps) {
  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = React.useState<SortValue>({
    field: defaultField,
    direction: "desc",
  })
  const current = isControlled ? (value as SortValue) : internalValue

  const [open, setOpen] = React.useState(false)

  const handleChange = (next: SortValue) => {
    onChange?.(next)
    if (!isControlled) setInternalValue(next)
  }

  const DirectionIcon =
    current.direction === "asc" ? ArrowUpNarrowWide : ArrowDownWideNarrow

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button size="sm" variant="outline" className="bg-muted">
          <span className="inline-flex items-center gap-1 min-w-0">
            <span className="truncate capitalize">{current.field}</span>
            {current ? (
              <DirectionIcon className="size-3.5 shrink-0" />
            ) : (
              <ArrowUpDown className="size-3.5 shrink-0" />
            )}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-34 p-0" align="end">
        <Command>
          <CommandList className="max-h-30 overflow-y-auto">
            <CommandEmpty>No sort options found.</CommandEmpty>
            <CommandGroup>
              {SORT_OPTIONS.map((option) => {
                const isActive = current.field === option.value
                return (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => {
                      const next = getNextSortState(
                        current,
                        option.value,
                        defaultField
                      )
                      handleChange(next)
                      setOpen(false)
                    }}
                    className="h-7 gap-1.5 truncate text-sm"
                  >
                    <span className="flex items-center gap-1">
                      {isActive ? (
                        current.direction === "asc" ? (
                          <ArrowUpNarrowWide className="size-3.5 shrink-0 text-foreground" />
                        ) : (
                          <ArrowDownWideNarrow className="size-3.5 shrink-0 text-foreground" />
                        )
                      ) : (
                        <ArrowUpDown className="size-3.5 shrink-0 text-muted-foreground/50" />
                      )}
                      {option.label}
                    </span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export { Sort }
