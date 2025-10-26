"use client"

import { usePathname } from "next/navigation"
import { type ReactNode } from "react"
import Link from "next/link"

import { type LucideIcon, ChevronRight } from "lucide-react"

import {
  CollapsibleTrigger,
  CollapsibleContent,
  Collapsible,
} from "@/components/ui/collapsible"
import {
  SidebarMenuButton,
  SidebarGroupLabel,
  SidebarGroup,
  SidebarMenu,
} from "@/components/ui/sidebar"

type Item = {
  title: string
  url: string
  icon: LucideIcon
}

type NavGroupProps = {
  label: string
  items: Item[]
}

export default function NavGroup({ label, items }: NavGroupProps) {
  const pathname = usePathname()
  return (
    <NavGroupContainer label={label}>
      {items.map((item) => (
        <SidebarMenuButton
          key={item.title}
          asChild
          isActive={pathname === item.url}
        >
          <Link href={item.url}>
            <item.icon />
            <span>{item.title}</span>
          </Link>
        </SidebarMenuButton>
      ))}
    </NavGroupContainer>
  )
}

export function NavGroupContainer({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="group">
            <SidebarGroupLabel className="gap-2">
              {label}{" "}
              <ChevronRight className="size-3! group-data-[state=open]:rotate-90 transition-transform duration-200 ease-in-out" />
            </SidebarGroupLabel>
          </CollapsibleTrigger>
          <CollapsibleContent className="flex flex-col gap-1">
            {children}
          </CollapsibleContent>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  )
}
