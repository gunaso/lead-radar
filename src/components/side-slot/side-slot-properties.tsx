"use client"

import Link from "next/link"

import { SquareArrowOutUpRight } from "lucide-react"

import { OpenRedditButton } from "@/components/ui/open-reddit-button"
import { StatusDropdown } from "@/components/ui/dropdown-status"
import { ScoreDropdown } from "@/components/ui/dropdown-score"
import { SubredditAvatar } from "@/components/ui/avatar"
import { Expandable } from "@/components/ui/expandable"
import { Sentiment } from "@/components/ui/sentiment"
import { Keyword } from "@/components/ui/keywords"
import { Button } from "@/components/ui/button"

import { useItemUpdate } from "@/hooks/use-item-update"

import type { PostType, CommentType, SubredditType } from "@/types/reddit"

function Properties({ item }: { item: PostType | CommentType }) {
  const { updateScore, updateStatus } = useItemUpdate()
  const isPost = "title" in item
  const type = isPost ? "post" : "comment"

  return (
    <div className="px-2">
      <div className="flex items-center justify-end h-10">
        <OpenRedditButton url={item.url} />
      </div>

      <div className="flex flex-col gap-8 mt-6 pl-2 pr-2">
        <SubredditInfo subreddit={item.subreddit} />

        <div className="flex flex-col w-full gap-2">
          <StatusDropdown 
            initialStatus={item.status} 
            showLabelInTrigger 
            onStatusChange={(status) => updateStatus({ id: item.id, type, status })}
          />
          <ScoreDropdown 
            initialScore={item.score} 
            showLabelInTrigger 
            onScoreChange={(score) => updateScore({ id: item.id, type, score })}
          />
        </div>

        <SectionWithLabel label="Labels">
          <div className="flex flex-wrap gap-1.5">
            {item.keywords.map((keyword: string) => (
              <Keyword key={keyword} keyword={keyword} />
            ))}
          </div>
        </SectionWithLabel>

        <SectionWithLabel label="Sentiment">
          <Sentiment sentiment={item.sentiment} />
        </SectionWithLabel>

        <SectionWithLabel label="Subreddit Rules">
          <Expandable collapsedHeight={100}>
            <div className="whitespace-pre-wrap text-sm">
              {item.subreddit.rules}
            </div>
          </Expandable>
        </SectionWithLabel>
      </div>
    </div>
  )
}

function SubredditInfo({ subreddit }: { subreddit: SubredditType }) {
  return (
    <Link href={`https://www.reddit.com${subreddit.url}`} target="_blank">
      <Button
        variant="ghost"
        className="flex items-center justify-between gap-1.5 w-full px-1.5!"
      >
        <div className="flex items-center gap-1.5">
          <SubredditAvatar
            image={subreddit.image}
            name={subreddit.name}
            className="size-5"
          />
          <span className="text-2xs font-medium truncate">
            {subreddit.name}
          </span>
        </div>
        <SquareArrowOutUpRight className="size-3.5 text-muted-foreground" />
      </Button>
    </Link>
  )
}

function SectionWithLabel({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col w-full gap-1.5">
      <span className="text-sm text-muted-foreground">{label}</span>
      {children}
    </div>
  )
}

export { Properties }
