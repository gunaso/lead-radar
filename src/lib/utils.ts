import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {
  isValid as isValidDate,
  formatDistanceToNow,
  differenceInDays,
  format,
  type Locale,
} from "date-fns"

import type { PostType } from "@/types/reddit"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateInputId(label: string) {
  return label.toLowerCase().replace(/\s+/g, "-")
}

export function getInitials(name: string): string {
  if (!name) return "?"

  const parts = name.trim().split(/\s+/)

  if (parts.length === 1) {
    // Single name → take first two letters
    return parts[0].slice(0, 2).toUpperCase()
  }

  // Multi-word name → take first letter of first and last
  return parts[0][0].toUpperCase() + parts[parts.length - 1][0].toUpperCase()
}

export function formatPostDate(dateString: string): string {
  const date = new Date(dateString)
  const today = new Date()

  // Format as "Mon Day" (e.g., "Aug 22")
  const monthDay = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })

  // If same year, just return month and day
  if (date.getFullYear() === today.getFullYear()) {
    return monthDay
  }

  // Calculate months difference
  const monthsDiff =
    (today.getFullYear() - date.getFullYear()) * 12 +
    (today.getMonth() - date.getMonth())

  // If more than 6 months apart, include year on second line
  if (monthsDiff > 6) {
    return `${monthDay}\n${date.getFullYear()}`
  }

  // Less than 6 months but different year, just show month and day
  return monthDay
}

export function formatRelativeOrLocaleDate(
  dateInput: string | Date,
  locale?: Locale
): string {
  const date = new Date(dateInput)
  if (!isValidDate(date)) return ""

  const daysDiff = differenceInDays(new Date(), date)

  if (daysDiff < 7) {
    return formatDistanceToNow(date, { addSuffix: true, locale })
  }

  return format(date, "PP", { locale })
}

// Formats a date as YYYY-MM-DD; returns empty string if invalid
export function formatDateYMD(dateInput: string | Date): string {
  const date = new Date(dateInput)
  if (!isValidDate(date)) return ""
  return format(date, "yyyy-MM-dd")
}

export function mapStatus(status: string | null | undefined): PostType["status"] {
  switch (status) {
    case "-1": return "Archived"
    case "0": return "Needs Review"
    case "1": return "Ready to Engage"
    case "2": return "Engaging"
    case "3": return "Engaged"
    default: return "Needs Review"
  }
}

export function mapScore(score: number | null | undefined): PostType["score"] {
  if (score === null || score === undefined) return "Low"
  if (score > 90) return "Prime"
  if (score > 70) return "High"
  if (score > 40) return "Medium"
  return "Low"
}
