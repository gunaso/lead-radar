"use client"
import { useState } from "react"

import { HeaderConfig } from "@/components/header/header-context"
import { ProfileAvatar } from "@/components/ui/avatar"
import { DataList } from "@/components/ui/data-list"
import DeleteItem from "@/components/ui/delete-item"
import NewAction from "@/components/ui/new-action"
import { Input } from "@/components/ui/input"

import { cn, formatDateYMD } from "@/lib/utils"
import type { Keyword } from "@/types/objects"
import { PATHS } from "@/lib/path"
import {
  useCreateKeyword,
  useDeleteKeyword,
  useKeywords,
} from "@/queries/keywords"

const sizes = {
  name: "flex-1 min-w-0",
  owner:
    "w-17 flex items-center justify-center md:max-[55rem]:hidden max-sm:hidden max-[34rem]:hidden",
  posts: "w-16 text-center max-[24rem]:hidden",
  comments: "w-20 text-center max-[30rem]:hidden",
  createdAt: "w-24 text-center max-[20rem]:hidden",
}

export default function KeywordsPage() {
  const { data: keywords = [] } = useKeywords()
  const del = useDeleteKeyword()
  const create = useCreateKeyword()
  const [error, setError] = useState<string | null>(null)

  return (
    <section className="flex flex-col">
      <HeaderConfig
        config={{
          title: "Keywords",
          actions: [
            {
              key: "new-keyword",
              element: (
                <NewAction
                  name="Keyword"
                  dialogBodyClassName="py-4"
                  error={error}
                  onErrorChange={setError}
                  onSubmit={async (fd) => {
                    const name = String(fd.get("name") || "").trim()
                    if (!name) return
                    try {
                      await create.mutateAsync({ name })
                    } catch (err) {
                      // Error will be caught and handled by NewAction component
                      // The optimistic item will be removed by the mutation's onError handler
                      throw err
                    }
                  }}
                >
                  <Input
                    size="creating"
                    variant="creating"
                    placeholder="Keyword"
                    name="name"
                  />
                </NewAction>
              ),
            },
          ],
        }}
      />
      <DataList
        headers={[
          {
            key: "name",
            label: "Name",
            className: cn(sizes.name, "flex items-center gap-4"),
            render: ({ item }) => (
              <>
                <span className="truncate">{(item as Keyword).name}</span>
                <DeleteItem
                  name={(item as Keyword).name}
                  onClick={(e) => {
                    e.preventDefault()
                    const id = (item as Keyword).id
                    if (!id) return
                    // Optimistic mutation handled in hook
                    del.mutate({ id })
                  }}
                />
              </>
            ),
          },
          {
            key: "owner",
            label: "Owner",
            className: sizes.owner,
            render: ({ item }) => (
              <ProfileAvatar
                image={(item as Keyword).owner.image}
                name={(item as Keyword).owner.name}
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
              <span>{formatDateYMD((item as Keyword).createdAt)}</span>
            ),
          },
        ]}
        items={keywords}
        rowHrefBase={PATHS.KEYWORDS}
      />
    </section>
  )
}
