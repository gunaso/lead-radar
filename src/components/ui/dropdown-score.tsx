import {
  MessageCircleDashed,
  MessageCircleHeart,
  MessageCircle,
  Ellipsis,
  Flame,
} from "lucide-react"

import { GenericDropdown } from "@/components/ui/dropdown-menu"

type Score = "Prime" | "High" | "Medium" | "Low"

type ScoreDropdownProps = {
  initialScore?: Score
  onScoreChange?: (score: Score) => void
}

function ScoreDropdown({
  initialScore = "Medium",
  onScoreChange,
}: ScoreDropdownProps) {
  return (
    <GenericDropdown<Score>
      initialValue={initialScore}
      options={["Prime", "High", "Medium", "Low"]}
      onValueChange={onScoreChange}
      renderIcon={(score) => <ScoreIcon score={score} />}
    />
  )
}

function ScoreIcon({ score }: { score: Score }) {
  if (score === "Prime") {
    return <Flame className="text-primary size-4" fill="currentColor" />
  }
  if (score === "High") {
    return <MessageCircleHeart className="text-muted-foreground size-4" />
  }
  if (score === "Medium") {
    return <MessageCircle className="text-muted-foreground size-4" />
  }
  if (score === "Low") {
    return <MessageCircleDashed className="text-muted-foreground size-4" />
  }
  return <Ellipsis className="text-muted-foreground size-4" />
}

export { ScoreDropdown, ScoreIcon, type Score }
