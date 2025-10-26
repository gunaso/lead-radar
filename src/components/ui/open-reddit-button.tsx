import Link from "next/link"

import { SquareArrowOutUpRight } from "lucide-react"

import { Button } from "@/components/ui/button"

function OpenRedditButton({ url }: { url: string }) {
  return (
    <Link href={`https://www.reddit.com${url}`} target="_blank">
      <Button
        variant="ghost"
        size="sm"
        className="text-xs text-muted-foreground hover:text-foreground"
      >
        Open on Reddit <SquareArrowOutUpRight className="size-3.5" />
      </Button>
    </Link>
  )
}

export { OpenRedditButton }
