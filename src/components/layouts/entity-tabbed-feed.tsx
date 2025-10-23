"use client"

import { useState, type ReactNode } from "react"

import { PostsCommentsToggle } from "@/components/ui/posts-comments-toggle"
import { HeaderConfig } from "@/components/header/header-context"
import type { GroupableItem } from "@/components/grouped-layout"
import { GroupedLayout } from "@/components/grouped-layout"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Filters } from "@/components/filters"

import { FiltersProvider } from "@/hooks/use-filters"

type TabValue = "posts" | "comments"

export function EntityTabbedFeed<
  TPost extends GroupableItem,
  TComment extends GroupableItem
>({
  headerBreadcrumb,
  keywordsOptions,
  subredditsOptions,
  posts,
  comments,
  renderPost,
  renderComment,
  defaultTab = "posts",
}: {
  headerBreadcrumb: { key: string; label: string }
  keywordsOptions: Array<{ value: string; label: string }>
  subredditsOptions: Array<{ value: string; label: string }>
  posts: TPost[]
  comments: TComment[]
  renderPost: (post: TPost) => ReactNode
  renderComment: (comment: TComment) => ReactNode
  defaultTab?: TabValue
}) {
  const [tab, setTab] = useState<TabValue>(defaultTab)

  return (
    <FiltersProvider
      keywordsOptions={keywordsOptions}
      subredditsOptions={subredditsOptions}
    >
      <section className="flex flex-col">
        <HeaderConfig
          config={{
            breadcrumbs: [
              {
                key: headerBreadcrumb.key,
                label: headerBreadcrumb.label,
                loading: false,
              },
            ],
            afterCrumbs: <PostsCommentsToggle tab={tab} onChange={setTab} />,
          }}
        />
        <Filters
          disableKeywords={!keywordsOptions?.length}
          disableSubreddits={!subredditsOptions?.length}
        />

        <Tabs value={tab} onValueChange={(v) => setTab(v as TabValue)}>
          <TabsContent value="posts" className="flex flex-col">
            <GroupedLayout
              className="flex flex-col"
              items={posts as unknown as TPost[]}
              renderItem={(post) => renderPost(post)}
            />
          </TabsContent>
          <TabsContent value="comments" className="flex flex-col">
            <GroupedLayout
              className="flex flex-col"
              items={comments as unknown as TComment[]}
              renderItem={(comment) => renderComment(comment)}
            />
          </TabsContent>
        </Tabs>
      </section>
    </FiltersProvider>
  )
}
