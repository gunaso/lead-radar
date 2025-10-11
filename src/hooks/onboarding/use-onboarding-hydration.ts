import { useEffect } from "react"

import type { OnboardingState } from "@/hooks/onboarding/use-onboarding-reducer"
import { normalizeWebsiteUrl } from "@/lib/api/url-utils"
import {
  type SourceOption,
  type GoalOption,
  SOURCE_OPTIONS,
  GOAL_OPTIONS,
  type Step
} from "@/types/onboarding"

export function useOnboardingHydration(
  profileData: any,
  router: { replace: (path: string) => void },
  state: OnboardingState,
  dispatch: React.Dispatch<any>
) {
  useEffect(() => {
    const data = profileData
    if (!data) return
    let didRedirect = false
    try {
      if (!data.profile) return
      const { onboarding, onboarded, workspace: workspaceData, name, role } = data.profile as any

      if (onboarding === -1 || onboarded === true) {
        didRedirect = true
        router.replace("/")
        return
      }

      // Only adopt server step when:
      // - during initial hydration (state.loading), or
      // - the server step is ahead of the local step (avoid jumping backwards due to refetch races)
      const serverStep = typeof onboarding === "number" ? (onboarding as Step) : (0 as Step)
      const shouldAdoptServerStep =
        serverStep > 0 &&
        serverStep <= 6 &&
        (state.loading || serverStep > state.step) &&
        !state.justWentBack
      if (shouldAdoptServerStep && serverStep !== state.step) {
        dispatch({ type: "set_step", step: serverStep })
      }

      // Prepare optional normalized personal fields from workspace
      let nextSource: SourceOption | undefined = undefined
      let nextGoals: GoalOption[] = []

      if (workspaceData) {
        dispatch({ type: "set_workspace_id", workspaceId: workspaceData.id })
        dispatch({
          type: "set_workspace",
          workspace: {
            companyName: workspaceData.company || "",
            workspaceName: workspaceData.name || "",
            website: workspaceData.website || "",
            employees: workspaceData.employees || "",
          },
        })

        const wsSource = (workspaceData as any)?.source as string | null | undefined
        const wsGoals = (workspaceData as any)?.goal as string[] | null | undefined
        nextSource = wsSource && SOURCE_OPTIONS.includes(wsSource as any)
          ? (wsSource as SourceOption)
          : undefined
        nextGoals = Array.isArray(wsGoals)
          ? (wsGoals.filter((g) => (GOAL_OPTIONS as readonly string[]).includes(g)) as GoalOption[])
          : []

        if (Array.isArray(workspaceData.keywords) && workspaceData.keywords.length > 0) {
          dispatch({ type: "set_keywords", keywords: workspaceData.keywords as string[] })
        }

        const subsRaw = workspaceData.subreddits ?? []
        if (Array.isArray(subsRaw)) {
          const subs = subsRaw.map((s: any) => (s?.name ? `r/${s.name}` : "")).filter((s: string) => s.length > 0)
          if (subs.length > 0) dispatch({ type: "set_subreddits", subreddits: subs })
        }

        const competitorsRaw = workspaceData.competitors ?? []
        if (Array.isArray(competitorsRaw) && competitorsRaw.length > 0) {
          const list = competitorsRaw
            .map((c: any) => ({ name: (c?.name || "").trim(), website: (c?.website || "").trim() || null }))
            .filter((c: any) => c.name.length > 0)
          if (list.length > 0) dispatch({ type: "set_competitors", competitors: list })
        }

        const normalizedPrev = workspaceData.website ? normalizeWebsiteUrl(workspaceData.website) || "" : ""
        dispatch({ type: "set_previous_website", previousWebsite: normalizedPrev })
        dispatch({
          type: "set_workspace_validation",
          validation: {
            nameValid: !!workspaceData.company,
            workspaceValid: !!workspaceData.name,
            websiteValid: !!workspaceData.website,
            employeesValid: !!workspaceData.employees,
          },
        })
        dispatch({ type: "set_skip_validation", skip: true })
      }

      // Always compute merged personal once to avoid overwriting fields due to stale state
      const mergedPersonal = {
        name: name || state.personal.name || "",
        role: role || state.personal.role || "",
        source: (nextSource ?? state.personal.source) as SourceOption | undefined,
        goals: (nextGoals && nextGoals.length > 0 ? nextGoals : (state.personal.goals || [])) as GoalOption[],
      }

      dispatch({ type: "set_personal", personal: mergedPersonal })
      dispatch({
        type: "set_personal_validation",
        validation: {
          ...state.personalValidation,
          nameValid: !!mergedPersonal.name && mergedPersonal.name.length >= 2,
          roleValid: !!mergedPersonal.role,
          sourceValid: Boolean(
            mergedPersonal.source &&
              String(mergedPersonal.source).trim().length > 0 &&
              String(mergedPersonal.source) !== "Other"
          ),
          goalsValid: Array.isArray(mergedPersonal.goals) ? mergedPersonal.goals.length > 0 : false,
        },
      })
    } finally {
      if (!didRedirect) dispatch({ type: "set_loading", loading: false })
    }
  }, [profileData, router, state.loading, state.justWentBack])
}


