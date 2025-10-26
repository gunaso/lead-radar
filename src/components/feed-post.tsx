"use client"

import { FeedItem } from "@/components/feed-item"

import { useFiltersContext } from "@/hooks/use-filters"
import type { PostType } from "@/types/reddit"
import { cn } from "@/lib/utils"

function Post({ post }: { post: PostType }) {
  const { expandDetailsState } = useFiltersContext()
  const [expandDetails] = expandDetailsState
  return (
    <FeedItem item={post} url="/posts">
      <div
        className={cn(
          "text-sm mx-4 mb-3 p-2 rounded-md bg-border/30",
          !expandDetails && "hidden group-hover:block"
        )}
      >
        <span className="line-clamp-2">{post.summary}</span>
      </div>
    </FeedItem>
  )
}

export { Post }
