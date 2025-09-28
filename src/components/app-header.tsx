"use client"

import type { ReactElement } from "react"

import * as Popover from "@radix-ui/react-popover"
import { ListChecks, Search, Settings, Sparkles, User } from "lucide-react"

import { Button } from "./ui/button"
import { Input } from "./ui/input"

type AppHeaderProps = {
  search: string
  onSearchChange: (value: string) => void
}

export function AppHeader({
  search,
  onSearchChange,
}: AppHeaderProps): ReactElement {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/50">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center gap-3">
        <div className="inline-flex items-center gap-2 text-primary">
          <Sparkles className="size-5" />
          <span className="font-semibold">Lead Radar</span>
        </div>
        <div className="ml-4 flex-1">
          <div className="relative">
            <Input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search across all posts..."
              className="pl-9"
            />
            <Search className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
            <ListChecks className="size-4" /> Watchlists
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="size-4" />
          </Button>
          <Popover.Root>
            <Popover.Trigger asChild>
              <Button
                variant="secondary"
                size="sm"
                aria-label="Open profile menu"
              >
                <User className="size-4" />
              </Button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content
                side="bottom"
                align="end"
                className="z-50 w-56 rounded-md border bg-popover p-1 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out"
              >
                <div className="px-2 py-1.5 text-xs text-muted-foreground">
                  Account
                </div>
                <a
                  href="/onboarding"
                  className="flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                >
                  Settings
                </a>
                <form action="/auth/signout" method="post">
                  <button
                    type="submit"
                    className="w-full flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-left text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                  >
                    Logout
                  </button>
                </form>
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        </div>
      </div>
    </header>
  )
}
