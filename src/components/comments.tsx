"use client"

import type { ReactElement } from "react"

import { ExternalLink, MessageSquare } from "lucide-react"

import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { cn } from "../lib/utils"
import type { Comment } from "../types/reddit"
import { TimeAgo } from "./time-ago"

type CommentCardProps = {
  comment: Comment
}

export function CommentCard({ comment }: CommentCardProps): ReactElement {
  return (
    <Card className="overflow-hidden">
      <CardContent className="space-y-3">
        <div className="text-sm">
          <span className="font-medium">{comment.user}</span>{" "}
          <span className="text-muted-foreground">
            commented <TimeAgo date={comment.createdAt} />
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{comment.content}</p>
        <div className="flex flex-wrap gap-1">
          <Badge
            className={cn(
              "bg-secondary border-secondary/50",
              comment.sentiment === "Positive" &&
                "bg-emerald-500/10 text-emerald-700 border-emerald-500/30",
              comment.sentiment === "Negative" &&
                "bg-rose-500/10 text-rose-700 border-rose-500/30"
            )}
          >
            {comment.sentiment}
          </Badge>
        </div>
        <Card className="border-dashed">
          <CardContent className="p-3">
            <div className="text-sm font-medium">{comment.post.title}</div>
            <div className="text-xs text-muted-foreground">
              {comment.post.subreddit}
            </div>
          </CardContent>
        </Card>
        <div className="flex items-center gap-2">
          <Button asChild size="sm" variant="outline">
            <a href={`/reply?type=comment&id=${comment.id}`}>
              Reply <MessageSquare className="size-4" />
            </a>
          </Button>
          <Button asChild size="sm" variant="ghost">
            <a href={comment.post.url} target="_blank" rel="noreferrer">
              Open <ExternalLink className="size-4" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

type CommentsListProps = {
  comments: Comment[]
}

export function CommentsList({ comments }: CommentsListProps): ReactElement {
  return (
    <div className="space-y-3">
      {comments.map((c) => (
        <CommentCard key={c.id} comment={c} />
      ))}
    </div>
  )
}
