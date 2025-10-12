"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { request } from "@/lib/api/client"
import { qk } from "@/lib/api/query-keys"

export type ProfileWorkspace = {
  id: number
  name: string | null
  company: string | null
  website: string | null
  employees: string | null
  source?: string | null
  goal?: string[] | null
  keywords_suggested?: string[] | null
  keywords?: string[] | null
  subreddits?: Array<{
    name: string
    title?: string | null
    description?: string | null
    description_reddit?: string | null
    created_at?: string | null
    total_members?: number | null
  }> | null
  competitors?: Array<{
    name: string
    website?: string | null
  }> | null
}

export type ProfileData = {
  onboarding: number
  onboarded?: boolean
  workspace: ProfileWorkspace | null
  name: string
  role: string
}

export type ProfileResponse = {
  ok: boolean
  profile: ProfileData
}

export function useProfileQuery() {
  return useQuery<ProfileResponse>({
    queryKey: qk.profile(),
    queryFn: () => request<ProfileResponse>("/api/profile"),
  })
}

export function useUpdateProfileMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: { name?: string; role?: string }) => {
      return request<{ ok: boolean }>("/api/profile", {
        method: "PATCH",
        body: JSON.stringify(payload),
      })
    },
    onMutate: async (payload) => {
      await qc.cancelQueries({ queryKey: qk.profile() })
      const previous = qc.getQueryData<ProfileResponse>(qk.profile())
      if (previous) {
        qc.setQueryData<ProfileResponse>(qk.profile(), {
          ...previous,
          profile: {
            ...previous.profile,
            ...(payload.name !== undefined ? { name: payload.name } : {}),
            ...(payload.role !== undefined ? { role: payload.role } : {}),
          },
        })
      }
      return { previous }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        qc.setQueryData(qk.profile(), ctx.previous)
      }
    },
    onSettled: async () => {
      await qc.invalidateQueries({ queryKey: qk.profile() })
    },
  })
}

export function useUpdateOnboardingStepMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: { step: number }) => {
      return request<{ ok: boolean }>("/api/profile/step", {
        method: "PATCH",
        body: JSON.stringify(payload),
      })
    },
    // Optimistically update step
    onMutate: async ({ step }) => {
      await qc.cancelQueries({ queryKey: qk.profile() })
      const previous = qc.getQueryData<ProfileResponse>(qk.profile())
      if (previous) {
        qc.setQueryData<ProfileResponse>(qk.profile(), {
          ...previous,
          profile: { ...previous.profile, onboarding: step },
          ok: true,
        })
      }
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        qc.setQueryData(qk.profile(), context.previous)
      }
    },
    onSettled: async () => {
      await qc.invalidateQueries({ queryKey: qk.profile() })
    },
  })
}

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: async (payload: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
      return request<{ ok: boolean }>("/api/profile/password", {
        method: "POST",
        body: JSON.stringify(payload),
      })
    },
  })
}

export function useDeleteAccountMutation() {
  return useMutation({
    mutationFn: async () => {
      return request<{ ok: boolean }>("/api/account", {
        method: "DELETE",
      })
    },
  })
}
