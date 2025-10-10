"use client"

import { useMemo, type ReactElement, type Dispatch, type SetStateAction } from "react"

import { Check } from "lucide-react"

import KeywordsStep from "@/components/onboarding/keywords"
import SubredditsStep from "@/components/onboarding/subreddits"
import CompetitorsStep from "@/components/onboarding/competitors"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { CompetitorInput } from "@/types/onboarding"
import type { SubredditResult } from "@/hooks/use-subreddit-search"

export type TrackingTabValue = "keywords" | "subreddits" | "competitors"

type TrackingTabsProps = {
  value: TrackingTabValue
  onValueChange: (value: TrackingTabValue) => void

  // Keywords
  keywords: string[]
  setKeywords: (value: string[]) => void

  // Subreddits
  query: string
  setQuery: (value: string) => void
  results: SubredditResult[]
  searching: boolean
  subreddits: string[]
  setSubreddits: Dispatch<SetStateAction<string[]>>
  addSubreddit: (name: string) => void
  upsertDetails: (
    input: Partial<{
      name: string
      title?: string | null
      description?: string | null
      description_reddit?: string | null
      created_utc?: number | null
      total_members?: number | null
    }>
  ) => void

  // Competitors
  competitors: CompetitorInput[]
  setCompetitors: Dispatch<SetStateAction<CompetitorInput[]>>

  // Completion flags
  isKeywordsDone: boolean
  isSubredditsDone: boolean
  isCompetitorsDone: boolean
}

export default function TrackingTabs(props: TrackingTabsProps): ReactElement {
  const completed = useMemo(
    () => ({
      keywords: props.isKeywordsDone,
      subreddits: props.isSubredditsDone,
      competitors: props.isCompetitorsDone,
    }),
    [props.isKeywordsDone, props.isSubredditsDone, props.isCompetitorsDone]
  )

  return (
    <Tabs value={props.value} onValueChange={(v) => props.onValueChange(v as TrackingTabValue)} className="w-full">
      <TabsList className="mb-2">
        <TabsTrigger value="keywords">
          <Check className={completed.keywords ? "text-green-600" : "text-muted-foreground"} />
          Keywords
        </TabsTrigger>
        <TabsTrigger value="subreddits">
          <Check className={completed.subreddits ? "text-green-600" : "text-muted-foreground"} />
          Subreddits
        </TabsTrigger>
        <TabsTrigger value="competitors">
          <Check className={completed.competitors ? "text-green-600" : "text-muted-foreground"} />
          Competitors
        </TabsTrigger>
      </TabsList>

      <TabsContent value="keywords">
        <KeywordsStep keywords={props.keywords} setKeywords={props.setKeywords} />
      </TabsContent>

      <TabsContent value="subreddits">
        <SubredditsStep
          query={props.query}
          setQuery={props.setQuery}
          results={props.results}
          searching={props.searching}
          subreddits={props.subreddits}
          setSubreddits={props.setSubreddits}
          addSubreddit={props.addSubreddit}
          upsertDetails={props.upsertDetails}
        />
      </TabsContent>

      <TabsContent value="competitors">
        <CompetitorsStep competitors={props.competitors} setCompetitors={props.setCompetitors} />
      </TabsContent>
    </Tabs>
  )
}
