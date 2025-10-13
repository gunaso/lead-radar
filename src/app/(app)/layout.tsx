import type { ReactElement, ReactNode } from "react"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import Sidebar from "@/components/sidebar/sidebar"
import Header from "@/components/header/header"
import { HeaderProvider } from "@/components/header/header-context"

export default function AppShellLayout({
  children,
}: Readonly<{ children: ReactNode }>): ReactElement {
  return (
    <SidebarProvider>
      <Sidebar />
      <SidebarInset>
        <HeaderProvider>
          <Header />
          {children}
        </HeaderProvider>
      </SidebarInset>
    </SidebarProvider>
  )
}
