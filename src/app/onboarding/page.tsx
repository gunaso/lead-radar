"use client"
import type { ReactElement } from "react"

import OnboardingLayout from "@/components/onboarding/onboarding-layout"
import WorkspaceStep from "@/components/onboarding/workspace"
import PersonalStep from "@/components/onboarding/personal"
import WelcomeStep from "@/components/onboarding/welcome"
import TipsStep from "@/components/onboarding/tips"
import TrackingTabs, {
  type TrackingTabValue,
} from "@/components/onboarding/tracking-tabs"

import { useOnboardingController } from "@/hooks/onboarding/use-onboarding-controller"

export default function OnboardingPage(): ReactElement {
  const ctrl = useOnboardingController()

  const goToDisplayIndex = (i: number) => {
    const target = (i === 0 ? 1 : i === 1 ? 2 : 3) as any
    ctrl.setStepLocal(target)
  }

  const children = (
    <>
      {ctrl.step === 0 && <WelcomeStep />}
      {ctrl.step === 1 && (
        <WorkspaceStep
          value={ctrl.workspace}
          onChange={ctrl.setWorkspace}
          onValidationChange={ctrl.setWorkspaceValidation}
          skipValidation={ctrl.skipValidation}
        />
      )}
      {ctrl.step === 2 && (
        <PersonalStep
          value={ctrl.personal}
          onChange={ctrl.setPersonal}
          onValidationChange={ctrl.setPersonalValidation}
        />
      )}
      {ctrl.step >= 3 && ctrl.step <= 5 && ctrl.currentTrackingTab && (
        <TrackingTabs
          value={ctrl.currentTrackingTab as TrackingTabValue}
          onValueChange={ctrl.setTrackingTab as any}
          keywords={ctrl.keywords}
          setKeywords={ctrl.setKeywords}
          query={ctrl.subredditSearch.query}
          setQuery={ctrl.subredditSearch.setQuery}
          results={ctrl.subredditSearch.results}
          searching={ctrl.subredditSearch.searching}
          subreddits={ctrl.subreddits}
          setSubreddits={ctrl.setSubreddits as any}
          addSubreddit={ctrl.addSubreddit}
          upsertDetails={ctrl.upsertSubredditDetails}
          competitors={ctrl.competitors}
          setCompetitors={ctrl.setCompetitors as any}
          isKeywordsDone={
            Array.isArray(ctrl.keywords) && ctrl.keywords.length > 0
          }
          isSubredditsDone={
            Array.isArray(ctrl.subreddits) && ctrl.subreddits.length > 0
          }
          isCompetitorsDone={
            Array.isArray(ctrl.competitors) &&
            ctrl.competitors.length > 0 &&
            ctrl.competitors.every((c: any) => !!c?.name?.trim())
          }
        />
      )}
      {ctrl.step === ctrl.MAX_STEP && <TipsStep />}
    </>
  )

  return (
    <OnboardingLayout
      loading={ctrl.loading}
      step={ctrl.step}
      MAX_STEP={ctrl.MAX_STEP}
      TOTAL_MAIN_STEPS={ctrl.TOTAL_MAIN_STEPS}
      displayStepNumber={ctrl.displayStepNumber}
      displayIndex={ctrl.displayIndex}
      percent={ctrl.percent}
      showLoadingScreen={ctrl.showLoadingScreen}
      canContinue={ctrl.canContinue}
      onBack={ctrl.handlers.handleBack}
      onContinueOrFinish={
        ctrl.step < ctrl.MAX_STEP
          ? ctrl.handlers.handleContinue
          : ctrl.handlers.handleFinish
      }
      isFinishing={ctrl.step >= ctrl.MAX_STEP}
      dialog={{
        showLogoutDialog: ctrl.dialog.showLogoutDialog,
        setShowLogoutDialog: ctrl.dialog.setShowLogoutDialog,
        loggingOut: ctrl.dialog.loggingOut,
        confirmLogout: ctrl.handlers.confirmLogout,
      }}
      goToDisplayIndex={goToDisplayIndex}
    >
      {children}
    </OnboardingLayout>
  )
}
