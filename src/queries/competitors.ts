"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import type { Competitor } from "@/types/objects"
import { request } from "@/lib/api/client"
import { qk } from "@/lib/api/query-keys"

type GetCompetitorsResponse = {
  ok: true
  competitors: Array<{
    id: string
    name: string
    website: string | null
    owner: { name: string; image: string | null }
    createdAt: string
  }>
}

export function useCompetitors() {
  return useQuery({
    queryKey: qk.competitors(),
    queryFn: async () => {
      const res = await request<GetCompetitorsResponse>("/api/competitors")
      const items: Competitor[] = (res.competitors || []).map((c) => ({
        id: c.id,
        name: c.name,
        logo: null,
        website: c.website,
        owner: { name: c.owner?.name ?? "Unknown", image: c.owner?.image ?? null },
        createdAt: c.createdAt,
      }))
      return items
    },
  })
}

export function useCreateCompetitor() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: { name: string; website: string | null }) =>
      request<{
        ok: boolean
        id: string
        name: string
        website: string | null
        owner: { name: string; image: string | null }
        createdAt: string
      }>("/api/competitors", {
        method: "POST",
        body: JSON.stringify({ name: payload.name, website: payload.website }),
      }),
    onMutate: async ({ name, website }) => {
      await qc.cancelQueries({ queryKey: qk.competitors() })
      const previous = qc.getQueryData<Competitor[]>(qk.competitors())
      const tempId = `temp-${Date.now()}`
      const optimistic: Competitor = {
        id: tempId,
        name,
        logo: null,
        website,
        owner: { name: "You", image: null },
        createdAt: new Date().toISOString(),
      }
      if (previous) {
        const exists = previous.some(
          (c) => c.name.trim().toLowerCase() === name.trim().toLowerCase()
        )
        const next = exists ? previous : [optimistic, ...previous]
        qc.setQueryData<Competitor[]>(qk.competitors(), next)
      } else {
        qc.setQueryData<Competitor[]>(qk.competitors(), [optimistic])
      }
      return { previous, tempId }
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.previous) qc.setQueryData(qk.competitors(), ctx.previous)
    },
    onSuccess: (data, _vars, ctx) => {
      const prev = qc.getQueryData<Competitor[]>(qk.competitors()) || []
      const mapped: Competitor = {
        id: data.id,
        name: data.name,
        logo: null,
        website: data.website ?? null,
        owner: { name: data.owner?.name ?? "You", image: data.owner?.image ?? null },
        createdAt: data.createdAt,
      }
      const next = prev
        .filter((c) => (ctx?.tempId ? c.id !== ctx.tempId : true))
        .filter(
          (c, idx, arr) =>
            arr.findIndex(
              (x) => x.name.trim().toLowerCase() === c.name.trim().toLowerCase()
            ) === idx
        )
      qc.setQueryData<Competitor[]>(qk.competitors(), [mapped, ...next])
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: qk.competitors() })
    },
  })
}

export function useUpdateCompetitor() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: { id: string; name: string; website: string | null }) =>
      request<{
        ok: boolean
        id: string
        name: string
        website: string | null
        owner: { name: string; image: string | null }
        createdAt: string
      }>("/api/competitors", {
        method: "PATCH",
        body: JSON.stringify({
          id: payload.id,
          name: payload.name,
          website: payload.website,
        }),
      }),
    onMutate: async ({ id, name, website }) => {
      await qc.cancelQueries({ queryKey: qk.competitors() })
      const previous = qc.getQueryData<Competitor[]>(qk.competitors()) || []
      const next = previous.map((c) =>
        c.id === id ? { ...c, name, website } : c
      )
      qc.setQueryData<Competitor[]>(qk.competitors(), next)
      return { previous }
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.previous) qc.setQueryData(qk.competitors(), ctx.previous)
    },
    onSuccess: (data) => {
      const prev = qc.getQueryData<Competitor[]>(qk.competitors()) || []
      const next = prev.map((c) =>
        c.id === data.id
          ? {
              ...c,
              name: data.name,
              website: data.website ?? null,
              owner: { name: data.owner?.name ?? c.owner.name, image: c.owner.image },
              createdAt: data.createdAt,
            }
          : c
      )
      qc.setQueryData<Competitor[]>(qk.competitors(), next)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: qk.competitors() })
    },
  })
}

export function useDeleteCompetitor() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: { id: string }) =>
      request<{ ok: boolean }>("/api/competitors", {
        method: "DELETE",
        body: JSON.stringify({ id: payload.id }),
      }),
    onMutate: async ({ id }) => {
      await qc.cancelQueries({ queryKey: qk.competitors() })
      const previous = qc.getQueryData<Competitor[]>(qk.competitors())
      if (previous) {
        qc.setQueryData<Competitor[]>(
          qk.competitors(),
          previous.filter((c) => c.id !== id)
        )
      }
      return { previous }
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.previous) qc.setQueryData(qk.competitors(), ctx.previous)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: qk.competitors() })
    },
  })
}


