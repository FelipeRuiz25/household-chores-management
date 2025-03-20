"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function ChoreCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()

  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

  const monthName = currentDate.toLocaleString("default", { month: "long" })
  const year = currentDate.getFullYear()

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  // Sample chore data
  const choreSchedule = [
    {
      id: 1,
      name: "Vacuum Living Room",
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 5),
      assignedTo: {
        name: "Alex",
        avatar: "/placeholder.svg",
        initials: "AJ",
      },
    },
    {
      id: 2,
      name: "Take Out Trash",
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 7),
      assignedTo: {
        name: "Sam",
        avatar: "/placeholder.svg",
        initials: "SL",
      },
    },
    {
      id: 3,
      name: "Clean Bathroom",
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 12),
      assignedTo: {
        name: "Jamie",
        avatar: "/placeholder.svg",
        initials: "JD",
      },
    },
    {
      id: 4,
      name: "Mow Lawn",
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      assignedTo: {
        name: "Taylor",
        avatar: "/placeholder.svg",
        initials: "TS",
      },
    },
    {
      id: 5,
      name: "Do Dishes",
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 20),
      assignedTo: {
        name: "Alex",
        avatar: "/placeholder.svg",
        initials: "AJ",
      },
    },
    {
      id: 6,
      name: "Laundry",
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 22),
      assignedTo: {
        name: "Sam",
        avatar: "/placeholder.svg",
        initials: "SL",
      },
    },
    {
      id: 7,
      name: "Dust Furniture",
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 25),
      assignedTo: {
        name: "Jamie",
        avatar: "/placeholder.svg",
        initials: "JD",
      },
    },
  ]

  const getChoresForDay = (day: number) => {
    return choreSchedule.filter(
      (chore) =>
        chore.date.getDate() === day &&
        chore.date.getMonth() === currentDate.getMonth() &&
        chore.date.getFullYear() === currentDate.getFullYear(),
    )
  }

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const calendarDays = Array(firstDayOfMonth).fill(null).concat(days)

  // Fill the remaining cells to complete the grid
  const remainingCells = 7 - (calendarDays.length % 7)
  if (remainingCells < 7) {
    calendarDays.push(...Array(remainingCells).fill(null))
  }

  // Create weeks
  const weeks = []
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7))
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle>
            {monthName} {year}
          </CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" onClick={previousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardDescription>View and manage your family's chore schedule</CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <div className="min-w-[600px]">
          <div className="grid grid-cols-7 gap-1 text-center font-medium">
            <div className="p-2">Sun</div>
            <div className="p-2">Mon</div>
            <div className="p-2">Tue</div>
            <div className="p-2">Wed</div>
            <div className="p-2">Thu</div>
            <div className="p-2">Fri</div>
            <div className="p-2">Sat</div>
          </div>
          <div className="grid grid-cols-7 gap-1 mt-1">
            {weeks.map((week, weekIndex) =>
              week.map((day, dayIndex) => (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className={`min-h-[80px] sm:min-h-[100px] p-2 border rounded-md ${
                    day === null ? "bg-muted/20" : "hover:bg-muted/50"
                  }`}
                >
                  {day !== null && (
                    <>
                      <div className="font-medium">{day}</div>
                      <div className="mt-1 space-y-1">
                        {getChoresForDay(day).map((chore) => (
                          <div key={chore.id} className="flex items-center text-xs p-1 bg-primary/10 rounded">
                            <Avatar className="h-4 w-4 mr-1">
                              <AvatarImage src={chore.assignedTo.avatar} alt={chore.assignedTo.name} />
                              <AvatarFallback className="text-[8px]">{chore.assignedTo.initials}</AvatarFallback>
                            </Avatar>
                            <span className="truncate">{chore.name}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )),
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

