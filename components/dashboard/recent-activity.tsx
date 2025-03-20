import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function RecentActivity() {
  const activities = [
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
    },
  ]

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4 border-b pb-4 last:border-0 last:pb-0">
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
    </Card>
  )
}

