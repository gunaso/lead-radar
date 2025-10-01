/**
 * Normalizes a website URL to a standard format (origin only)
 * @param website - Raw website string (with or without protocol)
 * @returns Normalized URL (e.g., "https://example.com") or null if invalid
 */
export function normalizeWebsiteUrl(website: string): string | null {
  if (!website) return null
  
  try {
    const url = new URL(website.startsWith("http") ? website : `https://${website}`)
    return url.origin
  } catch {
    return null
  }
}

/**
 * Validates and normalizes a website URL
 * @param website - Raw website string
 * @returns Object with validation result and normalized URL
 */
export function validateAndNormalizeUrl(website: string): {
  valid: boolean
  normalized: string | null
  error?: string
} {
  const trimmed = website.trim()
  
  if (!trimmed) {
    return { valid: true, normalized: null }
  }

  const normalized = normalizeWebsiteUrl(trimmed)
  
  if (!normalized) {
    return {
      valid: false,
      normalized: null,
      error: "Invalid website URL format",
    }
  }

  return { valid: true, normalized }
}

