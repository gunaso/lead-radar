"use client"

import { type ReactElement, type ReactNode, useEffect, useState } from "react"

import { Label } from "@/components/ui/label"
import {
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
  Select,
} from "@/components/ui/select"

import { cn, generateInputId } from "@/lib/utils"

type Option = {
  value: string
  label?: string
}

type LabeledSelectProps = {
  label: string
  placeholder?: string
  value: string
  onValueChange: (value: string) => void
  options?: Option[]
  children?: ReactNode
  triggerClassName?: string
}

export default function LabeledSelect({
  label,
  placeholder,
  value,
  onValueChange,
  options,
  children,
  triggerClassName,
}: LabeledSelectProps): ReactElement {
  const [selectId, setSelectId] = useState<string>(generateInputId(label))

  useEffect(() => {
    setSelectId(generateInputId(label))
  }, [label])

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={selectId}>{label}</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger
          id={selectId}
          className={cn(
            "shadow-xs focus-visible:ring-[3px] focus-visible:border-ring focus-visible:ring-ring/50 rounded-md h-9 px-3 py-1",
            triggerClassName
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="rounded-md shadow-md">
          {children
            ? children
            : options?.map((opt) => (
                <SelectItem
                  className="py-1.5"
                  key={opt.value}
                  value={opt.value}
                >
                  {opt.label ?? opt.value}
                </SelectItem>
              ))}
        </SelectContent>
      </Select>
    </div>
  )
}
