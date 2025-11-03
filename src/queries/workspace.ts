"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import type { CompetitorInput } from "@/types/onboarding"
import { request } from "@/lib/api/client"
import { qk } from "@/lib/api/query-keys"

export type WorkspaceUpsertPayload = {
  workspaceId?: string | null
  companyName: string
  workspaceName: string
  website: string | null
  employees: string
}

export function useWorkspaceCompanyValidation() {
  return useMutation<{ ok: boolean; message?: string }, unknown, { name: string; signal?: AbortSignal }>({
    mutationFn: async ({ name, signal }) =>
      request<{ ok: boolean; message?: string }>(`/api/workspace/company?${new URLSearchParams({ companyName: name })}`, {
        method: "GET",
        signal,
      }),
  })
}

export function useWorkspaceNameValidation() {
  return useMutation<{ ok: boolean; message?: string }, unknown, { name: string; signal?: AbortSignal }>({
    mutationFn: async ({ name, signal }) =>
      request<{ ok: boolean; message?: string }>(`/api/workspace/name?${new URLSearchParams({ name })}`, {
        method: "GET",
        signal,
      }),
  })
}

export function useWorkspaceWebsiteValidation() {
  return useMutation<{ ok: boolean; message?: string; website?: string }, unknown, { website: string; signal?: AbortSignal }>({
    mutationFn: async ({ website, signal }) =>
      request<{ ok: boolean; message?: string; website?: string }>(`/api/workspace/website?${new URLSearchParams({ website })}`, {
        method: "GET",
        signal,
      }),
  })
}

export function useUpsertWorkspace() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: WorkspaceUpsertPayload) =>
      request<{ ok: boolean; workspace?: { id: string } }>("/api/workspace", {
        method: payload.workspaceId ? "PATCH" : "POST",
        body: JSON.stringify(payload.workspaceId ? {
          workspaceId: payload.workspaceId,
          companyName: payload.companyName,
          workspaceName: payload.workspaceName,
          website: payload.website,
          employees: payload.employees,
        } : {
          companyName: payload.companyName,
          workspaceName: payload.workspaceName,
          website: payload.website,
          employees: payload.employees,
        }),
      }),
    onMutate: async (_payload) => {
      await qc.cancelQueries({ queryKey: qk.profile() })
      const previous = qc.getQueryData(qk.profile())
      return { previous }
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.previous) qc.setQueryData(qk.profile(), ctx.previous)
    },
    onSettled: async () => {
      await qc.invalidateQueries({ queryKey: qk.profile() })
    },
  })
}

export function useScrapeWorkspace() {
  return useMutation<{ ok: boolean }, unknown, { workspaceId: string; website: string }>({
    mutationFn: async ({ workspaceId, website }) =>
      request<{ ok: boolean }>("/api/workspace/scrape", {
        method: "POST",
        body: JSON.stringify({ workspaceId, website }),
      }),
  })
}

export function useUpdateWorkspaceEntities() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: {
      workspaceId: string
      keywords?: string[]
      subreddits?: string[]
      subredditsDetails?: Array<{
        name: string
        title?: string | null
        description?: string | null
        description_reddit?: string | null
        created_utc?: number | null
        total_members?: number | null
      }>
      competitors?: Array<CompetitorInput | string>
      source?: "Youtube" | "Reddit" | "Twitter / X" | "Google Search" | "LLM Recommendation" | "A friend or colleague" | "Newsletter / Blog" | "Other"
      goal?: Array<
        | "Find new leads"
        | "Improve AI visibility"
        | "Monitor my industry / competitors"
        | "Understand audience pain points"
      >
      onboardingComplete?: boolean
    }) => request<{ ok: boolean }>("/api/workspace", {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
    onMutate: async (payload) => {
      await qc.cancelQueries({ queryKey: qk.profile() })
      const previous = qc.getQueryData<any>(qk.profile())
      if (previous && previous.profile?.workspace?.id === payload.workspaceId) {
        const next = { ...previous }
        const ws = { ...next.profile.workspace }
        if (Array.isArray(payload.keywords)) {
          ws.keywords = [...payload.keywords]
        }
        if (Array.isArray(payload.subreddits)) {
          const detailsByName = new Map(
            (payload.subredditsDetails || []).map((d) => [
              String((d?.name || '').replace(/^r\//i, '')).toLowerCase(),
              d,
            ])
          )
          ws.subreddits = payload.subreddits.map((n) => {
            const canonical = String(n).replace(/^r\//i, '')
            const d = detailsByName.get(canonical.toLowerCase())
            return {
              name: canonical.startsWith('r/') ? canonical : `r/${canonical}`,
              title: d?.title ?? null,
              description: d?.description ?? null,
              description_reddit: d?.description_reddit ?? null,
              // created_at here expects a date string; optimistic value omitted
              created_at: null,
              total_members: d?.total_members ?? null,
            }
          })
        }
        if (Array.isArray(payload.competitors)) {
          ws.competitors = payload.competitors.map((c) =>
            typeof c === 'string' ? { name: c, website: null } : { name: c.name, website: c.website ?? null }
          )
        }
        if (payload.source !== undefined) {
          ws.source = payload.source ?? null
        }
        if (payload.goal !== undefined) {
          ws.goal = Array.isArray(payload.goal) ? [...payload.goal] : null
        }
        next.profile = { ...next.profile, workspace: ws }
        qc.setQueryData(qk.profile(), next)
      }
      return { previous }
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.previous) qc.setQueryData(qk.profile(), ctx.previous)
    },
    onSettled: async () => {
      await qc.invalidateQueries({ queryKey: qk.profile() })
    },
  })
}


// Optimistic update for basic workspace fields used in settings dialog
export function useUpdateWorkspaceBasics() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: {
      workspaceId: string
      companyName: string
      website: string | null
      employees: string
    }) => request<{ ok: boolean }>("/api/workspace", {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
    onMutate: async (payload) => {
      await qc.cancelQueries({ queryKey: qk.profile() })
      const previous = qc.getQueryData<any>(qk.profile())
      if (previous && previous.profile?.workspace?.id === payload.workspaceId) {
        const next = { ...previous }
        next.profile = {
          ...next.profile,
          workspace: {
            ...next.profile.workspace,
            company: payload.companyName,
            website: payload.website,
            employees: payload.employees,
          },
        }
        qc.setQueryData(qk.profile(), next)
      }
      return { previous }
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.previous) qc.setQueryData(qk.profile(), ctx.previous)
    },
    onSettled: async () => {
      await qc.invalidateQueries({ queryKey: qk.profile() })
    },
  })
}


