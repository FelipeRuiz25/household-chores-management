"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, X, Award } from "lucide-react"
import { useRouter } from "next/navigation"

type FamilyMember = {
  id: number
  name: string
  avatar: string
  initials: string
  completedChores: number
  totalChores: number
  progress: number
  pendingChores?: {
    id: number
    name: string
    dueDate: string
  }[]
}

export function FamilyProgress() {
  const router = useRouter()
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null)

  const familyMembers: FamilyMember[] = [
    {
      id: 1,
      name: "Alex Johnson",
      avatar: "/placeholder.svg",
      initials: "AJ",
      completedChores: 8,
      totalChores: 10,
      progress: 80,
      pendingChores: [
        { id: 101, name: "Vacuum Living Room", dueDate: "Today" },
        { id: 102, name: "Take Out Trash", dueDate: "Tomorrow" },
      ],
    },
    {
      id: 2,
      name: "Sam Lee",
      avatar: "/placeholder.svg",
      initials: "SL",
      completedChores: 6,
      totalChores: 8,
      progress: 75,
      pendingChores: [
        { id: 103, name: "Wash Dishes", dueDate: "Today" },
        { id: 104, name: "Clean Bathroom", dueDate: "Friday" },
      ],
    },
    {
      id: 3,
      name: "Jamie Davis",
      avatar: "/placeholder.svg",
      initials: "JD",
      completedChores: 9,
      totalChores: 10,
      progress: 90,
      pendingChores: [{ id: 105, name: "Mow Lawn", dueDate: "Saturday" }],
    },
    {
      id: 4,
      name: "Taylor Smith",
      avatar: "/placeholder.svg",
      initials: "TS",
      completedChores: 7,
      totalChores: 9,
      progress: 78,
      pendingChores: [
        { id: 106, name: "Do Laundry", dueDate: "Today" },
        { id: 107, name: "Dust Furniture", dueDate: "Thursday" },
      ],
    },
  ]

  // Open member details modal
  const openMemberDetails = (member: FamilyMember) => {
    setSelectedMember(member)
  }

  // Close member details modal
  const closeMemberDetails = () => {
    setSelectedMember(null)
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Family Progress</CardTitle>
            <CardDescription>Track how family members are doing with their assigned chores</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => router.push("/users")}>
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {familyMembers.map((member) => (
              <div
                key={member.id}
                className="space-y-2 cursor-pointer hover:bg-muted/50 p-3 rounded-md"
                onClick={() => openMemberDetails(member)}
              >
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

      {/* Family Member Details Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-background border rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              onClick={closeMemberDetails}
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </button>

            <div className="flex items-center space-x-4 mb-6">
              <Avatar className="h-12 w-12">
                <AvatarImage src={selectedMember.avatar} alt={selectedMember.name} />
                <AvatarFallback>{selectedMember.initials}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{selectedMember.name}</h2>
                <div className="flex items-center mt-1">
                  <Progress value={selectedMember.progress} className="h-2 w-24 mr-2" />
                  <span className="text-sm font-medium">{selectedMember.progress}% complete</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm">Completed Chores</span>
                </div>
                <span className="text-sm font-medium">{selectedMember.completedChores}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <span className="text-sm">Pending Chores</span>
                </div>
                <span className="text-sm font-medium">
                  {selectedMember.totalChores - selectedMember.completedChores}
                </span>
              </div>

              {selectedMember.pendingChores && selectedMember.pendingChores.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Pending Chores:</h3>
                  <div className="space-y-2 bg-muted/50 p-3 rounded-md">
                    {selectedMember.pendingChores.map((chore) => (
                      <div key={chore.id} className="flex justify-between items-center text-xs">
                        <div className="flex items-center space-x-2">
                          <span>{chore.name}</span>
                        </div>
                        <span className="text-muted-foreground">Due: {chore.dueDate}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedMember.progress >= 80 && (
                <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400 mt-2">
                  <Award className="h-4 w-4" />
                  <span className="text-sm">Top Performer</span>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={closeMemberDetails}>
                Close
              </Button>
              <Button
                onClick={() => {
                  closeMemberDetails()
                  router.push(`/users`)
                }}
              >
                View Details
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

