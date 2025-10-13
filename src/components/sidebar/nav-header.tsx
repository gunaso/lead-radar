import {
  ArrowUpCircle,
  ChevronDown,
  CreditCard,
  Settings,
  Search,
  LogOut,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenuSeparator,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenu,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar"

import { getInitials } from "@/lib/utils"

type Workspace = {
  company: string
  logo: string | null
}

const workspace: Workspace = {
  company: "Acme Inc",
  logo: null,
}

export default function NavHeader() {
  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem className="flex items-center justify-between gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton asChild className="w-auto p-1">
                <span className="flex items-center gap-1">
                  <AvatarWithFallback workspace={workspace} />
                  <span className="text-xs font-semibold truncate">
                    {workspace.company}
                  </span>
                  <ChevronDown className="size-4" />
                </span>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <WorkspaceDropdown />
          </DropdownMenu>
          <SidebarMenuButton
            className="size-7 shrink-0 flex items-center justify-center"
            tooltip="Search"
          >
            <Search className="size-4" />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  )
}

function AvatarWithFallback({ workspace }: { workspace: Workspace }) {
  return (
    <Avatar className="size-5 rounded-sm">
      <AvatarImage
        className="rounded-sm"
        src={workspace.logo ?? ""}
        alt={workspace.company}
      />
      <AvatarFallback className="rounded-sm bg-gradient-to-t from-[color-mix(in_oklch,var(--accent),var(--primary)_40%)] to-[color-mix(in_oklch,var(--accent),var(--primary)_10%)] text-accent-foreground font-bold text-2xs/1">
        {getInitials(workspace.company)}
      </AvatarFallback>
    </Avatar>
  )
}

function WorkspaceDropdown() {
  return (
    <DropdownMenuContent className="w-54" align="start">
      <DropdownMenuItem>
        <ArrowUpCircle />
        Upgrade to Pro
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem>
          <Settings />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem>
          <CreditCard />
          Billing
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <LogOut />
        Log out
      </DropdownMenuItem>
    </DropdownMenuContent>
  )
}
