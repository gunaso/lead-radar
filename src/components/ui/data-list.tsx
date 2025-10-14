"use client"

import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"

type Header<TItem> = {
  key: keyof TItem | string
  label: React.ReactNode
  className?: string
  render?: (args: {
    item: TItem
    value: unknown
    rowIndex: number
  }) => React.ReactNode
}

type DataListProps<TItem> = {
  headers: Header<TItem>[]
  items: TItem[]
  /** Return a Link href for a given row to wrap the row as a link. */
  getRowHref?: (item: TItem, index: number) => string | undefined
  /** Base path used as `${rowHrefBase}/${rowId}` if provided. */
  rowHrefBase?: string
  /** Key on item to read the row id from (default: "id"). */
  idKey?: keyof TItem | string
  /** Alternative resolver for row id; takes precedence over idKey. */
  getRowId?: (item: TItem) => string | number
  /**
   * Optional function to get className for the row container
   */
  getRowClassName?: (item: TItem, index: number) => string | undefined
}

export function DataList<TItem>({
  headers,
  items,
  getRowHref,
  rowHrefBase,
  idKey,
  getRowId,
  getRowClassName,
}: DataListProps<TItem>) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 h-8 border-b page-padding-x text-sm font-medium text-muted-foreground">
        {headers.map((h) => (
          <span key={String(h.key)} className={h.className}>
            {h.label}
          </span>
        ))}
      </div>

      <div className="flex flex-col">
        {items.map((item, rowIndex) => {
          const base = (
            <div
              className={cn(
                "group flex items-center gap-1 page-padding-x h-12 text-sm hover:bg-muted",
                getRowClassName?.(item, rowIndex)
              )}
            >
              {headers.map((h) => {
                const value = (item as any)[h.key as any]
                const content = h.render
                  ? h.render({ item, value, rowIndex })
                  : (value as React.ReactNode)
                return (
                  <span key={String(h.key)} className={h.className}>
                    {content}
                  </span>
                )
              })}
            </div>
          )

          let href = getRowHref?.(item, rowIndex)
          if (!href && rowHrefBase) {
            const resolvedId = (
              getRowId ? getRowId(item) : (item as any)[(idKey as any) ?? "id"]
            ) as string | number
            if (resolvedId !== undefined && resolvedId !== null) {
              href = `${rowHrefBase}/${resolvedId}`
            }
          }
          return href ? (
            <Link key={rowIndex} href={href} className="contents">
              {base}
            </Link>
          ) : (
            <React.Fragment key={rowIndex}>{base}</React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

export type { DataListProps, Header }
