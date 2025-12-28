"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useMemo } from "react"

import type { BreadcrumbCrumb } from "@/components/header/header-context"

import { decodeBreadcrumbParam } from "@/lib/breadcrumbs"
import { PATHS } from "@/lib/path"

const ROOT_LABELS: Record<string, { label: string; href: string }> = {
  "": { label: "Inbox", href: PATHS.INBOX },
  subreddits: { label: "Subreddits", href: PATHS.SUBREDDITS },
  posts: { label: "Posts", href: PATHS.POSTS },
  comments: { label: "Comments", href: PATHS.COMMENTS },
  competitors: { label: "Competitors", href: PATHS.COMPETITORS },
  keywords: { label: "Keywords", href: PATHS.KEYWORDS },
}

export function useBreadcrumbs(
  pageCrumbs?: BreadcrumbCrumb[]
): BreadcrumbCrumb[] {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  return useMemo(() => {
    const crumbs: BreadcrumbCrumb[] = []

    // 1) bc param trail
    const bcParam = searchParams?.get("bc") || ""
    const bc = decodeBreadcrumbParam(bcParam) || []
    for (let i = 0; i < bc.length; i++) {
      const c = bc[i]
      crumbs.push({ key: `bc-${i}`, label: c.label, href: c.href })
    }

    // 2) section root from first segment (only when no bc trail provided)
    if (bc.length === 0) {
      const segments = (pathname || "/").split("/").filter(Boolean)
      const first = segments[0] ?? ""
      const root = ROOT_LABELS[first] ?? null
      if (root) {
        const alreadyHasRoot =
          crumbs.length > 0 && crumbs[0].label === root.label
        if (!alreadyHasRoot) {
          crumbs.push({
            key: `root-${first || "inbox"}`,
            label: root.label,
            href: root.href,
          })
        }
      }
    }

    // 3) page-provided crumbs
    if (Array.isArray(pageCrumbs) && pageCrumbs.length > 0) {
      for (const c of pageCrumbs) {
        // Prevent duplication of the last crumb (e.g. if Root added "Subreddits" and page also adds it)
        const last = crumbs[crumbs.length - 1]
        if (last && last.label === c.label && last.href === c.href) {
          continue
        }
        crumbs.push(c)
      }
    }

    // Ensure only the final crumb has no href
    if (crumbs.length > 0) {
      for (let i = 0; i < crumbs.length - 1; i++) {
        // keep only non-terminal crumbs as links
        if (!crumbs[i].href) {
          // infer href from root map when possible
          const infer = Object.values(ROOT_LABELS).find((r) => r.label === crumbs[i].label)
          if (infer) {
            crumbs[i] = { ...crumbs[i], href: infer.href }
          }
        }
      }
      // last crumb: remove href to indicate current page
      const lastIdx = crumbs.length - 1
      if (crumbs[lastIdx]?.href) {
        crumbs[lastIdx] = { ...crumbs[lastIdx], href: undefined }
      }
    }

    return crumbs
  }, [pathname, searchParams, pageCrumbs])
}


