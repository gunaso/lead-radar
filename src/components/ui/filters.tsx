import { useEffect } from "react"

import { DateRangePicker } from "@/components/ui/date-range-picker"
import { Sort, SortValue } from "@/components/ui/sort"
import { Filter } from "@/components/ui/filter"
import { DateRange } from "react-day-picker"
import { useFiltersContext } from "@/hooks/use-filters"

const sentimentOptions = [
  {
    value: "positive",
    label: "Positive",
  },
  {
    value: "neutral",
    label: "Neutral",
  },
  {
    value: "negative",
    label: "Negative",
  },
]

const scoreOptions = [
  {
    value: "prime",
    label: "Prime",
  },
  {
    value: "high",
    label: "High",
  },
  {
    value: "medium",
    label: "Medium",
  },
  {
    value: "low",
    label: "Low",
  },
]

function Filters() {
  const {
    subredditsOptions,
    keywordsOptions,
    subredditsState,
    sentimentState,
    dateRangeState,
    keywordsState,
    scoreState,
    sortState,
  } = useFiltersContext()

  const [subreddits, setSubreddits] = subredditsState
  const [sentiment, setSentiment] = sentimentState
  const [dateRange, setDateRange] = dateRangeState
  const [keywords, setKeywords] = keywordsState
  const [score, setScore] = scoreState
  const [sort, setSort] = sortState

  useEffect(() => {
    setSubreddits(subredditsOptions.map((option) => option.value))
    setKeywords(keywordsOptions.map((option) => option.value))
    setSentiment(sentimentOptions.map((option) => option.value))
    setScore(scoreOptions.map((option) => option.value))
  }, [subredditsOptions, keywordsOptions, sentimentOptions, scoreOptions])

  return (
    <div className="flex flex-row h-10 md:max-[60rem]:flex-col md:max-[60rem]:h-20 max-[45rem]:flex-col max-[45rem]:h-20 shrink-0 items-center justify-between border-b-1">
      <div className="page-padding-x flex items-center gap-2 h-10 md:max-[60rem]:w-full md:max-[60rem]:border-b-1 max-[45rem]:w-full max-[45rem]:border-b-1">
        <Filter
          name="Keywords"
          selectedState={[keywords, setKeywords]}
          options={keywordsOptions}
        />
        <Filter
          name="Subreddits"
          selectedState={[subreddits, setSubreddits]}
          options={subredditsOptions}
        />
        <Filter
          name="Sentiment"
          selectedState={[sentiment, setSentiment]}
          options={sentimentOptions}
          disableSearch
        />
        <Filter
          name="Score"
          selectedState={[score, setScore]}
          options={scoreOptions}
          disableSearch
        />
        <DateRangePicker value={dateRange} onChange={setDateRange} />
      </div>
      <div className="page-padding-x flex items-center justify-end h-10 md:max-[60rem]:w-full max-[45rem]:w-full">
        <Sort value={sort} onChange={setSort} />
      </div>
    </div>
  )
}

export { Filters }
