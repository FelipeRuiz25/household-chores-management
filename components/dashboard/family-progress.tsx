"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, X, Award } from "lucide-react"
import { useRouter } from "next/navigation"
import { useChores } from "@/contexts/chores-context"
import { useUsers } from "@/contexts/users-context"

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
  const { chores } = useChores()
  const { users } = useUsers()
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null)
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([])

  // Function to ensure consistent date formatting
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
  }

  // Calculate family progress data based on actual chores and users
  useEffect(() => {
    const updatedFamilyMembers = users.map((user) => {
      // Find all chores assigned to this user - using a more flexible matching approach
      const userChores = chores.filter((chore) => {
        // Check if the assignedTo name matches the user name (case insensitive)
        // Also handle potential first name only matches
        const choreName = chore.assignedTo.name.toLowerCase()
        const userName = user.name.toLowerCase()
        const userFirstName = userName.split(" ")[0]

        return choreName === userName || choreName === userFirstName
      })

      // Count completed and total chores
      const completedChores = userChores.filter((chore) => chore.status === "completed").length
      const totalChores = userChores.length

      // Calculate progress
      const progress = totalChores > 0 ? Math.round((completedChores / totalChores) * 100) : 0

      // Get pending chores details
      const pendingChores = userChores
          .filter((chore) => chore.status === "pending")
          .map((chore) => ({
            id: chore.id,
            name: chore.name,
            dueDate: formatDate(chore.dueDate),
          }))

      return {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        initials: user.initials,
        completedChores,
        totalChores,
        progress,
        pendingChores,
      }
    })

    setFamilyMembers(updatedFamilyMembers)
  }, [users, chores])

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
            {/* Adjust the progress items for small screens */}
            <div className="space-y-6">
              {familyMembers.map((member) => (
                  <div
                      key={member.id}
                      className="space-y-2 cursor-pointer hover:bg-muted/50 p-2 sm:p-3 rounded-md"
                      onClick={() => openMemberDetails(member)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
                        <Avatar className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>{member.initials}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{member.name}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {member.completedChores} of {member.totalChores} chores completed
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-medium ml-2">{member.progress}%</span>
                    </div>
                    <Progress value={member.progress} className="h-2" />
                  </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Family Member Details Modal */}
        {selectedMember && (
            <div
                className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center overflow-y-auto"
                aria-describedby="member-details-description"
                style={{ minHeight: "100vh" }}
            >
              <div className="bg-background border rounded-lg shadow-lg w-full max-w-md p-6 relative my-8 mx-auto">
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
                    <div className="sr-only" id="member-details-description">
                      View details about this family member's chore progress.
                    </div>
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

                <div className="flex flex-col gap-2 mt-6">
                  <Button
                      onClick={() => {
                        closeMemberDetails()
                        router.push(`/users`)
                      }}
                  >
                    View Details
                  </Button>
                  <Button variant="outline" onClick={closeMemberDetails}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
        )}
      </>
  )
}

