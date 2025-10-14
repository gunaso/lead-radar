"use client"

import { CircleUserRound, Building, Unplug } from "lucide-react"

import { SidebarContent, Sidebar } from "@/components/ui/sidebar"
import NavSecondary from "@/components/sidebar/nav-secondary"
import NavHeader from "./nav-header"
import NavGroup from "./nav-group"

const navTracking = {
  label: undefined,
  items: [
    {
      title: "Profile",
      icon: CircleUserRound,
    },
    {
      title: "Workspace",
      icon: Building,
    },
    {
      title: "Integrations",
      icon: Unplug,
    },
  ],
}

export default function SidebarSettings({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <NavHeader />
      <SidebarContent>
        <NavGroup label={navTracking.label} items={navTracking.items} />
        <NavSecondary />
      </SidebarContent>
    </Sidebar>
  )
}
