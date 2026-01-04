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

  async function submitTicket({
    endpoint,
    formData,
  }: {
    endpoint: "/api/tickets/support" | "/api/tickets/feedback"
    formData: FormData
  }): Promise<
    | { ok: true }
    | { ok: false; message: string; retryAfterSeconds?: number; status?: number }
  > {
    const response = await fetch(endpoint, { method: "POST", body: formData })
    const json = (await response.json()) as
      | { ok: true }
      | { ok: false; message?: string; retryAfterSeconds?: number }

    if (!response.ok || !json.ok) {
      if (response.status === 401) {
        return { ok: false, message: "Please log in to submit a ticket.", status: 401 }
      }
      return {
        ok: false,
        message: json && !json.ok ? json.message || "Request failed" : "Request failed",
        retryAfterSeconds: json && !json.ok ? json.retryAfterSeconds : undefined,
        status: response.status,
      }
    }

    return { ok: true }
  }

  function handleSubmitFeedback(formData: FormData) {
    const t = toast.loading("Submitting feedback...")
    void submitTicket({ endpoint: "/api/tickets/feedback", formData })
      .then((result) => {
        if (!result.ok) {
          if (result.retryAfterSeconds) {
            toast.error(
              `Too many requests. Please try again in ${Math.ceil(
                result.retryAfterSeconds / 60
              )} minutes.`,
              { id: t }
            )
            return
          }
          toast.error(result.message, { id: t })
          return
        }

        toast.success(
          "Thank you! We read every message to help us improve our product.",
          { id: t }
        )
        setOpenFeedback(false)
      })
      .catch(() => {
        toast.error("Something went wrong. Please try again.", { id: t })
      })
  }

  function handleSubmitSupport(formData: FormData) {
    const t = toast.loading("Sending support request...")
    void submitTicket({ endpoint: "/api/tickets/support", formData })
      .then((result) => {
        if (!result.ok) {
          if (result.retryAfterSeconds) {
            toast.error(
              `Too many requests. Please try again in ${Math.ceil(
                result.retryAfterSeconds / 60
              )} minutes.`,
              { id: t }
            )
            return
          }
          toast.error(result.message, { id: t })
          return
        }

        toast.success("Got it! Our team will get back to you soon.", { id: t })
        setOpenSupport(false)
      })
      .catch(() => {
        toast.error("Something went wrong. Please try again.", { id: t })
      })
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
