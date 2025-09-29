"use client"
import type { ReactElement } from "react"

import { ShieldCheck, Sparkles, BookText } from "lucide-react"

export default function TipsStep(): ReactElement {
  return (
    <section className="space-y-4">
      <div className="rounded-lg border p-4">
        <h4 className="font-medium flex items-center gap-2">
          <ShieldCheck className="size-4" /> Follow community rules
        </h4>
        <p className="text-sm text-muted-foreground mt-1">
          Understand each subreddit's posting and self-promo rules to avoid
          bans.
        </p>
      </div>
      <div className="rounded-lg border p-4">
        <h4 className="font-medium flex items-center gap-2">
          <Sparkles className="size-4" /> Best practices for comments
        </h4>
        <p className="text-sm text-muted-foreground mt-1">
          Be specific, cite experience, and add value before linking your
          product.
        </p>
      </div>
      <div className="rounded-lg border p-4">
        <h4 className="font-medium flex items-center gap-2">
          <BookText className="size-4" /> What ranks higher in LLM search
        </h4>
        <p className="text-sm text-muted-foreground mt-1">
          High-signal answers with examples, sources, and consistent engagement
          get surfaced.
        </p>
      </div>
    </section>
  )
}
