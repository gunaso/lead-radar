"use client"

import { useCallback, useEffect, useState, useMemo, useRef } from "react"

import { X } from "lucide-react"

import { SuggestionsSection } from "./suggestions-section"
import { Separator } from "@/components/ui/separator"
import { EditorSection } from "./editor-section"
import { Button } from "@/components/ui/button"

import { type AssistantPhase } from "./phase"
import { cn } from "@/lib/utils"

export type ReplyAssistantProps = {
  redditItemUrl: string
  context?: {
    postTitle?: string
    subreddit?: string
    keywords?: string[]
    commentsSample?: string[]
  }
  className?: string
  onClose?: () => void
}

const FAKE_BULLETS: string[] = [
  "Acknowledge OP's specific pain point and mirror their wording",
  "Share 1 practical tip with brief steps (no fluff)",
  "Add 1 data point or example to build credibility",
  "Offer a short CTA that feels helpful, not salesy",
  "Invite a quick follow-up question to keep the thread active",
]

function buildFakeAnswer(bullets: string[]): string {
  return (
    `Hey there, really thoughtful discussion. ${bullets.length} quick angles I’d consider:\n\n` +
    bullets.map((b, i) => `${i + 1}. ${b}.`).join("\n") +
    "\n\nIf helpful, I can share a short checklist we use to make this repeatable."
  )
}

export function ReplyAssistant({
  redditItemUrl,
  context,
  className,
  onClose,
}: ReplyAssistantProps) {
  const [activeTextView, setActiveTextView] = useState<"ai" | "draft">("ai")
  const [phase, setPhase] = useState<AssistantPhase>("preparingBullets")
  const [extraDirectionsOpen, setExtraDirectionsOpen] = useState(false)
  const [draftText, setPreviousText] = useState<string | null>(null)
  const [extraDirections, setExtraDirections] = useState("")
  const [bullets, setBullets] = useState<string[]>([])
  const [editorText, setEditorText] = useState("")

  const editorRef = useRef<HTMLTextAreaElement | null>(null)
  const generateTimeoutRef = useRef<number | null>(null)

  // Phase 1 → Phase 2: simulate fetching bullets
  useEffect(() => {
    if (phase !== "preparingBullets") return
    const t = setTimeout(() => {
      setBullets(FAKE_BULLETS)
      setPhase("bulletsReady")
    }, 1800)
    return () => clearTimeout(t)
  }, [phase])

  // Generate AI answer
  const handleGenerate = useCallback(() => {
    if (editorText.trim()) {
      setPreviousText(editorText)
      setActiveTextView("ai")
    }
    setPhase("generatingAnswer")
    if (generateTimeoutRef.current !== null) {
      clearTimeout(generateTimeoutRef.current)
    }
    const t = window.setTimeout(() => {
      const txt = buildFakeAnswer(bullets)
      setEditorText(txt)
      setPhase("answerReady")
      // focus editor after content arrives
      requestAnimationFrame(() => editorRef.current?.focus())
    }, 3000)
    generateTimeoutRef.current = t
  }, [bullets, editorText])

  // Clear any pending generation timeout on unmount
  useEffect(() => {
    return () => {
      if (generateTimeoutRef.current !== null) {
        clearTimeout(generateTimeoutRef.current)
      }
    }
  }, [])

  const canToggle = useMemo(() => draftText !== null, [draftText])

  const displayText = useMemo(() => {
    if (!canToggle) return editorText
    return activeTextView === "ai" ? editorText : draftText ?? ""
  }, [activeTextView, canToggle, editorText, draftText])

  const isVisibleTextEmpty = useMemo(
    () => displayText.trim().length === 0,
    [displayText]
  )

  const setDisplayText = (value: string) => {
    if (activeTextView === "ai") setEditorText(value)
    else setPreviousText(value)
  }

  const handleCopyOpen = async () => {
    if (isVisibleTextEmpty) return
    const textToCopy = displayText
    try {
      await navigator.clipboard.writeText(textToCopy)
    } catch (_) {
      // ignore copy failure silently
    }
    if (redditItemUrl) {
      window.open(redditItemUrl, "_blank")
    }
  }

  return (
    <div
      className={cn("bg-card border rounded-lg p-4 w-full relative", className)}
    >
      {onClose && (
        <div className="absolute top-0.5 right-0.5 sm:top-2 sm:right-2 md:top-0.5 md:right-0.5 min-[55rem]:top-2 min-[55rem]:right-2 lg:top-0.5 lg:right-0.5 min-[80rem]:top-2 min-[80rem]:right-2">
          <Button
            size="iconSm"
            variant="ghost"
            aria-label="Close assistant"
            onClick={onClose}
          >
            <X className="size-4" />
          </Button>
        </div>
      )}
      {/* Content grid: editor left, bullets/controls right */}
      <div className="flex flex-col sm:flex-row md:flex-col min-[55rem]:flex-row lg:flex-col min-[80rem]:flex-row gap-4">
        <div className="w-full sm:w-1/2 md:w-full min-[55rem]:w-1/2 lg:w-full min-[80rem]:w-1/2 flex flex-col gap-2">
          <EditorSection
            phase={phase}
            canToggle={canToggle}
            activeTextView={activeTextView}
            onChangeActiveView={setActiveTextView}
            displayText={displayText}
            onChangeDisplayText={setDisplayText}
            isVisibleTextEmpty={isVisibleTextEmpty}
            editorRef={editorRef}
            onCopyOpen={handleCopyOpen}
          />
        </div>

        <Separator
          orientation="vertical"
          className="hidden sm:block md:hidden min-[55rem]:block lg:hidden min-[80rem]:block"
        />

        <div className="w-full sm:w-1/2 md:w-full min-[55rem]:w-1/2 lg:w-full min-[80rem]:w-1/2 space-y-3">
          <SuggestionsSection
            phase={phase}
            bullets={bullets}
            extraDirectionsOpen={extraDirectionsOpen}
            onToggleExtraDirections={() => setExtraDirectionsOpen((v) => !v)}
            extraDirections={extraDirections}
            onChangeExtraDirections={setExtraDirections}
            onGenerate={handleGenerate}
            isGenerateDisabled={phase === "generatingAnswer"}
          />
        </div>
      </div>
    </div>
  )
}

export default ReplyAssistant
