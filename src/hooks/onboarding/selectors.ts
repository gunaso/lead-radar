import type { OnboardingState } from "@/hooks/onboarding/use-onboarding-reducer"

export function getDisplayStepNumber(step: number): number {
  return step === 0 ? 0 : step === 1 ? 1 : step === 2 ? 2 : 3
}

export function getPercent(step: number, displayStepNumber: number): number {
  if (step === 6) return 100
  switch (displayStepNumber) {
    case 0:
    case 1:
      return 0
    case 2:
      return 33
    case 3:
      return 66
    default:
      return 0
  }
}

export function getCurrentTrackingTab(step: number): "keywords" | "subreddits" | "competitors" | null {
  return step === 3 ? "keywords" : step === 4 ? "subreddits" : step === 5 ? "competitors" : null
}

export function canContinueSelector(state: OnboardingState): boolean {
  if (state.step === 0) return true
  if (state.step === 1) {
    const { nameValid, workspaceValid, websiteValid } = state.workspaceValidation
    const hasEmployees = state.workspace.employees !== ""
    const websiteOptional = state.workspace.website.trim() === "" || websiteValid
    return nameValid && workspaceValid && websiteOptional && hasEmployees
  }
  if (state.step === 2) {
    return (
      state.personalValidation.nameValid &&
      state.personalValidation.roleValid &&
      state.personalValidation.sourceValid &&
      state.personalValidation.goalsValid
    )
  }
  if (state.step === 3) return (Array.isArray(state.keywords) ? state.keywords.length : 0) > 0
  if (state.step === 4) return (Array.isArray(state.subreddits) ? state.subreddits.length : 0) > 0
  if (state.step === 5) {
    const competitors = Array.isArray(state.competitors) ? state.competitors : []
    return competitors.length > 0 && competitors.every((c: any) => !!c?.name?.trim())
  }
  if (state.step === 6) return true
  return true
}


