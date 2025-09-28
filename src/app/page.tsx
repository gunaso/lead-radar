"use client"
import type { ReactElement } from "react"
import { useEffect, useMemo, useState } from "react"
import type { DateRange } from "react-day-picker"

import { AppHeader } from "@/components/app-header"
import { FiltersSidebar } from "@/components/filters-sidebar"
import { CommentsList } from "@/components/comments"
import { PostsList } from "@/components/posts"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Comment, Post, Sentiment } from "@/types/reddit"

const MOCK_POSTS: Post[] = [
  {
    id: "p1",
    title: "Looking for the best project management software for my startup",
    content:
      "Hey everyone! I'm running a small startup... We need something not too expensive but with good collaboration features.",
    subreddit: "r/entrepreneur",
    user: "u/startup_founder_2024",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    sentiment: "Neutral",
    keywords: ["project management", "collaboration", "startup"],
    url: "https://reddit.com/r/entrepreneur/post/1",
  },
  {
    id: "p2",
    title: "How to set up automated workflows for team productivity?",
    content:
      "Our team is spending too much time on repetitive tasks... What tools do you recommend for automating things?",
    subreddit: "r/productivity",
    user: "u/productivity_seeker",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
    sentiment: "Positive",
    keywords: ["automation", "workflow", "tools"],
    url: "https://reddit.com/r/productivity/post/2",
  },
]

const MOCK_COMMENTS: Comment[] = [
  {
    id: "c1",
    content: "We switched to ToolX and it reduced our reporting time by 50%.",
    user: "u/ops_pro",
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    sentiment: "Positive",
    post: {
      id: "p2",
      title: "How to set up automated workflows for team productivity?",
      subreddit: "r/productivity",
      url: "https://reddit.com/r/productivity/post/2",
    },
  },
]

export default function Home(): ReactElement {
  const [activeTab, setActiveTab] = useState<
    "posts" | "comments" | "watchlists"
  >("posts")
  const [search, setSearch] = useState("")
  const [subreddits, setSubreddits] = useState<string[]>([
    "r/entrepreneur",
    "r/productivity",
  ]) // filter
  const [keywords, setKeywords] = useState<string[]>([])
  const [sentiment, setSentiment] = useState<Sentiment | "All">("All")
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)

  const filteredPosts = useMemo(() => {
    return MOCK_POSTS.filter((p) => {
      const matchesSearch = search
        ? (p.title + " " + p.content)
            .toLowerCase()
            .includes(search.toLowerCase())
        : true
      const matchesSubreddit = subreddits.length
        ? subreddits.includes(p.subreddit)
        : true
      const matchesSentiment =
        sentiment === "All" ? true : p.sentiment === sentiment
      const matchesKeywords = keywords.length
        ? keywords.some((k) =>
            (p.title + " " + p.content).toLowerCase().includes(k.toLowerCase())
          )
        : true
      const from = dateRange?.from
      const to = dateRange?.to
      const inDate =
        from && to ? p.createdAt >= from && p.createdAt <= to : true
      return (
        matchesSearch &&
        matchesSubreddit &&
        matchesSentiment &&
        matchesKeywords &&
        inDate
      )
    })
  }, [search, subreddits, sentiment, keywords, dateRange])

  const filteredComments = useMemo(() => {
    return MOCK_COMMENTS.filter((c) => {
      const matchesSearch = search
        ? c.content.toLowerCase().includes(search.toLowerCase())
        : true
      const matchesSubreddit = subreddits.length
        ? subreddits.includes(c.post.subreddit)
        : true
      const matchesSentiment =
        sentiment === "All" ? true : c.sentiment === sentiment
      const matchesKeywords = keywords.length
        ? keywords.some((k) =>
            c.content.toLowerCase().includes(k.toLowerCase())
          )
        : true
      const from = dateRange?.from
      const to = dateRange?.to
      const inDate =
        from && to ? c.createdAt >= from && c.createdAt <= to : true
      return (
        matchesSearch &&
        matchesSubreddit &&
        matchesSentiment &&
        matchesKeywords &&
        inDate
      )
    })
  }, [search, subreddits, sentiment, keywords, dateRange])

  return (
    <div className="min-h-dvh">
      <AppHeader search={search} onSearchChange={setSearch} />

      <main className="mx-auto max-w-6xl px-4 py-6 grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
        <FiltersSidebar
          subreddits={subreddits}
          setSubreddits={setSubreddits}
          sentiment={sentiment}
          setSentiment={setSentiment}
          keywords={keywords}
          setKeywords={setKeywords}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />

        {/* Main Content */}
        <section className="space-y-4">
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as typeof activeTab)}
          >
            <TabsList>
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
              <TabsTrigger value="watchlists">Watchlists</TabsTrigger>
            </TabsList>

            <TabsContent value="posts">
              <PostsList posts={filteredPosts} />
            </TabsContent>

            <TabsContent value="comments">
              <CommentsList comments={filteredComments} />
            </TabsContent>

            <TabsContent value="watchlists">
              <Card>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    No watchlists yet. Create a new one from the top bar.
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>
      </main>
    </div>
  )
}
