"use client"

import { type ReactElement, useState } from "react"

import { Pencil } from "lucide-react"

import { CompetitorAvatar, ProfileAvatar } from "@/components/ui/avatar"
import { HeaderConfig } from "@/components/header/header-context"
import { DataList } from "@/components/ui/data-list"
import DeleteItem from "@/components/ui/delete-item"
import NewAction from "@/components/ui/new-action"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
} from "@/components/ui/dialog"

import { cn } from "@/lib/utils"

type Competitor = {
  id: number
  name: string
  logo: string | null
  website: string | null
  owner: Owner
  createdAt: string
}

type Owner = {
  name: string
  image: string | null
}

const sizes = {
  name: "flex-1",
  owner: "w-17 flex items-center justify-center",
  website: "w-50 text-center truncate",
  createdAt: "w-24 text-center",
}

const competitors: Competitor[] = [
  {
    id: 1,
    name: "Competitor 1",
    logo: null,
    website: "https://competitor1.com",
    owner: {
      name: "Owner 1",
      image: null,
    },
    createdAt: "2021-01-01",
  },
  {
    id: 2,
    name: "Competitor 2",
    logo: null,
    website: "https://competitor2.com",
    owner: {
      name: "Owner 2",
      image: null,
    },
    createdAt: "2021-01-02",
  },
  {
    id: 3,
    name: "Competitor 3",
    logo: null,
    website: "https://competitor3.com",
    owner: {
      name: "Owner 3",
      image: null,
    },
    createdAt: "2021-01-03",
  },
  {
    id: 4,
    name: "Competitor 4",
    logo: null,
    website: "https://competitor4.com",
    owner: {
      name: "Owner 4",
      image: null,
    },
    createdAt: "2021-01-04",
  },
]

export default function CompetitorsPage() {
  return (
    <section className="flex flex-col">
      <HeaderConfig
        config={{
          title: "Competitors",
          actions: [
            {
              key: "new-competitor",
              element: (
                <NewAction name="Competitor" dialogBodyClassName="py-4">
                  <Input
                    size="creating"
                    variant="creating"
                    placeholder="Competitor"
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
                <CompetitorAvatar
                  logo={(item as Competitor).logo}
                  company={(item as Competitor).name}
                  className="size-6"
                />
                {(item as Competitor).name}
                <EditCompetitor competitor={item as Competitor} />
                <DeleteItem
                  name={(item as Competitor).name}
                  onClick={() => {}}
                />
              </>
            ),
          },
          { key: "website", label: "Website", className: sizes.website },
          {
            key: "owner",
            label: "Owner",
            className: sizes.owner,
            render: ({ item }) => (
              <ProfileAvatar
                image={(item as Competitor).owner.image}
                name={(item as Competitor).owner.name}
              />
            ),
          },
          { key: "createdAt", label: "Created At", className: sizes.createdAt },
        ]}
        items={competitors}
      />
    </section>
  )
}

function EditCompetitor({
  competitor,
}: {
  competitor: Competitor
}): ReactElement {
  const [website, setWebsite] = useState(competitor.website)
  const [name, setName] = useState(competitor.name)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground group-hover:flex hidden"
        >
          <Pencil className="size-3" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit</DialogTitle>
          <DialogDescription className="sr-only">
            Edit the {competitor.name} competitor.
          </DialogDescription>
        </DialogHeader>
        <DialogBody className="py-4 gap-2">
          <Input
            size="creating"
            variant="creating"
            placeholder="Competitor"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            size="creating"
            variant="creating"
            placeholder="Competitor"
            className="font-medium"
            value={website || ""}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </DialogBody>
        <DialogFooter>
          <Button type="submit">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
