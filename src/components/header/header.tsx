"use client"

import { type ReactElement, useState } from "react"
import Image from "next/image"

import { Rocket } from "lucide-react"

import { ShineBorder } from "@/components/ui/shine-border"
import AccountSettings from "./account-settings/dialog"
import WorkspaceSettings from "./workspace-settings"
import ProfileMenu from "./profile-dropdown"
import Preferences from "./preferences"
import Search from "./search"

import header from "@/assets/img/header.webp"

type AppHeaderProps = {
  search: string
  onSearchChange: (value: string) => void
}

export function Header({
  search,
  onSearchChange,
}: AppHeaderProps): ReactElement {
  const [preferencesDialogOpen, setPreferencesDialogOpen] = useState(false)
  const [workspaceDialogOpen, setWorkspaceDialogOpen] = useState(false)
  const [accountDialogOpen, setAccountDialogOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b bg-card backdrop-blur">
      <div className="mx-auto max-w-6xl w-full px-4 h-14 flex items-center justify-between gap-3">
        {/* Logo */}
        <div className="w-[200px]">
          <Image src={header} alt="header" height={30} />
        </div>

        <Search search={search} onSearchChange={onSearchChange} />

        <div className="flex items-center justify-end gap-4 w-[200px]">
          <UpgradeToPro /> {/* TODO: Only show this if user is on free plan */}
          <ProfileMenu
            user={{
              name: "John Doe",
              email: "john.doe@example.com",
              avatar: null,
            }}
            onOpenPreferencesDialog={() => setPreferencesDialogOpen(true)}
            onOpenWorkspaceDialog={() => setWorkspaceDialogOpen(true)}
            onOpenAccountDialog={() => setAccountDialogOpen(true)}
          />
        </div>
      </div>
      <Preferences
        open={preferencesDialogOpen}
        onOpenChange={setPreferencesDialogOpen}
      />
      <AccountSettings
        open={accountDialogOpen}
        onOpenChange={setAccountDialogOpen}
      />
      <WorkspaceSettings
        open={workspaceDialogOpen}
        onOpenChange={setWorkspaceDialogOpen}
      />
    </header>
  )
}

function UpgradeToPro() {
  return (
    <div className="relative rounded-lg hover:cursor-pointer active:scale-100 hover:scale-103 transition-transform">
      <ShineBorder
        shineColor={["#8B79F8", "#FF90A6", "var(--primary)"]}
        duration={10}
      />
      <span className=" flex items-center gap-1 rounded-lg py-1.5 px-2.5 border">
        <span className="text-sm">Upgrade to Pro</span>
        <Rocket className="size-4" strokeWidth={2} />
      </span>
    </div>
  )
}
