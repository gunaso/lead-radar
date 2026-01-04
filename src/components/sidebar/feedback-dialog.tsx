"use client"

import { type FormEvent } from "react"
import { Send } from "lucide-react"

import { DialogTrigger, Dialog } from "@/components/ui/dialog"
import { SidebarMenuButton } from "@/components/ui/sidebar"
import { FileInput } from "@/components/ui/file-input"
import { Textarea } from "@/components/ui/textarea"
import { FormDialogContent } from "./form-dialog"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
  Select,
} from "@/components/ui/select"

function FeedbackDialog({
  open,
  onOpenChange,
  pathname,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  pathname: string | null
  onSubmit: (formData: FormData) => void | Promise<void>
}) {
  const formId = "feedback-ticket-form"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <SidebarMenuButton size="sm">
          <Send />
          Feedback
        </SidebarMenuButton>
      </DialogTrigger>
      <FormDialogContent
        title={"Feedback"}
        description={
          <span className="sr-only">
            Share what's working well and what we can improve.
          </span>
        }
        submitButtonText="Submit Feedback"
        formId={formId}
      >
        <form
          id={formId}
          className="space-y-5"
          onSubmit={(e: FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            void onSubmit(new FormData(e.currentTarget))
          }}
        >
          {/* Page context */}
          <input type="hidden" name="context_path" value={pathname || ""} />

          <div className="space-y-1.5">
            <Label htmlFor="feedback-category">
              Category{" "}
              <span className="text-destructive" aria-hidden>
                *
              </span>
            </Label>
            <Select name="category" id="feedback-category">
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="uiux">UI/UX</SelectItem>
                <SelectItem value="feature">Feature Request</SelectItem>
                <SelectItem value="ai">AI Suggestions</SelectItem>
                <SelectItem value="performance">Performance</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Satisfaction rating: 1–5 slider */}
          <fieldset className="space-y-1.5">
            <Label htmlFor="rating">Rating</Label>
            <input type="hidden" name="rating" value={3} />
            <Slider
              aria-label="Rating"
              min={1}
              max={5}
              step={1}
              defaultValue={[3]}
              onValueChange={(values) => {
                const hidden = document.querySelector(
                  'input[name="rating"]'
                ) as HTMLInputElement | null
                if (hidden) hidden.value = String(values[0] ?? 5)
              }}
              className="mt-4"
            />
            <span className="flex justify-between text-sm px-1.5">
              <span>1</span>
              <span>5</span>
            </span>
          </fieldset>

          <div className="space-y-1.5">
            <Label htmlFor="feedback-text">
              Your feedback{" "}
              <span className="text-destructive" aria-hidden>
                *
              </span>
            </Label>
            <Textarea
              id="feedback-text"
              name="feedback"
              placeholder="What’s on your mind?"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="feedback-attachment">Screenshot (optional)</Label>
            <FileInput id="feedback-attachment" name="attachment" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="feedback-email">
              Email{" "}
              <span className="text-destructive" aria-hidden>
                *
              </span>
            </Label>
            <Input
              id="feedback-email"
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

export { FeedbackDialog }
