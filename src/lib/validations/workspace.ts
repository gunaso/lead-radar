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

