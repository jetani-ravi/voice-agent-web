"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export type Option = {
  value: string
  label: string | React.ReactNode
  [key: string]: any
}

interface SearchableSelectProps {
  options: Option[]
  placeholder?: string
  emptyMessage?: string
  onChange?: (value: string) => void
  className?: string
  disabled?: boolean
  defaultValue?: string
  dropdownClassName?: string
  selectedLabel?: string
  align?: "start" | "end" | "center"
}

export function SearchableSelect({
  options,
  placeholder = "Select an option",
  emptyMessage = "No results found.",
  onChange,
  className,
  disabled,
  defaultValue,
  dropdownClassName,
  selectedLabel,
  align = "start",
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(defaultValue)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={disabled} value={value}>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between", className)}
        >
          {value ? (selectedLabel || options.find((option) => option.value === value)?.label) : placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("p-0", dropdownClassName)} align={align}>
        <Command>
          <CommandInput placeholder={placeholder} disabled={disabled} className="h-9" />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    onChange?.(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {option.label}
                  <Check className={cn("ml-auto", value === option.value ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

