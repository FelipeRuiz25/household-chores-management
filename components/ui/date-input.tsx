"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { format, parse } from "date-fns"

interface DateInputProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function DateInput({ value, onChange, className }: DateInputProps) {
  const [date, setDate] = useState<Date | undefined>(() => {
    // Try to parse the initial value
    try {
      return value ? parse(value, "yyyy-MM-dd", new Date()) : undefined
    } catch (e) {
      return undefined
    }
  })

  // Update the input value when the date changes
  useEffect(() => {
    if (date) {
      onChange(format(date, "yyyy-MM-dd"))
    }
  }, [date, onChange])

  // Handle manual input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)

    // Try to parse the input value
    try {
      const inputDate = parse(e.target.value, "yyyy-MM-dd", new Date())
      if (!isNaN(inputDate.getTime())) {
        setDate(inputDate)
      }
    } catch (e) {
      // Invalid date format, just update the input
    }
  }

  return (
    <div className="flex w-full">
      <Input type="date" value={value} onChange={handleInputChange} className={className} />
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" className="ml-2">
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => {
              setDate(newDate)
              if (newDate) {
                onChange(format(newDate, "yyyy-MM-dd"))
              }
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

