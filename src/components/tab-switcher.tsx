"use client"

import type { ReactElement } from "react"

import { cn } from "../lib/utils"

type TabKey = "posts" | "comments" | "watchlists"

type TabSwitcherProps = {
  activeTab: TabKey
  onTabChange: (tab: TabKey) => void
}

export function TabSwitcher({
  activeTab,
  onTabChange,
}: TabSwitcherProps): ReactElement {
  const tabs = [
    { key: "posts" as const, label: "Posts" },
    { key: "comments" as const, label: "Comments" },
    { key: "watchlists" as const, label: "Watchlists" },
  ]

  return (
    <div className="flex items-center gap-2 border-b pb-2">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm",
            activeTab === tab.key
              ? "bg-primary text-primary-foreground"
              : "hover:bg-accent"
          )}
          onClick={() => onTabChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
