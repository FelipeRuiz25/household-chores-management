import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge-custom"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export function UpcomingChores() {
  const upcomingChores = [
    {
      id: 1,
      name: "Vacuum Living Room",
      dueDate: "Today",
      assignedTo: {
        name: "Alex",
        avatar: "/placeholder.svg",
        initials: "AJ",
      },
      priority: "high",
    },
    {
      id: 2,
      name: "Take Out Trash",
      dueDate: "Today",
      assignedTo: {
        name: "Sam",
        avatar: "/placeholder.svg",
        initials: "SL",
      },
      priority: "medium",
    },
    {
      id: 3,
      name: "Clean Bathroom",
      dueDate: "Tomorrow",
      assignedTo: {
        name: "Jamie",
        avatar: "/placeholder.svg",
        initials: "JD",
      },
      priority: "medium",
    },
    {
      id: 4,
      name: "Mow Lawn",
      dueDate: "Tomorrow",
      assignedTo: {
        name: "Taylor",
        avatar: "/placeholder.svg",
        initials: "TS",
      },
      priority: "low",
    },
  ]

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Upcoming Chores</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingChores.map((chore) => (
            <div key={chore.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
              <div className="flex items-center space-x-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={chore.assignedTo.avatar} alt={chore.assignedTo.name} />
                  <AvatarFallback>{chore.assignedTo.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{chore.name}</p>
                  <p className="text-xs text-muted-foreground">Due: {chore.dueDate}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge
                  variant={
                    chore.priority === "high" ? "destructive" : chore.priority === "medium" ? "default" : "secondary"
                  }
                >
                  {chore.priority}
                </Badge>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <CheckCircle className="h-4 w-4" />
                  <span className="sr-only">Mark as complete</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

