"use client"

import { useMemo, useReducer, useCallback } from "react"
import { useRouter } from "next/navigation"

import { useOnboardingHydration } from "@/hooks/onboarding/use-onboarding-hydration"
import { createClient as createSupabaseClient } from "@/lib/supabase/client"
import { useSubredditSearch } from "@/hooks/use-subreddit-search"
import {
  useOnboardingScrapeAdvance
} from "@/hooks/onboarding/use-onboarding-scrape-advance"
import {
  useOnboardingCommands
} from "@/hooks/onboarding/use-onboarding-commands"
import {
  onboardingReducer,
  initialOnboardingState
} from "@/hooks/onboarding/use-onboarding-reducer"
import { type Step } from "@/types/onboarding"
import {
  getCurrentTrackingTab,
  getDisplayStepNumber,
  canContinueSelector,
  getPercent,
} from "@/hooks/onboarding/selectors"
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

export function useOnboardingController() {
  const router = useRouter()
  const [state, dispatch] = useReducer(onboardingReducer, initialOnboardingState)

  const subredditSearch = useSubredditSearch({ active: state.step === 4 })
  const updateWorkspaceEntities = useUpdateWorkspaceEntities()
  const updateStep = useUpdateOnboardingStepMutation()
  const updateProfile = useUpdateProfileMutation()
  const { data: profileData } = useProfileQuery()
  const upsertWorkspace = useUpsertWorkspace()
  const scrapeWorkspace = useScrapeWorkspace()

  useOnboardingScrapeAdvance({
    showLoadingScreen: state.showLoadingScreen,
    scrapingComplete: state.scrapingComplete,
    isScrapingWebsite: state.isScrapingWebsite,
    setShowLoadingScreen: (show) => dispatch({ type: "set_show_loading_screen", show }),
    setStep: (step) => dispatch({ type: "set_step", step }),
    updateStep,
  })

  useOnboardingHydration(profileData, router, state, dispatch)

  const TOTAL_MAIN_STEPS = 3
  const displayStepNumber = useMemo(() => getDisplayStepNumber(state.step), [state.step])
  const displayIndex = displayStepNumber - 1
  const percent = useMemo(() => getPercent(state.step, displayStepNumber), [state.step, displayStepNumber])
  const currentTrackingTab = getCurrentTrackingTab(state.step)

  const { setTrackingTab, handleBack, handleContinue, handleFinish } = useOnboardingCommands({
    state,
    dispatch,
    updateStep,
    updateProfile,
    upsertWorkspace,
    updateWorkspaceEntities,
    scrapeWorkspace,
  })

  const confirmLogout = async (): Promise<void> => {
    try {
      dispatch({ type: "set_logging_out", loggingOut: true })
      const supabase = createSupabaseClient()
      await supabase.auth.signOut()
    } catch {
      // no-op
    } finally {
      window.location.href = "/login"
    }
  }

  const canContinue = useMemo(() => canContinueSelector(state), [state])

  const setStepLocal = useCallback((step: Step) => dispatch({ type: "set_step", step }), [dispatch])
  const setWorkspace = useCallback((workspace: typeof state.workspace) => dispatch({ type: "set_workspace", workspace }), [dispatch])
  const setWorkspaceValidation = useCallback(
    (validation: typeof state.workspaceValidation) => dispatch({ type: "set_workspace_validation", validation }),
    [dispatch]
  )
  const setPersonal = useCallback((personal: typeof state.personal) => dispatch({ type: "set_personal", personal }), [dispatch])
  const setPersonalValidation = useCallback(
    (validation: typeof state.personalValidation) => dispatch({ type: "set_personal_validation", validation }),
    [dispatch]
  )
  const addSubreddit = useCallback((name: string) => dispatch({ type: "add_or_toggle_subreddit", name }), [dispatch])
  const upsertSubredditDetails = useCallback((input: any) => dispatch({ type: "upsert_subreddit_details", input }), [dispatch])
  const setKeywords = useCallback((keywords: string[]) => dispatch({ type: "set_keywords", keywords }), [dispatch])
  const setSubreddits = useCallback(
    (next: string[] | ((prev: string[]) => string[])) => {
      if (typeof next === "function") {
        dispatch({ type: "compute_subreddits", compute: next as (p: string[]) => string[] })
      } else {
        dispatch({ type: "set_subreddits", subreddits: next })
      }
    },
    [dispatch]
  )
  const setCompetitors = useCallback(
    (next: any[] | ((prev: any[]) => any[])) => {
      const value = typeof next === "function" ? (next as (p: any[]) => any[])(state.competitors || []) : next
      dispatch({ type: "set_competitors", competitors: value })
    },
    [dispatch, state.competitors]
  )

  const value = {
    ...state,
    TOTAL_MAIN_STEPS,
    displayStepNumber,
    displayIndex,
    percent,
    currentTrackingTab,
    setTrackingTab,
    setStepLocal,
    subredditSearch,
    setWorkspace,
    setWorkspaceValidation,
    setPersonal,
    setPersonalValidation,
    addSubreddit,
    upsertSubredditDetails,
    setKeywords,
    setSubreddits,
    setCompetitors,
    canContinue,
    handlers: { handleContinue, handleFinish, handleBack, confirmLogout },
    dialog: {
      showLogoutDialog: state.showLogoutDialog,
      setShowLogoutDialog: (show: boolean) => dispatch({ type: "set_logout_dialog", show }),
      loggingOut: state.loggingOut,
    },
  }

  return value
}

export type UseOnboardingControllerReturn = ReturnType<typeof useOnboardingController>


