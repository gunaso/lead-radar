import { type RefObject } from "react"

import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import ReplyLoading from "./reply-loading"

import { type AssistantPhase } from "./phase"

type EditorSectionProps = {
  phase: AssistantPhase
  canToggle: boolean
  activeTextView: "ai" | "draft"
  onChangeActiveView: (view: "ai" | "draft") => void
  displayText: string
  onChangeDisplayText: (value: string) => void
  isVisibleTextEmpty: boolean
  editorRef: RefObject<HTMLTextAreaElement | null>
  onCopyOpen: () => void
}

function EditorSection({
  phase,
  canToggle,
  activeTextView,
  onChangeActiveView,
  displayText,
  onChangeDisplayText,
  isVisibleTextEmpty,
  editorRef,
  onCopyOpen,
}: EditorSectionProps) {
  if (phase === "generatingAnswer") {
    return (
      <div className="py-10">
        <ReplyLoading className="flex flex-col items-center justify-center gap-3" />
      </div>
    )
  }

  return (
    <>
      {canToggle && (
        <div className="flex gap-2 items-center text-xs">
          <span className="text-muted-foreground">Editor view:</span>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant={activeTextView === "ai" ? "secondary" : "outline"}
              onClick={() => onChangeActiveView("ai")}
            >
              AI Generated
            </Button>
            <Button
              size="sm"
              variant={activeTextView === "draft" ? "secondary" : "outline"}
              onClick={() => onChangeActiveView("draft")}
            >
              Draft
            </Button>
          </div>
        </div>
      )}

      <Textarea
        ref={editorRef}
        placeholder="Write your reply here, make sure to follow the reddit's rules and guidelines."
        value={displayText}
        onChange={(e) => onChangeDisplayText(e.target.value)}
        className="min-h-40"
      />

      <Button
        size="sm"
        onClick={onCopyOpen}
        disabled={isVisibleTextEmpty}
        className="w-fit"
      >
        Copy and Open on Reddit
      </Button>
    </>
  )
}

export { EditorSection }
