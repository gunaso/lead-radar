"use client"

import type { DateRange } from "react-day-picker"
import { useState } from "react"

import { DateRangePicker } from "@/components/ui/date-range-picker"
import { HeaderConfig } from "@/components/header/header-context"
import { Filter } from "@/components/ui/filter"
import { Sort, SortValue } from "@/components/ui/sort"

const keywordsOptions = [
  {
    value: "keyword1",
    label: "Keyword 1",
  },
  {
    value: "keyword2",
    label: "Keyword 2",
  },
  {
    value: "keyword3",
    label: "Keyword 3",
  },
  {
    value: "keyword4",
    label: "Keyword 4",
  },
  {
    value: "keyword5",
    label: "Keyword 5",
  },
  {
    value: "keyword6",
    label: "Keyword 6",
  },
  {
    value: "keyword7",
    label: "Keyword 7",
  },
  {
    value: "keyword8",
    label: "Keyword 8",
  },
  {
    value: "keyword9",
    label: "Keyword 9",
  },
]

const subredditsOptions = [
  {
    value: "subreddit1",
    label: "Subreddit 1",
  },
  {
    value: "subreddit2",
    label: "Subreddit 2",
  },
]

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

export default function PostsPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const [keywords, setKeywords] = useState<string[]>(
    keywordsOptions.map((option) => option.value)
  )
  const [subreddits, setSubreddits] = useState<string[]>(
    subredditsOptions.map((option) => option.value)
  )
  const [sentiment, setSentiment] = useState<string[]>(
    sentimentOptions.map((option) => option.value)
  )
  const [score, setScore] = useState<string[]>(
    scoreOptions.map((option) => option.value)
  )
  const [sort, setSort] = useState<SortValue>({
    field: "score",
    direction: "desc",
  })

  return (
    <section className="flex flex-col">
      <HeaderConfig
        config={{
          title: "Posts",
        }}
      />
      <div>
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
      </div>
    </section>
  )
}
