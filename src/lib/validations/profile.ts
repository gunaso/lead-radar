import { z } from "zod"

export const updateProfileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }).optional(),
  role: z.string().optional(),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>

export const profileStepSchema = z.object({
  step: z
    .number()
    .int({ message: "Invalid step value" })
    .min(0, { message: "Invalid step value" })
    .max(6, { message: "Invalid step value" }),
})

export type ProfileStepInput = z.infer<typeof profileStepSchema>


