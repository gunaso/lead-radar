"use client"

import type { ReactElement, ReactNode } from "react"
import { usePathname } from "next/navigation"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import SidebarSettings from "@/components/sidebar-settings/sidebar"

export default function AppShellLayout({
  children,
}: Readonly<{ children: ReactNode }>): ReactElement {
  const pathname = usePathname()
  const title = getSettingsTitleFromPath(pathname)
  return (
    <SidebarProvider>
      <SidebarSettings />
      <SidebarInset>
        <div className="flex flex-col items-center sm:my-16 my-4 sm:mx-10 mx-6">
          <div className="max-w-2xl w-full mx-auto">
            <div className="text-2xl font-medium">{title}</div>
            <div className="flex flex-col items-center gap-12 mt-10">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

function getSettingsTitleFromPath(pathname: string | null): string {
  if (!pathname) return "Settings"
  const parts = pathname.replace(/\/+$/, "").split("/").filter(Boolean)
  const settingsIndex = parts.indexOf("settings")
  const slug =
    settingsIndex >= 0 && parts.length > settingsIndex + 1
      ? parts[settingsIndex + 1]
      : "settings"
  const cleaned = decodeURIComponent(slug).replace(/-/g, " ")
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
}
