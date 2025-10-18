import Link from "next/link"

import { type Status, StatusDropdown } from "@/components/ui/dropdown-status"
import { type Score, ScoreDropdown } from "@/components/ui/dropdown-score"
import { SubredditAvatar } from "@/components/ui/avatar"
import { DateLines } from "@/components/ui/date-lines"
import { KeywordsRow } from "@/components/ui/keywords"
import { Checkbox } from "@/components/ui/checkbox"

type FeedItemType = {
  id: string
  score: Score
  status: Status
  title: string
  keywords: string[]
  subreddit: {
    image: string
    name: string
  }
  postedAt: string
}

function FeedItem({
  url,
  item,
  children,
}: {
  url: string
  item: FeedItemType
  children: React.ReactNode
}) {
  return (
    <Link
      href={`${url}/${item.id}`}
      className="page-padding-x group relative group flex flex-col hover:bg-muted has-[[data-state=checked]]:bg-accent/80 has-[[data-state=checked]]:hover:bg-accent hover:cursor-default border-b-border/20 not-last:border-b"
    >
      <div className="flex items-center justify-between h-11 lg:pl-0 pl-6 gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-grow-1">
          <Checkbox className="absolute lg:left-2 left-4 lg:not-data-[state=checked]:not-group-hover:hidden group-hover:block" />
          <ScoreDropdown initialScore={item.score} />
          <StatusDropdown initialStatus={item.status} />
          <span className="truncate min-w-0 text-sm font-medium pr-2 lg:max-w-120 md:max-w-100 sm:max-w-75">
            {item.title}
          </span>
          <KeywordsRow keywords={item.keywords} />
        </div>
        <div className="flex items-center gap-2">
          <SubredditAvatar
            image={item.subreddit.image}
            name={item.subreddit.name}
            className="size-5"
          />
          <DateLines postedAt={item.postedAt} />
        </div>
      </div>
      {children}
    </Link>
  )
}

export { FeedItem, type FeedItemType }
