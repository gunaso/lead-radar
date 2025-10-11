import { toast } from "sonner"

import type { Step, GoalOption } from "@/types/onboarding"
import { normalizeWebsiteUrl } from "@/lib/api/url-utils"

export function useOnboardingCommands(deps: {
  state: any
  dispatch: React.Dispatch<any>
  updateStep: { mutate: (p: { step: number }) => void }
  updateProfile: { mutate: (p: { name?: string; role?: string }, opts?: any) => void }
  upsertWorkspace: { mutate: (p: any, opts?: any) => void }
  updateWorkspaceEntities: { mutate: (p: any, opts?: any) => void; mutateAsync: (p: any) => Promise<any> }
  scrapeWorkspace: { mutate: (p: any, opts?: any) => void }
}) {
  const { state, dispatch, updateStep, updateProfile, upsertWorkspace, updateWorkspaceEntities, scrapeWorkspace } = deps

  const setTrackingTab = (tab: "keywords" | "subreddits" | "competitors") => {
    const map: Record<string, Step> = { keywords: 3, subreddits: 4, competitors: 5 }
    const next = map[tab]
    if (next !== state.step) {
      dispatch({ type: "set_step", step: next })
      updateStep.mutate({ step: next })
    }
  }

  const handleBack = (): void => {
    if (state.step === 0) {
      dispatch({ type: "set_logout_dialog", show: true })
      return
    }
    if (state.step > 0) {
      const prev = (state.step - 1) as Step
      const current = state.step as Step
      dispatch({ type: "set_just_went_back", value: true })
      dispatch({ type: "set_step", step: prev })
      // Persist step so hydration doesn't push us forward again
      updateStep.mutate({ step: prev })
      // Allow hydration to ignore server step for a moment, then re-enable
      window.setTimeout(() => {
        dispatch({ type: "set_just_went_back", value: false })
      }, 600)
    }
  }

  const handleContinue = async (): Promise<void> => {
    const currentStep = state.step
    const nextStep = (state.step + 1 > state.MAX_STEP ? state.MAX_STEP : (state.step + 1)) as Step
    dispatch({ type: "set_step", step: nextStep })
    updateStep.mutate({ step: nextStep })

    if (currentStep === 1) {
      const currentWebsiteRaw = state.workspace.website.trim()
      const previousWebsiteRaw = (state.previousWebsite || "").trim()
      const normalizedCurrent = normalizeWebsiteUrl(currentWebsiteRaw) || ""
      const normalizedPrevious = normalizeWebsiteUrl(previousWebsiteRaw) || ""
      const websiteChanged = normalizedCurrent !== normalizedPrevious
      const hasWebsite = normalizedCurrent !== ""
      dispatch({ type: "set_skip_validation", skip: true })
      upsertWorkspace.mutate(
        {
          workspaceId: state.workspaceId ?? undefined,
          companyName: state.workspace.companyName,
          workspaceName: state.workspace.workspaceName,
          website: state.workspace.website || null,
          employees: state.workspace.employees,
        },
        {
          onSuccess: (upsert: any) => {
            let finalWorkspaceId = state.workspaceId ?? undefined
            if (!finalWorkspaceId && upsert?.workspace?.id) {
              finalWorkspaceId = upsert.workspace.id
              dispatch({ type: "set_workspace_id", workspaceId: upsert.workspace.id })
            }
            if (hasWebsite && websiteChanged && finalWorkspaceId) {
              dispatch({ type: "set_scraping_state", isScrapingWebsite: true, scrapingComplete: false })
              scrapeWorkspace.mutate(
                { workspaceId: finalWorkspaceId, website: normalizedCurrent },
                {
                  onSuccess: () => {
                    dispatch({ type: "set_previous_website", previousWebsite: normalizedCurrent })
                    dispatch({ type: "set_scraping_state", isScrapingWebsite: false, scrapingComplete: true })
                  },
                  onError: (error: unknown) => {
                    console.error("Error scraping website:", error)
                    dispatch({ type: "set_scraping_state", isScrapingWebsite: false, scrapingComplete: true })
                    toast.error("Failed to analyze website. You can retry later.")
                  },
                }
              )
            }
          },
          onError: (error: unknown) => {
            console.error("Error with workspace:", error)
            toast.error(error instanceof Error ? error.message : "Failed to save workspace.")
            dispatch({ type: "set_step", step: currentStep })
            updateStep.mutate({ step: currentStep })
          },
        }
      )
      return
    }

    if (currentStep === 2) {
      updateProfile.mutate(
        { name: state.personal.name, role: state.personal.role },
        {
          onError: (error: unknown) => {
            console.error("Error updating profile:", error)
            toast.error(error instanceof Error ? error.message : "Failed to save profile.")
            dispatch({ type: "set_step", step: currentStep })
            updateStep.mutate({ step: currentStep })
            dispatch({ type: "set_show_loading_screen", show: false })
          },
        }
      )

      if (state.workspaceId) {
        updateWorkspaceEntities.mutate(
          {
            workspaceId: state.workspaceId,
            source: state.personal.source as any,
            goal: state.personal.goals && state.personal.goals.length > 0 ? (state.personal.goals as GoalOption[]) : undefined,
          },
          {
            onError: (error: unknown) => {
              console.error("Error saving personal preferences:", error)
              toast.error(error instanceof Error ? error.message : "Failed to save your preferences.")
              dispatch({ type: "set_step", step: currentStep })
              updateStep.mutate({ step: currentStep })
              dispatch({ type: "set_show_loading_screen", show: false })
            },
          }
        )
      }

      if (state.isScrapingWebsite && !state.scrapingComplete) {
        dispatch({ type: "set_show_loading_screen", show: true })
      }
      return
    }

    if (state.workspaceId) {
      if (currentStep === 3) {
        updateWorkspaceEntities.mutate(
          { workspaceId: state.workspaceId, keywords: state.keywords },
          {
            onError: (error: unknown) => {
              console.error("Error saving keywords:", error)
              toast.error(error instanceof Error ? error.message : "Failed to save keywords.")
              dispatch({ type: "set_step", step: currentStep })
              updateStep.mutate({ step: currentStep })
            },
          }
        )
      } else if (currentStep === 4) {
        const normalized = state.subreddits.map((s: string) => s.replace(/^r\//i, "").trim()).filter(Boolean)
        const subredditsDetails = normalized
          .map((n: string) => state.subredditDetailsByName[n.toLowerCase()])
          .filter(Boolean)
          .map((d: any) => ({
            name: d.name,
            title: d.title ?? null,
            description: d.description ?? null,
            description_reddit: d.description_reddit ?? null,
            created_utc: d.created_utc ?? null,
            total_members: d.total_members ?? null,
          }))
        updateWorkspaceEntities.mutate(
          { workspaceId: state.workspaceId, subreddits: normalized, subredditsDetails },
          {
            onError: (error: unknown) => {
              console.error("Error saving subreddits:", error)
              toast.error(error instanceof Error ? error.message : "Failed to save subreddits.")
              dispatch({ type: "set_step", step: currentStep })
              updateStep.mutate({ step: currentStep })
            },
          }
        )
      } else if (currentStep === 5) {
        updateWorkspaceEntities.mutate(
          { workspaceId: state.workspaceId, competitors: state.competitors },
          {
            onError: (error: unknown) => {
              console.error("Error saving competitors:", error)
              toast.error(error instanceof Error ? error.message : "Failed to save competitors.")
              dispatch({ type: "set_step", step: currentStep })
              updateStep.mutate({ step: currentStep })
            },
          }
        )
      }
    }
  }

  const handleFinish = async (): Promise<void> => {
    window.location.href = "/"
    if (state.workspaceId) {
      try {
        const normalized = state.subreddits.map((s: string) => s.replace(/^r\//i, "").trim()).filter(Boolean)
        const subredditsDetails = normalized
          .map((n: string) => state.subredditDetailsByName[n.toLowerCase()])
          .filter(Boolean)
          .map((d: any) => ({
            name: d.name,
            title: d.title ?? null,
            description: d.description ?? null,
            description_reddit: d.description_reddit ?? null,
            created_utc: d.created_utc ?? null,
            total_members: d.total_members ?? null,
          }))

        await updateWorkspaceEntities.mutateAsync({
          workspaceId: state.workspaceId,
          keywords: state.keywords,
          subreddits: normalized,
          subredditsDetails,
          competitors: state.competitors,
          onboardingComplete: true,
        })
      } catch (error) {
        console.error("Error updating workspace:", error)
      }
    }
  }

  return { setTrackingTab, handleBack, handleContinue, handleFinish }
}


