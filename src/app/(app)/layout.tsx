import { Suspense, type ReactElement, type ReactNode } from "react"

import { SideSlotProvider } from "@/components/side-slot/side-slot-context"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import SideSlotLayout from "@/components/side-slot/side-slot-layout"
import { HeaderProvider } from "@/components/header/header-context"
import Sidebar from "@/components/sidebar/sidebar"
import Header from "@/components/header/header"

export default function AppShellLayout({
  children,
}: Readonly<{ children: ReactNode }>): ReactElement {
  return (
    <SidebarProvider>
      <Sidebar />
      <SidebarInset>
        <HeaderProvider>
          <SideSlotProvider>
            <SideSlotLayout>
              <Suspense>
                <Header />
              </Suspense>
              {children}
            </SideSlotLayout>
          </SideSlotProvider>
        </HeaderProvider>
      </SidebarInset>
    </SidebarProvider>
  )
}
