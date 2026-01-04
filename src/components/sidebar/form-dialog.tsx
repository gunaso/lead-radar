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
  /**
   * If your form is rendered inside `children` (common with dialogs),
   * pass the form element id so the submit button in the footer can submit it.
   */
  formId?: string
}

function FormDialogContent({
  title,
  description,
  children,
  submitButtonText,
  formId,
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
        <Button type="submit" form={formId}>
          {submitButtonText ?? "Submit"}
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}

export { FormDialogContent }
