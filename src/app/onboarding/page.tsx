"use client"
import type { ReactElement } from "react"
import { useEffect, useMemo, useState } from "react"
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ShieldCheck,
  Sparkles,
  BookText,
  Target,
  Rocket,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { TagInput } from "@/components/tag-input"

// 4 steps: Welcome → Keywords → Subreddits → Competitors
type Step = 0 | 1 | 2 | 3 | 4

export default function OnboardingPage(): ReactElement {
  const [step, setStep] = useState<Step>(0)
  const [keywords, setKeywords] = useState<string[]>([])
  const [subreddits, setSubreddits] = useState<string[]>([])
  const [competitors, setCompetitors] = useState<string[]>([])
  // Subreddit search simulation
  const [subredditQuery, setSubredditQuery] = useState("")
  const [subredditResults, setSubredditResults] = useState<string[]>([])
  const [searching, setSearching] = useState(false)

  const percent = useMemo(() => (step / 4) * 100, [step])
  const addSubreddit = (name: string) => {
    const tag = name.trim()
    if (!tag) return
    if (subreddits.includes(tag)) return
    setSubreddits([...subreddits, tag])
    setSubredditQuery("")
  }

  // Fake API search for subreddits using intervals
  useEffect(() => {
    if (step !== 1) return
    if (!subredditQuery) {
      setSubredditResults([])
      setSearching(false)
      return
    }
    setSearching(true)
    setSubredditResults([])
    const all = [
      "r/sales",
      "r/CustomerSuccess",
      "r/martech",
      "r/marketing",
      "r/AskMarketing",
      "r/CRM",
      "r/SaaS",
      "r/startups",
      "r/SmallBusiness",
      "r/salesforce",
      "r/HubSpot",
      "r/zoho",
    ]
    const filtered = all.filter((s) =>
      s.toLowerCase().includes(subredditQuery.toLowerCase())
    )

    // Generate a few fun random CRM-themed results based on the query to simulate discovery
    const q = subredditQuery.toLowerCase().replace(/[^a-z0-9]/g, "")
    const suffixes = [
      "crm",
      "prospecting",
      "revops",
      "automation",
      "playbooks",
      "pipeline",
      "stack",
      "leaders",
      "ops",
    ]
    const prefixes = ["sales", "crm", "revops", "marketingops", "growth", "cs"]
    const randoms: string[] = []
    for (let i = 0; i < 8; i++) {
      const suffix = suffixes[Math.floor(Math.random() * suffixes.length)]
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
      const pattern =
        Math.random() > 0.5 ? `r/${q}${suffix}` : `r/${prefix}${q}`
      if (q && !randoms.includes(pattern)) randoms.push(pattern)
    }

    const combined = Array.from(new Set([...filtered, ...randoms])).slice(0, 12)
    let i = 0
    const interval = setInterval(() => {
      setSubredditResults((prev) => {
        if (i >= combined.length) {
          clearInterval(interval)
          setSearching(false)
          return prev
        }
        const next = [...prev, combined[i]]
        i += 1
        return next
      })
    }, 160)
    return () => {
      clearInterval(interval)
      setSearching(false)
    }
  }, [step, subredditQuery])

  const canContinue = useMemo(() => {
    if (step === 0) return true // Welcome step
    if (step === 1) return keywords.length > 0
    if (step === 2) return subreddits.length > 0
    if (step === 3) return competitors.length > 0
    if (step === 4) return true // Tips step, no gating
    return true
  }, [step, keywords, subreddits, competitors])

  return (
    <main className="min-h-dvh grid place-items-center p-4">
      <div className="w-full max-w-xl">
        {/* Top progress header */}
        <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
          <div>Step {step} of 4</div>
          <div>{Math.round(percent)}% Complete</div>
        </div>
        <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>

        <Card className="mx-auto flex flex-col min-h-[50dvh] shadow-xl">
          <CardHeader>
            <CardTitle>Get set up</CardTitle>
            <CardDescription>
              Track Reddit posts and comments by keywords, subreddits, and
              competitors.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            {step === 0 && (
              <section className="space-y-3">
                <div className="text-center space-y-4">
                  <h2 className="text-2xl font-semibold text-primary">
                    Welcome to Lead Radar
                  </h2>
                  <div className="text-sm text-muted-foreground max-w-xl mx-auto">
                    Let's set up your personalized Reddit monitoring dashboard.
                    Track discussions, analyze trends, and stay ahead of the
                    conversation.
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs bg-secondary/40">
                    <span className="text-rose-500">🚀</span> Get started in
                    under 2 minutes
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
            )}

            {step === 1 && (
              <section className="space-y-3">
                <Label>Which keywords should we track?</Label>
                <TagInput
                  placeholder="Add keyword and press Enter"
                  value={keywords}
                  onChange={setKeywords}
                  suggestions={[
                    "crm",
                    "sales pipeline",
                    "lead scoring",
                    "sales process",
                    "hubspot alternatives",
                    "salesforce integration",
                  ]}
                />
                <p className="text-xs text-muted-foreground">
                  We'll monitor new posts and comments containing these phrases.
                </p>
              </section>
            )}

            {step === 2 && (
              <section className="space-y-3">
                <Label>Which subreddits matter to you?</Label>
                <div className="relative">
                  <Input
                    value={subredditQuery}
                    onChange={(e) => setSubredditQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && subredditResults.length > 0) {
                        e.preventDefault()
                        addSubreddit(subredditResults[0])
                      }
                    }}
                    placeholder="Search subreddits (e.g. startups)"
                    aria-expanded={
                      (searching || subredditResults.length > 0) &&
                      !!subredditQuery
                    }
                    aria-controls="subreddit-results"
                    aria-haspopup="listbox"
                  />
                  {(searching || subredditResults.length > 0) &&
                    subredditQuery && (
                      <div
                        id="subreddit-results"
                        role="listbox"
                        className="absolute z-50 mt-2 w-full overflow-hidden rounded-md border bg-background shadow-md"
                      >
                        <ul className="max-h-64 overflow-auto py-1 text-sm">
                          {subredditResults.map((s) => (
                            <li key={s}>
                              <button
                                type="button"
                                className="flex w-full items-center justify-between px-3 py-2 text-left hover:bg-accent"
                                onClick={() => addSubreddit(s)}
                              >
                                <span>{s}</span>
                              </button>
                            </li>
                          ))}
                          {searching && subredditResults.length === 0 && (
                            <li className="px-3 py-2 text-muted-foreground inline-flex items-center gap-2">
                              <Loader2 className="size-3 animate-spin" />{" "}
                              Searching subreddits…
                            </li>
                          )}
                          {!searching && subredditResults.length === 0 && (
                            <li className="px-3 py-2 text-muted-foreground">
                              No results
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                </div>
                <TagInput
                  placeholder="e.g. r/sales"
                  value={subreddits}
                  onChange={setSubreddits}
                  suggestions={
                    subredditResults.length
                      ? subredditResults
                      : [
                          "r/sales",
                          "r/CustomerSuccess",
                          "r/martech",
                          "r/marketing",
                        ]
                  }
                />
                {searching && (
                  <p className="text-xs text-muted-foreground inline-flex items-center gap-2">
                    <Loader2 className="size-3 animate-spin" /> Searching
                    subreddits…
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  We'll prioritize activity from these communities.
                </p>
              </section>
            )}

            {step === 3 && (
              <section className="space-y-3">
                <Label>Who are your competitors?</Label>
                <TagInput
                  placeholder="Add competitor brands or products"
                  value={competitors}
                  onChange={setCompetitors}
                  suggestions={[
                    "Salesforce",
                    "HubSpot",
                    "Pipedrive",
                    "Zoho CRM",
                    "Freshsales",
                    "Close",
                  ]}
                />
                <p className="text-xs text-muted-foreground">
                  We'll highlight threads where they are mentioned so you can
                  respond.
                </p>
              </section>
            )}

            {step === 4 && (
              <section className="space-y-4">
                <div className="rounded-lg border p-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <ShieldCheck className="size-4" /> Follow community rules
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Understand each subreddit's posting and self-promo rules to
                    avoid bans.
                  </p>
                </div>
                <div className="rounded-lg border p-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <Sparkles className="size-4" /> Best practices for comments
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Be specific, cite experience, and add value before linking
                    your product.
                  </p>
                </div>
                <div className="rounded-lg border p-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <BookText className="size-4" /> What ranks higher in LLM
                    search
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    High-signal answers with examples, sources, and consistent
                    engagement get surfaced.
                  </p>
                </div>
              </section>
            )}
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => setStep((s) => (s > 0 ? ((s - 1) as Step) : s))}
              disabled={step === 0}
            >
              <ChevronLeft className="size-4" /> Back
            </Button>

            {/* Step dots */}
            <div className="flex items-center justify-center gap-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <button
                  key={i}
                  aria-label={`Go to step ${i + 1}`}
                  aria-current={step === i}
                  className={
                    "size-2.5 rounded-full transition-colors " +
                    (step === i ? "bg-primary" : "bg-muted")
                  }
                  onClick={() => {
                    if (i <= step) setStep(i as Step)
                  }}
                />
              ))}
            </div>

            {step < 4 ? (
              <Button
                onClick={() =>
                  setStep((s) => (s + 1 > 4 ? 4 : ((s + 1) as Step)))
                }
                disabled={!canContinue}
                className="min-w-32"
              >
                <span className="inline-flex items-center gap-2">
                  Continue <ChevronRight className="size-4" />
                </span>
              </Button>
            ) : (
              <Button asChild>
                <a href="/">
                  Finish <Check className="ml-2 size-4" />
                </a>
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}
