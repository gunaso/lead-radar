import { useEffect } from "react"

import type { Step } from "@/types/onboarding"

export function useOnboardingScrapeAdvance(args: {
  showLoadingScreen: boolean
  scrapingComplete: boolean
  isScrapingWebsite: boolean
  setShowLoadingScreen: (show: boolean) => void
  setStep: (step: Step) => void
  updateStep: { mutate: (payload: { step: number }) => void }
}) {
  const { showLoadingScreen, scrapingComplete, isScrapingWebsite, setShowLoadingScreen, setStep, updateStep } = args
  useEffect(() => {
    if (showLoadingScreen && scrapingComplete && !isScrapingWebsite) {
      const nextStep = 3 as Step
      setShowLoadingScreen(false)
      setStep(nextStep)
      updateStep.mutate({ step: nextStep })
    }
  }, [showLoadingScreen, scrapingComplete, isScrapingWebsite, setShowLoadingScreen, setStep, updateStep])
}


