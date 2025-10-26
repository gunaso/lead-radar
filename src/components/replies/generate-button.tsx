import { WandSparkles } from "lucide-react"

import { Button } from "@/components/ui/button"

function GenerateButton({
  onClick,
  disabled = false,
}: {
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <Button size="sm" onClick={onClick} disabled={disabled} className="w-fit">
      <WandSparkles className="size-3.5" />
      Generate AI Answer
    </Button>
  )
}

export { GenerateButton }
