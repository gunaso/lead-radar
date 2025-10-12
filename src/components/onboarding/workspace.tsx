"use client"

import { useEffect, useState, type ReactElement } from "react"

import LabeledSelect from "@/components/ui/labeled-select"
import AsyncInput from "@/components/input-async"

import { normalizeWebsiteUrl } from "@/lib/api/url-utils"
import { EMPLOYEE_RANGES } from "@/types/onboarding"
import {
  useWorkspaceCompanyValidation,
  useWorkspaceWebsiteValidation,
  useWorkspaceNameValidation,
} from "@/queries/workspace"

type WorkspaceStepProps = {
  value: {
    companyName: string
    workspaceName: string
    website: string
    employees: string
  }
  onChange: (next: {
    companyName: string
    workspaceName: string
    website: string
    employees: string
  }) => void
  onValidationChange: (validation: {
    nameValid: boolean
    workspaceValid: boolean
    websiteValid: boolean
    employeesValid: boolean
  }) => void
  skipValidation?: boolean
}

export default function WorkspaceStep({
  value,
  onChange,
  onValidationChange,
  skipValidation = false,
}: WorkspaceStepProps): ReactElement {
  const [workspaceName, setWorkspaceName] = useState(value.workspaceName)
  const [workspaceValid, setWorkspaceValid] = useState(skipValidation)
  const [employeesValid, setEmployeesValid] = useState(skipValidation)
  const [companyName, setCompanyName] = useState(value.companyName)
  const [employees, setEmployees] = useState(value.employees)
  const [nameValid, setNameValid] = useState(skipValidation)
  const [website, setWebsite] = useState(value.website)
  const [websiteValid, setWebsiteValid] = useState(
    skipValidation || !value.website
  )

  const workspaceNameValidation = useWorkspaceNameValidation()
  const companyValidation = useWorkspaceCompanyValidation()
  const websiteValidation = useWorkspaceWebsiteValidation()

  // Bubble up state (normalize website so equivalent protocol variants don't thrash state)
  useEffect(() => {
    const normalizedWebsite = normalizeWebsiteUrl(website.trim()) || website
    onChange({
      companyName,
      workspaceName,
      website: normalizedWebsite,
      employees,
    })
  }, [companyName, workspaceName, website, employees, onChange])

  // Bubble up validation state
  useEffect(() => {
    onValidationChange({
      nameValid,
      workspaceValid,
      websiteValid,
      employeesValid,
    })
  }, [nameValid, workspaceValid, websiteValid, employees, onValidationChange])

  return (
    <section className="space-y-4">
      <AsyncInput
        label="Company name"
        placeholder="e.g. Company Inc."
        valueState={[companyName, setCompanyName]}
        setValid={setNameValid}
        skipValidation={skipValidation}
        validate={async (val, signal) =>
          companyValidation.mutateAsync({ name: val, signal })
        }
      />

      <AsyncInput
        label="Workspace name"
        placeholder="e.g. Company"
        valueState={[workspaceName, setWorkspaceName]}
        setValid={setWorkspaceValid}
        skipValidation={skipValidation}
        validate={async (val, signal) =>
          workspaceNameValidation.mutateAsync({ name: val, signal })
        }
      />

      <AsyncInput
        label="Website (optional)"
        placeholder="e.g. company.com"
        valueState={[website, setWebsite]}
        setValid={setWebsiteValid}
        skipValidation={skipValidation}
        helperText="We’ll use this to suggest keywords, subs, and competitors — never to crawl private data."
        validate={async (val, signal) => {
          const trimmed = val.trim()
          if (!trimmed) return { ok: true }
          return websiteValidation.mutateAsync({ website: trimmed, signal })
        }}
      />

      <LabeledSelect
        label="Number of employees"
        placeholder="Select number of employees"
        value={employees}
        onValueChange={setEmployees}
        options={EMPLOYEE_RANGES.map((r) => ({ value: r }))}
      />
    </section>
  )
}
