"use client"

import { LifeBuoy } from "lucide-react"

import { DialogTrigger, Dialog } from "@/components/ui/dialog"
import { SidebarMenuButton } from "@/components/ui/sidebar"
import { FileInput } from "@/components/ui/file-input"
import { Textarea } from "@/components/ui/textarea"
import { FormDialogContent } from "./form-dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
  Select,
} from "@/components/ui/select"

function SupportDialog({
  open,
  onOpenChange,
  pathname,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  pathname: string | null
  onSubmit: (formData: FormData) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <SidebarMenuButton size="sm">
          <LifeBuoy />
          Support
        </SidebarMenuButton>
      </DialogTrigger>
      <FormDialogContent
        title={"Support"}
        description={
          <span className="sr-only">
            Get help with your account or billing.
          </span>
        }
        submitButtonText="Send message"
      >
        <form
          className="space-y-5"
          action={(formData: FormData) => onSubmit(formData)}
        >
          {/* Page context */}
          <input type="hidden" name="context_path" value={pathname || ""} />

          <div className="space-y-1.5">
            <Label htmlFor="support-category">
              Category{" "}
              <span className="text-destructive" aria-hidden>
                *
              </span>
            </Label>
            <Select name="category" id="support-category" required>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technical">Technical Issue</SelectItem>
                <SelectItem value="billing">Billing / Subscription</SelectItem>
                <SelectItem value="account">Account Access</SelectItem>
                <SelectItem value="data">Data / Tracking</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="support-description">
              Issue description{" "}
              <span className="text-destructive" aria-hidden>
                *
              </span>
            </Label>
            <Textarea
              id="support-description"
              name="description"
              placeholder="Tell us what's going on..."
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="support-steps">Steps to reproduce (optional)</Label>
            <Textarea
              id="support-steps"
              name="steps"
              placeholder="What happened before the issue occurred?"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="support-attachment">Screenshot (optional)</Label>
            <FileInput
              id="support-attachment"
              name="attachment"
              className="text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="support-email">
              Email{" "}
              <span className="text-destructive" aria-hidden>
                *
              </span>
            </Label>
            <Input
              id="support-email"
              type="email"
              name="email"
              placeholder="you@example.com"
              className="text-sm"
              required
            />
          </div>
        </form>
      </FormDialogContent>
    </Dialog>
  )
}

export { SupportDialog }
