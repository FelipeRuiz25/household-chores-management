"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"

export function TestCalendar() {
  const [date, setDate] = React.useState<Date | undefined>(undefined)

  return (
    <div className="p-4 border rounded mt-4">
      <h3 className="mb-4 font-bold">Test Calendar</h3>
      <Calendar
        mode="single"
        selected={date}
        onSelect={(newDate) => {
          setDate(newDate)
        }}
      />
    </div>
  )
}

