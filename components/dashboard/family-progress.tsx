import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function FamilyProgress() {
  const familyMembers = [
    {
      id: 1,
      name: "Alex Johnson",
      avatar: "/placeholder.svg",
      initials: "AJ",
      completedChores: 8,
      totalChores: 10,
      progress: 80,
    },
    {
      id: 2,
      name: "Sam Lee",
      avatar: "/placeholder.svg",
      initials: "SL",
      completedChores: 6,
      totalChores: 8,
      progress: 75,
    },
    {
      id: 3,
      name: "Jamie Davis",
      avatar: "/placeholder.svg",
      initials: "JD",
      completedChores: 9,
      totalChores: 10,
      progress: 90,
    },
    {
      id: 4,
      name: "Taylor Smith",
      avatar: "/placeholder.svg",
      initials: "TS",
      completedChores: 7,
      totalChores: 9,
      progress: 78,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Family Progress</CardTitle>
        <CardDescription>Track how family members are doing with their assigned chores</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {familyMembers.map((member) => (
            <div key={member.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {member.completedChores} of {member.totalChores} chores completed
                    </p>
                  </div>
                </div>
                <span className="text-sm font-medium">{member.progress}%</span>
              </div>
              <Progress value={member.progress} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

