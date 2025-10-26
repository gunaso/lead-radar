"use client"

import { useSearchParams } from "next/navigation"

import { DotIcon } from "lucide-react"

import { SideSlotConfig } from "@/components/side-slot/side-slot-context"
import { Properties } from "@/components/side-slot/side-slot-properties"
import { HeaderConfig } from "@/components/header/header-context"
import { StatusDropdown } from "@/components/ui/dropdown-status"
import { ScoreDropdown } from "@/components/ui/dropdown-score"
import { ItemActions } from "@/components/ui/item-actions"
import { PostHeader } from "@/components/ui/post-header"
import { Expandable } from "@/components/ui/expandable"
import { Sentiment } from "@/components/ui/sentiment"
import { Separator } from "@/components/ui/separator"

import type { PostType, CommentType } from "@/types/reddit"
import { formatRelativeOrLocaleDate } from "@/lib/utils"
import { PATHS } from "@/lib/path"

const comment: CommentType = {
  id: "1",
  content:
    "Perfect question from someone who is really one step away from the leap. The problem is not how much to charge for backlinks, but how to position yourself. If you continue to sell “links”, they will pay you as a supplier; if you sell “guaranteed editorial mentions on DR75+ sites”, they will pay you as a consultant. I would take $200-400 per link if it is a quality HARO, but with a solid brand positioning you can reach $800 without difficulty. Create a showcase mini-site with 3-4 case studies and directly contact medium-large SEO agencies offering white-labels: it's the quickest way to go from underpaid freelancer to sought-after partner.",
  status: "Needs Review",
  score: "Low",
  sentiment: "Positive",
  author: "u/user_123_seo",
  postedAt: "2025-10-25 08:00:00",
  url: "/r/SEO/comments/1oavdbc/comment/nkcefli/",
  summary: "This is a summary of the comment",
  keywords: ["backlink", "profile", "traffic"],
  subreddit: {
    id: "1",
    name: "r/SEO",
    image:
      "https://styles.redditmedia.com/t5_2qhbx/styles/communityIcon_191l6xkqju6d1.png?width=96&height=96&frame=1&auto=webp&crop=96%3A96%2Csmart&s=00e40b468c3e6e5bbebeaecc7a6f5c3345a27199",
    url: "/r/SEO/",
    rules:
      "1. No spam\n2. No self-promotion\n3. No trolling\n4. No hate speech\n5. No personal attacks\n6. No harassment\n7. No spam\n8. No self-promotion\n9. No trolling\n10. No hate speech\n11. No personal attacks\n12. No harassment",
  },
  post: {
    id: "adhiaudnas123kjna8d7h1iansdn1283rjpgom",
    title:
      "Website with better backlink profile had its traffic tanked in Jun-Jul Update",
    content: `So this is interesting, or perhaps I'm missing something.\n\nNeither of the websites are mine. These were ranking for a keyword I was trying to rank for. I found these when I was researching for top ranking websites for my keyword.\n\nWebsite 1: digitalmarkitors(dot)com: This is the website with better backlink profile. I say better because it seems to have links from pages that are contextually relevant (both content theme and location wise). But it's traffic started declining after the update.\n\nWebsite 2: pankajkumarseo(dot)com: However, this website, despite having a lot of irrelevant links, got a bump in traffic around the same time ye update was rolled out.\n\nWhat's the catch here?\n\nMy assumption was having a few high quality links (links from high DA websites and from pages that are contextually relevant) is better. But that seems to be the opposite for this case. Am I missing something?\n\nCould it be that the organic traffic on the pages the second website is getting links from is higher on an average and hence despite contextual irrelevance the links in the second case could be considered better than the first?`,
    author: "u/user_123_seo",
    subreddit: {
      id: "1",
      name: "r/SEO",
      image:
        "https://styles.redditmedia.com/t5_2qhbx/styles/communityIcon_191l6xkqju6d1.png?width=96&height=96&frame=1&auto=webp&crop=96%3A96%2Csmart&s=00e40b468c3e6e5bbebeaecc7a6f5c3345a27199",
      url: "/r/SEO/",
      rules:
        "1. No spam\n2. No self-promotion\n3. No trolling\n4. No hate speech\n5. No personal attacks\n6. No harassment\n7. No spam\n8. No self-promotion\n9. No trolling\n10. No hate speech\n11. No personal attacks\n12. No harassment",
    },
    sentiment: "Neutral",
    status: "Engaging",
    score: "Prime",
    keywords: ["backlink", "profile", "traffic"],
    summary: "This is a summary of the post",
    postedAt: "2025-10-25 08:00:00",
    url: "/r/SEO/comments/1ofkfke/website_with_better_backlink_profile_had_its/",
  },
}

export default function CommentPage() {
  const searchParams = useSearchParams()
  const label = comment.summary.split(" ")
  const postTitleParts = comment.post.title.split(" ")
  const postLabel = `${postTitleParts.slice(0, 3).join(" ")}${
    postTitleParts.length > 3 ? "..." : ""
  }`
  const bcParam = searchParams?.get("bc") || ""
  const showPostCrumb = (searchParams?.get("src") || "") === "post"
  const postHrefBase = `${PATHS.POSTS}/${comment.post.id}`
  const postHref = bcParam
    ? `${postHrefBase}?bc=${encodeURIComponent(bcParam)}`
    : postHrefBase

  return (
    <>
      <SideSlotConfig
        config={{
          content: <Properties item={comment} />,
        }}
      />
      <div className="page-padding-x flex flex-col gap-2 py-6">
        <HeaderConfig
          config={{
            breadcrumbs: [
              ...(showPostCrumb
                ? [
                    {
                      key: `post-${comment.post.id}`,
                      label: postLabel,
                      href: postHref,
                      loading: false,
                    },
                  ]
                : []),
              {
                key: comment.id,
                label: `${label.slice(0, 3).join(" ")}${
                  label.length > 3 ? "..." : ""
                }`,
                loading: false,
              },
            ],
          }}
        />
        <CommentHeader comment={comment} />

        <Expandable collapsedHeight={220} bigDiv>
          <div className="whitespace-pre-wrap text-sm">{comment.content}</div>
        </Expandable>

        <ItemActions redditItemUrl={comment.url} />

        <Separator className="my-1.5" />

        <CommentPost
          post={comment.post}
          bcParam={searchParams?.get("bc") || ""}
        />
      </div>
    </>
  )
}

function CommentHeader({ comment }: { comment: CommentType }) {
  return (
    <div className="flex flex-col gap-1 mb-3">
      <span className="flex items-center gap-1">
        <span className="text-md font-medium">{comment.author}</span>
        <DotIcon className="size-4" />
        <span className="text-sm text-muted-foreground">
          {formatRelativeOrLocaleDate(comment.postedAt)}
        </span>
      </span>
    </div>
  )
}

function CommentPost({ post, bcParam }: { post: PostType; bcParam?: string }) {
  return (
    <div className="flex flex-col gap-2 bg-card p-3 rounded-sm">
      <PostHeader post={post} titleSize="text-lg" redditUrl={post.url} />

      <Expandable collapsedHeight={220} bgTo="card">
        <div className="whitespace-pre-wrap text-sm p-3 bg-muted rounded-md">
          {post.content}
        </div>
      </Expandable>
      <ItemActions
        className="mt-2"
        openUrl={`${PATHS.POSTS}/${post.id}${
          bcParam ? `?bc=${encodeURIComponent(bcParam)}` : ""
        }`}
        redditItemUrl={post.url}
        extraActions={
          <>
            <StatusDropdown initialStatus={post.status} />
            <ScoreDropdown initialScore={post.score} />
            <Sentiment sentiment={post.sentiment} sm />
          </>
        }
      />
    </div>
  )
}
