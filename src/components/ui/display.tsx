"use client"

import * as React from "react"

import {
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  SlidersHorizontal,
  ArrowUpDown,
  ListTree,
  Package,
  Rows3,
} from "lucide-react"

import type { SortField, SortValue } from "@/components/ui/sort"
import { DisplaySelect } from "@/components/ui/display-select"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  PopoverContent,
  PopoverTrigger,
  Popover,
} from "@/components/ui/popover"

import type { GroupField } from "@/hooks/use-filters"
import { Switch } from "@/components/ui/switch"

type ArchiveField = "all" | "past day" | "past week" | "past month" | "none"

export type DisplayProps = {
  sortValue?: SortValue
  onSortChange?: (next: SortValue) => void
  groupValue: GroupField
  onGroupChange: (next: GroupField) => void
  defaultSortField?: SortField
  expandDetails: boolean
  onExpandDetailsChange: (next: boolean) => void
  archiveValue: ArchiveField
  onArchiveChange: (next: ArchiveField) => void
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

const GROUP_OPTIONS: { value: GroupField; label: string }[] = [
  { value: "none", label: "No grouping" },
  { value: "score", label: "Score" },
  { value: "sentiment", label: "Sentiment" },
  { value: "status", label: "Status" },
]

const SORT_OPTIONS: { value: SortField; label: string }[] = [
  { value: "score", label: "Score" },
  { value: "sentiment", label: "Sentiment" },
  { value: "date", label: "Created" },
]

const ARCHIVE_OPTIONS: { value: ArchiveField; label: string }[] = [
  { value: "all", label: "All" },
  { value: "past day", label: "Past day" },
  { value: "past week", label: "Past week" },
  { value: "past month", label: "Past month" },
  { value: "none", label: "None" },
]

function Display({
  sortValue,
  onSortChange,
  groupValue,
  onGroupChange,
  defaultSortField = "score",
  expandDetails,
  onExpandDetailsChange,
  archiveValue,
  onArchiveChange,
}: DisplayProps) {
  const isSortControlled = sortValue !== undefined
  const [sortInternal, setSortInternal] = React.useState<SortValue>({
    field: defaultSortField,
    direction: "desc",
  })
  const currentSort = isSortControlled ? (sortValue as SortValue) : sortInternal

  const [open, setOpen] = React.useState(false)

  const handleSortChange = (next: SortValue) => {
    onSortChange?.(next)
    if (!isSortControlled) setSortInternal(next)
  }

  const DirectionIcon =
    currentSort.direction === "asc" ? ArrowUpNarrowWide : ArrowDownWideNarrow

  // Trigger shows a simple "Display" label like the reference design

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button size="sm" variant="outline" className="bg-muted">
          <span className="inline-flex items-center gap-1 min-w-0">
            <SlidersHorizontal className="size-3.5 shrink-0" />
            <span className="truncate">Display</span>
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-65 p-0" align="end">
        <div className="p-2">
          {/* Controls */}
          <div className="grid grid-cols-[auto_1fr] items-center gap-x-8 gap-y-3 w-full">
            <Label
              htmlFor="grouping"
              className="text-2xs text-muted-foreground gap-1 inline-flex items-center"
            >
              <Rows3 className="size-3.5 shrink-0" />
              Grouping
            </Label>
            <DisplaySelect
              id="grouping"
              value={groupValue}
              onValueChange={(val) => onGroupChange(val as GroupField)}
              options={GROUP_OPTIONS}
              placeholder="No grouping"
              align="end"
            />

            <Label
              htmlFor="ordering"
              className="text-2xs text-muted-foreground gap-1 inline-flex items-center"
            >
              <ArrowUpDown className="size-3.5 shrink-0" />
              Ordering
            </Label>
            <div className="flex items-center gap-0.5">
              <DisplaySelect
                id="ordering"
                value={currentSort.field}
                onValueChange={(val) => {
                  const preserve: SortValue = {
                    field: val as SortField,
                    direction: currentSort.direction,
                  }
                  handleSortChange(preserve)
                }}
                options={SORT_OPTIONS}
                align="end"
              />
              <Button
                size="icon"
                variant="outline"
                className="size-7 bg-transparent"
                onClick={() =>
                  handleSortChange({
                    field: currentSort.field,
                    direction: currentSort.direction === "asc" ? "desc" : "asc",
                  })
                }
              >
                <DirectionIcon className="size-4" />
              </Button>
            </div>

            <Label
              htmlFor="details"
              className="text-2xs text-muted-foreground gap-1 inline-flex items-center"
            >
              <ListTree className="size-3.5 shrink-0" />
              Details
            </Label>
            <span className="flex items-center justify-end">
              <Switch
                checked={expandDetails}
                onCheckedChange={(checked: boolean) =>
                  onExpandDetailsChange(Boolean(checked))
                }
              />
            </span>
          </div>
        </div>
        <Separator />
        <div className="p-2">
          <div className="grid grid-cols-[auto_1fr] items-center gap-x-8 gap-y-3 w-full">
            <Label
              htmlFor="archived"
              className="text-2xs text-muted-foreground gap-1 inline-flex items-center"
            >
              <Package className="size-3.5 shrink-0" />
              Archived
            </Label>
            <DisplaySelect
              id="archived"
              value={archiveValue}
              onValueChange={(val) => onArchiveChange(val as ArchiveField)}
              options={ARCHIVE_OPTIONS}
              placeholder="None"
              align="end"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export { Display }
