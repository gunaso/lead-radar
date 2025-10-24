"use client"

import { usePathname } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

import { FeedbackDialog } from "./feedback-dialog"
import { SupportDialog } from "./support-dialog"
import {
  SidebarGroupContent,
  SidebarMenuItem,
  SidebarGroup,
  SidebarMenu,
} from "@/components/ui/sidebar"

export default function NavSecondary() {
  const pathname = usePathname()

  // Local dialog controls
  const [openFeedback, setOpenFeedback] = useState(false)
  const [openSupport, setOpenSupport] = useState(false)

  // Simple client-only submit handlers. Replace with real API later.
  function handleSubmitFeedback(formData: FormData) {
    const optimisticMsg = "Submitting feedback..."
    const t = toast.loading(optimisticMsg)
    // Simulate immediate success UX
    setTimeout(() => {
      toast.success(
        "Thank you! We read every message to help us improve our product.",
        { id: t }
      )
      setOpenFeedback(false)
    }, 350)
  }

  function handleSubmitSupport(formData: FormData) {
    const optimisticMsg = "Sending support request..."
    const t = toast.loading(optimisticMsg)
    setTimeout(() => {
      toast.success("Got it! Our team will get back to you soon.", { id: t })
      setOpenSupport(false)
    }, 350)
  }

  return (
    <SidebarGroup className="mt-auto">
      <SidebarGroupContent>
        <SidebarMenu>
          {/* Support */}
          <SidebarMenuItem>
            <SupportDialog
              open={openSupport}
              onOpenChange={setOpenSupport}
              pathname={pathname}
              onSubmit={handleSubmitSupport}
            />
          </SidebarMenuItem>

          {/* Feedback */}
          <SidebarMenuItem>
            <FeedbackDialog
              open={openFeedback}
              onOpenChange={setOpenFeedback}
              pathname={pathname}
              onSubmit={handleSubmitFeedback}
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
