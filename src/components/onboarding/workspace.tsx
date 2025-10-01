"use client"
import { useEffect, useState, type ReactElement } from "react"

import AsyncInput from "@/components/input-async"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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

const EMPLOYEE_RANGES = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1,000",
  "1,001-5,000",
  "5,001+",
]

export default function WorkspaceStep({
  value,
  onChange,
  onValidationChange,
  skipValidation = false,
}: WorkspaceStepProps): ReactElement {
  const [employees, setEmployees] = useState(value.employees)
  const [workspaceValid, setWorkspaceValid] = useState(skipValidation)
  const [employeesValid, setEmployeesValid] = useState(skipValidation)
  const [workspaceName, setWorkspaceName] = useState(value.workspaceName)
  const [websiteValid, setWebsiteValid] = useState(
    skipValidation || !value.website
  )
  const [website, setWebsite] = useState(value.website)
  const [nameValid, setNameValid] = useState(skipValidation)
  const [companyName, setCompanyName] = useState(value.companyName)

  // Bubble up state
  useEffect(() => {
    onChange({ companyName, workspaceName, website, employees })
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
      <div>
        <Label htmlFor="company-name">Company name</Label>
        <div className="relative mt-1">
          <AsyncInput
            id="company-name"
            placeholder="e.g. Company Inc."
            valueState={[companyName, setCompanyName]}
            setValid={setNameValid}
            skipValidation={skipValidation}
            validate={async (val, signal) => {
              const params = new URLSearchParams({ companyName: val })
              return fetch(
                `/api/workspace/company?${params.toString()}` as string,
                {
                  method: "GET",
                  signal,
                }
              )
            }}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="org-name">Workspace name</Label>
        <div className="relative mt-1">
          <AsyncInput
            id="org-name"
            placeholder="e.g. Company"
            valueState={[workspaceName, setWorkspaceName]}
            setValid={setWorkspaceValid}
            skipValidation={skipValidation}
            validate={async (val, signal) => {
              const params = new URLSearchParams({ name: val })
              return fetch(
                `/api/workspace/name?${params.toString()}` as string,
                {
                  method: "GET",
                  signal,
                }
              )
            }}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="org-website">Website (optional)</Label>
        <div className="relative mt-1">
          <AsyncInput
            id="org-website"
            placeholder="e.g. company.com"
            valueState={[website, setWebsite]}
            setValid={setWebsiteValid}
            skipValidation={skipValidation}
            validate={async (val, signal) => {
              const trimmed = val.trim()
              if (!trimmed) return { ok: true }
              const params = new URLSearchParams({ website: trimmed })
              return fetch(
                `/api/workspace/website?${params.toString()}` as string,
                {
                  method: "GET",
                  signal,
                }
              )
            }}
          />
        </div>
        <span className="text-xs text-muted-foreground pl-1">
          With your website, we can personalize suggestions based on the
          services you offer.
        </span>
      </div>

      <div>
        <Label htmlFor="org-employees">Number of employees</Label>
        <Select value={employees} onValueChange={setEmployees}>
          <SelectTrigger
            id="org-employees"
            className="mt-1 w-full border-1 border-border"
          >
            <SelectValue placeholder="Select number of employees" />
          </SelectTrigger>
          <SelectContent>
            {EMPLOYEE_RANGES.map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </section>
  )
}
