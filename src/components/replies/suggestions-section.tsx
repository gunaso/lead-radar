"use client"

import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { GenerateButton } from "./generate-button"
import ReplyLoading from "./reply-loading"

import { type AssistantPhase } from "./phase"

type SuggestionsSectionProps = {
  phase: AssistantPhase
  bullets: string[]
  extraDirectionsOpen: boolean
  onToggleExtraDirections: () => void
  extraDirections: string
  onChangeExtraDirections: (value: string) => void
  onGenerate: () => void
  isGenerateDisabled: boolean
}

function SuggestionsSection({
  phase,
  bullets,
  extraDirectionsOpen,
  onToggleExtraDirections,
  extraDirections,
  onChangeExtraDirections,
  onGenerate,
  isGenerateDisabled,
}: SuggestionsSectionProps) {
  if (phase === "preparingBullets") {
    return (
      <ReplyLoading className="flex flex-col items-center justify-center gap-3 py-10" />
    )
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <div className="text-sm font-medium">High-impact reply angles</div>
        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
          {bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
        {phase === "answerReady" && (
          <p className="text-xs text-muted-foreground">
            Human-proof and adapt the answer before posting; tailored, authentic
            replies convert best.
          </p>
        )}
      </div>

      <Separator />

      <div className="space-y-2">
        <div className="text-xs text-muted-foreground">
          Non-AI responses often convert better. Consider crafting your own or
          generate a starter below and personalize it.
        </div>
        {!extraDirectionsOpen && (
          <GenerateButton
            onClick={onToggleExtraDirections}
            disabled={isGenerateDisabled}
          />
        )}

        {extraDirectionsOpen && (
          <div className="flex flex-col gap-1 items-end">
            <Textarea
              placeholder="Optional: tone, target audience, constraints, examples..."
              value={extraDirections}
              onChange={(e) => onChangeExtraDirections(e.target.value)}
              className="min-h-16"
            />
            <GenerateButton
              onClick={onGenerate}
              disabled={isGenerateDisabled}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export { SuggestionsSection }
