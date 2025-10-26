"use client"

import Link from "next/link"
import * as React from "react"

const DEFAULT_INTERACTIVE_SELECTORS = [
  '[data-slot="checkbox"]',
  '[data-slot="button"]',
  '[data-slot="dropdown-menu-trigger"]',
  "button",
  "input",
  "select",
  "textarea",
  '[contenteditable="true"]',
  '[role="button"]',
]

function elementMatchesAnySelector(
  element: Element | null,
  selectors: string[]
): boolean {
  if (!element) return false
  return selectors.some((selector) => element.closest(selector))
}

type GuardedLinkProps = React.ComponentProps<typeof Link> & {
  /**
   * Optional additional selectors to consider as interactive.
   * These are merged on top of the default set.
   */
  blockSelectors?: string[]
}

const GuardedLink = React.forwardRef<HTMLAnchorElement, GuardedLinkProps>(
  ({ onClick, blockSelectors, ...props }, ref) => {
    const selectors = React.useMemo(
      () => blockSelectors ?? DEFAULT_INTERACTIVE_SELECTORS,
      [blockSelectors]
    )

    const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
      const target = event.target as Element | null
      if (elementMatchesAnySelector(target, selectors)) {
        event.preventDefault()
        return
      }
      onClick?.(event)
    }

    return <Link ref={ref} {...props} onClick={handleClick} />
  }
)

GuardedLink.displayName = "GuardedLink"

export { GuardedLink, DEFAULT_INTERACTIVE_SELECTORS }
