"use client"

import { EntityTabbedFeed } from "@/components/layouts/entity-tabbed-feed"
import { FeedComment } from "@/components/feed-comment"
import { Post } from "@/components/feed-post"

import { CommentType, PostType } from "@/types/reddit"

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

const keyword = {
  id: 1,
  name: "keyword1",
  posts: [
    {
      id: "1",
      title: "Mini title",
      summary:
        "Found an organic backlink from Fortune via Bing Webmaster Tools, but Google Search Console doesn’t list it as a top linking site. Asking why Google might not recognize the link yet and what can be done to help Google track it.",
      subreddit: {
        name: "r/seogrowth",
        image:
          "https://styles.redditmedia.com/t5_2wjav/styles/communityIcon_a0kac7rnkdi71.png?width=64&height=64&frame=1&auto=webp&crop=64:64,smart&s=fe456bf923c844418ef638966b1a35ea495aceaa",
      },
      sentiment: "neutral",
      status: "Engaged",
      score: "Prime",
      keywords: ["keyword1", "keyword2"],
      postedAt: "2025-08-01",
    },
    {
      id: "2",
      title:
        "Google has not yet recognized a backlink from Fortune magazine. Help!",
      summary:
        "Found an organic backlink from Fortune via Bing Webmaster Tools, but Google Search Console doesn’t list it as a top linking site. Asking why Google might not recognize the link yet and what can be done to help Google track it.",
      subreddit: {
        name: "r/seogrowth",
        image:
          "https://styles.redditmedia.com/t5_2wjav/styles/communityIcon_a0kac7rnkdi71.png?width=64&height=64&frame=1&auto=webp&crop=64:64,smart&s=fe456bf923c844418ef638966b1a35ea495aceaa",
      },
      sentiment: "positive",
      status: "Engaging",
      score: "High",
      keywords: ["keyword1", "keyword2", "keyword3"],
      postedAt: "2025-10-01",
    },
    {
      id: "3",
      title:
        "Google has not yet recognized a backlink from Fortune magazine. Help! aksjdnask djnaskdj naksjdna kjdnaskdj naskdj naskdjnak jdnaksj n",
      summary:
        "Found an organic backlink from Fortune via Bing Webmaster Tools, but Google Search Console doesn’t list it as a top linking site. Asking why Google might not recognize the link yet and what can be done to help Google track it.",
      subreddit: {
        name: "r/seogrowth",
        image:
          "https://styles.redditmedia.com/t5_2wjav/styles/communityIcon_a0kac7rnkdi71.png?width=64&height=64&frame=1&auto=webp&crop=64:64,smart&s=fe456bf923c844418ef638966b1a35ea495aceaa",
      },
      sentiment: "negative",
      status: "Ready to Engage",
      score: "Medium",
      keywords: ["keyword1"],
      postedAt: "2024-04-01",
    },
    {
      id: "4",
      title:
        "Google has not yet recognized a backlink from Fortune magazine. Help!",
      summary:
        "Found an organic backlink from Fortune via Bing Webmaster Tools, but Google Search Console doesn’t list it as a top linking site. Asking why Google might not recognize the link yet and what can be done to help Google track it.",
      subreddit: {
        name: "r/seogrowth",
        image:
          "https://styles.redditmedia.com/t5_2wjav/styles/communityIcon_a0kac7rnkdi71.png?width=64&height=64&frame=1&auto=webp&crop=64:64,smart&s=fe456bf923c844418ef638966b1a35ea495aceaa",
      },
      sentiment: "neutral",
      status: "Needs Review",
      score: "Low",
      keywords: ["keyword1", "keyword2", "keyword5"],
      postedAt: "2025-01-01",
    },
    {
      id: "5",
      title:
        "Google has not yet recognized a backlink from Fortune magazine. Help!",
      summary:
        "Found an organic backlink from Fortune via Bing Webmaster Tools, but Google Search Console doesn’t list it as a top linking site. Asking why Google might not recognize the link yet and what can be done to help Google track it.",
      subreddit: {
        name: "r/seogrowth",
        image:
          "https://styles.redditmedia.com/t5_2wjav/styles/communityIcon_a0kac7rnkdi71.png?width=64&height=64&frame=1&auto=webp&crop=64:64,smart&s=fe456bf923c844418ef638966b1a35ea495aceaa",
      },
      sentiment: "positive",
      status: "Archived",
      score: "Low",
      keywords: ["keyword1", "keyword5"],
      postedAt: "2025-01-01",
    },
  ],
  comments: [
    {
      id: "1",
      title:
        "Totally normal — GSC can lag. Give it a week or two and re-crawl.",
      subreddit: {
        name: "r/seogrowth",
        image:
          "https://styles.redditmedia.com/t5_2wjav/styles/communityIcon_a0kac7rnkdi71.png?width=64&height=64&frame=1&auto=webp&crop=64:64,smart&s=fe456bf923c844418ef638966b1a35ea495aceaa",
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
        name: "r/seogrowth",
        image:
          "https://styles.redditmedia.com/t5_2wjav/styles/communityIcon_a0kac7rnkdi71.png?width=64&height=64&frame=1&auto=webp&crop=64:64,smart&s=fe456bf923c844418ef638966b1a35ea495aceaa",
      },
      sentiment: "positive",
      status: "Engaging",
      score: "High",
      keywords: ["keyword1", "keyword3"],
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
        name: "r/seogrowth",
        image:
          "https://styles.redditmedia.com/t5_2wjav/styles/communityIcon_a0kac7rnkdi71.png?width=64&height=64&frame=1&auto=webp&crop=64:64,smart&s=fe456bf923c844418ef638966b1a35ea495aceaa",
      },
      sentiment: "negative",
      status: "Ready to Engage",
      score: "Medium",
      keywords: ["keyword1"],
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
        name: "r/seogrowth",
        image:
          "https://styles.redditmedia.com/t5_2wjav/styles/communityIcon_a0kac7rnkdi71.png?width=64&height=64&frame=1&auto=webp&crop=64:64,smart&s=fe456bf923c844418ef638966b1a35ea495aceaa",
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
        name: "r/seogrowth",
        image:
          "https://styles.redditmedia.com/t5_2wjav/styles/communityIcon_a0kac7rnkdi71.png?width=64&height=64&frame=1&auto=webp&crop=64:64,smart&s=fe456bf923c844418ef638966b1a35ea495aceaa",
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
  ],
}

export default function KeywordPage() {
  const bcCrumbs = [
    { label: "Keywords", href: "/keywords" },
    { label: keyword.name, href: `/keywords/${keyword.id}` },
  ]
  return (
    <EntityTabbedFeed<PostType, CommentType>
      headerBreadcrumb={{ key: keyword.id.toString(), label: keyword.name }}
      keywordsOptions={[]}
      subredditsOptions={subredditsOptions}
      posts={keyword.posts as unknown as PostType[]}
      comments={keyword.comments as unknown as CommentType[]}
      renderPost={(post) => (
        <Post post={post as PostType} bcCrumbs={bcCrumbs} />
      )}
      renderComment={(comment) => (
        <FeedComment comment={comment as CommentType} bcCrumbs={bcCrumbs} />
      )}
    />
  )
}
