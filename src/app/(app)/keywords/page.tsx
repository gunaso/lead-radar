"use client"

import Link from "next/link"

import { Trash } from "lucide-react"

import { HeaderConfig } from "@/components/header/header-context"
import { Button, NewButton } from "@/components/ui/button"
import { ProfileAvatar } from "@/components/ui/avatar"
import { DataList } from "@/components/ui/data-list"

import { getInitials, cn } from "@/lib/utils"

type Keyword = {
  id: number
  name: string
  owner: Owner
  posts: number
  comments: number
  createdAt: string
}

type Owner = {
  name: string
  image: string | null
}

const sizes = {
  name: "flex-1",
  owner: "w-17 flex items-center justify-center",
  posts: "w-16 text-center",
  comments: "w-20 text-center",
  createdAt: "w-24 text-center",
}

const keywords: Keyword[] = [
  {
    id: 1,
    name: "Keyword 1",
    owner: {
      name: "Owner 1",
      image: null,
    },
    posts: 10,
    comments: 20,
    createdAt: "2021-01-01",
  },
  {
    id: 2,
    name: "Keyword 2",
    owner: {
      name: "Owner 2",
      image: null,
    },
    posts: 20,
    comments: 40,
    createdAt: "2021-01-02",
  },
  {
    id: 3,
    name: "Keyword 3",
    owner: {
      name: "Owner 3",
      image: null,
    },
    posts: 30,
    comments: 60,
    createdAt: "2021-01-03",
  },
  {
    id: 4,
    name: "Keyword 4",
    owner: {
      name: "Owner 4",
      image: null,
    },
    posts: 40,
    comments: 80,
    createdAt: "2021-01-04",
  },
]

export default function KeywordsPage() {
  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <section className="flex flex-col">
      <HeaderConfig
        config={{
          title: "Keywords",
          actions: [
            {
              key: "new-keyword",
              element: <NewButton name="Keyword" />,
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
                {(item as Keyword).name}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDelete}
                  className="text-muted-foreground hover:text-destructive group-hover:flex hidden"
                >
                  <Trash className="size-3" />
                </Button>
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
          { key: "createdAt", label: "Created At", className: sizes.createdAt },
        ]}
        items={keywords}
        rowHrefBase="/keywords"
      />
    </section>
  )
}
