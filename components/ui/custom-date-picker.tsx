"use client"

import * as React from "react"
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addDays,
} from "date-fns"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CustomDatePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
}

export function CustomDatePicker({ date, setDate }: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [currentMonth, setCurrentMonth] = React.useState(date || new Date())
  const [position, setPosition] = React.useState<"top" | "bottom">("bottom")
  const containerRef = React.useRef<HTMLDivElement>(null)
  const buttonRef = React.useRef<HTMLButtonElement>(null)

  // Generate calendar days
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Add days from previous month to start on Sunday
  const startDay = monthStart.getDay()
  const prevMonthDays = Array.from({ length: startDay }, (_, i) => addDays(monthStart, -startDay + i))

  // Add days from next month to complete the grid
  const totalDaysDisplayed = Math.ceil((monthDays.length + startDay) / 7) * 7
  const nextMonthDays = Array.from({ length: totalDaysDisplayed - (monthDays.length + startDay) }, (_, i) =>
      addDays(monthEnd, i + 1),
  )

  // All days to display
  const allDays = [...prevMonthDays, ...monthDays, ...nextMonthDays]

  // Week days header
  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

  // Handle month navigation
  const prevMonth = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const nextMonth = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  // Handle date selection
  const handleSelectDate = (day: Date, e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setDate(day)
    setIsOpen(false)
  }

  // Determine position based on available space
  const updatePosition = React.useCallback(() => {
    if (!buttonRef.current) return

    const buttonRect = buttonRef.current.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const spaceBelow = viewportHeight - buttonRect.bottom
    const calendarHeight = 320 // Approximate height of the calendar

    if (spaceBelow < calendarHeight) {
      setPosition("top")
    } else {
      setPosition("bottom")
    }
  }, [])

  // Toggle calendar open/closed
  const toggleCalendar = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault() // Prevent form submission

    if (!isOpen) {
      updatePosition()
    }
    setIsOpen(!isOpen)
  }

  // Close when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  // Update position when window is resized
  React.useEffect(() => {
    const handleResize = () => {
      if (isOpen) {
        updatePosition()
      }
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [isOpen, updatePosition])

  return (
      <div className="relative" ref={containerRef}>
        <Button
            ref={buttonRef}
            type="button" // Important: prevent form submission
            variant="outline"
            className="w-full justify-start text-left font-normal h-10"
            onClick={toggleCalendar}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>

        {isOpen && (
            <div
                className={cn(
                    "absolute z-50 rounded-md border bg-background shadow-md p-3 max-w-[280px] w-full",
                    position === "top" ? "bottom-full mb-2" : "top-full mt-2",
                )}
                onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-2">
                <Button type="button" variant="ghost" size="icon" onClick={prevMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="font-medium">{format(currentMonth, "MMMM yyyy")}</div>
                <Button type="button" variant="ghost" size="icon" onClick={nextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-7 gap-1">
                {/* Week days header */}
                {weekDays.map((day) => (
                    <div
                        key={day}
                        className="text-center text-xs font-medium text-muted-foreground h-8 flex items-center justify-center"
                    >
                      {day}
                    </div>
                ))}

                {/* Calendar days */}
                {allDays.map((day, i) => {
                  const isCurrentMonth = isSameMonth(day, currentMonth)
                  const isSelected = date ? isSameDay(day, date) : false

                  return (
                      <Button
                          key={i}
                          type="button" // Important: prevent form submission
                          variant="ghost"
                          size="icon"
                          className={cn(
                              "h-8 w-8 p-0 font-normal",
                              !isCurrentMonth && "text-muted-foreground opacity-50",
                              isSelected && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                          )}
                          onClick={(e) => handleSelectDate(day, e)}
                      >
                        {format(day, "d")}
                      </Button>
                  )
                })}
              </div>
            </div>
        )}
      </div>
  )
}

