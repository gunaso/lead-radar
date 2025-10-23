"use client"

import { ButtonGroup } from "@/components/ui/button-group"
import { Button } from "@/components/ui/button"

import { cn } from "@/lib/utils"

type TabValue = "posts" | "comments"

export function PostsCommentsToggle({
  tab,
  onChange,
}: {
  tab: TabValue
  onChange: (next: TabValue) => void
}) {
  return (
    <ButtonGroup orientation="horizontal" aria-label="Posts/Comments controls">
      <Button
        variant="outline"
        size="sm"
        aria-pressed={tab === "posts"}
        className={cn(
          tab === "posts" ? "bg-card" : "bg-muted",
          "hover:bg-card"
        )}
        onClick={() => onChange("posts")}
      >
        Posts
      </Button>
      <Button
        variant="outline"
        size="sm"
        aria-pressed={tab === "comments"}
        className={cn(
          tab === "comments" ? "bg-card" : "bg-muted",
          "hover:bg-card"
        )}
        onClick={() => onChange("comments")}
      >
        Comments
      </Button>
    </ButtonGroup>
  )
}
