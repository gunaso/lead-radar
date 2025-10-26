import { DotIcon } from "lucide-react"

import { OpenRedditButton } from "./open-reddit-button"
import { SubredditAvatar } from "./avatar"

import { cn, formatRelativeOrLocaleDate } from "@/lib/utils"
import type { PostType } from "@/types/reddit"

function PostHeader({
  post,
  redditUrl,
  titleSize = "text-xl",
}: {
  post: PostType
  redditUrl?: string
  titleSize?: "text-lg" | "text-xl"
}) {
  return (
    <div className="flex flex-col gap-2 mb-2">
      <div className="flex justify-between gap-2">
        <div className="flex items-center gap-3 text-sm/none">
          <SubredditAvatar
            image={post.subreddit.image}
            name={post.subreddit.name}
            className="size-7"
          />
          <div className="flex flex-col justify-center gap-0.5">
            <div className="flex items-center gap-1">
              <span className="font-medium">{post.subreddit.name}</span>
              <DotIcon className="size-4 text-muted-foreground" />
              <span className="text-2xs text-muted-foreground">
                {formatRelativeOrLocaleDate(post.postedAt)}
              </span>
            </div>
            <span>{post.author}</span>
          </div>
        </div>
        {redditUrl && <OpenRedditButton url={redditUrl} />}
      </div>
      <span className={cn(titleSize, "font-semibold")}>{post.title}</span>
    </div>
  )
}

export { PostHeader }
