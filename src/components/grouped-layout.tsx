"use client"

import * as React from "react"

import { GroupedList } from "@/components/ui/grouped-list"
import { useFiltersContext } from "@/hooks/use-filters"
import type { SortValue } from "@/components/ui/sort"

type Getters<T> = {
  getScore: (item: T) => string
  getSentiment: (item: T) => string
  getStatus: (item: T) => string
  getDate: (item: T) => Date
  getKey?: (item: T) => string
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

function sortItems<T>(items: T[], sort: SortValue | undefined, g: Getters<T>) {
  if (!sort) return items
  const sorted = [...items]
  if (sort.field === "date") {
    sorted.sort((a, b) => g.getDate(b).getTime() - g.getDate(a).getTime())
  } else if (sort.field === "score") {
    sorted.sort((a, b) =>
      compareByOrder(g.getScore(a), g.getScore(b), SCORE_ORDER)
    )
  } else if (sort.field === "sentiment") {
    sorted.sort((a, b) =>
      compareByOrder(g.getSentiment(a), g.getSentiment(b), SENTIMENT_ORDER)
    )
  }
  if (sort.direction === "asc") sorted.reverse()
  return sorted
}

type GroupedLayoutProps<T> = {
  items: T[]
  getters: Getters<T>
  renderItem: (item: T) => React.ReactNode
  className?: string
}

function GroupedLayout<T>({
  items,
  getters,
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
      const status = getters.getStatus(item)
      if (status !== "Archived") return true
      if (archive === "none") return false
      const date = getters.getDate(item)
      return withinWindow(date)
    })
  }, [items, archive, getters, now])

  const sorted = React.useMemo(
    () => sortItems(filtered, sort, getters),
    [filtered, sort, getters]
  )

  if (group === "none") {
    return (
      <GroupedList
        className={className}
        items={sorted}
        getItemKey={getters.getKey}
        renderItem={renderItem}
      />
    )
  }

  const groupConfig = {
    getGroupKey: (item: T) => {
      if (group === "score") return getters.getScore(item)
      if (group === "sentiment") return getters.getSentiment(item)
      return getters.getStatus(item)
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
      getItemKey={getters.getKey}
      renderItem={renderItem}
      group={groupConfig}
    />
  )
}

export { GroupedLayout }
