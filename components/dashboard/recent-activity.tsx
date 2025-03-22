"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Clock, CheckCircle, X } from "lucide-react"
import { useRouter } from "next/navigation"

type Activity = {
  id: number
  user: {
    name: string
    avatar: string
    initials: string
  }
  action: string
  chore: string
  time: string
  details?: string
}

export function RecentActivity() {
  const router = useRouter()
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)

  const activities: Activity[] = [
    {
      id: 1,
      user: {
        name: "Alex",
        avatar: "/placeholder.svg",
        initials: "AJ",
      },
      action: "completed",
      chore: "Dishes",
      time: "10 minutes ago",
      details: "Washed all dishes, cleaned the sink, and put everything away in the cabinets.",
    },
    {
      id: 2,
      user: {
        name: "Sam",
        avatar: "/placeholder.svg",
        initials: "SL",
      },
      action: "assigned",
      chore: "Laundry",
      time: "1 hour ago",
      details: "Assigned to do laundry for the week, including washing, drying, and folding clothes.",
    },
    {
      id: 3,
      user: {
        name: "Jamie",
        avatar: "/placeholder.svg",
        initials: "JD",
      },
      action: "completed",
      chore: "Dusting",
      time: "2 hours ago",
      details: "Dusted all surfaces in the living room and bedrooms, including shelves and furniture.",
    },
    {
      id: 4,
      user: {
        name: "Taylor",
        avatar: "/placeholder.svg",
        initials: "TS",
      },
      action: "verified",
      chore: "Bedroom Cleaning",
      time: "3 hours ago",
      details:
        "Verified that the bedroom cleaning was completed properly, including making the bed and organizing items.",
    },
  ]

  // Open activity details modal
  const openActivityDetails = (activity: Activity) => {
    setSelectedActivity(activity)
  }

  // Close activity details modal
  const closeActivityDetails = () => {
    setSelectedActivity(null)
  }

  return (
    <>
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center space-x-4 border-b pb-4 last:border-0 last:pb-0 cursor-pointer hover:bg-muted/50 p-2 rounded-md"
                onClick={() => openActivityDetails(activity)}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                  <AvatarFallback>{activity.user.initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {activity.user.name}
                    <span className="text-muted-foreground"> {activity.action} </span>
                    {activity.chore}
                  </p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="ghost" className="w-full text-sm" onClick={() => router.push("/chores")}>
            View All Activity
          </Button>
        </CardFooter>
      </Card>

      {/* Activity Details Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-background border rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              onClick={closeActivityDetails}
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </button>

            <div className="flex items-center space-x-4 mb-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={selectedActivity.user.avatar} alt={selectedActivity.user.name} />
                <AvatarFallback>{selectedActivity.user.initials}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-semibold">{selectedActivity.user.name}</h2>
                <p className="text-sm text-muted-foreground">
                  <span className="capitalize">{selectedActivity.action}</span> {selectedActivity.chore}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {selectedActivity.details && (
                <div className="text-sm border-l-2 border-primary pl-3 py-1">{selectedActivity.details}</div>
              )}

              <div className="flex items-center space-x-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{selectedActivity.time}</span>
              </div>

              {selectedActivity.action === "completed" && (
                <div className="flex items-center space-x-2 text-sm text-green-600 dark:text-green-400">
                  <CheckCircle className="h-4 w-4" />
                  <span>Marked as completed</span>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={closeActivityDetails}>
                Close
              </Button>
              {selectedActivity.action === "assigned" && (
                <Button
                  onClick={() => {
                    closeActivityDetails()
                    // In a real app, this would navigate to the chore details
                    router.push(`/chores`)
                  }}
                >
                  View Chore
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

