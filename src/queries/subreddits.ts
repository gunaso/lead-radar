"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import type { Subreddit } from "@/types/objects"
import { request } from "@/lib/api/client"
import { qk } from "@/lib/api/query-keys"

type GetSubredditsResponse = {
  ok: true
  subreddits: Array<{
    id: string
    name: string
    image: string | null
    owner: { name: string; image: string | null }
    posts: number
    comments: number
    createdAt: string
  }>
}

export function useSubreddits() {
  return useQuery({
    queryKey: qk.subreddits(),
    queryFn: async () => {
      const res = await request<GetSubredditsResponse>("/api/subreddits")
      const items: Subreddit[] = (res.subreddits || []).map((s) => ({
        id: s.id,
        name: s.name,
        image: s.image ?? null,
        owner: { name: s.owner?.name ?? "Unknown", image: s.owner?.image ?? null },
        posts: s.posts ?? 0,
        comments: s.comments ?? 0,
        createdAt: s.createdAt,
      }))
      return items
    },
  })
}

export function useDeleteSubreddit() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: { id: string }) =>
      request<{ ok: boolean }>("/api/subreddits", {
        method: "DELETE",
        body: JSON.stringify({ id: payload.id }),
      }),
    onMutate: async ({ id }) => {
      await qc.cancelQueries({ queryKey: qk.subreddits() })
      const previous = qc.getQueryData<Subreddit[]>(qk.subreddits())
      if (previous) {
        qc.setQueryData<Subreddit[]>(
          qk.subreddits(),
          previous.filter((s) => s.id !== id)
        )
      }
      return { previous }
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.previous) qc.setQueryData(qk.subreddits(), ctx.previous)
      toast.error("Failed to remove subreddit")
    },
    onSuccess: () => {
      toast.success("Subreddit removed")
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: qk.subreddits() })
    },
  })
}

export function useCreateSubreddit() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: { name: string; details?: Partial<{ title?: string | null; description?: string | null; description_reddit?: string | null; community_icon?: string | null }> }) =>
      request<{ ok: boolean; id: string; name: string; image: string | null; owner: { name: string; image: string | null }; posts: number; comments: number; createdAt: string }>(
        "/api/subreddits",
        {
          method: "POST",
          body: JSON.stringify({ name: payload.name, details: payload.details }),
        }
      ),
    onMutate: async ({ name, details }) => {
      await qc.cancelQueries({ queryKey: qk.subreddits() })
      const previous = qc.getQueryData<Subreddit[]>(qk.subreddits())
      const tempId = `temp-${Date.now()}`
      const optimistic: Subreddit = {
        id: tempId,
        name: name.startsWith("r/") ? name : `r/${name}`,
        image: details?.community_icon ? details.community_icon.split("?")[0] ?? null : null,
        owner: { name: "You", image: null },
        posts: 0,
        comments: 0,
        createdAt: new Date().toISOString(),
      }
      if (previous) {
        // prevent duplicates by name (case-insensitive)
        const exists = previous.some((s) => s.name.trim().toLowerCase() === optimistic.name.trim().toLowerCase())
        const next = exists ? previous : [optimistic, ...previous]
        qc.setQueryData<Subreddit[]>(qk.subreddits(), next)
      } else {
        qc.setQueryData<Subreddit[]>(qk.subreddits(), [optimistic])
      }
      return { previous, tempId }
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.previous) qc.setQueryData(qk.subreddits(), ctx.previous)
      toast.error("Failed to add subreddit")
    },
    onSuccess: (data, _vars, ctx) => {
      const prev = qc.getQueryData<Subreddit[]>(qk.subreddits()) || []
      const mapped: Subreddit = {
        id: data.id,
        name: data.name,
        image: data.image ?? null,
        owner: { name: data.owner?.name ?? "You", image: data.owner?.image ?? null },
        posts: data.posts ?? 0,
        comments: data.comments ?? 0,
        createdAt: data.createdAt,
      }
      // Replace the optimistic item in-place to avoid remount/reorder
      const next = [...prev]
      const byTempIdx = ctx?.tempId ? next.findIndex((s) => s.id === ctx.tempId) : -1
      const byNameIdx =
        byTempIdx === -1
          ? next.findIndex(
              (s) => s.name.trim().toLowerCase() === mapped.name.trim().toLowerCase()
            )
          : -1
      const targetIdx = byTempIdx !== -1 ? byTempIdx : byNameIdx
      if (targetIdx !== -1) {
        next[targetIdx] = mapped
      } else {
        next.unshift(mapped)
      }
      // Deduplicate by name (case-insensitive), keeping first occurrence
      const seen = new Set<string>()
      const deduped: Subreddit[] = []
      for (const item of next) {
        const key = item.name.trim().toLowerCase()
        if (seen.has(key)) continue
        seen.add(key)
        deduped.push(item)
      }
      qc.setQueryData<Subreddit[]>(qk.subreddits(), deduped)
      toast.success("Subreddit added")
    },
    // Do not invalidate/refetch to prevent full remount; cache is already updated
  })
}


