"use client"

import { useEffect, useRef } from "react"
import { useInView } from "framer-motion"

import { HeaderConfig } from "@/components/header/header-context"
import { GroupedLayout } from "@/components/grouped-layout"
import { Filters } from "@/components/filters"
import { FeedComment } from "@/components/feed-comment"

import { FiltersProvider, useFiltersContext } from "@/hooks/use-filters"
import { useSubreddits } from "@/queries/subreddits"
import { useKeywords } from "@/queries/keywords"
import { useComments } from "@/queries/comments"
import { Loader2 } from "lucide-react"

function CommentsContent() {
  const {
    keywordsState: [keywords],
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
      keywords,
      subreddits,
      sentiment,
      score,
      from: dateRange?.from?.toISOString(),
      to: dateRange?.to?.toISOString(),
      sort: sort ? `${sort.field}:${sort.direction}` : undefined,
      group, // Note: group param not technically used in querying but for consistency
      archive,
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
          There are no new comments for the keywords or subreddits that you
          selected.
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

export default function CommentsPage() {
  const { data: keywords = [] } = useKeywords()
  const { data: subreddits = [] } = useSubreddits()

  const keywordsOptions = keywords.map((k) => ({
    value: k.id,
    label: k.name,
  }))

  const subredditsOptions = subreddits.map((s) => ({
    value: s.id,
    label: s.name,
  }))

  return (
    <FiltersProvider
      keywordsOptions={keywordsOptions}
      subredditsOptions={subredditsOptions}
    >
      <section className="flex flex-col h-full">
        <HeaderConfig
          config={{
            title: "Comments",
          }}
        />
        <Filters />
        <CommentsContent />
      </section>
    </FiltersProvider>
  )
}
