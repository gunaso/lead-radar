import { type LucideProps } from "lucide-react"

import { Button } from "@/components/ui/button"

interface ProviderButtonProps {
  provider: string
  Icon: React.ComponentType<LucideProps>
  size?: number
}

/**
 * Button component for OAuth provider authentication
 */
export function ProviderButton({
  provider,
  Icon,
  size = 20,
}: ProviderButtonProps) {
  return (
    <Button
      variant="outline"
      type="button"
      className="w-full hover:cursor-pointer"
    >
      <Icon size={size} className="text-muted-foreground" />
      <span>Continue with {provider}</span>
    </Button>
  )
}
