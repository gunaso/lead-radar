"use client"

import type { Dispatch, ReactElement, SetStateAction } from "react"

import type { DateRange } from "react-day-picker"

import { Button } from "./ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card"
import { TagInput } from "./tag-input"
import { DateRangePicker } from "./ui/date-range-picker"
import type { Sentiment } from "../types/reddit"

type FiltersSidebarProps = {
  subreddits: string[]
  setSubreddits: Dispatch<SetStateAction<string[]>>
  sentiment: Sentiment | "All"
  setSentiment: (value: Sentiment | "All") => void
  keywords: string[]
  setKeywords: Dispatch<SetStateAction<string[]>>
  dateRange: DateRange | undefined
  setDateRange: (value: DateRange | undefined) => void
}

export function FiltersSidebar({
  subreddits,
  setSubreddits,
  sentiment,
  setSentiment,
  keywords,
  setKeywords,
  dateRange,
  setDateRange,
}: FiltersSidebarProps): ReactElement {
  return (
    <aside className="md:sticky md:top-16 h-max">
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>
            Refine results by source and context
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-5">
          <div className="space-y-5">
            <div>
              <div className="text-sm font-medium mb-2">Subreddits</div>
              <TagInput
                value={subreddits}
                onChange={setSubreddits}
                placeholder="Add subreddit and press Enter"
                suggestions={[
                  "r/entrepreneur",
                  "r/productivity",
                  "r/startups",
                  "r/sales",
                ]}
              />
            </div>

            <div>
              <div className="text-sm font-medium mb-2">Sentiment</div>
              <div className="flex flex-wrap gap-2">
                {["All", "Positive", "Neutral", "Negative"].map((s) => (
                  <Button
                    key={s}
                    variant={
                      sentiment === (s as Sentiment | "All")
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => setSentiment(s as Sentiment | "All")}
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-5">
            <div>
              <div className="text-sm font-medium mb-2">Keywords</div>
              <TagInput
                value={keywords}
                onChange={setKeywords}
                placeholder="Add keyword and press Enter"
                suggestions={["crm", "automation", "hubspot", "salesforce"]}
              />
            </div>

            <div>
              <div className="text-sm font-medium mb-2">Date range</div>
              <DateRangePicker value={dateRange} onChange={setDateRange} />
            </div>
          </div>
        </CardContent>
      </Card>
    </aside>
  )
}
