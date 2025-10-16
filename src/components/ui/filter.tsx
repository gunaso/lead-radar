"use client"

import * as React from "react"

import { ListFilter } from "lucide-react"

import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Command,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

function Filter({
  name,
  selectedState,
  options,
  disableSearch = false,
}: {
  name: string
  selectedState: [string[], React.Dispatch<React.SetStateAction<string[]>>]
  options: { value: string; label: string }[]
  disableSearch?: boolean
}) {
  const [open, setOpen] = React.useState(false)
  const [selectedValues, setSelectedValues] = selectedState

  const toggleValue = (value: string) => {
    setSelectedValues((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="bg-muted"
        >
          {name}
          {selectedValues.length > 0 && (
            <span className="h-4 flex items-center justify-center rounded-sm bg-primary px-1 text-xs text-primary-foreground">
              {selectedValues.length}
            </span>
          )}
          <ListFilter className="size-3 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-0" align="start">
        <Command>
          {!disableSearch && (
            <CommandInput
              className="h-7 text-sm"
              wrapperClassName="h-8 gap-1 px-2"
              iconClassName="size-3.5"
              placeholder={`Search ${name.toLowerCase()}...`}
            />
          )}
          <CommandList className="max-h-30 overflow-y-auto">
            <CommandEmpty>No {name.toLowerCase()} found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => {
                    toggleValue(option.value)
                  }}
                  className="h-7 gap-1.5 truncate text-sm"
                >
                  <Checkbox
                    className="size-3"
                    noCheckIcon
                    checked={selectedValues.includes(option.value)}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export { Filter }
