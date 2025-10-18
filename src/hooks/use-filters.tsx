import * as React from "react"

import type { DateRange } from "react-day-picker"

import type { SortValue } from "@/components/ui/sort"

type Option = { value: string; label: string }

export type UseFiltersArgs = {
  keywordsOptions?: Option[]
  subredditsOptions?: Option[]
  initialDateRange?: DateRange
  initialKeywords?: string[]
  initialSubreddits?: string[]
  initialSentiment?: string[]
  initialScore?: string[]
}

export type UseFiltersResult = {
  // option lists to be used by UI components
  keywordsOptions: Option[]
  subredditsOptions: Option[]
  sentimentOptions: Option[]
  scoreOptions: Option[]

  // controlled states (tuple form for easy prop drilling)
  keywordsState: [string[], React.Dispatch<React.SetStateAction<string[]>>]
  subredditsState: [string[], React.Dispatch<React.SetStateAction<string[]>>]
  sentimentState: [string[], React.Dispatch<React.SetStateAction<string[]>>]
  scoreState: [string[], React.Dispatch<React.SetStateAction<string[]>>]
  dateRangeState: [
    DateRange | undefined,
    React.Dispatch<React.SetStateAction<DateRange | undefined>>
  ]
  sortState: [
    SortValue | undefined,
    React.Dispatch<React.SetStateAction<SortValue | undefined>>
  ]

  // helpers for future URL-sync / navigation
  toSearchParams: () => URLSearchParams
}

const DEFAULT_SENTIMENT_OPTIONS: Option[] = [
  { value: "positive", label: "Positive" },
  { value: "neutral", label: "Neutral" },
  { value: "negative", label: "Negative" },
]

const DEFAULT_SCORE_OPTIONS: Option[] = [
  { value: "prime", label: "Prime" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
]

function keepOnlyValid(selected: string[], options: Option[]): string[] {
  if (!selected?.length) return []
  const valid = new Set(options.map((o) => o.value))
  return selected.filter((v) => valid.has(v))
}

export function useFilters(args: UseFiltersArgs = {}): UseFiltersResult {
  const {
    keywordsOptions = [],
    subredditsOptions = [],
    initialDateRange,
    initialKeywords,
    initialSubreddits,
    initialSentiment,
    initialScore,
  } = args

  // Options are passed in (and may change later via props/APIs)
  const [keywordsOptionsState, setKeywordsOptionsState] =
    React.useState(keywordsOptions)
  const [subredditsOptionsState, setSubredditsOptionsState] =
    React.useState(subredditsOptions)

  React.useEffect(() => {
    setKeywordsOptionsState(keywordsOptions)
  }, [keywordsOptions])

  React.useEffect(() => {
    setSubredditsOptionsState(subredditsOptions)
  }, [subredditsOptions])

  // Selections
  const [keywords, setKeywords] = React.useState<string[]>(
    initialKeywords ?? []
  )
  const [subreddits, setSubreddits] = React.useState<string[]>(
    initialSubreddits ?? []
  )
  const [sentiment, setSentiment] = React.useState<string[]>(
    initialSentiment ?? DEFAULT_SENTIMENT_OPTIONS.map((o) => o.value)
  )
  const [score, setScore] = React.useState<string[]>(
    initialScore ?? DEFAULT_SCORE_OPTIONS.map((o) => o.value)
  )
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(
    initialDateRange
  )
  const [sort, setSort] = React.useState<SortValue | undefined>({
    field: "score",
    direction: "desc",
  })

  // Initialize to "all" when options arrive for the first time
  React.useEffect(() => {
    if (keywordsOptionsState.length) {
      setKeywords((prev) => {
        if (prev.length === 0) return keywordsOptionsState.map((o) => o.value)
        return keepOnlyValid(prev, keywordsOptionsState)
      })
    } else {
      setKeywords([])
    }
  }, [keywordsOptionsState])

  React.useEffect(() => {
    if (subredditsOptionsState.length) {
      setSubreddits((prev) => {
        if (prev.length === 0) return subredditsOptionsState.map((o) => o.value)
        return keepOnlyValid(prev, subredditsOptionsState)
      })
    } else {
      setSubreddits([])
    }
  }, [subredditsOptionsState])

  const toSearchParams = React.useCallback((): URLSearchParams => {
    const params = new URLSearchParams()
    if (keywords.length) params.set("keywords", keywords.join(","))
    if (subreddits.length) params.set("subreddits", subreddits.join(","))
    if (sentiment.length) params.set("sentiment", sentiment.join(","))
    if (score.length) params.set("score", score.join(","))
    if (dateRange?.from) params.set("from", dateRange.from.toISOString())
    if (dateRange?.to) params.set("to", dateRange.to.toISOString())
    if (sort) params.set("sort", `${sort.field}:${sort.direction}`)
    return params
  }, [keywords, subreddits, sentiment, score, dateRange, sort])

  return {
    keywordsOptions: keywordsOptionsState,
    subredditsOptions: subredditsOptionsState,
    sentimentOptions: DEFAULT_SENTIMENT_OPTIONS,
    scoreOptions: DEFAULT_SCORE_OPTIONS,

    keywordsState: [keywords, setKeywords],
    subredditsState: [subreddits, setSubreddits],
    sentimentState: [sentiment, setSentiment],
    scoreState: [score, setScore],
    dateRangeState: [dateRange, setDateRange],
    sortState: [sort, setSort],

    toSearchParams,
  }
}

// Context to avoid prop drilling for filters across pages/components
type FiltersContextValue = UseFiltersResult

const FiltersContext = React.createContext<FiltersContextValue | null>(null)

type FiltersProviderProps = React.PropsWithChildren<UseFiltersArgs>

export function FiltersProvider({ children, ...args }: FiltersProviderProps) {
  const value = useFilters(args)
  return (
    <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>
  )
}

export function useFiltersContext(): FiltersContextValue {
  const ctx = React.useContext(FiltersContext)
  if (!ctx) {
    throw new Error("useFiltersContext must be used within a FiltersProvider")
  }
  return ctx
}
