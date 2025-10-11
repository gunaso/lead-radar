import { ProviderButton } from "@/components/auth/provider-button"
import { AuthHeader } from "@/components/auth/auth-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { validateEmailFormat } from "@/lib/validations/email"

import { GoogleIcon, LinkedInIcon, MicrosoftIcon } from "@/assets/Icons"

interface ProvidersViewProps {
  email: string
  onEmailChange: (email: string) => void
  onContinue: () => void
}

/**
 * Initial login view showing OAuth providers and email input
 */
export function ProvidersView({
  email,
  onEmailChange,
  onContinue,
}: ProvidersViewProps) {
  const isEmailValid = validateEmailFormat(email)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && isEmailValid) {
      onContinue()
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8">
      <AuthHeader title="Welcome to" className="mb-5" />

      <div className="flex flex-col justify-center gap-4">
        <ProviderButton provider="Google" Icon={GoogleIcon} />
        <ProviderButton provider="Microsoft" Icon={MicrosoftIcon} size={16} />
        <ProviderButton provider="LinkedIn" Icon={LinkedInIcon} />
      </div>

      <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
        <span className="bg-card text-muted-foreground relative z-10 px-2">
          or
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button
          className="w-full"
          size="sm"
          disabled={!isEmailValid}
          onClick={onContinue}
        >
          Continue with email
        </Button>
      </div>
    </div>
  )
}
