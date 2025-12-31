import { type InfiniteData, type QueryClient, type QueryKey } from "@tanstack/react-query"

import { qk } from "@/lib/api/query-keys"
import type { CommentType, PostType, ScoreType, StatusType } from "@/types/reddit"

export type ItemType = "post" | "comment"

type PostsPage = {
  data: PostType[]
  nextCursor?: number
}

type CommentsPage = {
  data: CommentType[]
  nextCursor?: number
}

export type SnapshotContext = {
  previousPostsQueries: Array<[QueryKey, InfiniteData<PostsPage> | undefined]>
  previousCommentsQueries: Array<[QueryKey, InfiniteData<CommentsPage> | undefined]>
  previousPost?: PostType
  previousComment?: CommentType
}

function updateInfiniteQueryData<T extends { id: string }>(
  old: InfiniteData<{ data: T[]; nextCursor?: number }> | undefined,
  id: string,
  updater: (item: T) => T
): InfiniteData<{ data: T[]; nextCursor?: number }> | undefined {
  if (!old) return old

  return {
    ...old,
    pages: old.pages.map((page) => ({
      ...page,
      data: page.data.map((item) => (item.id === id ? updater(item) : item)),
    })),
  }
}

export async function applyOptimisticScoreUpdate(
  queryClient: QueryClient,
  {
    id,
    type,
    score,
  }: {
    id: string
    type: ItemType
    score: ScoreType
  }
): Promise<SnapshotContext> {
  await queryClient.cancelQueries({ queryKey: ["posts"] })
  await queryClient.cancelQueries({ queryKey: ["comments"] })

  const previousPostsQueries = queryClient.getQueriesData<InfiniteData<PostsPage>>({
    queryKey: ["posts"],
  })
  const previousCommentsQueries = queryClient.getQueriesData<InfiniteData<CommentsPage>>({
    queryKey: ["comments"],
  })

  const previousPost = type === "post" ? queryClient.getQueryData<PostType>(qk.post(id)) : undefined
  const previousComment =
    type === "comment" ? queryClient.getQueryData<CommentType>(qk.comment(id)) : undefined

  queryClient.setQueriesData<InfiniteData<PostsPage>>({ queryKey: ["posts"] }, (old) =>
    updateInfiniteQueryData(old, id, (item) => ({ ...item, score }))
  )
  queryClient.setQueriesData<InfiniteData<CommentsPage>>({ queryKey: ["comments"] }, (old) =>
    updateInfiniteQueryData(old, id, (item) => ({ ...item, score }))
  )

  if (type === "post") {
    queryClient.setQueryData<PostType>(qk.post(id), (old) => (old ? { ...old, score } : old))
  } else {
    queryClient.setQueryData<CommentType>(qk.comment(id), (old) => (old ? { ...old, score } : old))
  }

  return {
    previousPostsQueries,
    previousCommentsQueries,
    previousPost,
    previousComment,
  }
}

export async function applyOptimisticStatusUpdate(
  queryClient: QueryClient,
  {
    id,
    type,
    status,
  }: {
    id: string
    type: ItemType
    status: StatusType
  }
): Promise<SnapshotContext> {
  await queryClient.cancelQueries({ queryKey: ["posts"] })
  await queryClient.cancelQueries({ queryKey: ["comments"] })

  const previousPostsQueries = queryClient.getQueriesData<InfiniteData<PostsPage>>({
    queryKey: ["posts"],
  })
  const previousCommentsQueries = queryClient.getQueriesData<InfiniteData<CommentsPage>>({
    queryKey: ["comments"],
  })

  const previousPost = type === "post" ? queryClient.getQueryData<PostType>(qk.post(id)) : undefined
  const previousComment =
    type === "comment" ? queryClient.getQueryData<CommentType>(qk.comment(id)) : undefined

  queryClient.setQueriesData<InfiniteData<PostsPage>>({ queryKey: ["posts"] }, (old) =>
    updateInfiniteQueryData(old, id, (item) => ({ ...item, status }))
  )
  queryClient.setQueriesData<InfiniteData<CommentsPage>>({ queryKey: ["comments"] }, (old) =>
    updateInfiniteQueryData(old, id, (item) => ({ ...item, status }))
  )

  if (type === "post") {
    queryClient.setQueryData<PostType>(qk.post(id), (old) => (old ? { ...old, status } : old))
  } else {
    queryClient.setQueryData<CommentType>(qk.comment(id), (old) => (old ? { ...old, status } : old))
  }

  return {
    previousPostsQueries,
    previousCommentsQueries,
    previousPost,
    previousComment,
  }
}

export function rollbackOptimisticUpdate(queryClient: QueryClient, context: SnapshotContext) {
  context.previousPostsQueries.forEach(([queryKey, data]) => {
    queryClient.setQueryData(queryKey, data)
  })
  context.previousCommentsQueries.forEach(([queryKey, data]) => {
    queryClient.setQueryData(queryKey, data)
  })

  if (context.previousPost !== undefined) {
    queryClient.setQueryData(qk.post(context.previousPost.id), context.previousPost)
  }
  if (context.previousComment !== undefined) {
    queryClient.setQueryData(qk.comment(context.previousComment.id), context.previousComment)
  }
}

