"use client"

import { ProfileAvatar, SubredditAvatar } from "@/components/ui/avatar"
import { HeaderConfig } from "@/components/header/header-context"
import { DataList } from "@/components/ui/data-list"
import DeleteItem from "@/components/ui/delete-item"
import NewAction from "@/components/ui/new-action"
import { Input } from "@/components/ui/input"

import { cn } from "@/lib/utils"

type Subreddit = {
  id: number
  name: string
  image: string | null
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
  name: "flex-1 min-w-0",
  owner:
    "w-17 flex items-center justify-center md:max-[55rem]:hidden max-sm:hidden max-[34rem]:hidden",
  posts: "w-16 text-center max-[30rem]:hidden",
  comments: "w-20 text-center max-[34rem]:hidden",
  createdAt: "w-24 text-center max-[26rem]:hidden",
}

const subreddits: Subreddit[] = [
  {
    id: 1,
    name: "r/SEO",
    image: null,
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
    name: "r/seogrowth",
    image:
      "https://styles.redditmedia.com/t5_4t7j8c/styles/communityIcon_gkpdve958xd71.png?width=64&height=64&frame=1&auto=webp&crop=64:64,smart&s=c8f055a39e68cc07a0f3573aba5f4fcc948291db",
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
    name: "r/SEO_Digital_Marketing",
    image:
      "https://styles.redditmedia.com/t5_3j43f/styles/communityIcon_tmxl7sjsju6d1.png?width=64&height=64&frame=1&auto=webp&crop=64:64,smart&s=7b0a0073eefd147872ba5934c0157f3ffd150325",
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
    name: "r/bigseo",
    image:
      "https://styles.redditmedia.com/t5_2wjav/styles/communityIcon_a0kac7rnkdi71.png?width=64&height=64&frame=1&auto=webp&crop=64:64,smart&s=fe456bf923c844418ef638966b1a35ea495aceaa",
    owner: {
      name: "Owner 4",
      image: null,
    },
    posts: 40,
    comments: 80,
    createdAt: "2021-01-04",
  },
  {
    id: 5,
    name: "r/SEO_Experts",
    image:
      "https://styles.redditmedia.com/t5_bshop8/styles/communityIcon_bei333mntv7d1.png?width=64&height=64&frame=1&auto=webp&crop=64:64,smart&s=f4f1ad8fb4298cd5549d8591386b842402e7ef14",
    owner: {
      name: "Owner 5",
      image: null,
    },
    posts: 50,
    comments: 100,
    createdAt: "2021-01-05",
  },
  {
    id: 6,
    name: "r/localseo",
    image:
      "https://styles.redditmedia.com/t5_2sg2d/styles/communityIcon_obywzu5hm0991.png?width=64&height=64&frame=1&auto=webp&crop=64:64,smart&s=a32231c60c3395edfc6da995de1de20198e4a3f1",
    owner: {
      name: "Owner 6",
      image: null,
    },
    posts: 60,
    comments: 120,
    createdAt: "2021-01-06",
  },
]

export default function KeywordsPage() {
  return (
    <section className="flex flex-col">
      <HeaderConfig
        config={{
          actions: [
            {
              key: "new-keyword",
              element: (
                <NewAction name="Subreddit" dialogBodyClassName="py-4">
                  <Input
                    size="creating"
                    variant="creating"
                    placeholder="Subreddit"
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
            className: cn(sizes.name, "flex items-center gap-2"),
            render: ({ item }) => (
              <>
                <SubredditAvatar
                  image={(item as Subreddit).image}
                  name={(item as Subreddit).name}
                />
                <span className="truncate">{(item as Subreddit).name}</span>
                <DeleteItem
                  name={(item as Subreddit).name}
                  onClick={() => {}}
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
                image={(item as Subreddit).owner.image}
                name={(item as Subreddit).owner.name}
              />
            ),
          },
          { key: "posts", label: "Posts", className: sizes.posts },
          { key: "comments", label: "Comments", className: sizes.comments },
          { key: "createdAt", label: "Created At", className: sizes.createdAt },
        ]}
        items={subreddits}
        rowHrefBase="/subreddits"
      />
    </section>
  )
}
