"use client"

import {
  type SetStateAction,
  type ReactElement,
  type Dispatch,
  useMemo,
} from "react"

import {
  type LucideIcon,
  CircleCheck,
  SearchCheck,
  Swords,
  Layers,
} from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CompetitorsStep from "@/components/onboarding/competitors"
import SubredditsStep from "@/components/onboarding/subreddits"
import KeywordsStep from "@/components/onboarding/keywords"

import type { SubredditResult } from "@/hooks/use-subreddit-search"
import type { CompetitorInput } from "@/types/onboarding"
import { cn } from "@/lib/utils"

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

  showIcons?: boolean
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
    <Tabs
      value={props.value}
      onValueChange={(v) => props.onValueChange(v as TrackingTabValue)}
      className="w-full min-h-[300px]"
    >
      <TabsList className="mb-3 bg-transparent! max-w-[270px] w-full items-start h-auto! mx-auto pb-6">
        <TabSelector
          step={1}
          title="Keywords"
          completed={completed.keywords}
          ShowIcon={props.showIcons ? SearchCheck : null}
        />
        <TabConnector showingIcons={props.showIcons} />
        <TabSelector
          step={2}
          title="Subreddits"
          completed={completed.subreddits}
          ShowIcon={props.showIcons ? Layers : null}
        />
        <TabConnector showingIcons={props.showIcons} />
        <TabSelector
          step={3}
          title="Competitors"
          completed={completed.competitors}
          ShowIcon={props.showIcons ? Swords : null}
        />
      </TabsList>

      <TabsContent value="keywords" className="min-h-62">
        <KeywordsStep
          keywords={props.keywords}
          setKeywords={props.setKeywords}
        />
      </TabsContent>

      <TabsContent value="subreddits" className="min-h-62">
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

      <TabsContent value="competitors" className="min-h-62">
        <CompetitorsStep
          competitors={props.competitors}
          setCompetitors={props.setCompetitors}
        />
      </TabsContent>
    </Tabs>
  )
}

function TabSelector({
  step,
  title,
  completed,
  ShowIcon = null,
}: {
  step: number
  title: string
  completed: boolean
  ShowIcon?: LucideIcon | null
}) {
  return (
    <TabsTrigger
      value={title.toLowerCase()}
      className="flex flex-col justify-centeritems-center gap-2 relative p-0 data-[state=active]:bg-transparent rounded-full active:scale-100! data-[state=active]:shadow-none group focus-visible:outline-none focus-visible:ring-0 focus-visible:border-none"
    >
      {ShowIcon ? (
        <span className="flex items-center justify-center size-8 rounded-full border-2 border-muted-foreground/80 text-muted-foreground/80 group-data-[state=active]:shadow-sm">
          <ShowIcon className="size-4" />
        </span>
      ) : completed ? (
        <CircleCheck className="text-green-600 size-6 group-data-[state=active]:[text-shadow:0_1px_0_rgba(0,0,0,0.10)]" />
      ) : (
        <span className="flex items-center justify-center size-6 rounded-full border-2 border-muted-foreground/80 text-muted-foreground/80 group-data-[state=active]:shadow-sm">
          {step}
        </span>
      )}
      <span className="absolute bottom-[-25px] text-center text-muted-foreground/80 group-data-[state=active]:font-semibold group-data-[state=active]:[text-shadow:0_1px_0_rgba(0,0,0,0.10)]">
        {title}
      </span>
    </TabsTrigger>
  )
}

function TabConnector({ showingIcons }: { showingIcons: boolean | undefined }) {
  return (
    <div
      className={cn(
        "h-6 flex items-center justify-center w-full pt-px",
        showingIcons ? "h-10" : ""
      )}
    >
      <span className="w-full h-[2px] bg-muted-foreground/80" />
    </div>
  )
}
