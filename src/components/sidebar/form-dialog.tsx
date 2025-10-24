"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  DialogDescription,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogClose,
  DialogTitle,
  DialogBody,
} from "@/components/ui/dialog"

type FormDialogContentProps = {
  title: React.ReactNode
  description?: React.ReactNode
  children: React.ReactNode
  submitButtonText?: string
}

function FormDialogContent({
  title,
  description,
  children,
  submitButtonText,
}: FormDialogContentProps) {
  return (
    <DialogContent closeButtonClassName="right-3 top-3" showCloseButton>
      <DialogHeader className="px-5 py-3">
        <DialogTitle className="text-base">{title}</DialogTitle>
        {description ? (
          <DialogDescription className="sr-only">
            {description}
          </DialogDescription>
        ) : null}
      </DialogHeader>
      <DialogBody className="py-2 px-5">{children}</DialogBody>
      <DialogFooter className="border-t-0">
        <DialogClose asChild>
          <Button variant="ghost" type="button">
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit">{submitButtonText}</Button>
      </DialogFooter>
    </DialogContent>
  )
}

export { FormDialogContent }
