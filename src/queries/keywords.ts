import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import type { Keyword } from "@/types/objects"
import { request } from "@/lib/api/client"
import { qk } from "@/lib/api/query-keys"

type GetKeywordsResponse = {
  ok: true
  keywords: Array<{
    id: string
    name: string
    owner: { name: string; image: string | null }
    posts: number
    comments: number
    createdAt: string
  }>
}

export function useKeywords() {
  return useQuery({
    queryKey: qk.keywords(),
    queryFn: async () => {
      const res = await request<GetKeywordsResponse>("/api/keywords")
      const items: Keyword[] = (res.keywords || []).map((k) => ({
        id: k.id,
        name: k.name,
        owner: { name: k.owner?.name ?? "Unknown", image: k.owner?.image ?? null },
        posts: k.posts ?? 0,
        comments: k.comments ?? 0,
        createdAt: k.createdAt,
      }))
      return items
    },
  })
}

export function useDeleteKeyword() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: { id: string }) =>
      request<{ ok: boolean }>("/api/keywords", {
        method: "DELETE",
        body: JSON.stringify({ id: payload.id }),
      }),
    onMutate: async ({ id }) => {
      await qc.cancelQueries({ queryKey: qk.keywords() })
      const previous = qc.getQueryData<Keyword[]>(qk.keywords())
      if (previous) {
        qc.setQueryData<Keyword[]>(
          qk.keywords(),
          previous.filter((k) => k.id !== id)
        )
      }
      return { previous }
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.previous) qc.setQueryData(qk.keywords(), ctx.previous)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: qk.keywords() })
    },
  })
}

export function useCreateKeyword() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: { name: string }) =>
      request<{ ok: boolean; id: string; name: string; owner: { name: string; image: string | null }; posts: number; comments: number; createdAt: string }>(
        "/api/keywords",
        {
          method: "POST",
          body: JSON.stringify({ name: payload.name }),
        }
      ),
    onMutate: async ({ name }) => {
      await qc.cancelQueries({ queryKey: qk.keywords() })
      const previous = qc.getQueryData<Keyword[]>(qk.keywords())
      const tempId = `temp-${Date.now()}`
      const optimistic: Keyword = {
        id: tempId,
        name,
        owner: { name: "You", image: null },
        posts: 0,
        comments: 0,
        createdAt: new Date().toISOString(),
      }
      if (previous) {
        // prevent duplicates by name (case-insensitive)
        const exists = previous.some((k) => k.name.trim().toLowerCase() === name.trim().toLowerCase())
        const next = exists ? previous : [optimistic, ...previous]
        qc.setQueryData<Keyword[]>(qk.keywords(), next)
      } else {
        qc.setQueryData<Keyword[]>(qk.keywords(), [optimistic])
      }
      return { previous, tempId }
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.previous) qc.setQueryData(qk.keywords(), ctx.previous)
    },
    onSuccess: (data, _vars, ctx) => {
      const prev = qc.getQueryData<Keyword[]>(qk.keywords()) || []
      const mapped: Keyword = {
        id: data.id,
        name: data.name,
        owner: { name: data.owner?.name ?? "You", image: data.owner?.image ?? null },
        posts: data.posts ?? 0,
        comments: data.comments ?? 0,
        createdAt: data.createdAt,
      }
      const next = prev
        .filter((k) => (ctx?.tempId ? k.id !== ctx.tempId : true))
        .filter((k, idx, arr) => arr.findIndex((x) => x.name.trim().toLowerCase() === k.name.trim().toLowerCase()) === idx)
      qc.setQueryData<Keyword[]>(qk.keywords(), [mapped, ...next])
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: qk.keywords() })
    },
  })
}


