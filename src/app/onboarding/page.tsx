"use client"
import { useEffect, useMemo, useState, type ReactElement } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

import { Check, ChevronLeft, ChevronRight } from "lucide-react"

import WebsiteLoading from "@/components/onboarding/website-loading"
import WorkspaceStep from "@/components/onboarding/workspace"
import PersonalStep from "@/components/onboarding/personal"
import WelcomeStep from "@/components/onboarding/welcome"
import LoadingShapes from "@/components/loading-shapes"
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
import type { Step, CompetitorInput } from "@/types/onboarding"
import {
  useProfileQuery,
  useUpdateOnboardingStepMutation,
  useUpdateProfileMutation,
} from "@/queries/profile"
import {
  useScrapeWorkspace,
  useUpsertWorkspace,
  useUpdateWorkspaceEntities,
} from "@/queries/workspace"
import TrackingTabs, { type TrackingTabValue } from "@/components/onboarding/tracking-tabs"

const STEP_TITLES: Record<Step, string> = {
  0: "Welcome to Prompted",
  1: "Tell us about your company",
  2: "Tell us about yourself",
  3: "Choose what to track",
  4: "Choose what to track",
  5: "Choose what to track",
  6: "Tips",
}

const STEP_DESCRIPTIONS: Record<Step, string> = {
  0: "Let's set up your personalized Reddit monitoring dashboard. Track discussions, analyze trends, and stay ahead of the conversation.",
  1: "Create a workspace for your company, to help us personalize suggestions and allowing you to invite your team to collaborate.",
  2: "Help us understand your role so we can tailor your experience.",
  3: "Add keywords, subreddits, and competitors. Use the tabs below.",
  4: "Add keywords, subreddits, and competitors. Use the tabs below.",
  5: "Add keywords, subreddits, and competitors. Use the tabs below.",
  6: "Tips to help you get started.",
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
  const [personal, setPersonal] = useState({
    name: "",
    role: "",
  })
  const [personalValidation, setPersonalValidation] = useState({
    nameValid: false,
    roleValid: false,
  })
  const [workspaceId, setWorkspaceId] = useState<number | null>(null)
  const [keywords, setKeywords] = useState<string[]>([])
  const [subreddits, setSubreddits] = useState<string[]>([])
  // Cache for subreddit metadata keyed by canonical lowercase name (without r/)
  const [subredditDetailsByName, setSubredditDetailsByName] = useState<
    Record<
      string,
      {
        name: string
        title?: string | null
        description?: string | null
        description_reddit?: string | null
        created_utc?: number | null
        total_members?: number | null
      }
    >
  >({})
  const [competitors, setCompetitors] = useState<CompetitorInput[]>([])
  const [skipValidation, setSkipValidation] = useState(false)
  const [isScrapingWebsite, setIsScrapingWebsite] = useState(false)
  const [scrapingComplete, setScrapingComplete] = useState(false)
  const [showLoadingScreen, setShowLoadingScreen] = useState(false)
  const [previousWebsite, setPreviousWebsite] = useState("")

  const subredditSearch = useSubredditSearch({ active: step === 4 })
  const { data: profileData } = useProfileQuery()
  const updateStep = useUpdateOnboardingStepMutation()
  const updateProfile = useUpdateProfileMutation()
  const upsertWorkspace = useUpsertWorkspace()
  const scrapeWorkspace = useScrapeWorkspace()
  const updateWorkspaceEntities = useUpdateWorkspaceEntities()

  // Auto-advance to next step when scraping completes while showing loading screen
  useEffect(() => {
    if (showLoadingScreen && scrapingComplete && !isScrapingWebsite) {
      // Scraping just completed, move to next step
      const nextStep = 3 as Step
      setShowLoadingScreen(false)
      setStep(nextStep)

      // Update onboarding step in profile (optimistically in background)
      updateStep.mutate({ step: nextStep })
    }
  }, [showLoadingScreen, scrapingComplete, isScrapingWebsite, updateStep])

  // Hydrate state from profile query
  useEffect(() => {
    const data = profileData
    if (!data) return
    try {
      const { onboarding, workspace: workspaceData, name, role } = data.profile

      if (onboarding === -1) {
        router.push("/")
        return
      }

      if (onboarding > 0 && onboarding <= 6) {
        setStep(onboarding as Step)
      }

      if (workspaceData) {
        setWorkspaceId(workspaceData.id)
        setWorkspace({
          companyName: workspaceData.company || "",
          workspaceName: workspaceData.name || "",
          website: workspaceData.website || "",
          employees: workspaceData.employees || "",
        })
        if (
          Array.isArray(workspaceData.keywords) &&
          workspaceData.keywords.length > 0
        ) {
          setKeywords(workspaceData.keywords as string[])
        }
        // Hydrate previously selected subreddits into tags
        const subsRaw = workspaceData.subreddits ?? []
        if (Array.isArray(subsRaw)) {
          const subs = subsRaw
            .map((s) => (s?.name ? `r/${s.name}` : ""))
            .filter((s) => s.length > 0)
          if (subs.length > 0) setSubreddits(subs)
        }
        // Hydrate competitors if present
        const competitorsRaw = workspaceData.competitors ?? []
        if (Array.isArray(competitorsRaw) && competitorsRaw.length > 0) {
          const list = competitorsRaw
            .map((c) => ({
              name: (c?.name || "").trim(),
              website: (c?.website || "").trim() || null,
            }))
            .filter((c) => c.name.length > 0)
          if (list.length > 0) setCompetitors(list)
        }

        setPreviousWebsite(workspaceData.website || "")
        setWorkspaceValidation({
          nameValid: !!workspaceData.company,
          workspaceValid: !!workspaceData.name,
          websiteValid: !!workspaceData.website,
          employeesValid: !!workspaceData.employees,
        })
        setSkipValidation(true)
      }

      if (name || role) {
        setPersonal({ name: name || "", role: role || "" })
        setPersonalValidation({
          nameValid: !!name && name.length >= 2,
          roleValid: !!role,
        })
      }
    } finally {
      setLoading(false)
    }
  }, [profileData, router])

  const MAX_STEP = 6 as Step
  const TOTAL_STEPS = MAX_STEP + 1
  const percent = useMemo(() => (step / MAX_STEP) * 100, [step, MAX_STEP])
  const currentTrackingTab: TrackingTabValue | null =
    step === 3 ? "keywords" : step === 4 ? "subreddits" : step === 5 ? "competitors" : null

  const setTrackingTab = (tab: TrackingTabValue): void => {
    const map: Record<TrackingTabValue, Step> = {
      keywords: 3,
      subreddits: 4,
      competitors: 5,
    }
    const next = map[tab]
    if (next !== step) {
      setStep(next)
      updateStep.mutate({ step: next })
    }
  }
  const addSubreddit = (name: string) => {
    const raw = name.trim()
    if (!raw) return
    const normalized = `r/${raw.replace(/^r\//i, "").trim()}`
    const target = normalized.toLowerCase()
    setSubreddits((prev) => {
      const exists = prev.some((t) => t.toLowerCase() === target)
      if (exists) {
        // Toggle off if already selected (case-insensitive)
        return prev.filter((t) => t.toLowerCase() !== target)
      }
      return [...prev, normalized]
    })
    // Keep query as-is to keep dropdown open and context visible
  }

  // Helper to merge provided details into cache
  const upsertSubredditDetails = (
    input: Partial<{
      name: string
      title?: string | null
      description?: string | null
      description_reddit?: string | null
      created_utc?: number | null
      total_members?: number | null
    }>
  ) => {
    const key = (input.name || "").replace(/^r\//i, "").trim().toLowerCase()
    if (!key) return
    setSubredditDetailsByName((prev) => {
      const existing = prev[key] || { name: key }
      return {
        ...prev,
        [key]: {
          ...existing,
          // ensure canonical stored name without prefix
          name: key,
          title: input.title ?? existing.title ?? null,
          description: input.description ?? existing.description ?? null,
          description_reddit:
            input.description_reddit ?? existing.description_reddit ?? null,
          created_utc: input.created_utc ?? existing.created_utc ?? null,
          total_members: input.total_members ?? existing.total_members ?? null,
        },
      }
    })
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
    if (step === 2) {
      // Personal info must be valid
      return personalValidation.nameValid && personalValidation.roleValid
    }
    // For combined tracking step, allow continue at each mini-step if its own content is valid
    if (step === 3) return keywords.length > 0
    if (step === 4) return subreddits.length > 0
    if (step === 5) return competitors.length > 0 && competitors.every((c) => !!c.name?.trim())
    if (step === 6) return true
    return true
  }, [
    step,
    workspace,
    workspaceValidation,
    personalValidation,
    keywords,
    subreddits,
    competitors,
  ])

  const handleContinue = async (): Promise<void> => {
    const nextStep = (step + 1 > MAX_STEP ? MAX_STEP : step + 1) as Step

    // Handle workspace creation/update on step 1
    if (step === 1) {
      const currentWebsite = workspace.website.trim()
      const websiteChanged = currentWebsite !== previousWebsite
      const hasWebsite = currentWebsite !== ""

      setSkipValidation(true)

      try {
        let finalWorkspaceId = workspaceId

        const upsert = await upsertWorkspace.mutateAsync({
          workspaceId: workspaceId ?? undefined,
          companyName: workspace.companyName,
          workspaceName: workspace.workspaceName,
          website: workspace.website || null,
          employees: workspace.employees,
        })
        if (!finalWorkspaceId && upsert?.workspace?.id) {
          finalWorkspaceId = upsert.workspace.id
          setWorkspaceId(upsert.workspace.id)
        }

        // Start website scraping in the background (don't await)
        if (hasWebsite && websiteChanged && finalWorkspaceId) {
          setIsScrapingWebsite(true)
          setScrapingComplete(false)

          // Fire and forget - scraping happens in background
          scrapeWorkspace
            .mutateAsync({
              workspaceId: finalWorkspaceId,
              website: currentWebsite,
            })
            .then(() => {
              setPreviousWebsite(currentWebsite)
              setScrapingComplete(true)
              setIsScrapingWebsite(false)
            })
            .catch((error) => {
              console.error("Error scraping website:", error)
              setScrapingComplete(true)
              setIsScrapingWebsite(false)
            })
        }

        // Move to next step immediately (scraping happens in background)
        setStep(nextStep)
      } catch (error) {
        console.error("Error with workspace:", error)
      }
    } else if (step === 2) {
      // Handle personal info update on step 2
      try {
        await updateProfile.mutateAsync({
          name: personal.name,
          role: personal.role,
        })

        // Check if scraping is still in progress
        if (!scrapingComplete && isScrapingWebsite) {
          // Show loading screen while waiting for scraping to complete
          setShowLoadingScreen(true)
          return
        }

        // Scraping is done or wasn't needed, move to next step
        setStep(nextStep)
      } catch (error) {
        console.error("Error updating profile:", error)
      }
    } else {
      // For other steps (3–5), save optimistically in background then advance immediately
      if (workspaceId) {
        try {
          if (step === 3) {
            updateWorkspaceEntities.mutate({ workspaceId, keywords })
          } else if (step === 4) {
            // Normalize subreddit names and send any cached details; avoid refetching
            const normalized = subreddits
              .map((s) => s.replace(/^r\//i, "").trim())
              .filter(Boolean)
            const subredditsDetails = normalized
              .map((n) => subredditDetailsByName[n.toLowerCase()])
              .filter(Boolean)
              .map((d) => ({
                name: d.name,
                title: d.title ?? null,
                description: d.description ?? null,
                description_reddit: d.description_reddit ?? null,
                created_utc: d.created_utc ?? null,
                total_members: d.total_members ?? null,
              }))
            updateWorkspaceEntities.mutate({
              workspaceId,
              subreddits: normalized,
              subredditsDetails,
            })
          } else if (step === 5) {
            updateWorkspaceEntities.mutate({
              workspaceId,
              competitors,
            })
          }
        } catch (error) {
          console.error("Error saving step data:", error)
        }
      }

      setStep(nextStep)
    }

    // Update onboarding step in profile (optimistically in background)
    try {
      updateStep.mutate({ step: nextStep })
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
        // Prepare subreddit payload using cached details
        const normalized = subreddits
          .map((s) => s.replace(/^r\//i, "").trim())
          .filter(Boolean)
        const subredditsDetails = normalized
          .map((n) => subredditDetailsByName[n.toLowerCase()])
          .filter(Boolean)
          .map((d) => ({
            name: d.name,
            title: d.title ?? null,
            description: d.description ?? null,
            description_reddit: d.description_reddit ?? null,
            created_utc: d.created_utc ?? null,
            total_members: d.total_members ?? null,
          }))

        await updateWorkspaceEntities.mutateAsync({
          workspaceId,
          keywords,
          subreddits: normalized,
          subredditsDetails,
          competitors,
          onboardingComplete: true,
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
      <div className="flex items-center justify-center h-dvh background-gradient">
        <LoadingShapes className="size-10" />
      </div>
    )
  }

  return (
    <main className="background-gradient min-h-dvh flex justify-center p-4 pt-[10%]">
      <div className="w-full max-w-xl">
        {/* Top progress header */}
        <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
          <div>
            Step {step} of {MAX_STEP}
          </div>
          <div>{Math.round(percent)}% Complete</div>
        </div>
        <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
            }}
          />
        </div>

        <motion.div
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            layout: { duration: 0.3, ease: "easeOut" },
            opacity: { duration: 0.3 },
            y: { duration: 0.3 },
          }}
        >
          <Card className="mx-auto flex flex-col min-h-[50dvh] shadow-xl">
            {showLoadingScreen ? (
              <WebsiteLoading />
            ) : (
              <>
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
                  <>
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
                      <PersonalStep
                        value={personal}
                        onChange={setPersonal}
                        onValidationChange={setPersonalValidation}
                      />
                    )}
                    {step >= 3 && step <= 5 && currentTrackingTab && (
                      <TrackingTabs
                        value={currentTrackingTab}
                        onValueChange={setTrackingTab}
                        keywords={keywords}
                        setKeywords={setKeywords}
                        query={subredditSearch.query}
                        setQuery={subredditSearch.setQuery}
                        results={subredditSearch.results}
                        searching={subredditSearch.searching}
                        subreddits={subreddits}
                        setSubreddits={setSubreddits}
                        addSubreddit={addSubreddit}
                        upsertDetails={upsertSubredditDetails}
                        competitors={competitors}
                        setCompetitors={setCompetitors}
                        isKeywordsDone={keywords.length > 0}
                        isSubredditsDone={subreddits.length > 0}
                        isCompetitorsDone={
                          competitors.length > 0 &&
                          competitors.every((c) => !!c.name?.trim())
                        }
                      />
                    )}
                    {step === MAX_STEP && <TipsStep />}
                  </>
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    onClick={handleBack}
                    disabled={step === 0 || showLoadingScreen}
                  >
                    <ChevronLeft className="size-4" /> Back
                  </Button>

                  {/* Step dots - keep but prevent skipping ahead beyond current */}
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
                      disabled={!canContinue || showLoadingScreen}
                      className="min-w-32"
                    >
                      <span className="inline-flex items-center gap-2">
                        Continue <ChevronRight className="size-4" />
                      </span>
                    </Button>
                  ) : (
                    <Button
                      onClick={handleFinish}
                      disabled={!canContinue || showLoadingScreen}
                      className="min-w-32"
                    >
                      <span className="inline-flex items-center gap-2">
                        Finish <Check className="size-4" />
                      </span>
                    </Button>
                  )}
                </CardFooter>
              </>
            )}
          </Card>
        </motion.div>
      </div>
    </main>
  )
}
