"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"

import { WorkspaceAvatar } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  SettingsContainerElem,
  SettingsContainer,
} from "@/components/ui/settings-container"
import {
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
  Select,
} from "@/components/ui/select"

import { Spinner } from "@/components/ui/spinner"
import { EMPLOYEE_RANGES } from "@/types/onboarding"
import { useProfileQuery } from "@/queries/profile"
import {
  useUpdateWorkspaceBasics,
  useWorkspaceWebsiteValidation,
} from "@/queries/workspace"
import type { ApiError } from "@/lib/api/client"
import { request } from "@/lib/api/client"
import { qk } from "@/lib/api/query-keys"

export default function WorkspacePage() {
  const { data } = useProfileQuery()
  const qc = useQueryClient()
  const updateWorkspace = useUpdateWorkspaceBasics()
  const websiteValidation = useWorkspaceWebsiteValidation()

  const workspaceId = data?.profile?.workspace?.id || ""

  // Initial values
  const initialCompany = useMemo(
    () => data?.profile?.workspace?.company ?? "",
    [data]
  )
  const initialWebsite = useMemo(
    () => data?.profile?.workspace?.website ?? "",
    [data]
  )
  const initialEmployees = useMemo(
    () => data?.profile?.workspace?.employees ?? "",
    [data]
  )

  // Local state + initialization guards
  const initializedRef = useRef(false)
  const lastSavedCompanyRef = useRef<string>("")
  const lastSavedWebsiteRef = useRef<string>("")
  const websiteRunIdRef = useRef(0)

  const [company, setCompany] = useState("")
  const [website, setWebsite] = useState("")
  const [websiteInputError, setWebsiteInputError] = useState<string | null>(
    null
  )
  const [employees, setEmployees] = useState("")
  const [websiteLoading, setWebsiteLoading] = useState(false)

  useEffect(() => {
    if (!initializedRef.current && data?.profile?.workspace) {
      initializedRef.current = true
      const startCompany = initialCompany || ""
      const startWebsite = initialWebsite || ""
      const startEmployees = initialEmployees || ""
      lastSavedCompanyRef.current = startCompany
      lastSavedWebsiteRef.current = startWebsite
      setCompany(startCompany)
      setWebsite(startWebsite)
      setEmployees(startEmployees)
    }
  }, [data, initialCompany, initialWebsite, initialEmployees])

  // Debounced autosave: company (500ms)
  useEffect(() => {
    if (!initializedRef.current) return
    if (!workspaceId) return
    if (company.trim() === (lastSavedCompanyRef.current || "").trim()) return
    if (company.trim().length === 0) {
      // Do not send empty company names
      return
    }
    const t = setTimeout(() => {
      updateWorkspace.mutate(
        {
          workspaceId,
          companyName: company.trim(),
          website: website.trim().length === 0 ? null : website.trim(),
          employees: employees || "",
        } as any,
        {
          onSuccess: () => {
            lastSavedCompanyRef.current = company.trim()
            toast.success("Company name saved")
          },
          onError: (e: ApiError) => {
            const message = e?.message || "Failed to update company name"
            // For server/unexpected errors revert to last saved
            if (!e?.status || e.status >= 500) {
              setCompany(lastSavedCompanyRef.current)
            }
            toast.error(message)
          },
        }
      )
    }, 500)
    return () => clearTimeout(t)
  }, [company, employees, updateWorkspace, workspaceId])

  // Debounced validate + save (NO optimistic UI): website (500ms)
  useEffect(() => {
    if (!initializedRef.current) return
    if (!workspaceId) return
    const current = (website || "").trim()
    if (current === (lastSavedWebsiteRef.current || "").trim()) {
      setWebsiteLoading(false)
      setWebsiteInputError(null)
      return
    }
    // Allow empty -> null (clears website)
    setWebsiteInputError(null)
    const ac = new AbortController()
    const runId = ++websiteRunIdRef.current
    const t = setTimeout(async () => {
      const trimmed = website.trim()
      setWebsiteLoading(true)
      // If empty, clear website in DB without validation (non-optimistic)
      if (!trimmed) {
        try {
          await request<{ ok: boolean }>("/api/workspace", {
            method: "PATCH",
            body: JSON.stringify({
              workspaceId,
              companyName: company.trim(),
              website: null,
              employees: employees || "",
            }),
          })
          if (websiteRunIdRef.current === runId) {
            lastSavedWebsiteRef.current = ""
            toast.success("Website saved")
            await qc.invalidateQueries({ queryKey: qk.profile() })
          }
        } catch (e: any) {
          if (websiteRunIdRef.current === runId) {
            toast.error(e?.message || "Failed to update website")
          }
          // keep input value as is; no optimistic revert
        } finally {
          if (websiteRunIdRef.current === runId) {
            setWebsiteLoading(false)
          }
        }
        return
      }

      try {
        const res = await websiteValidation.mutateAsync({
          website: trimmed,
          signal: ac.signal,
        } as any)
        if (!res?.ok) {
          if (websiteRunIdRef.current === runId) {
            setWebsiteInputError(res?.message || "Invalid website")
            setWebsiteLoading(false)
          }
          return
        }
        const normalized = (res as any).website ?? trimmed
        // Save via direct request to avoid optimistic UI for website
        await request<{ ok: boolean }>("/api/workspace", {
          method: "PATCH",
          body: JSON.stringify({
            workspaceId,
            companyName: company.trim(),
            website: normalized,
            employees: employees || "",
          }),
        })
        if (websiteRunIdRef.current === runId) {
          lastSavedWebsiteRef.current = normalized
          toast.success("Website saved")
          await qc.invalidateQueries({ queryKey: qk.profile() })
        }
      } catch (e: any) {
        // Do not toast for GET validation failures; show inline error when meaningful
        if (e?.status === 400) {
          if (websiteRunIdRef.current === runId) {
            setWebsiteInputError(e.message || "Invalid website")
          }
        }
        // For non-400 (server/network) show a toast, ignore AbortError
        else if (e?.name !== "AbortError") {
          if (websiteRunIdRef.current === runId) {
            toast.error(e?.message || "Failed to update website")
          }
        }
      } finally {
        if (websiteRunIdRef.current === runId) {
          setWebsiteLoading(false)
        }
      }
    }, 500)
    return () => {
      ac.abort()
      clearTimeout(t)
    }
  }, [website, workspaceId])

  // Immediate save: employees
  const changeEmployees = (value: string) => {
    if (!workspaceId) return
    setEmployees(value)
    updateWorkspace.mutate(
      {
        workspaceId,
        companyName: company.trim(),
        website: website.trim().length === 0 ? null : website.trim(),
        employees: value,
      },
      {
        onSuccess: () => toast.success("Employees saved"),
        onError: (e: ApiError) => {
          toast.error(e?.message || "Failed to update employees")
          // Revert on failure
          setEmployees(initialEmployees || "")
        },
      }
    )
  }

  return (
    <section className="settings-section">
      <SettingsContainer>
        <SettingsContainerElem title="Logo" commingSoon>
          <WorkspaceAvatar logo={null} company={company || "Acme Inc."} />
        </SettingsContainerElem>
        <SettingsContainerElem
          title="Company name"
          childrenClassName="max-w-45"
        >
          <Input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Company name"
            className="text-sm"
          />
        </SettingsContainerElem>
        <SettingsContainerElem title="Website" childrenClassName="max-w-60">
          <div className="grid gap-2">
            <div className="relative">
              <Input
                value={website}
                onChange={(e) => {
                  setWebsite(e.target.value)
                  setWebsiteLoading(true)
                  setWebsiteInputError(null)
                }}
                placeholder="https://yourcompany.com"
                className="text-sm pr-8 w-50"
              />
              {websiteLoading ? (
                <Spinner className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
              ) : null}
            </div>
            {websiteInputError ? (
              <p className="text-xs text-destructive text-right max-w-50">
                {websiteInputError}
              </p>
            ) : null}
          </div>
        </SettingsContainerElem>
        <SettingsContainerElem
          title="Number of employees"
          childrenClassName="max-w-40"
        >
          <Select value={employees || ""} onValueChange={changeEmployees}>
            <SelectTrigger>
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              {EMPLOYEE_RANGES.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SettingsContainerElem>
      </SettingsContainer>
    </section>
  )
}
