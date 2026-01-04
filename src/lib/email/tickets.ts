import { Resend } from "resend"

import type { TicketType } from "@/lib/api/rate-limit"

type EmailAttachment = {
  filename: string
  contentBase64: string
}

type BaseTicketEmail = {
  ticketType: TicketType
  ticketId: string
  userId: string
  userEmail: string
  userFullName?: string | null
  contextPath?: string | null
  attachment?: { name: string; type?: string | null; size?: number | null } | null
  attachmentFile?: EmailAttachment | null
}

type SupportTicketEmail = BaseTicketEmail & {
  category: string
  description: string
  steps?: string | null
}

type FeedbackTicketEmail = BaseTicketEmail & {
  category: string
  rating: number
  feedback: string
}

function getResendOrNull(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Missing RESEND_API_KEY")
    }
    console.warn("[tickets] Missing RESEND_API_KEY. Skipping ticket email send.")
    return null
  }
  return new Resend(apiKey)
}

function getSupportEmailToOrNull(): string | null {
  const supportEmail = process.env.SUPPORT_EMAIL
  if (!supportEmail) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Missing SUPPORT_EMAIL")
    }
    console.warn("[tickets] Missing SUPPORT_EMAIL. Skipping ticket email send.")
    return null
  }
  return supportEmail
}

function getFromEmail(): string {
  // Using Resend's default domain is convenient for local/dev.
  // In production you likely want a verified sender like "support@yourdomain.com".
  return process.env.TICKETS_FROM_EMAIL ?? "Prompted <onboarding@resend.dev>"
}

function formatAttachment(attachment: BaseTicketEmail["attachment"]): string {
  if (!attachment) return "none"
  const parts = [
    attachment.name,
    attachment.type ? `type=${attachment.type}` : null,
    typeof attachment.size === "number" ? `size=${attachment.size}` : null,
  ].filter(Boolean)
  return parts.join(", ")
}

export async function sendSupportTicketEmail(input: SupportTicketEmail): Promise<void> {
  const resend = getResendOrNull()
  const to = getSupportEmailToOrNull()
  if (!resend || !to) return

  const subject = `[Support] ${input.category} (${input.ticketId})`

  const html = `
    <p><strong>Type:</strong> support</p>
    <p><strong>Ticket:</strong> ${input.ticketId}</p>
    <p><strong>User:</strong> ${input.userId}</p>
    <p><strong>User full name:</strong> ${input.userFullName ?? "(not provided)"}</p>
    <p><strong>User email:</strong> ${input.userEmail}</p>
    <p><strong>Context path:</strong> ${input.contextPath ?? ""}</p>
    <p><strong>Category:</strong> ${input.category}</p>
    <br>
    <p><strong>Description:</strong></p>
    <p style="white-space: pre-wrap;">${input.description}</p>
    <br>
    <p><strong>Steps to reproduce:</strong></p>
    <p style="white-space: pre-wrap;">${input.steps?.trim() ? input.steps : "(none)"}</p>
    <br>
    <p><strong>Attachment:</strong> ${formatAttachment(input.attachment)}</p>
  `

  await resend.emails.send({
    from: getFromEmail(),
    to,
    subject,
    html,
    attachments: input.attachmentFile
      ? [{ filename: input.attachmentFile.filename, content: input.attachmentFile.contentBase64 }]
      : undefined,
  })
}

export async function sendFeedbackTicketEmail(input: FeedbackTicketEmail): Promise<void> {
  const resend = getResendOrNull()
  const to = getSupportEmailToOrNull()
  if (!resend || !to) return

  const subject = `[Feedback] ${input.category} (${input.ticketId})`

  const html = `
    <p><strong>Type:</strong> feedback</p>
    <p><strong>Ticket:</strong> ${input.ticketId}</p>
    <p><strong>User:</strong> ${input.userId}</p>
    <p><strong>User full name:</strong> ${input.userFullName ?? "(not provided)"}</p>
    <p><strong>User email:</strong> ${input.userEmail}</p>
    <p><strong>Context path:</strong> ${input.contextPath ?? ""}</p>
    <p><strong>Category:</strong> ${input.category}</p>
    <p><strong>Rating:</strong> ${input.rating}</p>
    <br>
    <p><strong>Feedback:</strong></p>
    <p style="white-space: pre-wrap;">${input.feedback}</p>
    <br>
    <p><strong>Attachment:</strong> ${formatAttachment(input.attachment)}</p>
  `

  await resend.emails.send({
    from: getFromEmail(),
    to,
    subject,
    html,
    attachments: input.attachmentFile
      ? [{ filename: input.attachmentFile.filename, content: input.attachmentFile.contentBase64 }]
      : undefined,
  })
}

