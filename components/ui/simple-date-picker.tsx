"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"

interface SimpleDatePickerProps {
    date: Date | undefined
    setDate: (date: Date | undefined) => void
}

export function SimpleDatePicker({ date, setDate }: SimpleDatePickerProps) {
    const [isCalendarOpen, setIsCalendarOpen] = React.useState(false)
    const ref = React.useRef<HTMLDivElement>(null)

    // Add event listener to close calendar when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsCalendarOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    return (
        <div className="relative" ref={ref}>
            <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
                onClick={(e) => {
                    e.stopPropagation()
                    setIsCalendarOpen(!isCalendarOpen)
                }}
            >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>

            {isCalendarOpen && (
                <div
                    className="absolute z-50 mt-2 rounded-md border bg-background shadow-md"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(newDate) => {
                            setDate(newDate)
                            if (newDate) {
                                setIsCalendarOpen(false)
                            }
                        }}
                    />
                </div>
            )}
        </div>
    )
}

