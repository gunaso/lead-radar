import { StatusDropdown } from "@/components/ui/dropdown-status"
import { ScoreDropdown } from "@/components/ui/dropdown-score"
import { GuardedLink } from "@/components/ui/guarded-link"
import { SubredditAvatar } from "@/components/ui/avatar"
import { DateLines } from "@/components/ui/date-lines"
import { KeywordsRow } from "@/components/ui/keywords"
import { Checkbox } from "@/components/ui/checkbox"

import { encodeBreadcrumbParam } from "@/lib/breadcrumbs"

import type { PostType, CommentType } from "@/types/reddit"

function FeedItem({
  url,
  item,
  children,
  bcCrumbs,
}: {
  url: string
  item: PostType | CommentType
  children: React.ReactNode
  bcCrumbs?: Array<{ label: string; href?: string }>
}) {
  const baseHref = `${url}/${item.id}`
  const href = (() => {
    if (!bcCrumbs || bcCrumbs.length === 0) return baseHref
    const bc = encodeBreadcrumbParam(bcCrumbs)
    const sep = baseHref.includes("?") ? "&" : "?"
    return `${baseHref}${sep}bc=${encodeURIComponent(bc)}`
  })()
  return (
    <GuardedLink
      href={href}
      className="page-padding-x group relative group flex flex-col hover:bg-muted has-[[data-state=checked]]:bg-accent/80 has-[[data-state=checked]]:hover:bg-accent hover:cursor-default border-b-border/20 not-last:border-b"
    >
      <div className="flex items-center justify-between h-11 lg:pl-0 pl-6 gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-grow-1">
          <Checkbox className="absolute lg:left-2 left-4 lg:not-data-[state=checked]:not-group-hover:hidden group-hover:block" />
          <ScoreDropdown initialScore={item.score} />
          <StatusDropdown initialStatus={item.status} />
          <span className="truncate min-w-0 text-sm font-medium pr-2 lg:max-w-120 md:max-w-100 sm:max-w-75">
            {"title" in item ? item.title : item.summary || item.content}
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
    </GuardedLink>
  )
}

export { FeedItem }
