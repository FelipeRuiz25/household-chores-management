"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash, Award } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { useUsers, type User } from "@/contexts/users-context"
import { useChores, type Chore } from "@/contexts/chores-context"

export function UsersList() {
  const { users, updateUser, deleteUser, addUser } = useUsers()
  const { chores, updateChore, deleteChore, addChore } = useChores()
  const [displayUsers, setDisplayUsers] = useState<User[]>([])

  // State for modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [editFormData, setEditFormData] = useState<Partial<User> | null>(null)

  // Add a new ref to store deleted user and chores
  const lastDeletedUserRef = useRef<User | null>(null)
  const lastDeletedChoresRef = useRef<Chore[]>([])

  // Update user stats based on chores data
  useEffect(() => {
    const updatedUsers = users.map((user) => {
      // Find all chores assigned to this user - using a more flexible matching approach
      const userChores = chores.filter((chore) => {
        // Check if the assignedTo name matches the user name (case insensitive)
        // Also handle potential first name only matches
        const choreName = chore.assignedTo.name.toLowerCase()
        const userName = user.name.toLowerCase()
        const userFirstName = userName.split(" ")[0]

        return choreName === userName || choreName === userFirstName
      })

      // Count completed and pending chores
      const completedChores = userChores.filter((chore) => chore.status === "completed").length
      const pendingChores = userChores.filter((chore) => chore.status === "pending").length

      return {
        ...user,
        completedChores,
        pendingChores,
      }
    })

    setDisplayUsers(updatedUsers)
  }, [users, chores])

  // Handle edit user
  const handleEditUser = (user: User) => {
    setCurrentUser({ ...user })
    setEditFormData({ ...user })
    setIsEditModalOpen(true)
  }

  // Handle save edited user
  const handleSaveEdit = () => {
    if (!editFormData || !currentUser) return

    const oldName = currentUser.name
    const newName = editFormData.name || ""

    // Update the user in the context
    updateUser(currentUser.id, editFormData)

    // If the name has changed, update all chores assigned to this user
    if (oldName !== newName && newName.trim() !== "") {
      // Find all chores assigned to this user
      const userChores = chores.filter((chore) => {
        const choreName = chore.assignedTo.name.toLowerCase()
        const userName = oldName.toLowerCase()
        const userFirstName = userName.split(" ")[0]

        return choreName === userName || choreName === userFirstName
      })

      // Update each chore with the new user name
      userChores.forEach((chore) => {
        updateChore(chore.id, {
          assignedTo: {
            ...chore.assignedTo,
            name: newName,
            initials: editFormData.initials || newName.substring(0, 2).toUpperCase(),
          },
        })
      })
    }

    toast.success("User updated", {
      description: `${editFormData.name} has been updated successfully.`,
    })

    // Reset states
    setIsEditModalOpen(false)
    setCurrentUser(null)
    setEditFormData(null)
  }

  // Handle delete user
  const handleDeleteUser = (user: User) => {
    setCurrentUser({ ...user })
    setIsDeleteModalOpen(true)
  }

  // Update the handleConfirmDelete function to correctly restore each chore with its original status
  const handleConfirmDelete = () => {
    if (!currentUser) return

    // Store the user before deleting
    lastDeletedUserRef.current = { ...currentUser }

    // Find all chores assigned to this user
    const userChores = chores.filter((chore) => {
      const choreName = chore.assignedTo.name.toLowerCase()
      const userName = currentUser.name.toLowerCase()
      const userFirstName = userName.split(" ")[0]

      return choreName === userName || choreName === userFirstName
    })

    // Make a deep copy of the chores before deleting them
    lastDeletedChoresRef.current = userChores.map((chore) => ({ ...chore }))

    // Delete the user
    deleteUser(currentUser.id)

    // Delete all chores assigned to this user
    userChores.forEach((chore) => {
      deleteChore(chore.id)
    })

    // Show toast with undo button
    toast(`${currentUser.name} has been removed.`, {
      description: `The family member has been deleted${userChores.length > 0 ? ` along with ${userChores.length} assigned chore${userChores.length === 1 ? "" : "s"}` : ""}.`,
      action: {
        label: "Undo",
        onClick: () => {
          // Restore the user if undo is clicked
          if (lastDeletedUserRef.current) {
            const userToRestore = lastDeletedUserRef.current

            // Add the user back to the context
            addUser({
              name: userToRestore.name,
              email: userToRestore.email,
              role: userToRestore.role,
            })

            // Restore the deleted chores with their original status
            if (lastDeletedChoresRef.current.length > 0) {
              // Process each chore individually
              const restoredChores = lastDeletedChoresRef.current.map((chore) => {
                // Create a new chore with all the original properties
                const newChore = addChore({
                  name: chore.name,
                  description: chore.description,
                  frequency: chore.frequency,
                  dueDate: chore.dueDate,
                  assignedTo: chore.assignedTo,
                  priority: chore.priority,
                  status: chore.status,
                  id: chore.id
                })

                // If the chore was completed, update its status
                if (newChore && chore.status === "completed") {
                  updateChore(newChore.id, { status: "completed" })
                  return { ...newChore, status: "completed" }
                }

                return newChore
              })
            }

            toast.success("User restored", {
              description: `${userToRestore.name} has been restored with ${lastDeletedChoresRef.current.length} assigned chore(s).`,
            })

            lastDeletedUserRef.current = null
            lastDeletedChoresRef.current = []
          }
        },
      },
    })

    // Reset states
    setIsDeleteModalOpen(false)
    setCurrentUser(null)
  }

  return (
      <>
        <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {displayUsers.map((user) => (
              <Card key={user.id}>
                <CardHeader className="flex flex-row items-center gap-2 sm:gap-4 pb-2">
                  <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.initials}</AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1 min-w-0 flex-1">
                    <CardTitle className="text-base sm:text-lg truncate">{user.name}</CardTitle>
                    <CardDescription className="truncate">{user.email}</CardDescription>
                    <Badge className="w-fit capitalize" variant={user.role === "parent" ? "default" : "secondary"}>
                      {user.role}
                    </Badge>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditUser(user)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteUser(user)}>
                        <Trash className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-sm text-muted-foreground">Completed Chores</span>
                      <span className="text-sm font-medium w-6 text-center">{user.completedChores}</span>
                    </div>
                    <div className="flex items-center justify-between px-1">
                      <span className="text-sm text-muted-foreground">Pending Chores</span>
                      <span className="text-sm font-medium w-6 text-center">{user.pendingChores}</span>
                    </div>
                    {user.completedChores > 7 && (
                        <div className="flex items-center mt-2 text-amber-500">
                          <Award className="h-4 w-4 mr-1" />
                          <span className="text-xs font-medium">Top Performer</span>
                        </div>
                    )}
                  </div>
                </CardContent>
              </Card>
          ))}
        </div>

        {/* Edit Modal */}
        {isEditModalOpen && editFormData && (
            <div
                className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center overflow-y-auto"
                aria-describedby="edit-user-description"
                style={{ minHeight: "100vh" }}
            >
              <div className="bg-background border rounded-lg shadow-lg w-full max-w-md p-6 relative my-8 mx-auto">
                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    onClick={() => {
                      setIsEditModalOpen(false)
                      setCurrentUser(null)
                      setEditFormData(null)
                    }}
                >
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-x"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                  <span className="sr-only">Close</span>
                </button>

                <h2 className="text-lg font-semibold mb-4">Edit Family Member</h2>
                <div className="sr-only" id="edit-user-description">
                  Make changes to the family member details.
                </div>
                <p className="text-sm text-muted-foreground mb-4">Make changes to the family member details below.</p>

                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-name">Full Name</Label>
                    <Input
                        id="edit-name"
                        value={editFormData.name || ""}
                        onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="edit-email">Email Address</Label>
                    <Input
                        id="edit-email"
                        type="email"
                        value={editFormData.email || ""}
                        onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="edit-role">Role</Label>
                    <Select
                        value={editFormData.role || ""}
                        onValueChange={(value) => setEditFormData({ ...editFormData, role: value })}
                    >
                      <SelectTrigger id="edit-role">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="parent">Parent</SelectItem>
                        <SelectItem value="child">Child</SelectItem>
                        <SelectItem value="other">Other Family Member</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-col gap-2 mt-6">
                  <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditModalOpen(false)
                        setCurrentUser(null)
                        setEditFormData(null)
                      }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSaveEdit}>Save Changes</Button>
                </div>
              </div>
            </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && currentUser && (
            <div
                className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center overflow-y-auto"
                aria-describedby="delete-user-description"
                style={{ minHeight: "100vh" }}
            >
              <div className="bg-background border rounded-lg shadow-lg w-full max-w-md p-6 relative my-8 mx-auto">
                <h2 className="text-lg font-semibold mb-4">Are you sure?</h2>
                <div className="sr-only" id="delete-user-description">
                  Confirm deletion of this family member.
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  This will permanently remove "{currentUser.name}" from your family members and delete all chores assigned
                  to them.
                </p>

                <div className="flex flex-col gap-2 mt-6">
                  <Button
                      variant="outline"
                      onClick={() => {
                        setIsDeleteModalOpen(false)
                        setCurrentUser(null)
                      }}
                  >
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleConfirmDelete}>
                    Delete
                  </Button>
                </div>
              </div>
            </div>
        )}
      </>
  )
}

