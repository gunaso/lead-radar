import { useAuthNavigation } from "@/components/auth/auth-container"

interface AuthToggleLinkProps {
  text: string
  linkText: string
  targetPath: "/login" | "/signup" | "/forgot-password"
  emailValue?: string
  className?: string
}

/**
 * Reusable component for toggling between login and signup forms
 * Preserves the email value in the URL when switching between forms
 */
export function AuthToggleLink({
  text,
  linkText,
  targetPath,
  emailValue,
  className = "text-center text-sm text-muted-foreground",
}: AuthToggleLinkProps) {
  const { navigateWithAnimation } = useAuthNavigation()

  const handleClick = () => {
    const params = emailValue ? `?email=${encodeURIComponent(emailValue)}` : ""
    navigateWithAnimation(`${targetPath}${params}`)
  }

  return (
    <div className={className}>
      {text}{" "}
      <button
        type="button"
        onClick={handleClick}
        className="underline underline-offset-4 hover:text-foreground transition-colors"
      >
        {linkText}
      </button>
    </div>
  )
}
