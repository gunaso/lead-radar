"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"

import { Loader2, DotIcon } from "lucide-react"

import { SideSlotConfig } from "@/components/side-slot/side-slot-context"
import { Properties } from "@/components/side-slot/side-slot-properties"
import { HeaderConfig } from "@/components/header/header-context"
import { StatusDropdown } from "@/components/ui/dropdown-status"
import { ScoreDropdown } from "@/components/ui/dropdown-score"
import { ItemActions } from "@/components/ui/item-actions"
import { PostHeader } from "@/components/ui/post-header"
import { Expandable } from "@/components/ui/expandable"
import { Sentiment } from "@/components/ui/sentiment"
import { Separator } from "@/components/ui/separator"

import type { PostType, CommentType } from "@/types/reddit"
import { useComment, useCommentAccess } from "@/queries/comments"
import { mapStatus, mapScore, formatRelativeOrLocaleDate } from "@/lib/utils"
import { PATHS } from "@/lib/path"

export function CommentPageContent({ commentId }: { commentId: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const bcParam = searchParams?.get("bc") || ""
  const showPostCrumb = (searchParams?.get("src") || "") === "post"

  const { data: commentData, isLoading: isCommentLoading } = useComment(commentId)
  const { data: accessData, isLoading: isAccessLoading } = useCommentAccess(commentId)

  useEffect(() => {
    if (!isAccessLoading && accessData && !accessData.access) {
      router.push("/comments")
    }
  }, [accessData, isAccessLoading, router])

  if (isCommentLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!commentData) {
    return null // Handle Not Found or no access
  }

  // Transform Data
  const workspaceCommentData = commentData.workspaces_reddit_comments?.[0]
  const postData = commentData.post
  // Post workspace data might be missing in fetch, so assume defaults or partial info for parent post
  const postAuthor = postData?.reddit_users?.username || "Unknown"
  const commentAuthor = commentData.reddit_users?.username || "Unknown"

  const post: PostType = {
      id: postData.id,
      title: postData.title || "No Title",
      content: postData.content || "",
      author: postAuthor,
      subreddit: {
        id: postData.subreddits?.id || "",
        name: postData.subreddits?.name || "",
        image: postData.subreddits?.image || "",
        url: `/r/${postData.subreddits?.name || ""}/`,
        rules: postData.subreddits?.rules || "",
      },
      sentiment: postData.sentiment,
      status: "Needs Review", // We didn't fetch workspace status for post specifically here
      score: "Low", // Default
      keywords: [], 
      summary: postData.summary || "",
      postedAt: postData.created_at || new Date().toISOString(),
      url: postData.url || "",
  }

  const comment: CommentType = {
    id: commentData.id,
    content: commentData.content || "",
    status: mapStatus(workspaceCommentData?.status),
    score: mapScore(workspaceCommentData?.score),
    sentiment: commentData.sentiment,
    author: commentAuthor,
    postedAt: commentData.posted_at || new Date().toISOString(),
    url: commentData.url || "",
    summary: commentData.summary || "",
    keywords: commentData.reddit_comments_keywords?.map((k: any) => k.keywords?.value || "") || [],
    post: post,
    subreddit: post.subreddit
  }

  const label = comment.summary.split(" ")
  const postTitleParts = comment.post.title.split(" ")
  const postLabel = `${postTitleParts.slice(0, 3).join(" ")}${
    postTitleParts.length > 3 ? "..." : ""
  }`

  const postHrefBase = `${PATHS.POSTS}/${comment.post.id}`
  const postHref = bcParam
    ? `${postHrefBase}?bc=${encodeURIComponent(bcParam)}`
    : postHrefBase

  return (
    <>
      <SideSlotConfig
        config={{
          content: <Properties item={comment} />,
        }}
      />
      <div className="page-padding-x flex flex-col gap-2 py-6">
        <HeaderConfig
          config={{
            breadcrumbs: [
              ...(showPostCrumb
                ? [
                    {
                      key: `post-${comment.post.id}`,
                      label: postLabel,
                      href: postHref,
                      loading: false,
                    },
                  ]
                : []),
              {
                key: comment.id,
                label: `${label.slice(0, 3).join(" ")}${
                  label.length > 3 ? "..." : ""
                }`,
                loading: false,
              },
            ],
          }}
        />
        <CommentHeader comment={comment} />

        <Expandable collapsedHeight={220} bigDiv>
          <div className="whitespace-pre-wrap text-sm">{comment.content}</div>
        </Expandable>

        <ItemActions redditItemUrl={comment.url} />

        <Separator className="my-1.5" />

        <CommentPost
          post={comment.post}
          bcParam={searchParams?.get("bc") || ""}
        />
      </div>
    </>
  )
}

function CommentHeader({ comment }: { comment: CommentType }) {
  return (
    <div className="flex flex-col gap-1 mb-3">
      <span className="flex items-center gap-1">
        <span className="text-md font-medium">{comment.author}</span>
        <DotIcon className="size-4" />
        <span className="text-sm text-muted-foreground">
          {formatRelativeOrLocaleDate(comment.postedAt)}
        </span>
      </span>
    </div>
  )
}

function CommentPost({ post, bcParam }: { post: PostType; bcParam?: string }) {
  return (
    <div className="flex flex-col gap-2 bg-card p-3 rounded-sm">
      <PostHeader post={post} titleSize="text-lg" redditUrl={post.url} />

      <Expandable collapsedHeight={220} bgTo="card">
        <div className="whitespace-pre-wrap text-sm p-3 bg-muted rounded-md">
          {post.content}
        </div>
      </Expandable>
      <ItemActions
        className="mt-2"
        openUrl={`${PATHS.POSTS}/${post.id}${
          bcParam ? `?bc=${encodeURIComponent(bcParam)}` : ""
        }`}
        redditItemUrl={post.url}
        extraActions={
          // Use generic actions or specific if needed.
          // Note: status/score here refer to parent post.
          // Since we didn't fetch workspace data for post, these might be default.
          // In real app, we should fetch post workspace data if we want to edit it here.
          // For now, let's keep it read-only or minimal?
          // The mock had them.
          <>
            <StatusDropdown initialStatus={post.status} />
            <ScoreDropdown initialScore={post.score} />
            <Sentiment sentiment={post.sentiment} sm />
          </>
        }
      />
    </div>
  )
}
