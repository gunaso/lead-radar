"use client"

import * as React from "react"

import {
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
  Select,
} from "@/components/ui/select"

import { cn } from "@/lib/utils"

type DisplaySelectOption = {
  value: string
  label: React.ReactNode
}

type DisplaySelectProps = {
  id?: string
  value: string
  onValueChange: (value: string) => void
  options: DisplaySelectOption[]
  placeholder?: string
  align?: "start" | "center" | "end"
  triggerClassName?: string
  contentClassName?: string
  itemClassName?: string
}

function DisplaySelect({
  id,
  value,
  onValueChange,
  options,
  placeholder,
  align = "end",
  triggerClassName,
  contentClassName,
  itemClassName,
}: DisplaySelectProps) {
  return (
    <Select id={id} value={value} onValueChange={onValueChange}>
      <SelectTrigger
        className={cn(
          "h-7! w-full px-1.5 text-xs [&_svg]:size-3.5 rounded-sm",
          triggerClassName
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent
        className={cn("max-h-64 w-38", contentClassName)}
        align={align}
      >
        {options.map((opt) => (
          <SelectItem
            key={opt.value}
            value={opt.value}
            className={cn("h-7 text-xs [&_svg]:size-3 w-full", itemClassName)}
          >
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export { DisplaySelect, type DisplaySelectProps, type DisplaySelectOption }
