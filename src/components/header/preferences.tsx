"use client"

import { toast } from "sonner"
import {
  type SetStateAction,
  type ReactElement,
  type Dispatch,
  useCallback,
  useEffect,
  useState,
  useMemo,
} from "react"

import { ChevronLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import TrackingTabs, {
  type TrackingTabValue,
} from "@/components/onboarding/tracking-tabs"
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Dialog,
} from "@/components/ui/dialog"

import type { SubredditDetailsInput } from "@/lib/api/workspace-entities"
import { useSubredditSearch } from "@/hooks/use-subreddit-search"
import { useUpdateWorkspaceEntities } from "@/queries/workspace"
import type { CompetitorInput } from "@/types/onboarding"
import { useProfileQuery } from "@/queries/profile"
import {
  buildSubredditDetails,
  normalizeSubreddits,
} from "@/lib/workspace-utils"

type PreferencesProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function Preferences({
  open,
  onOpenChange,
}: PreferencesProps): ReactElement {
  const { data } = useProfileQuery()

  const workspaceId = data?.profile?.workspace?.id ?? null
  const initialKeywords = useMemo<string[]>(
    () =>
      Array.isArray(data?.profile?.workspace?.keywords)
        ? (data!.profile!.workspace!.keywords as string[])
        : [],
    [data]
  )
  const initialSubreddits = useMemo<string[]>(() => {
    const source = data?.profile?.workspace?.subreddits
    if (!Array.isArray(source)) return []
    return source
      .map((s: any) => (typeof s?.name === "string" ? s.name : ""))
      .filter(Boolean)
  }, [data])

  const initialCompetitors = useMemo<CompetitorInput[]>(() => {
    const list = data?.profile?.workspace?.competitors
    if (!Array.isArray(list)) return []
    return list
      .map((c: any) => ({
        name: String(c?.name ?? "").trim(),
        website: c?.website ?? null,
      }))
      .filter((c) => c.name.length > 0)
  }, [data])

  const [competitors, setCompetitors] = useState<CompetitorInput[]>([])
  const [tab, setTab] = useState<TrackingTabValue>("keywords")
  const [subreddits, setSubreddits] = useState<string[]>([])
  const [keywords, setKeywords] = useState<string[]>([])

  // Subreddit search state
  const subredditSearch = useSubredditSearch({
    active: open && tab === "subreddits",
  })

  // Local store of details by lowercase name for persistence during session
  const [detailsByName, setDetailsByName] = useState<
    Record<string, SubredditDetailsInput>
  >({})

  // Hydrate from profile when dialog opens or profile changes
  useEffect(() => {
    if (!open) return
    setKeywords(initialKeywords)
    setSubreddits(initialSubreddits)
    setCompetitors(initialCompetitors)
    // Initialize known subreddit details from profile payload (if present)
    const source = data?.profile?.workspace?.subreddits
    if (Array.isArray(source)) {
      const next: Record<string, SubredditDetailsInput> = {}
      for (const s of source as any[]) {
        if (!s?.name) continue
        next[String(s.name).toLowerCase()] = {
          name: s.name,
          title: s.title ?? null,
          description: s.description ?? null,
          description_reddit: s.description_reddit ?? null,
          created_utc: s.created_at ? Date.parse(s.created_at) / 1000 : null,
          total_members:
            typeof s.total_members === "number" ? s.total_members : null,
        }
      }
      setDetailsByName(next)
    } else {
      setDetailsByName({})
    }
    subredditSearch.setQuery("")
  }, [open, initialKeywords, initialSubreddits, initialCompetitors, data])

  // Only reset to first tab when dialog opens (not on profile changes)
  useEffect(() => {
    if (open) setTab("keywords")
  }, [open])

  const addSubreddit = useCallback((name: string) => {
    setSubreddits((prev) => {
      const exists = prev.some((s) => s.toLowerCase() === name.toLowerCase())
      return exists ? prev : [...prev, name]
    })
  }, [])

  const upsertDetails = useCallback((input: Partial<SubredditDetailsInput>) => {
    const key = String(input.name ?? "").toLowerCase()
    if (!key) return
    setDetailsByName((prev) => ({
      ...prev,
      [key]: {
        name: input.name as string,
        title: input.title ?? prev[key]?.title ?? null,
        description: input.description ?? prev[key]?.description ?? null,
        description_reddit:
          input.description_reddit ?? prev[key]?.description_reddit ?? null,
        created_utc: input.created_utc ?? prev[key]?.created_utc ?? null,
        total_members: input.total_members ?? prev[key]?.total_members ?? null,
      },
    }))
  }, [])

  const isKeywordsDone = keywords.length > 0
  const isSubredditsDone = subreddits.length > 0
  const isCompetitorsDone = competitors.length > 0

  const updateWorkspaceEntities = useUpdateWorkspaceEntities()

  // helpers provided by workspace-utils

  // Optimistic navigation helpers
  const goNext = useCallback(() => {
    setTab((t) => (t === "keywords" ? "subreddits" : "competitors"))
  }, [])
  const goBack = useCallback(() => {
    setTab((t) => (t === "competitors" ? "subreddits" : "keywords"))
  }, [])

  // Action handlers
  const handleSaveKeywords = useCallback(() => {
    if (!workspaceId) return
    goNext()
    updateWorkspaceEntities.mutate(
      { workspaceId, keywords: [...keywords] },
      {
        onSuccess: () => toast.success("Keywords saved"),
        onError: (e: any) =>
          toast.error(e?.message ?? "Failed to save keywords"),
      }
    )
  }, [workspaceId, keywords, goNext, updateWorkspaceEntities])

  const handleSaveSubreddits = useCallback(() => {
    if (!workspaceId) return
    const normalized = normalizeSubreddits(subreddits)
    const subredditsDetails = buildSubredditDetails(normalized, detailsByName)
    goNext()
    updateWorkspaceEntities.mutate(
      { workspaceId, subreddits: normalized, subredditsDetails },
      {
        onSuccess: () => toast.success("Subreddits saved"),
        onError: (e: any) =>
          toast.error(e?.message ?? "Failed to save subreddits"),
      }
    )
  }, [
    workspaceId,
    subreddits,
    goNext,
    updateWorkspaceEntities,
    buildSubredditDetails,
  ])

  const handleSaveCompetitors = useCallback(() => {
    if (!workspaceId) return
    onOpenChange(false)
    updateWorkspaceEntities.mutate(
      { workspaceId, competitors: [...competitors] },
      {
        onSuccess: () => toast.success("Competitors saved"),
        onError: (e: any) =>
          toast.error(e?.message ?? "Failed to save competitors"),
      }
    )
  }, [workspaceId, competitors, onOpenChange, updateWorkspaceEntities])

  const isPrimaryDisabled = useMemo(() => {
    if (tab === "keywords") return !isKeywordsDone
    if (tab === "subreddits") return !isSubredditsDone
    return !isCompetitorsDone
  }, [tab, isKeywordsDone, isSubredditsDone, isCompetitorsDone])

  const handlePrimaryAction = useCallback(() => {
    if (tab === "keywords") {
      handleSaveKeywords()
      return
    }
    if (tab === "subreddits") {
      handleSaveSubreddits()
      return
    }
    handleSaveCompetitors()
  }, [tab, handleSaveKeywords, handleSaveSubreddits, handleSaveCompetitors])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl w-full gap-10">
        <DialogHeader>
          <DialogTitle className="mx-auto">Monitoring Preferences</DialogTitle>
        </DialogHeader>

        <TrackingTabs
          value={tab}
          onValueChange={setTab}
          keywords={keywords}
          setKeywords={setKeywords}
          query={subredditSearch.query}
          setQuery={subredditSearch.setQuery}
          results={subredditSearch.results}
          searching={subredditSearch.searching}
          subreddits={subreddits}
          setSubreddits={setSubreddits as Dispatch<SetStateAction<string[]>>}
          addSubreddit={addSubreddit}
          upsertDetails={upsertDetails}
          competitors={competitors}
          setCompetitors={
            setCompetitors as Dispatch<SetStateAction<CompetitorInput[]>>
          }
          isKeywordsDone={isKeywordsDone}
          isSubredditsDone={isSubredditsDone}
          isCompetitorsDone={isCompetitorsDone}
          showIcons={true}
        />

        <DialogFooter>
          <div className="mr-auto">
            <Button
              type="button"
              variant="ghost"
              onClick={goBack}
              disabled={tab === "keywords"}
            >
              <ChevronLeft className="size-4" />
              Previous
            </Button>
          </div>
          <Button
            type="button"
            onClick={handlePrimaryAction}
            disabled={isPrimaryDisabled}
          >
            {tab === "competitors" ? "Save" : "Save & Next"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
