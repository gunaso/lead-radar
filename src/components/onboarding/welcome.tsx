"use client"

import type { ReactElement } from "react"

import { Target, Sparkles, ShieldCheck, BookText } from "lucide-react"

export default function WelcomeStep(): ReactElement {
  return (
    <section className="space-y-3">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs bg-secondary/40">
          <span className="text-rose-500">🚀</span> Get started in under 2
          minutes
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-lg border p-4">
          <div className="mb-2 inline-flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Target className="size-4" />
          </div>
          <div className="font-medium">Track Keywords</div>
          <p className="text-xs text-muted-foreground">
            Monitor specific terms and phrases across Reddit.
          </p>
        </div>
        <div className="rounded-lg border p-4">
          <div className="mb-2 inline-flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Sparkles className="size-4" />
          </div>
          <div className="font-medium">Follow Subreddits</div>
          <p className="text-xs text-muted-foreground">
            Stay updated with your target communities.
          </p>
        </div>
        <div className="rounded-lg border p-4">
          <div className="mb-2 inline-flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
            <ShieldCheck className="size-4" />
          </div>
          <div className="font-medium">Competitor Analysis</div>
          <p className="text-xs text-muted-foreground">
            Track what your competitors are discussing.
          </p>
        </div>
        <div className="rounded-lg border p-4">
          <div className="mb-2 inline-flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
            <BookText className="size-4" />
          </div>
          <div className="font-medium">Best Practices</div>
          <p className="text-xs text-muted-foreground">
            Learn how to optimize your Reddit presence.
          </p>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Ready to dive in? Let's configure your tracking preferences.
      </p>
    </section>
  )
}
