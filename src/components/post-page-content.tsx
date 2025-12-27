"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"

import { Loader2 } from "lucide-react"

import { SideSlotConfig } from "@/components/side-slot/side-slot-context"
import { Properties } from "@/components/side-slot/side-slot-properties"
import { HeaderConfig } from "@/components/header/header-context"
import { PostComment } from "@/components/ui/post-comment"
import { ItemActions } from "@/components/ui/item-actions"
import { PostHeader } from "@/components/ui/post-header"
import { Expandable } from "@/components/ui/expandable"
import { Separator } from "@/components/ui/separator"

import type { PostType, PostCommentType } from "@/types/reddit"
import { usePost, usePostAccess } from "@/queries/posts"
import { mapStatus, mapScore } from "@/lib/utils"

export function PostPageContent({ postId }: { postId: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const bcParam = searchParams?.get("bc") || ""

  const { data: postData, isLoading: isPostLoading } = usePost(postId)
  const { data: accessData, isLoading: isAccessLoading } = usePostAccess(postId)

  useEffect(() => {
    if (!isAccessLoading && accessData && !accessData.access) {
      router.push("/posts")
    }
  }, [accessData, isAccessLoading, router])

  if (isPostLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!postData) {
    return null // or NotFound logic handled by parent or empty state
  }

  // Transform Data (similar to server component, but now on client or API return type)
  // Assuming API returns raw DB shape, we map it here.
  const workspacePostData = postData.workspaces_reddit_posts?.[0]

  const post: PostType = {
    id: postData.id,
    title: postData.title || "No Title",
    content: postData.content || "",
    author: postData.reddit_users?.username || "Unknown",
    subreddit: {
      id: postData.subreddits?.id || "",
      name: postData.subreddits?.name || "",
      image: postData.subreddits?.image || "",
      url: `/r/${postData.subreddits?.name || ""}/`,
      rules: postData.subreddits?.rules || "",
    },
    sentiment: postData.sentiment,
    status: mapStatus(workspacePostData?.status),
    score: mapScore(workspacePostData?.score),
    keywords: postData.reddit_posts_keywords.map((k: any) => k.keywords?.value || ""),
    summary: postData.summary || "",
    postedAt: postData.created_at || new Date().toISOString(),
    url: postData.url || "",
  }

  const comments: PostCommentType[] = (postData.reddit_comments || []).map((c: any) => {
    const workspaceCommentData = c.workspaces_reddit_comments?.[0]
    return {
      id: c.id,
      content: c.content || "",
      status: mapStatus(workspaceCommentData?.status),
      score: mapScore(workspaceCommentData?.score),
      sentiment: c.sentiment,
      author: c.reddit_users?.username || "Unknown",
      postedAt: c.posted_at || new Date().toISOString(),
      url: c.url || "",
    }
  })

  const label = (post.title || "").split(" ")

  return (
    <>
      <SideSlotConfig
        config={{
          content: <Properties item={post} />,
        }}
      />
      <div className="page-padding-x flex flex-col gap-2 py-6">
        <HeaderConfig
          config={{
            breadcrumbs: [
              {
                key: post.id,
                label: `${label.slice(0, 3).join(" ")}${
                  label.length > 3 ? "..." : ""
                }`,
                loading: false,
              },
            ],
          }}
        />
        <PostHeader post={post} />

        <Expandable collapsedHeight={220} bigDiv>
          <div className="whitespace-pre-wrap text-sm p-3 bg-muted rounded-md">
            {post.content}
          </div>
        </Expandable>

        <ItemActions redditItemUrl={post.url} />

        <Separator className="my-1.5" />

        <span className="text-md font-semibold">Comments</span>
        <div className="flex flex-col gap-2">
          {comments.map((comment) => (
            <PostComment
              key={comment.id}
              comment={comment}
              bcParam={bcParam}
              postUrl={post.url}
            />
          ))}
        </div>
      </div>
    </>
  )
}
