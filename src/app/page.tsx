"use client"
import type { ReactElement } from "react"
import { useMemo, useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { TagInput } from "@/components/tag-input"
import { cn, formatTimeAgo } from "@/lib/utils"
import {
  ExternalLink,
  MessageSquare,
  Search,
  Settings,
  Sparkles,
  User,
  Clock,
  ListChecks,
} from "lucide-react"
import * as Popover from "@radix-ui/react-popover"
import type { DateRange } from "react-day-picker"

type Sentiment = "Positive" | "Neutral" | "Negative"

type Post = {
  id: string
  title: string
  content: string
  subreddit: string
  user: string
  createdAt: Date
  sentiment: Sentiment
  keywords: string[]
  url: string
}

type Comment = {
  id: string
  content: string
  user: string
  createdAt: Date
  sentiment: Sentiment
  post: Pick<Post, "id" | "title" | "subreddit" | "url">
}

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
      {/* Top Nav */}
      <header className="sticky top-0 z-40 border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/50">
        <div className="mx-auto max-w-6xl px-4 h-14 flex items-center gap-3">
          <div className="inline-flex items-center gap-2 text-primary">
            <Sparkles className="size-5" />
            <span className="font-semibold">Lead Radar</span>
          </div>
          <div className="ml-4 flex-1">
            <div className="relative">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search across all posts..."
                className="pl-9"
              />
              <Search className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
              <ListChecks className="size-4" /> Watchlists
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="size-4" />
            </Button>
            <Popover.Root>
              <Popover.Trigger asChild>
                <Button
                  variant="secondary"
                  size="sm"
                  aria-label="Open profile menu"
                >
                  <User className="size-4" />
                </Button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content
                  side="bottom"
                  align="end"
                  className="z-50 w-56 rounded-md border bg-popover p-1 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out"
                >
                  <div className="px-2 py-1.5 text-xs text-muted-foreground">
                    Account
                  </div>
                  <a
                    href="/onboarding"
                    className="flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                  >
                    Settings
                  </a>
                  <form action="/auth/signout" method="post">
                    <button
                      type="submit"
                      className="w-full flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-left text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                    >
                      Logout
                    </button>
                  </form>
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
        {/* Sidebar Filters */}
        <aside className="md:sticky md:top-16 h-max">
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
              <CardDescription>
                Refine results by source and context
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
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
                      variant={sentiment === s ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSentiment(s as Sentiment | "All")}
                    >
                      {s as string}
                    </Button>
                  ))}
                </div>
              </div>

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
            </CardContent>
          </Card>
        </aside>

        {/* Main Content */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b pb-2">
            {(
              [
                { key: "posts", label: "Posts" },
                { key: "comments", label: "Comments" },
                { key: "watchlists", label: "Watchlists" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm",
                  activeTab === tab.key
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                )}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "posts" && (
            <div className="space-y-3">
              {filteredPosts.map((p) => (
                <Card key={p.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{p.title}</CardTitle>
                    <CardDescription>
                      <span className="mr-2">{p.subreddit}</span>
                      <span className="inline-flex items-center gap-1 text-muted-foreground">
                        <User className="size-3" /> {p.user}
                        <Clock className="size-3 ml-2" />{" "}
                        {formatTimeAgo(p.createdAt)}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{p.content}</p>
                    <div className="flex flex-wrap gap-1">
                      <Badge
                        className={cn(
                          "bg-secondary border-secondary/50",
                          p.sentiment === "Positive" &&
                            "bg-emerald-500/10 text-emerald-700 border-emerald-500/30",
                          p.sentiment === "Negative" &&
                            "bg-rose-500/10 text-rose-700 border-rose-500/30"
                        )}
                      >
                        {p.sentiment}
                      </Badge>
                      {p.keywords.map((k) => (
                        <Badge
                          key={k}
                          className="bg-primary/10 text-primary border-primary/20"
                        >
                          {k}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button asChild size="sm" variant="outline">
                        <a href={`/reply?type=post&id=${p.id}`}>
                          Reply <MessageSquare className="size-4" />
                        </a>
                      </Button>
                      <Button asChild size="sm" variant="ghost">
                        <a href={p.url} target="_blank" rel="noreferrer">
                          Open <ExternalLink className="size-4" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeTab === "comments" && (
            <div className="space-y-3">
              {filteredComments.map((c) => (
                <Card key={c.id} className="overflow-hidden">
                  <CardContent className="space-y-3">
                    <div className="text-sm">
                      <span className="font-medium">{c.user}</span>{" "}
                      <span className="text-muted-foreground">
                        commented {formatTimeAgo(c.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{c.content}</p>
                    <div className="flex flex-wrap gap-1">
                      <Badge
                        className={cn(
                          "bg-secondary border-secondary/50",
                          c.sentiment === "Positive" &&
                            "bg-emerald-500/10 text-emerald-700 border-emerald-500/30",
                          c.sentiment === "Negative" &&
                            "bg-rose-500/10 text-rose-700 border-rose-500/30"
                        )}
                      >
                        {c.sentiment}
                      </Badge>
                    </div>
                    <Card className="border-dashed">
                      <CardContent className="p-3">
                        <div className="text-sm font-medium">
                          {c.post.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {c.post.subreddit}
                        </div>
                      </CardContent>
                    </Card>
                    <div className="flex items-center gap-2">
                      <Button asChild size="sm" variant="outline">
                        <a href={`/reply?type=comment&id=${c.id}`}>
                          Reply <MessageSquare className="size-4" />
                        </a>
                      </Button>
                      <Button asChild size="sm" variant="ghost">
                        <a href={c.post.url} target="_blank" rel="noreferrer">
                          Open <ExternalLink className="size-4" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeTab === "watchlists" && (
            <Card>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  No watchlists yet. Create a new one from the top bar.
                </div>
              </CardContent>
            </Card>
          )}
        </section>
      </main>
    </div>
  )
}
