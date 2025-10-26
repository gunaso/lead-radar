"use client"

import { useRouter } from "next/navigation"

import { ArrowUpRight } from "lucide-react"

import { FeedItem } from "@/components/feed-item"

import { useFiltersContext } from "@/hooks/use-filters"
import type { CommentType } from "@/types/reddit"
import { cn } from "@/lib/utils"

function FeedComment({ comment }: { comment: CommentType }) {
  const { expandDetailsState } = useFiltersContext()
  const [expandDetails] = expandDetailsState
  const router = useRouter()
  return (
    <FeedItem item={comment} url="/comments">
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
            onClick={() => router.push(`/posts/${comment.post.id}`)}
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
