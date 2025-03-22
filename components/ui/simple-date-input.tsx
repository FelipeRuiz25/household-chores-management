"use client"

import type * as React from "react"
import { format } from "date-fns"
import { Input } from "@/components/ui/input"

interface SimpleDateInputProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  className?: string
}

export function SimpleDateInput({ date, setDate, className }: SimpleDateInputProps) {
  // Convert Date to string format for the input
  const dateString = date ? format(date, "yyyy-MM-dd") : ""

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    if (value) {
      // Parse the date string to a Date object
      try {
        const newDate = new Date(value)
        setDate(newDate)
      } catch (error) {
        console.error("Invalid date format", error)
      }
    } else {
      // If the input is cleared, set date to undefined
      setDate(undefined)
    }
  }

  return <Input type="date" value={dateString} onChange={handleChange} className={className} />
}

