"use client"

import * as React from "react"

import { Triangle } from "lucide-react"

type GroupConfig<TItem> = {
  // Group field accessor: returns the grouping key string
  getGroupKey: (item: TItem) => string
  // Order of groups to show; if omitted, will use insertion order from data
  groupOrder?: string[]
  // Optional labels for headers
  groupLabels?: Record<string, string>
}

type GroupedListProps<TItem> = {
  items: TItem[]
  // Render individual item
  renderItem: (item: TItem) => React.ReactNode
  // Optional key extractor
  getItemKey?: (item: TItem) => string
  // Optional section header renderer
  renderSectionHeader?: (
    groupKey: string,
    count: number,
    isOpen: boolean,
    toggle: () => void
  ) => React.ReactNode
  // Grouping configuration; when omitted, acts as a flat list
  group?: GroupConfig<TItem>
  className?: string
}

function defaultSectionHeader(
  groupKey: string,
  count: number,
  isOpen: boolean,
  toggle: () => void
) {
  return (
    <div className="relative page-padding-x h-9 flex items-center gap-1 bg-muted/40 border-b-1 not-first:border-t-1">
      <span
        className="group size-4 flex items-center justify-center"
        onClick={toggle}
      >
        <Triangle
          className={`h-[0.6rem] w-[0.35rem] ${
            isOpen ? "rotate-180" : "rotate-90"
          } fill-muted-foreground/60 text-muted-foreground/60 group-hover:fill-muted-foreground group-hover:text-muted-foreground transition-colors duration-150`}
        />
      </span>
      <span className="font-medium text-sm">{groupKey}</span>
      <span className="text-muted-foreground/80 text-2xs ml-2">{count}</span>
    </div>
  )
}

function GroupedList<TItem>({
  items,
  renderItem,
  getItemKey,
  renderSectionHeader = defaultSectionHeader,
  group,
  className,
}: GroupedListProps<TItem>) {
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>(
    {}
  )

  if (!group) {
    return (
      <div className={className}>
        {items.map((item, idx) => (
          <React.Fragment key={getItemKey?.(item) ?? `${idx}`}>
            {renderItem(item)}
          </React.Fragment>
        ))}
      </div>
    )
  }

  // Build buckets
  const buckets = new Map<string, TItem[]>()
  for (const item of items) {
    const key = group.getGroupKey(item)
    const label = group.groupLabels?.[key] ?? key
    const bucketKey = label
    const arr = buckets.get(bucketKey)
    if (arr) arr.push(item)
    else buckets.set(bucketKey, [item])
  }

  // Determine order
  const order = group.groupOrder?.length
    ? group.groupOrder.map((k) => group.groupLabels?.[k] ?? k)
    : Array.from(buckets.keys())

  return (
    <div className={className}>
      {order.map((k) => {
        const bucket = buckets.get(k) ?? []

        if (bucket.length === 0) return null

        const isOpen = openGroups[k] !== false
        const toggle = () =>
          setOpenGroups((prev) => ({ ...prev, [k]: !isOpen }))

        return (
          <div key={k} className="flex flex-col">
            {renderSectionHeader(k, bucket.length, isOpen, toggle)}
            {isOpen && (
              <div className="flex flex-col">
                {bucket.map((item, idx) => (
                  <React.Fragment key={getItemKey?.(item) ?? `${k}-${idx}`}>
                    {renderItem(item)}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export { GroupedList }
