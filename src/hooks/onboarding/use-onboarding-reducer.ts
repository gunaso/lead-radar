"use client"

import type { GoalOption, SourceOption, Step, CompetitorInput } from "@/types/onboarding"

export type SubredditDetails = {
  name: string
  title?: string | null
  description?: string | null
  description_reddit?: string | null
  created_utc?: number | null
  total_members?: number | null
}

export type OnboardingState = {
  loading: boolean
  step: Step
  MAX_STEP: Step

  workspace: {
    companyName: string
    workspaceName: string
    website: string
    employees: string
  }
  workspaceValidation: {
    nameValid: boolean
    workspaceValid: boolean
    websiteValid: boolean
    employeesValid: boolean
  }

  personal: {
    name: string
    role: string
    source?: SourceOption
    goals?: GoalOption[]
  }
  personalValidation: {
    nameValid: boolean
    roleValid: boolean
    sourceValid: boolean
    goalsValid: boolean
  }

  workspaceId: number | null
  previousWebsite: string

  keywords: string[]
  subreddits: string[]
  subredditDetailsByName: Record<string, SubredditDetails>
  competitors: CompetitorInput[]

  skipValidation: boolean
  isScrapingWebsite: boolean
  scrapingComplete: boolean
  showLoadingScreen: boolean

  showLogoutDialog: boolean
  loggingOut: boolean
  justWentBack: boolean
}

export const initialOnboardingState: OnboardingState = {
  loading: true,
  step: 0 as Step,
  MAX_STEP: 6 as Step,

  workspace: {
    companyName: "",
    workspaceName: "",
    website: "",
    employees: "",
  },
  workspaceValidation: {
    nameValid: false,
    workspaceValid: false,
    websiteValid: false,
    employeesValid: false,
  },

  personal: {
    name: "",
    role: "",
    source: undefined,
    goals: [],
  },
  personalValidation: {
    nameValid: false,
    roleValid: false,
    sourceValid: false,
    goalsValid: false,
  },

  workspaceId: null,
  previousWebsite: "",

  keywords: [],
  subreddits: [],
  subredditDetailsByName: {},
  competitors: [],

  skipValidation: false,
  isScrapingWebsite: false,
  scrapingComplete: false,
  showLoadingScreen: false,

  showLogoutDialog: false,
  loggingOut: false,
  justWentBack: false,
}

export type OnboardingAction =
  | { type: "set_loading"; loading: boolean }
  | { type: "set_step"; step: Step }
  | { type: "set_workspace"; workspace: OnboardingState["workspace"] }
  | {
      type: "set_workspace_validation"
      validation: OnboardingState["workspaceValidation"]
    }
  | { type: "set_personal"; personal: OnboardingState["personal"] }
  | {
      type: "set_personal_validation"
      validation: OnboardingState["personalValidation"]
    }
  | { type: "set_workspace_id"; workspaceId: number | null }
  | { type: "set_previous_website"; previousWebsite: string }
  | { type: "set_keywords"; keywords: string[] }
  | { type: "set_subreddits"; subreddits: string[] }
  | { type: "compute_subreddits"; compute: (prev: string[]) => string[] }
  | { type: "add_or_toggle_subreddit"; name: string }
  | { type: "upsert_subreddit_details"; input: Partial<SubredditDetails> & { name?: string } }
  | { type: "set_competitors"; competitors: CompetitorInput[] }
  | { type: "set_skip_validation"; skip: boolean }
  | { type: "set_scraping_state"; isScrapingWebsite: boolean; scrapingComplete: boolean }
  | { type: "set_show_loading_screen"; show: boolean }
  | { type: "set_logout_dialog"; show: boolean }
  | { type: "set_logging_out"; loggingOut: boolean }
  | { type: "set_just_went_back"; value: boolean }

export function onboardingReducer(state: OnboardingState, action: OnboardingAction): OnboardingState {
  switch (action.type) {
    case "set_loading":
      return { ...state, loading: action.loading }
    case "set_step":
      return { ...state, step: action.step }
    case "set_workspace":
      return { ...state, workspace: action.workspace }
    case "set_workspace_validation":
      return { ...state, workspaceValidation: action.validation }
    case "set_personal":
      return { ...state, personal: action.personal }
    case "set_personal_validation":
      return { ...state, personalValidation: action.validation }
    case "set_workspace_id":
      return { ...state, workspaceId: action.workspaceId }
    case "set_previous_website":
      return { ...state, previousWebsite: action.previousWebsite }
    case "set_keywords":
      return { ...state, keywords: action.keywords }
    case "set_subreddits":
      return { ...state, subreddits: action.subreddits }
    case "compute_subreddits": {
      const next = action.compute(Array.isArray(state.subreddits) ? state.subreddits : [])
      return { ...state, subreddits: next }
    }
    case "add_or_toggle_subreddit": {
      const raw = (action.name || "").trim()
      if (!raw) return state
      const normalized = `r/${raw.replace(/^r\//i, "").trim()}`
      const target = normalized.toLowerCase()
      const exists = state.subreddits.some((t) => t.toLowerCase() === target)
      const next = exists
        ? state.subreddits.filter((t) => t.toLowerCase() !== target)
        : [...state.subreddits, normalized]
      return { ...state, subreddits: next }
    }
    case "upsert_subreddit_details": {
      const key = (action.input.name || "").replace(/^r\//i, "").trim().toLowerCase()
      if (!key) return state
      const existing = state.subredditDetailsByName[key] || { name: key }
      return {
        ...state,
        subredditDetailsByName: {
          ...state.subredditDetailsByName,
          [key]: {
            ...existing,
            name: key,
            title: action.input.title ?? existing.title ?? null,
            description: action.input.description ?? existing.description ?? null,
            description_reddit: action.input.description_reddit ?? existing.description_reddit ?? null,
            created_utc: action.input.created_utc ?? existing.created_utc ?? null,
            total_members: action.input.total_members ?? existing.total_members ?? null,
          },
        },
      }
    }
    case "set_competitors":
      return { ...state, competitors: action.competitors }
    case "set_skip_validation":
      return { ...state, skipValidation: action.skip }
    case "set_scraping_state":
      return {
        ...state,
        isScrapingWebsite: action.isScrapingWebsite,
        scrapingComplete: action.scrapingComplete,
      }
    case "set_show_loading_screen":
      return { ...state, showLoadingScreen: action.show }
    case "set_logout_dialog":
      return { ...state, showLogoutDialog: action.show }
    case "set_logging_out":
      return { ...state, loggingOut: action.loggingOut }
    case "set_just_went_back":
      return { ...state, justWentBack: action.value }
    default:
      return state
  }
}


