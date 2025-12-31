import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { type ScoreType, type StatusType } from "@/types/reddit"
import { qk } from "@/lib/api/query-keys"

import {
  applyOptimisticStatusUpdate,
  applyOptimisticScoreUpdate,
  rollbackOptimisticUpdate,
  type SnapshotContext,
  type ItemType,
} from "@/hooks/use-item-update-optimistic"

export function useItemUpdate() {
  const queryClient = useQueryClient()

  const { mutate: updateScore } = useMutation({
    mutationFn: async ({
      id,
      type,
      score,
    }: {
      id: string
      type: ItemType
      score: ScoreType
    }) => {
      const endpoint = type === "post" ? `/api/posts/${id}/score` : `/api/comments/${id}/score`
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score }),
      })

      if (!response.ok) {
        throw new Error("Failed to update score")
      }
      return response.json()
    },
    onMutate: ({ id, type, score }) => applyOptimisticScoreUpdate(queryClient, { id, type, score }),
    onError: (_, __, context) => {
      if (context) {
        rollbackOptimisticUpdate(queryClient, context)
      }
      toast.error("Failed to update score")
    },
    onSuccess: () => {
      toast.success("Score updated")
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      queryClient.invalidateQueries({ queryKey: ["comments"] })
      if (variables.type === "post") {
        queryClient.invalidateQueries({ queryKey: qk.post(variables.id) })
      } else {
        queryClient.invalidateQueries({ queryKey: qk.comment(variables.id) })
      }
    },
  })

  const { mutate: updateStatus } = useMutation<
    unknown,
    unknown,
    { id: string; type: ItemType; status: StatusType },
    SnapshotContext
  >({
    mutationFn: async ({
      id,
      type,
      status,
    }: {
      id: string
      type: ItemType
      status: StatusType
    }) => {
      const endpoint = type === "post" ? `/api/posts/${id}/status` : `/api/comments/${id}/status`
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        throw new Error("Failed to update status")
      }
      return response.json()
    },
    onMutate: ({ id, type, status }) =>
      applyOptimisticStatusUpdate(queryClient, { id, type, status }),
    onError: (_, __, context) => {
      if (context) {
        rollbackOptimisticUpdate(queryClient, context)
      }
      toast.error("Failed to update status")
    },
    onSuccess: () => {
      toast.success("Status updated")
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      queryClient.invalidateQueries({ queryKey: ["comments"] })
      if (variables.type === "post") {
        queryClient.invalidateQueries({ queryKey: qk.post(variables.id) })
      } else {
        queryClient.invalidateQueries({ queryKey: qk.comment(variables.id) })
      }
    },
  })

  return {
    updateScore,
    updateStatus,
  }
}
