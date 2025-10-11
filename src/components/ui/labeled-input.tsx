"use client"

import {
  type ComponentProps,
  type ReactElement,
  useEffect,
  useState,
} from "react"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

import { generateInputId } from "@/lib/utils"

type LabeledInputProps = {
  label: string
  inputClassName?: string
  hideLabel?: boolean
} & Omit<ComponentProps<typeof Input>, "id" | "className">

export default function LabeledInput({
  label,
  inputClassName,
  hideLabel,
  ...inputProps
}: LabeledInputProps): ReactElement {
  const [inputId, setInputId] = useState<string>(generateInputId(label))

  useEffect(() => {
    setInputId(generateInputId(label))
  }, [label])

  return (
    <div className="flex flex-col gap-1.5">
      {!hideLabel && <Label htmlFor={inputId}>{label}</Label>}
      <Input id={inputId} className={inputClassName} {...inputProps} />
    </div>
  )
}
