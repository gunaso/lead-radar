"use client"

import { FeedItem, type FeedItemType } from "@/components/feed-item"
import { useFiltersContext } from "@/hooks/use-filters"
import { cn } from "@/lib/utils"

type CommentType = FeedItemType & {
  post: {
    title: string
    summary: string
  }
}

function Comment({ comment }: { comment: CommentType }) {
  const { expandDetailsState } = useFiltersContext()
  const [expandDetails] = expandDetailsState
  return (
    <FeedItem item={comment} url="/comments">
      <div
        className={cn(
          "text-sm mx-4 mb-3 p-2 rounded-md bg-border/30",
          !expandDetails && "hidden group-hover:block"
        )}
      >
        <span className="block font-medium truncate w-full pr-2 mb-1">
          {comment.post.title}
        </span>
        <span className="line-clamp-2 text-muted-foreground">
          {comment.post.summary}
        </span>
      </div>
    </FeedItem>
  )
}

export { Comment, type CommentType }
