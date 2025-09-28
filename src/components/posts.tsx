"use client"

import type { ReactElement } from "react"

import { ExternalLink, MessageSquare, User, Clock } from "lucide-react"

import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card"
import { cn } from "../lib/utils"
import type { Post } from "../types/reddit"
import { TimeAgo } from "./time-ago"

type PostCardProps = {
  post: Post
}

export function PostCard({ post }: PostCardProps): ReactElement {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{post.title}</CardTitle>
        <CardDescription>
          <span className="mr-2">{post.subreddit}</span>
          <span className="inline-flex items-center gap-1 text-muted-foreground">
            <User className="size-3" /> {post.user}
            <Clock className="size-3 ml-2" /> <TimeAgo date={post.createdAt} />
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{post.content}</p>
        <div className="flex flex-wrap gap-1">
          <Badge
            className={cn(
              "bg-secondary border-secondary/50",
              post.sentiment === "Positive" &&
                "bg-emerald-500/10 text-emerald-700 border-emerald-500/30",
              post.sentiment === "Negative" &&
                "bg-rose-500/10 text-rose-700 border-rose-500/30"
            )}
          >
            {post.sentiment}
          </Badge>
          {post.keywords.map((k) => (
            <Badge
              key={k}
              className="bg-primary/10 text-primary border-primary/20"
            >
              {k}
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Button asChild size="sm" variant="outline">
            <a href={`/reply?type=post&id=${post.id}`}>
              Reply <MessageSquare className="size-4" />
            </a>
          </Button>
          <Button asChild size="sm" variant="ghost">
            <a href={post.url} target="_blank" rel="noreferrer">
              Open <ExternalLink className="size-4" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

type PostsListProps = {
  posts: Post[]
}

export function PostsList({ posts }: PostsListProps): ReactElement {
  return (
    <div className="space-y-3">
      {posts.map((p) => (
        <PostCard key={p.id} post={p} />
      ))}
    </div>
  )
}
