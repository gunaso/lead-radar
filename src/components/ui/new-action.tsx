import type { ReactNode } from "react"
import pluralize from "pluralize"

import { NewButton, Button } from "@/components/ui/button"
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

export default function NewAction({
  name,
  children,
  dialogBodyClassName,
}: {
  name: string
  children: ReactNode
  dialogBodyClassName?: string
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <NewButton name={name} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New {name}</DialogTitle>
          <DialogDescription className="sr-only">
            Add a new {name} to your {pluralize.plural(name)} list.
          </DialogDescription>
        </DialogHeader>
        <DialogBody className={dialogBodyClassName}>{children}</DialogBody>
        <DialogFooter>
          <Button type="submit">Add {name}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
