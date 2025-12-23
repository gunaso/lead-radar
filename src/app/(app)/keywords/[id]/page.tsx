"use client"

import { useEffect, useRef, useState } from "react"
import { useParams } from "next/navigation"
import { useInView } from "framer-motion"
import { Loader2 } from "lucide-react"

import { HeaderConfig } from "@/components/header/header-context"
import { GroupedLayout } from "@/components/grouped-layout"
import { Filters } from "@/components/filters"
import { Post } from "@/components/feed-post"
import { FeedComment } from "@/components/feed-comment"
import { PostsCommentsToggle } from "@/components/ui/posts-comments-toggle"

import { FiltersProvider, useFiltersContext } from "@/hooks/use-filters"
import { useSubreddits } from "@/queries/subreddits"
import { useKeywords } from "@/queries/keywords"
import { usePosts } from "@/queries/posts"
import { useComments } from "@/queries/comments"
import { PATHS } from "@/lib/path"

type TabValue = "posts" | "comments"

function KeywordPostsContent({ keywordId }: { keywordId: string }) {
  const {
    subredditsState: [subreddits],
    sentimentState: [sentiment],
    scoreState: [score],
    dateRangeState: [dateRange],
    sortState: [sort],
    groupState: [group],
    archiveState: [archive],
  } = useFiltersContext()

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    usePosts({
      keywords: [keywordId],
      subreddits,
      sentiment,
      score,
      from: dateRange?.from?.toISOString(),
      to: dateRange?.to?.toISOString(),
      sort: sort ? `${sort.field}:${sort.direction}` : undefined,
      group,
      archive,
      matchType: "all",
    })

  const loadMoreRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(loadMoreRef)

  useEffect(() => {
    if (isInView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [isInView, hasNextPage, isFetchingNextPage, fetchNextPage])

  const posts = data?.pages.flatMap((page) => page.data) || []

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-2 text-center">
        <p className="text-lg font-medium text-foreground">No posts found</p>
        <p className="text-sm text-muted-foreground">
          There are no posts for this keyword with the selected filters.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col pb-8">
      <GroupedLayout
        className="flex flex-col"
        items={posts}
        renderItem={(post) => <Post key={post.id} post={post} />}
      />

      {hasNextPage && (
        <div
          ref={loadMoreRef}
          className="flex h-24 items-center justify-center"
        >
          {isFetchingNextPage && (
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          )}
        </div>
      )}
    </div>
  )
}

function KeywordCommentsContent({ keywordId }: { keywordId: string }) {
  const {
    subredditsState: [subreddits],
    sentimentState: [sentiment],
    scoreState: [score],
    dateRangeState: [dateRange],
    sortState: [sort],
    groupState: [group],
    archiveState: [archive],
  } = useFiltersContext()

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useComments({
      keywords: [keywordId],
      subreddits,
      sentiment,
      score,
      from: dateRange?.from?.toISOString(),
      to: dateRange?.to?.toISOString(),
      sort: sort ? `${sort.field}:${sort.direction}` : undefined,
      group,
      archive,
      matchType: "all",
    })

  const loadMoreRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(loadMoreRef)

  useEffect(() => {
    if (isInView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [isInView, hasNextPage, isFetchingNextPage, fetchNextPage])

  const comments = data?.pages.flatMap((page) => page.data) || []

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (comments.length === 0) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-2 text-center">
        <p className="text-lg font-medium text-foreground">No comments found</p>
        <p className="text-sm text-muted-foreground">
          There are no comments for this keyword with the selected filters.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col pb-8">
      <GroupedLayout
        className="flex flex-col"
        items={comments}
        renderItem={(comment) => <FeedComment key={comment.id} comment={comment} />}
      />

      {hasNextPage && (
        <div
          ref={loadMoreRef}
          className="flex h-24 items-center justify-center"
        >
          {isFetchingNextPage && (
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          )}
        </div>
      )}
    </div>
  )
}

function KeywordPageContent() {
  const params = useParams()
  const id = params.id as string
  const [tab, setTab] = useState<TabValue>("posts")
  
  const { data: keywords = [] } = useKeywords()
  
  // Find the keyword name from the list
  const currentKeyword = keywords.find((k) => k.id === id)
  const keywordName = currentKeyword?.name || "Keyword"

  return (
    <section className="flex flex-col h-full">
      <HeaderConfig
        config={{
          breadcrumbs: [
            {
              key: "keywords",
              label: "Keywords",
              href: PATHS.KEYWORDS,
            },
            {
              key: id,
              label: keywordName,
            },
          ],
          afterCrumbs: <PostsCommentsToggle tab={tab} onChange={setTab} />,
        }}
      />
      
      <Filters disableKeywords />

      {tab === "posts" ? (
        <KeywordPostsContent keywordId={id} />
      ) : (
        <KeywordCommentsContent keywordId={id} />
      )}
    </section>
  )
}

export default function KeywordPage() {
  const { data: subreddits = [] } = useSubreddits()

  const subredditsOptions = subreddits.map((s) => ({
    value: s.id,
    label: s.name,
  }))

  return (
    <FiltersProvider
      keywordsOptions={[]}
      subredditsOptions={subredditsOptions}
    >
      <KeywordPageContent />
    </FiltersProvider>
  )
}
