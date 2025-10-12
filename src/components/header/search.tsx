"use client"

import { SearchIcon } from "lucide-react"

import { ShineBorder } from "@/components/ui/shine-border"
import { Input } from "@/components/ui/input"

export default function Search({
  search,
  onSearchChange,
}: {
  search: string
  onSearchChange: (value: string) => void
}) {
  return (
    <div className="relative max-w-3xs focus-within:max-w-md w-full transition-all rounded-full">
      <Input
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search across your workspace..."
        className="peer w-full pl-9 shadow-none bg-background rounded-full hover:bg-card transition-all focus:bg-card active:bg-card focus-visible:ring-0 focus-visible:outline-none focus-visible:border-border"
      />
      <ShineBorder
        shineColor={["var(--primary)"]}
        duration={10}
        className="opacity-0 peer-focus-visible:opacity-100 transition-opacity"
      />
      <span className="flex items-center justify-center pointer-events-none absolute size-7 left-1 top-1/2 -translate-y-1/2 rounded-full bg-card">
        <SearchIcon
          className="size-4 text-muted-foreground"
          strokeWidth={2.5}
        />
      </span>
    </div>
  )
}
