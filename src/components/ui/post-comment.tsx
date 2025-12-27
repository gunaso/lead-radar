"use client"

import { DotIcon } from "lucide-react"

import { OpenRedditButton } from "@/components/ui/open-reddit-button"
import { StatusDropdown } from "@/components/ui/dropdown-status"
import { ScoreDropdown } from "@/components/ui/dropdown-score"
import { ItemActions } from "@/components/ui/item-actions"
import { Expandable } from "@/components/ui/expandable"
import { Sentiment } from "@/components/ui/sentiment"

import type { PostCommentType } from "@/types/reddit"
import { formatRelativeOrLocaleDate } from "@/lib/utils"

export function PostComment({
  comment,
  bcParam,
  postUrl,
}: {
  comment: PostCommentType
  bcParam: string
  postUrl: string
}) {
  return (
    <div className="flex flex-col gap-2 bg-card p-2 rounded-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-sm font-medium">u/{comment.author}</span>
          <DotIcon className="size-4 text-muted-foreground" />
          <span className="text-2xs text-muted-foreground">
            {formatRelativeOrLocaleDate(comment.postedAt)}
          </span>
        </div>
        <OpenRedditButton url={comment.url} />
      </div>
      <Expandable collapsedHeight={80} bgTo="card">
        <div className="pl-3 whitespace-pre-wrap text-sm">
          {comment.content}
        </div>
      </Expandable>
      <ItemActions
        openUrl={`/comments/${comment.id}${
          bcParam ? `?bc=${encodeURIComponent(bcParam)}&src=post` : `?src=post`
        }`}
        redditItemUrl={postUrl}
        extraActions={
          <>
            <StatusDropdown initialStatus={comment.status} />
            <ScoreDropdown initialScore={comment.score} />
            <Sentiment sentiment={comment.sentiment} sm />
          </>
        }
      />
    </div>
  )
}
