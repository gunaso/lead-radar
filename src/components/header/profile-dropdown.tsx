"use client"

import { useRouter } from "next/navigation"

import {
  CircleArrowUp,
  CreditCard,
  Satellite,
  Building,
  LogOut,
  User,
} from "lucide-react"

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenu,
} from "@/components/ui/dropdown-menu"

import { getInitials } from "@/lib/utils"

type User = {
  name: string
  email: string
  avatar: string | null
}

export default function ProfileMenu({
  user,
  onOpenAccountDialog,
  onOpenWorkspaceDialog,
  onOpenPreferencesDialog,
}: {
  user: User
  onOpenAccountDialog: () => void
  onOpenWorkspaceDialog: () => void
  onOpenPreferencesDialog: () => void
}) {
  const router = useRouter()

  const handleLogout = () => {
    router.replace("/login?logout=true")

    const url = "/auth/signout"
    const blob = new Blob([], { type: "application/json" })

    if (!navigator.sendBeacon(url, blob)) {
      fetch(url, { method: "POST", keepalive: true }).catch(() => {})
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full focus-visible:outline-none">
        <AvatarWithFallback user={user} />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        side="bottom"
        align="end"
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <AvatarWithFallback user={user} />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="truncate text-xs">{user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <CircleArrowUp />
            Upgrade to Pro
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={onOpenAccountDialog}>
            <User />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={onOpenWorkspaceDialog}>
            <Building />
            Workspace
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={onOpenPreferencesDialog}>
            <Satellite />
            Preferences
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard />
            Billing
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function AvatarWithFallback({ user }: { user: User }) {
  return (
    <Avatar className="h-8 w-8 rounded-full">
      <AvatarImage
        className="rounded-full"
        src={user.avatar ?? ""}
        alt={user.name}
      />
      <AvatarFallback className="rounded-full bg-gradient-to-t from-[color-mix(in_oklch,var(--accent),var(--primary)_40%)] to-[color-mix(in_oklch,var(--accent),var(--primary)_10%)] text-accent-foreground font-bold text-xs">
        {getInitials(user.name)}
      </AvatarFallback>
    </Avatar>
  )
}
