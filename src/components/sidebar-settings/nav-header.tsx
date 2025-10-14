import Link from "next/link"

import { ChevronLeft } from "lucide-react"

import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar"

export default function NavHeader() {
  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem className="flex items-center justify-between gap-1">
          <SidebarMenuButton asChild className="w-auto p-1 pr-2">
            <Link href="/" className="flex items-center gap-1">
              <ChevronLeft className="size-4" />
              <span className="text-xs truncate">Go back</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  )
}
