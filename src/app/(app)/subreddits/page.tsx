"use client"

import { useState } from "react"

import { NewSubredditAction } from "@/components/new-actions/new-subreddit"
import { ProfileAvatar, SubredditAvatar } from "@/components/ui/avatar"
import { HeaderConfig } from "@/components/header/header-context"
import { DataList } from "@/components/ui/data-list"
import DeleteItem from "@/components/ui/delete-item"

import { useDeleteSubreddit, useSubreddits } from "@/queries/subreddits"
import { cn, formatDateYMD } from "@/lib/utils"
import { Subreddit } from "@/types/objects"
import { PATHS } from "@/lib/path"

const sizes = {
  name: "flex-1 min-w-0",
  owner:
    "w-17 flex items-center justify-center md:max-[55rem]:hidden max-sm:hidden max-[34rem]:hidden",
  posts: "w-16 text-center max-[30rem]:hidden",
  comments: "w-20 text-center max-[34rem]:hidden",
  createdAt: "w-24 text-center max-[26rem]:hidden",
}

export default function SubredditsPage() {
  const { data: subreddits = [], isLoading } = useSubreddits()
  const del = useDeleteSubreddit()
  const [canSubmit, setCanSubmit] = useState<boolean>(false)

  return (
    <section className="flex flex-col">
      <HeaderConfig
        config={{
          // Toggle afterCrumbs between null and false to force HeaderConfig to
          // re-apply without remounting the action element (stable action key).
          afterCrumbs: canSubmit ? null : false,
          actions: [
            {
              key: "new-subreddit",
              element: <NewSubredditAction onStateChange={setCanSubmit} />,
            },
          ],
        }}
      />
      <DataList
        isLoading={isLoading}
        emptyStateName="Subreddit"
        emptyStateAction={<NewSubredditAction onStateChange={setCanSubmit} />}
        headers={[
          {
            key: "name",
            label: "Name",
            className: cn(sizes.name, "flex items-center gap-2"),
            render: ({ item }) => {
              const s = item as Subreddit
              return (
                <>
                  <SubredditAvatar image={s.image} name={s.name} />
                  <span className="truncate">{s.name}</span>
                  <DeleteItem
                    name={s.name}
                    onClick={() => del.mutate({ id: s.id })}
                  />
                </>
              )
            },
          },
          {
            key: "owner",
            label: "Owner",
            className: sizes.owner,
            render: ({ item }) => (
              <ProfileAvatar
                image={(item as Subreddit).owner.image}
                name={(item as Subreddit).owner.name}
              />
            ),
          },
          { key: "posts", label: "Posts", className: sizes.posts },
          { key: "comments", label: "Comments", className: sizes.comments },
          {
            key: "createdAt",
            label: "Created At",
            className: sizes.createdAt,
            render: ({ item }) => (
              <span>{formatDateYMD((item as Subreddit).createdAt)}</span>
            ),
          },
        ]}
        items={subreddits}
        rowHrefBase={PATHS.SUBREDDITS}
      />
    </section>
  )
}
