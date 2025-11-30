"use client"

import { type ReactElement, useMemo, useState } from "react"

import { Pencil } from "lucide-react"

import { CompetitorAvatar, ProfileAvatar } from "@/components/ui/avatar"
import { HeaderConfig } from "@/components/header/header-context"
import { DataList } from "@/components/ui/data-list"
import DeleteItem from "@/components/ui/delete-item"
import NewAction from "@/components/ui/new-action"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import AsyncBareInput from "@/components/ui/input-async-bare"
import {
  DialogDescription,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogBody,
  Dialog,
} from "@/components/ui/dialog"

import type { Competitor } from "@/types/objects"
import { cn, formatDateYMD } from "@/lib/utils"
import {
  useCompetitors,
  useCreateCompetitor,
  useDeleteCompetitor,
  useUpdateCompetitor,
} from "@/queries/competitors"
import { useWorkspaceWebsiteValidation } from "@/queries/workspace"

const sizes = {
  name: "flex-1 min-w-0",
  owner:
    "w-17 flex items-center justify-center md:max-[55rem]:hidden max-sm:hidden max-[34rem]:hidden",
  website: "w-45 text-center truncate max-[32rem]:hidden",
  createdAt: "w-24 text-center max-[22rem]:hidden",
}

export default function CompetitorsPage() {
  const { data: competitors = [] } = useCompetitors()
  const del = useDeleteCompetitor()
  const create = useCreateCompetitor()

  // New competitor form state (inside NewAction)
  const [error, setError] = useState<string | null>(null)
  const websiteValidation = useWorkspaceWebsiteValidation()

  return (
    <section className="flex flex-col">
      <HeaderConfig
        config={{
          title: "Competitors",
          actions: [
            {
              key: "new-competitor",
              element: (
                <NewAction
                  name="Competitor"
                  dialogBodyClassName="py-4 space-y-2"
                  error={error}
                  onErrorChange={setError}
                  onSubmit={async (fd) => {
                    const name = String(fd.get("name") || "").trim()
                    const rawWebsite = String(fd.get("website") || "").trim()
                    if (!name) return
                    try {
                      let website: string | null = rawWebsite || null
                      if (website) {
                        const res = await websiteValidation.mutateAsync({
                          website,
                        })
                        if (!res.ok) {
                          throw new Error(res.message || "Invalid website")
                        }
                        if (typeof res.website === "string") {
                          website = res.website
                        }
                      }
                      await create.mutateAsync({
                        name,
                        website,
                      })
                    } catch (err) {
                      throw err
                    }
                  }}
                >
                  <Input
                    size="creating"
                    variant="creating"
                    placeholder="Competitor name"
                    name="name"
                  />
                  <AsyncBareInput
                    name="website"
                    placeholder="e.g. company.com"
                    validate={async (val, signal) => {
                      const trimmed = val.trim()
                      if (!trimmed) return { ok: true }
                      return websiteValidation.mutateAsync({
                        website: trimmed,
                        signal,
                      })
                    }}
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
                <span className="truncate">{(item as Competitor).name}</span>
                <EditCompetitor competitor={item as Competitor} />
                <DeleteItem
                  name={(item as Competitor).name}
                  onClick={(e) => {
                    e.preventDefault()
                    const id = (item as Competitor).id
                    if (!id) return
                    del.mutate({ id })
                  }}
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
          {
            key: "createdAt",
            label: "Created At",
            className: sizes.createdAt,
            render: ({ item }) => (
              <span>{formatDateYMD((item as Competitor).createdAt)}</span>
            ),
          },
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
  const [open, setOpen] = useState(false)
  const [website, setWebsite] = useState(competitor.website || "")
  const [name, setName] = useState(competitor.name)
  const [websiteValid, setWebsiteValid] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const update = useUpdateCompetitor()
  const websiteValidation = useWorkspaceWebsiteValidation()

  const canSave = useMemo(() => {
    const nameOk = name.trim().length > 0
    const websiteTrimmed = website.trim()
    const websiteOk = websiteTrimmed ? websiteValid : true
    return nameOk && websiteOk
  }, [name, website, websiteValid])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
            placeholder="Competitor name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <AsyncBareInput
            placeholder="e.g. company.com"
            valueState={[website, setWebsite]}
            setValid={setWebsiteValid}
            // Skip validation for initial value; validate only after user changes
            skipValidation={Boolean(competitor.website)}
            validate={async (val, signal) => {
              const trimmed = val.trim()
              if (!trimmed) return { ok: true }
              return websiteValidation.mutateAsync({
                website: trimmed,
                signal,
              })
            }}
          />
          {error && <p className="text-sm text-destructive mt-2">{error}</p>}
        </DialogBody>
        <DialogFooter>
          <Button
            type="button"
            disabled={!canSave || update.isPending}
            onClick={() => {
              const id = competitor.id
              if (!id) return
              setError(null)
              // Close optimistically; reopen on error
              setOpen(false)
              update.mutate(
                {
                  id,
                  name: name.trim(),
                  website: website.trim() ? website.trim() : null,
                },
                {
                  onError: (e) => {
                    const message =
                      (e &&
                        typeof (e as any).message === "string" &&
                        (e as any).message) ||
                      "Failed to save changes"
                    setError(message)
                    setOpen(true)
                  },
                }
              )
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
