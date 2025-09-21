import type { ReactElement } from "react"
import { useCallback, useMemo, useState } from "react"
import { X, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export type TagInputProps = {
  label?: string
  placeholder?: string
  value: string[]
  onChange: (next: string[]) => void
  suggestions?: string[]
  className?: string
}

export function TagInput({
  placeholder,
  value,
  onChange,
  suggestions = [],
  className,
}: TagInputProps): ReactElement {
  const [draft, setDraft] = useState("")

  const normalizedSuggestions = useMemo(
    () => suggestions.filter((s) => !value.includes(s)),
    [suggestions, value]
  )

  const add = useCallback(
    (tag: string) => {
      const t = tag.trim()
      if (!t) return
      if (value.includes(t)) return
      onChange([...value, t])
      setDraft("")
    },
    [onChange, value]
  )

  const remove = useCallback(
    (tag: string) => {
      onChange(value.filter((t) => t !== tag))
    },
    [onChange, value]
  )

  return (
    <div className={cn("w-full", className)}>
      <div className="flex flex-wrap gap-2">
        {value.map((tag) => (
          <Badge
            key={tag}
            className="gap-1 bg-primary/10 text-primary border-primary/20"
          >
            {tag}
            <button
              aria-label={`remove ${tag}`}
              className="ml-1 rounded-full p-0.5 hover:bg-primary/20"
              onClick={() => remove(tag)}
            >
              <X className="size-3" />
            </button>
          </Badge>
        ))}
      </div>
      <div className="mt-2 flex items-center gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault()
              add(draft)
            }
            if (e.key === "Backspace" && draft.length === 0 && value.length) {
              remove(value[value.length - 1])
            }
          }}
          placeholder={placeholder}
        />
        <button
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          onClick={() => add(draft)}
        >
          <Plus className="size-4" /> Add
        </button>
      </div>
      {normalizedSuggestions.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {normalizedSuggestions.slice(0, 6).map((s) => (
            <button
              key={s}
              className="rounded-full border px-2.5 py-1 text-xs text-muted-foreground hover:bg-accent"
              onClick={() => add(s)}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
