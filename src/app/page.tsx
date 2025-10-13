"use client"
import { type ReactElement } from "react"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import Sidebar from "@/components/sidebar/sidebar"
import Header from "@/components/header/header"

export default function Home(): ReactElement {
  return (
    <SidebarProvider>
      <Sidebar />
      <SidebarInset>
        <Header />
      </SidebarInset>
    </SidebarProvider>
  )
}
