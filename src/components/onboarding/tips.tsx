"use client"
import { type ReactElement, useState } from "react"

import {
  MessageCircleHeart,
  ShieldCheck,
  TextSearch,
  InfoIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"

export default function TipsStep(): ReactElement {
  return (
    <section className="space-y-2">
      <div className="flex flex-col gap-3">
        <TipCard
          icon={<ShieldCheck className="size-5" />}
          title="Follow the Culture, Not Just the Rules"
          description="Every subreddit has its own tone and taboos. Read the room before you post, authenticity earns more trust than self-promotion ever will."
        />
        <TipCard
          icon={<MessageCircleHeart className="size-5" />}
          title="Comment Like a Human, Not a Marketer"
          description="Share experiences, give honest help, and drop insights that make people think “this person knows their stuff“. Great comments naturally attract leads, no sales pitch needed."
        />
        <TipCard
          icon={<TextSearch className="size-5" />}
          title="How to Rank in AI Search"
          description="LLMs notice Reddit posts with substance. Answers that include examples, clear reasoning, and consistent engagement are the ones that surface in AI-generated results."
        />
      </div>
      <p className="text-sm text-muted-foreground text-center">
        Keep these in mind when you start exploring your feed,{" "}
        <span className="text-primary font-semibold">Prompted</span> will guide
        you to the right threads and help you craft replies that stand out.
      </p>
    </section>
  )
}

function TipCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}): ReactElement {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="rounded-lg border p-4">
      <h4 className="font-medium flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon} {title}
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
          <InfoIcon className="size-4" />
        </Button>
      </h4>
      {isOpen && (
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      )}
    </div>
  )
}
