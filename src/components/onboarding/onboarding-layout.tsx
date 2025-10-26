"use client"

import type { ReactElement, ReactNode } from "react"
import { motion } from "framer-motion"
import { Check, ChevronLeft, ChevronRight } from "lucide-react"

import WebsiteLoading from "@/components/onboarding/website-loading"
import LoadingShapes from "@/components/ui/loading-shapes"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import type { Step } from "@/types/onboarding"

const STEP_TITLES: Record<Step, string> = {
  0: "Welcome to Prompted",
  1: "Tell us about your company",
  2: "Tell us about yourself",
  3: "Choose what to track",
  4: "Choose what to track",
  5: "Choose what to track",
  6: "Tips for Getting Real Results",
}

const STEP_DESCRIPTIONS: Record<Step, string> = {
  0: "Find the Reddit conversations shaping AI search results. Engage authentically, understand your audience, and get noticed where it matters.",
  1: "Create a workspace for your company, to help us personalize suggestions and allowing you to invite your team to collaborate.",
  2: "Help us tailor your experience and recommendations.",
  3: "Add keywords, subreddits, and competitor names. We’ll do the rest.",
  4: "Add keywords, subreddits, and competitor names. We’ll do the rest.",
  5: "Add keywords, subreddits, and competitor names. We’ll do the rest.",
  6: "Here’s how to make every Reddit interaction count — for your audience, your brand, and AI visibility.",
}

type OnboardingLayoutProps = {
  loading: boolean
  step: Step
  MAX_STEP: Step
  TOTAL_MAIN_STEPS: number
  displayStepNumber: number
  displayIndex: number
  percent: number
  showLoadingScreen: boolean
  canContinue: boolean
  onBack: () => void
  onContinueOrFinish: () => void
  isFinishing: boolean
  dialog: {
    showLogoutDialog: boolean
    setShowLogoutDialog: (show: boolean) => void
    loggingOut: boolean
    confirmLogout: () => void
  }
  goToDisplayIndex?: (i: number) => void
  children: ReactNode
}

export default function OnboardingLayout(
  props: OnboardingLayoutProps
): ReactElement {
  if (props.loading) {
    return (
      <div className="flex items-center justify-center h-dvh background-gradient">
        <LoadingShapes className="size-10" />
      </div>
    )
  }

  return (
    <main className="background-gradient min-h-dvh flex justify-center p-4 pt-[10%]">
      <div className="w-full max-w-xl">
        <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
          <div>
            Step {props.displayStepNumber} of {props.TOTAL_MAIN_STEPS}
          </div>
          <div>{Math.round(props.percent)}% Complete</div>
        </div>
        <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${props.percent}%` }}
            transition={{ duration: 0.25, ease: "easeOut" }}
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
            {props.showLoadingScreen ? (
              <WebsiteLoading />
            ) : (
              <>
                <CardHeader>
                  <CardTitle className="text-center text-2xl font-semibold text-primary">
                    {STEP_TITLES[props.step]}
                  </CardTitle>
                  {STEP_DESCRIPTIONS[props.step] && (
                    <CardDescription className="text-center text-sm text-muted-foreground mt-2 max-w-9/10 mx-auto">
                      {STEP_DESCRIPTIONS[props.step]}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="flex-1">{props.children}</CardContent>
                <CardFooter className="flex items-center justify-between">
                  <span className="w-[150px]">
                    <Button
                      size="onboarding"
                      variant="ghost"
                      onClick={props.onBack}
                      disabled={props.showLoadingScreen}
                    >
                      <ChevronLeft className="size-4" /> Back
                    </Button>
                  </span>

                  <div className="flex items-center justify-center gap-2">
                    {Array.from(
                      { length: props.TOTAL_MAIN_STEPS },
                      (_, i) => i
                    ).map((i) => (
                      <button
                        key={i}
                        aria-label={`Go to step ${i + 1}`}
                        aria-current={
                          props.step > 0 && props.displayIndex === i
                        }
                        className={
                          "size-2.5 rounded-full transition-colors " +
                          (props.step > 0 && props.displayIndex === i
                            ? "bg-primary"
                            : "bg-muted")
                        }
                        onClick={() => {
                          if (i <= props.displayIndex)
                            props.goToDisplayIndex?.(i)
                        }}
                      />
                    ))}
                  </div>

                  <span className="flex justify-end w-[150px]">
                    <Button
                      size="onboarding"
                      onClick={props.onContinueOrFinish}
                      disabled={!props.canContinue || props.showLoadingScreen}
                      className="min-w-32"
                    >
                      <span className="inline-flex items-center gap-2">
                        {!props.isFinishing ? (
                          <>
                            Continue <ChevronRight className="size-4" />
                          </>
                        ) : (
                          <>
                            Finish <Check className="size-4" />
                          </>
                        )}
                      </span>
                    </Button>
                  </span>
                </CardFooter>
              </>
            )}
          </Card>
        </motion.div>
        <AlertDialog
          open={props.dialog.showLogoutDialog}
          onOpenChange={props.dialog.setShowLogoutDialog}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Sign out</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to log out? You can continue onboarding
                later.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={props.dialog.loggingOut}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={props.dialog.confirmLogout}
                className="bg-destructive text-muted-foreground hover:bg-destructive/90"
                disabled={props.dialog.loggingOut}
              >
                {props.dialog.loggingOut ? "Logging out..." : "Log out"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </main>
  )
}
