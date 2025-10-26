import type { SentimentType } from "@/types/reddit"
import { cn } from "@/lib/utils"

function Sentiment({
  sentiment,
  sm = false,
}: {
  sentiment: SentimentType
  sm?: boolean
}) {
  let colors = "bg-card"
  if (sentiment === "Positive") {
    colors = "bg-success/5 border-success/15 text-success"
  } else if (sentiment === "Neutral") {
    colors = "bg-muted-foreground/5 text-muted-foreground"
  } else if (sentiment === "Negative") {
    colors = "bg-destructive/5 border-destructive/15 text-destructive"
  }

  return (
    <span
      className={cn(
        "flex items-center text-xs rounded-full px-3 border truncate min-w-0 w-fit",
        sm ? "h-5.5" : "h-7",
        colors
      )}
    >
      {sentiment}
    </span>
  )
}

export { Sentiment }
