import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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