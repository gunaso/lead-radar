"use client"

import { useRouter, useSearchParams } from "next/navigation"

import { ArrowUpRight } from "lucide-react"

import { FeedItem } from "@/components/feed-item"

import { encodeBreadcrumbParam } from "@/lib/breadcrumbs"
import { useFiltersContext } from "@/hooks/use-filters"
import type { CommentType } from "@/types/reddit"
import { cn } from "@/lib/utils"

function FeedComment({
  comment,
  bcCrumbs,
}: {
  comment: CommentType
  bcCrumbs?: Array<{ label: string; href?: string }>
}) {
  const { expandDetailsState } = useFiltersContext()
  const [expandDetails] = expandDetailsState
  const router = useRouter()
  const searchParams = useSearchParams()
  return (
    <FeedItem item={comment} url="/comments" bcCrumbs={bcCrumbs}>
      <div
        className={cn(
          "text-sm mx-4 mb-3 p-2 rounded-md bg-border/30",
          !expandDetails && "hidden group-hover:block"
        )}
      >
        <div className="flex items-center gap-3 w-full relative">
          <span className="block font-medium truncate w-[calc(100%-60px)] pr-2 mb-1">
            {comment.post.title}
          </span>
          <button
            type="button"
            onClick={() => {
              const hrefBase = `/posts/${comment.post.id}`
              // Prefer provided bcCrumbs (from parent context), else fall back to any bc in URL
              const bcFromCrumbs =
                bcCrumbs && bcCrumbs.length > 0
                  ? encodeBreadcrumbParam(bcCrumbs)
                  : ""
              const bcParam = bcFromCrumbs || searchParams?.get("bc") || ""
              const href = bcParam
                ? `${hrefBase}?bc=${encodeURIComponent(bcParam)}`
                : hrefBase
              router.push(href)
            }}
            className="flex gap-1 items-center text-xs text-muted-foreground shrink-0 hover:scale-103 transition-transform duration-150 absolute right-[-3px] top-[-3px]"
          >
            Post <ArrowUpRight className="size-3.5" />
          </button>
        </div>
        <span className="line-clamp-2 text-muted-foreground">
          {comment.post.summary}
        </span>
      </div>
    </FeedItem>
  )
}

export { FeedComment }
