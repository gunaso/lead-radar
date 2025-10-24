"use client"

import * as React from "react"
import { Image as ImageIcon, Plus, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export type FileInputProps = Omit<
  React.ComponentProps<"input">,
  "type" | "multiple"
> & {
  accept?: string
  placeholder?: string
}

const DEFAULT_ACCEPT = "image/png,image/jpeg,image/webp"

export function FileInput({
  id,
  name,
  accept = DEFAULT_ACCEPT,
  placeholder = "Add image...",
  className,
  onChange,
  ...props
}: FileInputProps) {
  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const [fileName, setFileName] = React.useState<string>("")

  const openFilePicker = () => {
    inputRef.current?.click()
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) {
      setFileName("")
      onChange?.(e)
      return
    }

    const allowed = DEFAULT_ACCEPT.split(",")
    const isAllowedType = allowed.includes(file.type)
    const isAllowedExt = /(png|jpe?g|webp)$/i.test(file.name)

    if (!isAllowedType || !isAllowedExt) {
      toast.error("Unsupported file. Please select a PNG, JPEG, or WEBP image.")
      // Reset the input
      e.target.value = ""
      setFileName("")
      return
    }

    setFileName(file.name)
    onChange?.(e)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      openFilePicker()
    }
  }

  function handleRemoveClick(e: React.MouseEvent) {
    e.stopPropagation()
    if (inputRef.current) {
      inputRef.current.value = ""
    }
    setFileName("")
  }

  function handleEditClick(e: React.MouseEvent) {
    e.stopPropagation()
    openFilePicker()
  }

  return (
    <div className={cn("flex w-full items-center gap-2", className)}>
      <input
        ref={inputRef}
        id={id}
        name={name}
        type="file"
        accept={accept}
        multiple={false}
        className="sr-only"
        onChange={handleChange}
        {...props}
      />
      <div
        role="button"
        tabIndex={0}
        onClick={openFilePicker}
        onKeyDown={handleKeyDown}
        aria-label="Select image file"
        className={cn(
          "border-input focus-visible:border-primary aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex h-9 w-full items-center justify-between gap-2 rounded-md border bg-transparent pl-3 pr-1 py-2 text-sm outline-none transition-[color,box-shadow]",
          "focus-visible:ring-2 focus-visible:ring-ring/40"
        )}
      >
        <span className="flex min-w-0 items-center gap-2">
          <ImageIcon className="size-4 text-muted-foreground" />
          <span className="truncate text-left text-foreground/90">
            {fileName || placeholder}
          </span>
        </span>
        <span className="shrink-0 flex items-center gap-1.5">
          {fileName ? (
            <>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleEditClick}
                className="size-6"
              >
                <Pencil className="size-3" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleRemoveClick}
                className="size-6"
              >
                <Trash2 className="size-3" />
              </Button>
            </>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                openFilePicker()
              }}
            >
              <Plus className="size-3" />
              Add
            </Button>
          )}
        </span>
      </div>
    </div>
  )
}
