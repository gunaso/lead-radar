import { useState } from "react"

import { Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  AlertDialogDescription,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogBody,
  AlertDialog,
} from "@/components/ui/alert-dialog"

export default function DeleteItem({
  name,
  onClick,
}: {
  name: string
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
}) {
  const [open, setOpen] = useState(false)

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    onClick(e)
    setOpen(false)
    console.log("deleted")
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
  }

  const handleWrapperClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <div onClick={handleWrapperClick}>
      <AlertDialog open={open} onOpenChange={handleOpenChange}>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive group-hover:flex hidden"
          >
            <Trash className="size-3" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">
              Delete {name}
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogBody>
            <AlertDialogDescription>
              This will delete the {name} from your list. You can add it again
              later.
            </AlertDialogDescription>
          </AlertDialogBody>
          <AlertDialogFooter onClick={handleDelete} />
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
