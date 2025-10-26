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
  const { groupState, sortState, archiveState } = useFiltersContext()
  const [group] = groupState
  const [sort] = sortState
  const [archive] = archiveState

  const now = React.useMemo(() => new Date(), [])

  const filtered = React.useMemo(() => {
    if (!archive || archive === "all") return items

    const withinWindow = (date: Date): boolean => {
      if (archive === "past day") {
        return now.getTime() - date.getTime() <= 24 * 60 * 60 * 1000
      }
      if (archive === "past week") {
        return now.getTime() - date.getTime() <= 7 * 24 * 60 * 60 * 1000
      }
      if (archive === "past month") {
        return now.getTime() - date.getTime() <= 30 * 24 * 60 * 60 * 1000
      }
      // "none" excludes archived entirely
      return false
    }

    return items.filter((item) => {
      const status = item.status
      if (status !== "Archived") return true
      if (archive === "none") return false
      const date = getItemDate(item)
      return withinWindow(date)
    })
  }, [items, archive, now])

  const sorted = React.useMemo(
    () => sortItems(filtered, sort),
    [filtered, sort]
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
