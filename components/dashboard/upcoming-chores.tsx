"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge-custom"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, User, AlertTriangle, X, Edit, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useChores } from "@/contexts/chores-context"

// Define the Chore type for the component
type Chore = {
  id: number
  name: string
  description?: string
  dueDate: string
  assignedTo: {
    name: string
    avatar: string
    initials: string
  }
  priority: string
  completed: boolean
}

export function UpcomingChores() {
  const { toast } = useToast()
  const router = useRouter()
  const { chores, updateChore } = useChores()
  const [selectedChore, setSelectedChore] = useState<Chore | null>(null)

  // Filter to get only pending chores and convert to the component's Chore type
  const pendingChores = chores
    .filter((chore) => chore.status === "pending")
    .map((chore) => ({
      id: chore.id,
      name: chore.name,
      description: chore.description,
      dueDate: new Date(chore.dueDate).toLocaleDateString(),
      assignedTo: chore.assignedTo,
      priority: chore.priority,
      completed: false,
    }))

  // State to track chores being completed
  const [upcomingChores, setUpcomingChores] = useState<Chore[]>(pendingChores)

  // Function to mark a chore as completed
  const markChoreAsCompleted = (choreId: number) => {
    // Update in the context
    updateChore(choreId, { status: "completed" })

    // Update local state
    setUpcomingChores((prevChores) =>
      prevChores.map((chore) => (chore.id === choreId ? { ...chore, completed: true } : chore)),
    )

    // Find the chore to get its name for the toast
    const chore = upcomingChores.find((c) => c.id === choreId)

    if (chore) {
      toast({
        title: "Chore completed",
        description: `"${chore.name}" has been marked as completed.`,
        variant: "default",
      })
    }
  }

  // Filter out completed chores after a delay (for animation purposes)
  const [completedChoreIds, setCompletedChoreIds] = useState<number[]>([])

  const handleCompleteChore = (choreId: number, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent opening the modal when clicking the complete button

    // Mark as completed immediately for visual feedback
    markChoreAsCompleted(choreId)

    // Add to completed IDs list for removal
    setCompletedChoreIds((prev) => [...prev, choreId])

    // Remove from list after a delay (for animation)
    setTimeout(() => {
      setUpcomingChores((prev) => prev.filter((chore) => chore.id !== choreId))
    }, 2000)
  }

  // Open chore details modal
  const openChoreDetails = (chore: Chore) => {
    setSelectedChore(chore)
  }

  // Close chore details modal
  const closeChoreDetails = () => {
    setSelectedChore(null)
  }

  // Filter chores to show only non-completed ones
  const visibleChores = upcomingChores.filter((chore) => !completedChoreIds.includes(chore.id))

  return (
    <>
      <Card className="col-span-1">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Upcoming Chores</CardTitle>
          <Button variant="outline" size="sm" className="h-8" onClick={() => router.push("/chores/new")}>
            <Plus className="h-4 w-4 mr-1" /> Add Chore
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {visibleChores.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">No upcoming chores. Great job!</div>
            ) : (
              visibleChores.map((chore) => (
                <div
                  key={chore.id}
                  className={`flex items-center justify-between border-b pb-4 last:border-0 last:pb-0 transition-opacity duration-500 cursor-pointer hover:bg-muted/50 p-2 rounded-md ${
                    chore.completed ? "opacity-50" : "opacity-100"
                  }`}
                  onClick={() => openChoreDetails(chore)}
                >
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
                        chore.priority === "high"
                          ? "destructive"
                          : chore.priority === "medium"
                            ? "warning"
                            : "secondary"
                      }
                    >
                      {chore.priority}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-green-100 hover:text-green-600 dark:hover:bg-green-900 dark:hover:text-green-400 transition-colors"
                      onClick={(e) => handleCompleteChore(chore.id, e)}
                      aria-label={`Mark ${chore.name} as complete`}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="ghost" className="w-full text-sm" onClick={() => router.push("/chores")}>
            View All Chores
          </Button>
        </CardFooter>
      </Card>

      {/* Chore Details Modal */}
      {selectedChore && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-background border rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              onClick={closeChoreDetails}
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </button>

            <h2 className="text-xl font-semibold mb-4">{selectedChore.name}</h2>

            <div className="space-y-4">
              {selectedChore.description && <div className="text-sm">{selectedChore.description}</div>}

              <div className="flex items-center space-x-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>
                  Due: <strong>{selectedChore.dueDate}</strong>
                </span>
              </div>

              <div className="flex items-center space-x-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>
                  Assigned to: <strong>{selectedChore.assignedTo.name}</strong>
                </span>
              </div>

              <div className="flex items-center space-x-2 text-sm">
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                <span>
                  Priority:
                  <Badge
                    variant={
                      selectedChore.priority === "high"
                        ? "destructive"
                        : selectedChore.priority === "medium"
                          ? "warning"
                          : "secondary"
                    }
                    className="ml-2"
                  >
                    {selectedChore.priority}
                  </Badge>
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={closeChoreDetails}>
                Close
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  closeChoreDetails()
                  router.push(`/chores/edit/${selectedChore.id}`)
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                onClick={() => {
                  handleCompleteChore(selectedChore.id, { stopPropagation: () => {} } as React.MouseEvent)
                  closeChoreDetails()
                }}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Complete
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

