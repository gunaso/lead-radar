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