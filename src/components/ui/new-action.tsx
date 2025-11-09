import { type ReactNode, useState, useCallback, useEffect } from "react"
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
  onSubmit,
  submitDisabled,
  error,
  onErrorChange,
}: {
  name: string
  children: ReactNode
  dialogBodyClassName?: string
  onSubmit?: (formData: FormData) => void | Promise<void>
  submitDisabled?: boolean
  error?: string | null
  onErrorChange?: (error: string | null) => void
}) {
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Reopen dialog if error occurs
  useEffect(() => {
    if (error && !open) {
      setOpen(true)
    }
  }, [error, open])

  // Clear error when dialog closes
  useEffect(() => {
    if (!open && error && onErrorChange) {
      onErrorChange(null)
    }
  }, [open, error, onErrorChange])

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      if (!onSubmit) return
      e.preventDefault()
      e.stopPropagation()
      const fd = new FormData(e.currentTarget)

      // Clear any previous errors
      if (onErrorChange) {
        onErrorChange(null)
      }

      // Close dialog immediately (optimistic)
      setOpen(false)

      try {
        setSubmitting(true)
        await onSubmit(fd)
      } catch (err) {
        // On error, set error message which will trigger dialog to reopen
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred"
        if (onErrorChange) {
          onErrorChange(errorMessage)
        }
        // Dialog will reopen via useEffect when error is set
      } finally {
        setSubmitting(false)
      }
    },
    [onSubmit, onErrorChange]
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
        {onSubmit ? (
          <form onSubmit={handleSubmit}>
            <DialogBody className={dialogBodyClassName}>
              {children}
              {error && (
                <p className="text-sm text-destructive mt-2">{error}</p>
              )}
            </DialogBody>
            <DialogFooter>
              <Button type="submit" disabled={submitting || !!submitDisabled}>
                Add {name}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <>
            <DialogBody className={dialogBodyClassName}>{children}</DialogBody>
            <DialogFooter>
              <Button type="submit">Add {name}</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
