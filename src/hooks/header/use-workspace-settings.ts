"use client"

import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

import { useProfileQuery } from "@/queries/profile"
import {
  useScrapeWorkspace,
  useUpdateWorkspaceBasics,
  useWorkspaceCompanyValidation,
  useWorkspaceWebsiteValidation,
} from "@/queries/workspace"
import { normalizeWebsiteUrl } from "@/lib/api/url-utils"

export function useWorkspaceSettings(open: boolean, onOpenChange: (open: boolean) => void) {
  const { data } = useProfileQuery()

  const workspaceId = data?.profile?.workspace?.id ?? null
  const initialCompany = useMemo(() => data?.profile?.workspace?.company ?? "", [data])
  const initialWebsite = useMemo(() => data?.profile?.workspace?.website ?? "", [data])
  const initialEmployees = useMemo(() => data?.profile?.workspace?.employees ?? "", [data])

  const [companyName, setCompanyName] = useState("")
  const [website, setWebsite] = useState("")
  const [employees, setEmployees] = useState("")

  const [companyValid, setCompanyValid] = useState(true)
  const [websiteValid, setWebsiteValid] = useState(true)

  const updateBasics = useUpdateWorkspaceBasics()
  const scrapeWorkspace = useScrapeWorkspace()
  const companyValidation = useWorkspaceCompanyValidation()
  const websiteValidation = useWorkspaceWebsiteValidation()

  useEffect(() => {
    if (!open) return
    setCompanyName(initialCompany)
    setWebsite(initialWebsite ?? "")
    setEmployees(initialEmployees ?? "")
    setCompanyValid(true)
    setWebsiteValid(true)
  }, [open, initialCompany, initialWebsite, initialEmployees])

  const canSave =
    companyName.trim().length >= 2 &&
    employees.trim().length > 0 &&
    companyValid &&
    // Website is optional; only require websiteValid when provided
    (website.trim().length === 0 || websiteValid)

  const save = () => {
    if (!workspaceId) return
    if (!canSave) return

    const normalizedCurrent = normalizeWebsiteUrl(website.trim()) || ""
    const normalizedPrevious = normalizeWebsiteUrl((initialWebsite || "").trim()) || ""
    const websiteChanged = normalizedCurrent !== normalizedPrevious
    const hasWebsite = normalizedCurrent !== ""

    // Optimistically update and close dialog immediately
    updateBasics.mutate(
      {
        workspaceId,
        companyName: companyName.trim(),
        website: website.trim() ? normalizedCurrent : null,
        employees: employees.trim(),
      },
      {
        onSuccess: () => {
          toast.success("Workspace updated")
        },
        onError: (e: any) => toast.error(e?.message ?? "Failed to update workspace"),
      }
    )

    // Fire-and-forget scraping if website changed and present
    if (hasWebsite && websiteChanged) {
      scrapeWorkspace.mutate({ workspaceId, website: normalizedCurrent })
    }

    onOpenChange(false)
  }

  const validateCompany = async (value: string, signal?: AbortSignal) => {
    const res = await companyValidation.mutateAsync({ name: value, signal })
    setCompanyValid(!!res?.ok)
    return res
  }

  const validateWebsite = async (value: string, signal?: AbortSignal) => {
    const trimmed = value.trim()
    if (!trimmed) {
      setWebsiteValid(true)
      return { ok: true }
    }
    const res = await websiteValidation.mutateAsync({ website: trimmed, signal })
    setWebsiteValid(!!res?.ok)
    return res
  }

  return {
    workspaceId,
    companyName,
    setCompanyName,
    website,
    setWebsite,
    employees,
    setEmployees,
    companyValid,
    setCompanyValid,
    websiteValid,
    setWebsiteValid,
    canSave,
    save,
    validateCompany,
    validateWebsite,
  }
}


