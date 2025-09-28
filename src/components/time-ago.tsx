"use client"

import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

function formatTimeAgo(date: Date | string) {
  const now = new Date()
  const givenDate = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - givenDate.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return `${diffInSeconds}s`
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours}h`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays}d`
  }

  const diffInWeeks = Math.floor(diffInDays / 7)
  if (diffInWeeks < 4) {
    return `${diffInWeeks}w`
  }

  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return `${diffInMonths}mo`
  }

  const diffInYears = Math.floor(diffInDays / 365)
  return `${diffInYears}y`
}

interface TimeAgoProps {
  date: Date | string
  className?: string
}

export function TimeAgo({ date, className }: TimeAgoProps) {
  const [timeAgo, setTimeAgo] = useState(() => formatTimeAgo(date))

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeAgo(formatTimeAgo(date))
    }, 1000)

    return () => clearInterval(interval)
  }, [date])

  return (
    <span className={cn(className)} suppressHydrationWarning>
      {timeAgo}
    </span>
  )
}
