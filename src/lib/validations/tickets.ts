import { z } from "zod"

const supportCategorySchema = z.enum([
  "technical",
  "billing",
  "account",
  "data",
  "other",
])

const feedbackCategorySchema = z.enum([
  "uiux",
  "feature",
  "ai",
  "performance",
  "other",
])

export const supportTicketSchema = z.object({
  category: supportCategorySchema,
  description: z.string().min(10, { message: "Issue description is too short" }),
  steps: z.string().optional(),
  email: z.string().email({ message: "Invalid email address" }),
  context_path: z.string().optional(),
  attachment: z
    .object({
      name: z.string(),
      type: z.string().optional(),
      size: z.number().int().nonnegative().optional(),
    })
    .optional(),
})

export type SupportTicketInput = z.infer<typeof supportTicketSchema>

export const feedbackTicketSchema = z.object({
  category: feedbackCategorySchema.default("other"),
  rating: z.number().int().min(1).max(5).default(3),
  feedback: z.string().min(10, { message: "Feedback is too short" }),
  email: z.string().email({ message: "Invalid email address" }),
  context_path: z.string().optional(),
  attachment: z
    .object({
      name: z.string(),
      type: z.string().optional(),
      size: z.number().int().nonnegative().optional(),
    })
    .optional(),
})

export type FeedbackTicketInput = z.infer<typeof feedbackTicketSchema>

