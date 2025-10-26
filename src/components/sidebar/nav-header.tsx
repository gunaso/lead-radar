import { useRouter } from "next/navigation"
import Link from "next/link"

import {
  ArrowUpCircle,
  ChevronDown,
  CreditCard,
  Settings,
  Search,
  LogOut,
} from "lucide-react"

import { WorkspaceAvatar } from "@/components/ui/avatar"
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

import type { Workspace } from "@/types/objects"

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
                  <WorkspaceAvatar
                    logo={workspace.logo}
                    company={workspace.company}
                    className="size-5 text-2xs/1"
                  />
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

function WorkspaceDropdown() {
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
    <DropdownMenuContent className="w-54" align="start">
      <DropdownMenuItem>
        <ArrowUpCircle />
        Upgrade to Pro
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <Link href="/settings/profile">
          <DropdownMenuItem>
            <Settings />
            Settings
          </DropdownMenuItem>
        </Link>
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
  )
}
