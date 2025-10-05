interface AuthHeaderProps {
  title: string
  className?: string
  hideName?: boolean
}

/**
 * Reusable header component for authentication forms
 * Provides consistent branding with the "Prompted" highlight
 */
export function AuthHeader({
  title,
  className = "flex items-center justify-center text-center",
  hideName = false,
}: AuthHeaderProps) {
  return (
    <div className={className}>
      <h1 className="text-2xl font-bold text-center">
        {title} {!hideName && <span className="text-primary">Prompted</span>}
      </h1>
    </div>
  )
}
