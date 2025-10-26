import {
  MessageCircleDashed,
  MessageCircleHeart,
  MessageCircle,
  Ellipsis,
  Flame,
} from "lucide-react"

import { GenericDropdown } from "@/components/ui/dropdown-menu"

import { type ScoreType } from "@/types/reddit"
import { cn } from "@/lib/utils"

type ScoreDropdownProps = {
  initialScore?: ScoreType
  onScoreChange?: (score: ScoreType) => void
  showLabelInTrigger?: boolean
}

function ScoreDropdown({
  initialScore = "Medium",
  onScoreChange,
  showLabelInTrigger = false,
}: ScoreDropdownProps) {
  return (
    <GenericDropdown<ScoreType>
      initialValue={initialScore}
      options={["Prime", "High", "Medium", "Low"]}
      onValueChange={onScoreChange}
      renderIcon={(score, bigIcon) => (
        <ScoreIcon score={score} bigIcon={bigIcon} />
      )}
      showLabelInTrigger={showLabelInTrigger}
    />
  )
}

function ScoreIcon({
  score,
  bigIcon,
}: {
  score: ScoreType
  bigIcon?: boolean
}) {
  const size = bigIcon ? "size-4.5" : "size-4"

  if (score === "Prime") {
    return <Flame className={cn("text-primary", size)} fill="currentColor" />
  }
  if (score === "High") {
    return <MessageCircleHeart className={cn("text-muted-foreground", size)} />
  }
  if (score === "Medium") {
    return <MessageCircle className={cn("text-muted-foreground", size)} />
  }
  if (score === "Low") {
    return <MessageCircleDashed className={cn("text-muted-foreground", size)} />
  }
  return <Ellipsis className={cn("text-muted-foreground", size)} />
}

export { ScoreDropdown, ScoreIcon }
