import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { type ScoreType, type StatusType } from "@/types/reddit"

type ItemType = "post" | "comment"

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
    onSuccess: (_, variables) => {
      toast.success("Score updated")
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      queryClient.invalidateQueries({ queryKey: ["comments"] })
      if (variables.type === "post") {
          queryClient.invalidateQueries({ queryKey: ["post", variables.id] })
      }
    },
    onError: () => {
      toast.error("Failed to update score")
    },
  })

  const { mutate: updateStatus } = useMutation({
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
    onSuccess: (_, variables) => {
      toast.success("Status updated")
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      queryClient.invalidateQueries({ queryKey: ["comments"] })
       if (variables.type === "post") {
          queryClient.invalidateQueries({ queryKey: ["post", variables.id] })
      }
    },
    onError: () => {
      toast.error("Failed to update status")
    },
  })

  return {
    updateScore,
    updateStatus,
  }
}
