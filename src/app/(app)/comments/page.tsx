"use client"

import { HeaderConfig } from "@/components/header/header-context"
import { Comment, type CommentType } from "@/components/comment"
import { GroupedLayout } from "@/components/grouped-layout"
import { Filters } from "@/components/filters"

import { FiltersProvider } from "@/hooks/use-filters"

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

const comments = [
  {
    id: "1",
    title: "Totally normal — GSC can lag. Give it a week or two and re-crawl.",
    subreddit: {
      name: "r/SEO",
      image: null,
    },
    sentiment: "neutral",
    status: "Engaged",
    score: "Prime",
    keywords: ["keyword1", "keyword2"],
    postedAt: "2025-08-01",
    post: {
      title: "Mini title",
      summary:
        "Found an organic backlink from Fortune via Bing Webmaster Tools, but Google Search Console doesn’t list it as a top linking site. Asking why Google might not recognize the link yet and what can be done to help Google track it.",
    },
  },
  {
    id: "2",
    title: "Request indexing on the source page and check if it’s nofollow.",
    subreddit: {
      name: "r/SEO",
      image:
        "https://styles.redditmedia.com/t5_2qhbx/styles/communityIcon_191l6xkqju6d1.png?width=128&frame=1&auto=webp&s=98d43911f4989d3efa12445a5b1508a4c5c2e61a",
    },
    sentiment: "positive",
    status: "Engaging",
    score: "High",
    keywords: ["keyword1", "keyword2", "keyword3"],
    postedAt: "2025-10-01",
    post: {
      title:
        "Google has not yet recognized a backlink from Fortune magazine. Help!",
      summary:
        "Found an organic backlink from Fortune via Bing Webmaster Tools, but Google Search Console doesn’t list it as a top linking site. Asking why Google might not recognize the link yet and what can be done to help Google track it.",
    },
  },
  {
    id: "3",
    title: "Happens a lot. Wait for recrawl; sometimes Bing sees it first.",
    subreddit: {
      name: "r/SEO",
      image: null,
    },
    sentiment: "negative",
    status: "Ready to Engage",
    score: "Medium",
    keywords: [],
    postedAt: "2024-04-01",
    post: {
      title:
        "Google has not yet recognized a backlink from Fortune magazine. Help! aksjdnask djnaskdj naksjdna kjdnaskdj naskdj naskdjnak jdnaksj n",
      summary:
        "Found an organic backlink from Fortune via Bing Webmaster Tools, but Google Search Console doesn’t list it as a top linking site. Asking why Google might not recognize the link yet and what can be done to help Google track it.",
    },
  },
  {
    id: "4",
    title:
      "Also verify the linking page is indexed and not blocked by robots.txt.",
    subreddit: {
      name: "r/SEO",
      image:
        "https://styles.redditmedia.com/t5_2qhbx/styles/communityIcon_191l6xkqju6d1.png?width=128&frame=1&auto=webp&s=98d43911f4989d3efa12445a5b1508a4c5c2e61a",
    },
    sentiment: "neutral",
    status: "Needs Review",
    score: "Low",
    keywords: ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
    postedAt: "2025-01-01",
    post: {
      title:
        "Google has not yet recognized a backlink from Fortune magazine. Help!",
      summary:
        "Found an organic backlink from Fortune via Bing Webmaster Tools, but Google Search Console doesn’t list it as a top linking site. Asking why Google might not recognize the link yet and what can be done to help Google track it.",
    },
  },
  {
    id: "5",
    title: "If it’s brand-new, patience is key. You’ll likely see it soon.",
    subreddit: {
      name: "r/SEO",
      image:
        "https://styles.redditmedia.com/t5_2qhbx/styles/communityIcon_191l6xkqju6d1.png?width=128&frame=1&auto=webp&s=98d43911f4989d3efa12445a5b1508a4c5c2e61a",
    },
    sentiment: "positive",
    status: "Archived",
    score: "Low",
    keywords: ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
    postedAt: "2025-01-01",
    post: {
      title:
        "Google has not yet recognized a backlink from Fortune magazine. Help!",
      summary:
        "Found an organic backlink from Fortune via Bing Webmaster Tools, but Google Search Console doesn’t list it as a top linking site. Asking why Google might not recognize the link yet and what can be done to help Google track it.",
    },
  },
]

export default function CommentsPage() {
  return (
    <FiltersProvider
      keywordsOptions={keywordsOptions}
      subredditsOptions={subredditsOptions}
    >
      <section className="flex flex-col">
        <HeaderConfig
          config={{
            title: "Comments",
          }}
        />
        <Filters />
        <GroupedLayout
          className="flex flex-col"
          items={comments as unknown as CommentType[]}
          renderItem={(comment) => <Comment comment={comment as CommentType} />}
        />
      </section>
    </FiltersProvider>
  )
}
