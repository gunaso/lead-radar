/**
 * Validates if an email has the basic format requirements
 * Checks for @ symbol with text before/after and a dot after the @
 * Also ensures there's text before and after the dot
 * @param email - The email string to validate
 * @returns true if valid, false otherwise
 */
export function validateEmailFormat(email: string): boolean {
  if (!email.includes("@")) {
    return false
  }

  const [localPart, domainPart] = email.split("@")

  if (!localPart || localPart.length === 0) {
    return false
  }

  if (!domainPart || domainPart.length === 0) {
    return false
  }

  if (!domainPart.includes(".")) {
    return false
  }

  const lastDotIndex = domainPart.lastIndexOf(".")

  // Check if there's at least one character before the dot
  if (lastDotIndex === 0) {
    return false
  }

  // Check if there's at least one character after the dot
  if (lastDotIndex === domainPart.length - 1) {
    return false
  }

  return true
}

