"use client"
import { useEffect, useMemo, useState, type ReactElement } from "react"
import { useRouter } from "next/navigation"

import { Check, ChevronLeft, ChevronRight } from "lucide-react"

import CompetitorsStep from "@/components/onboarding/competitors"
import SubredditsStep from "@/components/onboarding/subreddits"
import WorkspaceStep from "@/components/onboarding/workspace"
import KeywordsStep from "@/components/onboarding/keywords"
import WelcomeStep from "@/components/onboarding/welcome"
import TipsStep from "@/components/onboarding/tips"
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

const STEP_TITLES: Record<Step, string> = {
  0: "Welcome to Prompted",
  1: "Tell us about your company",
  2: "Add keywords",
  3: "Choose subreddits",
  4: "Add competitors",
  5: "Tips",
}

const STEP_DESCRIPTIONS: Record<Step, string> = {
  0: "Let's set up your personalized Reddit monitoring dashboard. Track discussions, analyze trends, and stay ahead of the conversation.",
  1: "Create a workspace for your company, to help us personalize suggestions and allowing you to invite your team to collaborate.",
  2: "Add keywords to track discussions.",
  3: "Choose subreddits to monitor.",
  4: "Add competitors to track discussions.",
  5: "Tips to help you get started.",
}

export default function OnboardingPage(): ReactElement {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState<Step>(0)
  const [workspace, setWorkspace] = useState({
    companyName: "",
    workspaceName: "",
    website: "",
    employees: "",
  })
  const [workspaceValidation, setWorkspaceValidation] = useState({
    nameValid: false,
    workspaceValid: false,
    websiteValid: false,
    employeesValid: false,
  })
  const [workspaceId, setWorkspaceId] = useState<number | null>(null)
  const [keywords, setKeywords] = useState<string[]>([])
  const [subreddits, setSubreddits] = useState<string[]>([])
  const [competitors, setCompetitors] = useState<string[]>([])
  const [skipValidation, setSkipValidation] = useState(false)

  const subredditSearch = useSubredditSearch({ active: step === 3 })

  // Fetch user profile and check onboarding status on mount
  useEffect(() => {
    const checkOnboardingStatus = async (): Promise<void> => {
      try {
        const response = await fetch("/api/profile")
        const data = await response.json()

        if (data.ok && data.profile) {
          const { onboarding, workspace: workspaceData } = data.profile

          // If onboarding is -1, user has already completed onboarding
          if (onboarding === -1) {
            router.push("/")
            return
          }

          // If onboarding step exists and is valid, set it
          if (onboarding > 0 && onboarding <= 5) {
            setStep(onboarding as Step)
          }

          // If workspace exists, populate the form
          if (workspaceData) {
            setWorkspaceId(workspaceData.id)
            setWorkspace({
              companyName: workspaceData.company || "",
              workspaceName: workspaceData.name || "",
              website: workspaceData.website || "",
              employees: workspaceData.employees || "",
            })
            // Mark existing fields as valid
            setWorkspaceValidation({
              nameValid: !!workspaceData.company,
              workspaceValid: !!workspaceData.name,
              websiteValid: !!workspaceData.website,
              employeesValid: !!workspaceData.employees,
            })
            setSkipValidation(true)
          }
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error)
      } finally {
        setLoading(false)
      }
    }

    checkOnboardingStatus()
  }, [router])

  const MAX_STEP = 5 as Step
  const TOTAL_STEPS = MAX_STEP + 1
  const percent = useMemo(() => (step / MAX_STEP) * 100, [step, MAX_STEP])
  const addSubreddit = (name: string) => {
    const tag = name.trim()
    if (!tag) return
    if (subreddits.includes(tag)) return
    setSubreddits([...subreddits, tag])
    subredditSearch.setQuery("")
  }

  const canContinue = useMemo(() => {
    if (step === 0) return true // Welcome
    if (step === 1) {
      // All required fields must be valid: company name, workspace name, and employees selected
      const { nameValid, workspaceValid, websiteValid } = workspaceValidation
      const hasEmployees = workspace.employees !== ""
      const websiteOptional = workspace.website.trim() === "" || websiteValid

      return nameValid && workspaceValid && websiteOptional && hasEmployees
    }
    if (step === 2) return keywords.length > 0
    if (step === 3) return subreddits.length > 0
    if (step === 4) return competitors.length > 0
    if (step === 5) return true
    return true
  }, [step, workspace, workspaceValidation, keywords, subreddits, competitors])

  const handleContinue = async (): Promise<void> => {
    const nextStep = (step + 1 > MAX_STEP ? MAX_STEP : step + 1) as Step

    // Handle workspace creation/update on step 1
    if (step === 1) {
      // Move to next step immediately (optimistic)
      setStep(nextStep)
      setSkipValidation(true)

      try {
        if (workspaceId) {
          // Update existing workspace
          await fetch("/api/workspace", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              workspaceId,
              companyName: workspace.companyName,
              workspaceName: workspace.workspaceName,
              website: workspace.website || null,
              employees: workspace.employees,
            }),
          })
        } else {
          // Create new workspace
          const response = await fetch("/api/workspace", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              companyName: workspace.companyName,
              workspaceName: workspace.workspaceName,
              website: workspace.website || null,
              employees: workspace.employees,
            }),
          })

          const data = await response.json()
          if (data.ok && data.workspace?.id) {
            setWorkspaceId(data.workspace.id)
          }
        }
      } catch (error) {
        console.error("Error with workspace:", error)
      }
    } else {
      // For other steps, just move forward
      setStep(nextStep)
    }

    // Update onboarding step in profile (optimistically in background)
    try {
      await fetch("/api/profile/step", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: nextStep }),
      })
    } catch (error) {
      console.error("Error updating onboarding step:", error)
    }
  }

  const handleFinish = async (): Promise<void> => {
    // Update workspace with all collected data and redirect
    window.location.href = "/"

    // Optimistically update in background
    if (workspaceId) {
      try {
        await fetch("/api/workspace", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            workspaceId,
            keywords,
            subreddits,
            competitors,
            onboardingComplete: true,
          }),
        })
      } catch (error) {
        console.error("Error updating workspace:", error)
      }
    }
  }

  const handleBack = (): void => {
    if (step > 0) {
      setStep((s) => (s - 1) as Step)
    }
  }

  // Show loading state while checking onboarding status
  if (loading) {
    return (
      <main className="min-h-dvh flex justify-center items-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-dvh flex justify-center p-4 pt-[10%]">
      <div className="w-full max-w-xl">
        {/* Top progress header */}
        <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
          <div>
            Step {step} of {MAX_STEP}
          </div>
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
            <CardTitle className="text-center text-2xl font-semibold text-primary">
              {STEP_TITLES[step]}
            </CardTitle>
            {STEP_DESCRIPTIONS[step] && (
              <CardDescription className="text-center text-sm text-muted-foreground mt-2">
                {STEP_DESCRIPTIONS[step]}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="flex-1">
            {step === 0 && <WelcomeStep />}
            {step === 1 && (
              <WorkspaceStep
                value={workspace}
                onChange={setWorkspace}
                onValidationChange={setWorkspaceValidation}
                skipValidation={skipValidation}
              />
            )}
            {step === 2 && (
              <KeywordsStep keywords={keywords} setKeywords={setKeywords} />
            )}
            {step === 3 && (
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
            {step === 4 && (
              <CompetitorsStep
                competitors={competitors}
                setCompetitors={setCompetitors}
              />
            )}
            {step === MAX_STEP && <TipsStep />}
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <Button variant="ghost" onClick={handleBack} disabled={step === 0}>
              <ChevronLeft className="size-4" /> Back
            </Button>

            {/* Step dots */}
            <div className="flex items-center justify-center gap-2">
              {Array.from({ length: TOTAL_STEPS }, (_, i) => i).map((i) => (
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

            {step < MAX_STEP ? (
              <Button
                onClick={handleContinue}
                disabled={!canContinue}
                className="min-w-32"
              >
                <span className="inline-flex items-center gap-2">
                  Continue <ChevronRight className="size-4" />
                </span>
              </Button>
            ) : (
              <Button
                onClick={handleFinish}
                disabled={!canContinue}
                className="min-w-32"
              >
                <span className="inline-flex items-center gap-2">
                  Finish <Check className="size-4" />
                </span>
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}
