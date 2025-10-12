"use client"

import { type ReactElement, useMemo } from "react"

import LabeledSelect from "@/components/ui/labeled-select"
import AsyncInput from "@/components/input-async"
import { Button } from "@/components/ui/button"
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Dialog,
} from "@/components/ui/dialog"

import { useWorkspaceSettings } from "@/hooks/header/use-workspace-settings"
import { EMPLOYEE_RANGES } from "@/types/onboarding"

type WorkspaceSettingsProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function WorkspaceSettings({
  open,
  onOpenChange,
}: WorkspaceSettingsProps): ReactElement {
  const state = useWorkspaceSettings(open, onOpenChange)

  const saveDisabled = useMemo(
    () => !state.canSave || !state.workspaceId,
    [state.canSave, state.workspaceId]
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl w-full gap-10">
        <DialogHeader>
          <DialogTitle className="mx-auto">Workspace Settings</DialogTitle>
        </DialogHeader>

        <section className="space-y-4">
          <AsyncInput
            label="Company name"
            placeholder="e.g. Company Inc."
            valueState={[state.companyName, state.setCompanyName]}
            setValid={state.setCompanyValid}
            // Skip initial validation; will re-enable when value changes
            skipValidation={true}
            validate={async (val, signal) => state.validateCompany(val, signal)}
          />

          <AsyncInput
            label="Website (optional)"
            placeholder="e.g. company.com"
            valueState={[state.website, state.setWebsite]}
            setValid={state.setWebsiteValid}
            // Skip initial validation; will only validate when user edits
            skipValidation={true}
            helperText="We’ll use this to suggest keywords, subs, and competitors — never to crawl private data."
            validate={async (val, signal) => state.validateWebsite(val, signal)}
          />

          <LabeledSelect
            label="Number of employees"
            placeholder="Select number of employees"
            value={state.employees}
            onValueChange={state.setEmployees}
            options={EMPLOYEE_RANGES.map((r) => ({ value: r }))}
          />
        </section>

        <DialogFooter>
          <Button
            type="button"
            onClick={() => state.save()}
            disabled={saveDisabled}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
