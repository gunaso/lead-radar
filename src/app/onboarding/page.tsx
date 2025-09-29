"use client"
import { useMemo, useState, type ReactElement } from "react"

import { Check, ChevronLeft, ChevronRight } from "lucide-react"

import CompetitorsStep from "@/components/onboarding/competitors-step"
import SubredditsStep from "@/components/onboarding/subreddits-step"
import KeywordsStep from "@/components/onboarding/keywords-step"
import WelcomeStep from "@/components/onboarding/welcome-step"
import TipsStep from "@/components/onboarding/tips-step"
import { Button } from "@/components/ui/button"
import {
  CardDescription,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Card,
} from "@/components/ui/card"

import { useSubredditSearch } from "@/hooks/use-subreddit-search"
import type { Step } from "@/types/onboarding"

export default function OnboardingPage(): ReactElement {
  const [step, setStep] = useState<Step>(0)
  const [keywords, setKeywords] = useState<string[]>([])
  const [subreddits, setSubreddits] = useState<string[]>([])
  const [competitors, setCompetitors] = useState<string[]>([])

  const subredditSearch = useSubredditSearch({ active: step === 2 })

  const percent = useMemo(() => (step / 4) * 100, [step])
  const addSubreddit = (name: string) => {
    const tag = name.trim()
    if (!tag) return
    if (subreddits.includes(tag)) return
    setSubreddits([...subreddits, tag])
    subredditSearch.setQuery("")
  }

  const canContinue = useMemo(() => {
    if (step === 0) return true
    if (step === 1) return keywords.length > 0
    if (step === 2) return subreddits.length > 0
    if (step === 3) return competitors.length > 0
    if (step === 4) return true
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
            {step === 0 && <WelcomeStep />}
            {step === 1 && (
              <KeywordsStep keywords={keywords} setKeywords={setKeywords} />
            )}
            {step === 2 && (
              <SubredditsStep
                query={subredditSearch.query}
                setQuery={subredditSearch.setQuery}
                results={subredditSearch.results}
                searching={subredditSearch.searching}
                subreddits={subreddits}
                setSubreddits={setSubreddits}
                addSubreddit={addSubreddit}
              />
            )}
            {step === 3 && (
              <CompetitorsStep
                competitors={competitors}
                setCompetitors={setCompetitors}
              />
            )}
            {step === 4 && <TipsStep />}
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
