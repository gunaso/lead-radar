"use client"

import type { ReactElement } from "react"

import {
  type LucideIcon,
  ChartColumn,
  Handshake,
  Megaphone,
  Sparkles,
} from "lucide-react"

export default function WelcomeStep(): ReactElement {
  return (
    <section className="flex flex-col gap-2 mt-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <FeatureCard
          Icon={Handshake}
          title="Get Leads Authentically"
          description="Instead of cold outreach, join discussions already full of your target audience. Offer helpful answers and subtly showcase your expertise."
        />
        <FeatureCard
          Icon={ChartColumn}
          title="Understand the Market"
          description="See what people love, hate, and ask about products like yours. Learn the real pain points your audience discusses daily."
        />
        <FeatureCard
          Icon={Megaphone}
          title="Build Visibility"
          description="Contribute to Reddit discussions in ways that get noticed, both by people and AI models that power modern search."
        />
        <FeatureCard
          Icon={Sparkles}
          title="Get Found by AI"
          description="LLMs pull from Reddit to shape their answers. Prompted helps you appear in the conversations that influence AI search rankings."
        />
      </div>
      <p className="text-center text-xs text-muted-foreground px-5">
        Ready to see where your brand fits in? Let’s set up your tracking to
        find the best conversations for you.
      </p>
    </section>
  )
}

function FeatureCard({
  Icon,
  title,
  description,
}: {
  Icon: LucideIcon
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col rounded-lg border p-4 gap-2">
      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon className="size-4" />
        </div>
        <div className="font-semibold text-muted-foreground">{title}</div>
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  )
}
