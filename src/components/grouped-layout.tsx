"use client"

import * as React from "react"

import { GroupedList } from "@/components/ui/grouped-list"
import type { SortValue } from "@/components/ui/sort"

import { useFiltersContext } from "@/hooks/use-filters"
import { ScoreType, SentimentType, StatusType } from "@/types/reddit"

export type GroupableItem = {
  id: string
  score: ScoreType
  sentiment: SentimentType
  status: StatusType
  postedAt: string | Date
}

const SCORE_ORDER = ["Prime", "High", "Medium", "Low"]
const SENTIMENT_ORDER = ["Positive", "Neutral", "Negative"]
const STATUS_ORDER = [
  "Engaged",
  "Engaging",
  "Ready to Engage",
  "Needs Review",
  "Archived",
]

function compareByOrder(valueA: string, valueB: string, order: string[]) {
  const indexA = order.indexOf(valueA)
  const indexB = order.indexOf(valueB)
  const a = indexA === -1 ? Number.MAX_SAFE_INTEGER : indexA
  const b = indexB === -1 ? Number.MAX_SAFE_INTEGER : indexB
  return a - b
}

function getItemDate(item: GroupableItem): Date {
  return item.postedAt instanceof Date ? item.postedAt : new Date(item.postedAt)
}

function sortItems<T extends GroupableItem>(
  items: T[],
  sort: SortValue | undefined
) {
  if (!sort) return items
  const sorted = [...items]
  if (sort.field === "date") {
    sorted.sort((a, b) => getItemDate(b).getTime() - getItemDate(a).getTime())
  } else if (sort.field === "score") {
    sorted.sort((a, b) => compareByOrder(a.score, b.score, SCORE_ORDER))
  } else if (sort.field === "sentiment") {
    sorted.sort((a, b) =>
      compareByOrder(a.sentiment, b.sentiment, SENTIMENT_ORDER)
    )
  }
  if (sort.direction === "asc") sorted.reverse()
  return sorted
}

type GroupedLayoutProps<T extends GroupableItem> = {
  items: T[]
  renderItem: (item: T) => React.ReactNode
  className?: string
}

function GroupedLayout<T extends GroupableItem>({
  items,
  renderItem,
  className,
}: GroupedLayoutProps<T>) {
  const { groupState, sortState } = useFiltersContext()
  const [group] = groupState
  const [sort] = sortState

  const sorted = React.useMemo(
    () => sortItems(items, sort),
    [items, sort]
  )

  if (group === "none") {
    return (
      <GroupedList
        className={className}
        items={sorted}
        getItemKey={(item) => item.id}
        renderItem={renderItem}
      />
    )
  }

  const groupConfig = {
    getGroupKey: (item: T) => {
      if (group === "score") return item.score
      if (group === "sentiment") return item.sentiment
      return item.status
    },
    groupOrder:
      group === "score"
        ? SCORE_ORDER
        : group === "sentiment"
        ? SENTIMENT_ORDER
        : STATUS_ORDER,
  }

  return (
    <GroupedList
      className={className}
      items={sorted}
      getItemKey={(item) => item.id}
      renderItem={renderItem}
      group={groupConfig}
    />
  )
}

export { GroupedLayout }
