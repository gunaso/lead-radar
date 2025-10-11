"use client"
import { useEffect, useState, type ReactElement } from "react"

import LabeledSelect from "@/components/ui/labeled-select"
import LabeledInput from "@/components/ui/labeled-input"
import { Button } from "@/components/ui/button"

import { cn } from "@/lib/utils"
import {
  type SourceOption,
  type GoalOption,
  SOURCE_OPTIONS,
  COMPANY_ROLES,
  GOAL_OPTIONS,
} from "@/types/onboarding"

type PersonalStepProps = {
  value: {
    name: string
    role: string
    source?: SourceOption
    goals?: GoalOption[]
  }
  onChange: (next: {
    name: string
    role: string
    source?: SourceOption
    goals?: GoalOption[]
  }) => void
  onValidationChange: (validation: {
    nameValid: boolean
    roleValid: boolean
    sourceValid: boolean
    goalsValid: boolean
  }) => void
}

export default function PersonalStep({
  value,
  onChange,
  onValidationChange,
}: PersonalStepProps): ReactElement {
  const [source, setSource] = useState<SourceOption | undefined>(value.source)
  const [goals, setGoals] = useState<GoalOption[]>(value.goals || [])
  const [otherSource, setOtherSource] = useState<string>("")
  const [name, setName] = useState(value.name)
  const [role, setRole] = useState<string>(value.role)

  // Sync local state when parent value changes (e.g., hydration from profile)
  useEffect(() => {
    if (value.name !== name) setName(value.name)
    if (value.role !== role) setRole(value.role)
    if (value.source !== source) setSource(value.source)
    // Shallow compare goals arrays
    const nextGoals = value.goals || []
    const sameGoals =
      goals.length === nextGoals.length &&
      goals.every((g, i) => g === nextGoals[i])
    if (!sameGoals) setGoals(nextGoals)
  }, [value.name, value.role, value.source, value.goals])

  // Validate name (at least 2 characters)
  const nameValid = name.trim().length >= 2
  // Validate role (must be selected)
  const roleValid = role !== "Other"
  // Validate source (must be chosen; if Other, require specification)
  const effectiveSource =
    source === "Other" && otherSource.trim().length > 0
      ? otherSource.trim()
      : source
  const sourceValid = Boolean(
    effectiveSource &&
      String(effectiveSource).trim().length > 0 &&
      effectiveSource !== ("Other" as SourceOption)
  )
  // Validate goals (at least one)
  const goalsValid = goals.length > 0

  // Bubble up state
  useEffect(() => {
    const effectiveSource =
      source === "Other" && otherSource.trim().length > 0
        ? otherSource.trim()
        : source
    onChange({
      name,
      role,
      source: effectiveSource as any,
      goals,
    })
  }, [name, role, source, goals, otherSource, onChange])

  // Bubble up validation state
  useEffect(() => {
    onValidationChange({ nameValid, roleValid, sourceValid, goalsValid })
  }, [nameValid, roleValid, sourceValid, goalsValid, onValidationChange])

  const handleGoal = (goal: GoalOption) => {
    setGoals((prev) =>
      prev.includes(goal) ? prev.filter((x) => x !== goal) : [...prev, goal]
    )
  }

  return (
    <section className="space-y-4">
      <LabeledInput
        label="Full name"
        type="text"
        placeholder="e.g. John Doe"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <LabeledSelect
        label="Role at company"
        placeholder="Select your role"
        value={role}
        onValueChange={setRole}
        options={COMPANY_ROLES.map((r) => ({ value: r }))}
      />

      <LabeledSelect
        label="How did you hear about Prompted?"
        placeholder="Select an option"
        value={source ?? ""}
        onValueChange={(v) => setSource(v as SourceOption)}
        options={SOURCE_OPTIONS.map((v) => ({ value: v }))}
      />

      {source === "Other" && (
        <LabeledInput
          label="Please specify"
          type="text"
          placeholder="Please specify"
          value={otherSource}
          onChange={(e) => setOtherSource(e.target.value)}
          hideLabel
        />
      )}

      <div className="space-y-2">
        <div className="text-sm font-medium">
          What do you want to achieve with Prompted?
        </div>
        <div className="grid grid-cols-2 gap-2">
          {GOAL_OPTIONS.map((g) => {
            const selected = goals.includes(g)
            return (
              <Button
                key={g}
                type="button"
                variant="outline"
                size="lg"
                className={cn(
                  "w-full justify-start text-left bg-card px-3! py-7 rounded-sm",
                  selected && "bg-primary/10 border-primary"
                )}
                onClick={() => handleGoal(g)}
                aria-pressed={selected}
              >
                {g}
              </Button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
