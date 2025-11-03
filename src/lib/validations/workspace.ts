import { z } from "zod"
/**
 * Validates if a company name meets format requirements
 * @param name - The company name to validate
 * @returns An object with ok (boolean) and message (string) if invalid
 */
export function validateCompanyNameFormat(
  name: string
): { ok: boolean; message?: string } {
  // Check minimum length
  if (name.length < 2) {
    return {
      ok: false,
      message: "Company name must be at least 2 characters long",
    }
  }

  // Check maximum length
  if (name.length > 100) {
    return {
      ok: false,
      message: "Company name must be less than 100 characters",
    }
  }

  // Check for valid characters (letters, numbers, spaces, and common punctuation)
  const validNamePattern = /^[a-zA-Z0-9\s\-'&.,()]+$/
  if (!validNamePattern.test(name)) {
    return { ok: false, message: "Company name contains invalid characters" }
  }

  // Check that it's not just spaces or special characters
  const hasLetterOrNumber = /[a-zA-Z0-9]/.test(name)
  if (!hasLetterOrNumber) {
    return {
      ok: false,
      message: "Company name must contain at least one letter or number",
    }
  }

  // Prevent names with excessive consecutive spaces
  if (/\s{3,}/.test(name)) {
    return {
      ok: false,
      message: "Company name has too many consecutive spaces",
    }
  }

  return { ok: true }
}

/**
 * Validates if a workspace name meets format requirements
 * @param name - The workspace name to validate
 * @returns An object with ok (boolean) and message (string) if invalid
 */
export function validateWorkspaceNameFormat(
  name: string
): { ok: boolean; message?: string } {
  // Check minimum length
  if (name.length < 2) {
    return {
      ok: false,
      message: "Workspace name must be at least 2 characters long",
    }
  }

  // Check maximum length
  if (name.length > 50) {
    return {
      ok: false,
      message: "Workspace name must be less than 50 characters",
    }
  }

  // Check for valid characters (letters, numbers, spaces, hyphens, underscores)
  const validNamePattern = /^[a-zA-Z0-9\s\-_]+$/
  if (!validNamePattern.test(name)) {
    return {
      ok: false,
      message:
        "Workspace name can only contain letters, numbers, spaces, hyphens, and underscores",
    }
  }

  // Check that it's not just spaces or special characters
  const hasLetterOrNumber = /[a-zA-Z0-9]/.test(name)
  if (!hasLetterOrNumber) {
    return {
      ok: false,
      message: "Workspace name must contain at least one letter or number",
    }
  }

  // Prevent names with excessive consecutive spaces
  if (/\s{3,}/.test(name)) {
    return {
      ok: false,
      message: "Workspace name has too many consecutive spaces",
    }
  }

  return { ok: true }
}

// Zod schemas for API inputs
export const createWorkspaceSchema = z.object({
  companyName: z.string().min(1, { message: "Company name is required" }).max(100),
  workspaceName: z.string().min(2, { message: "Workspace name must be at least 2 characters" }).max(50),
  website: z.string().url().nullable().optional().or(z.literal("")),
  employees: z.string().min(1),
})

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>

export const updateWorkspaceSchema = z.object({
  workspaceId: z.string().min(1),
  companyName: z.string().min(1).max(100).optional(),
  workspaceName: z.string().min(2).max(50).optional(),
  website: z.string().url().nullable().optional(),
  employees: z.string().optional(),
  // How did you hear about Prompted?
  source: z
    .union([
      z.enum([
        "Youtube",
        "Reddit",
        "Twitter / X",
        "Google Search",
        "LLM Recommendation",
        "A friend or colleague",
        "Newsletter / Blog",
        "Other",
      ]),
      // Allow a custom free-text value (e.g., when selecting Other and specifying)
      z.string().min(1).max(100),
    ])
    .optional(),
  // What do you want to achieve with Prompted? (multi-select)
  goal: z
    .array(
      z.enum([
        "Find new leads",
        "Improve AI visibility",
        "Monitor my industry / competitors",
        "Understand audience pain points",
      ])
    )
    .optional(),
  keywords: z.array(z.string()).optional(),
  subreddits: z.array(z.string()).optional(),
  subredditsDetails: z
    .array(
      z.object({
        name: z.string(),
        title: z.string().nullable().optional(),
        description: z.string().nullable().optional(),
        description_reddit: z.string().nullable().optional(),
        // Accept created_utc (unix seconds) from client; server maps to date
        created_utc: z.number().nullable().optional(),
        total_members: z.number().nullable().optional(),
      })
    )
    .optional(),
  competitors: z
    .array(
      z.union([
        z.string(),
        z.object({
          name: z.string().min(1),
          website: z.string().url().nullable().optional(),
        }),
      ])
    )
    .optional(),
  onboardingComplete: z.boolean().optional(),
})

export type UpdateWorkspaceInput = z.infer<typeof updateWorkspaceSchema>

