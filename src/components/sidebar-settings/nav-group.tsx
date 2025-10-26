"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"

import { type LucideIcon } from "lucide-react"

import {
  SidebarGroupContent,
  SidebarMenuButton,
  SidebarGroupLabel,
  SidebarGroup,
  SidebarMenu,
} from "@/components/ui/sidebar"

import { PATHS } from "@/lib/path"

type Item = {
  title: string
  icon: LucideIcon
}

type NavGroupProps = {
  label?: string | undefined
  items: Item[]
}

export default function NavGroup({ label, items }: NavGroupProps) {
  const pathname = usePathname()
  return (
    <SidebarGroup>
      <SidebarMenu>
        {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
        <SidebarGroupContent>
          {items.map((item) => {
            const url = item.title.toLowerCase().replace(/ /g, "-")
            return (
              <SidebarMenuButton
                key={item.title}
                asChild
                isActive={
                  url !== "#" &&
                  (pathname === url ||
                    pathname.startsWith(`${PATHS.SETTINGS}/${url}/`))
                }
              >
                <Link href={`${PATHS.SETTINGS}/${url}`}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            )
          })}
        </SidebarGroupContent>
      </SidebarMenu>
    </SidebarGroup>
  )
}
