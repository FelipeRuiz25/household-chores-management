"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash, Award } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useUsers, type User } from "@/contexts/users-context"

export function UsersList() {
  const { toast } = useToast()
  const { users, updateUser, deleteUser, addUser } = useUsers()

  // State for modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [editFormData, setEditFormData] = useState<Partial<User> | null>(null)

  // Add a state to track the last deleted user for undo functionality
  const [lastDeletedUser, setLastDeletedUser] = useState<User | null>(null)

  // Handle edit user
  const handleEditUser = (user: User) => {
    setCurrentUser({ ...user })
    setEditFormData({ ...user })
    setIsEditModalOpen(true)
  }

  // Handle save edited user
  const handleSaveEdit = () => {
    if (!editFormData || !currentUser) return

    updateUser(currentUser.id, editFormData)

    toast({
      title: "User updated",
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

  // Update the handleConfirmDelete function to store the deleted user and show a toast with undo button
  const handleConfirmDelete = () => {
    if (!currentUser) return

    // Store the user before deleting
    setLastDeletedUser({ ...currentUser })

    // Delete the user
    deleteUser(currentUser.id)

    // Show toast with undo button
    toast({
      title: "User deleted",
      description: `${currentUser.name} has been removed.`,
      variant: "default",
      action: (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            // Restore the user if undo is clicked
            if (lastDeletedUser) {
              // Add the user back to the context
              addUser({
                name: lastDeletedUser.name,
                email: lastDeletedUser.email,
                role: lastDeletedUser.role,
              })
              setLastDeletedUser(null)
              toast({
                title: "User restored",
                description: `${lastDeletedUser.name} has been restored.`,
              })
            }
          }}
        >
          Undo
        </Button>
      ),
    })

    // Reset states
    setIsDeleteModalOpen(false)
    setCurrentUser(null)
  }

  return (
    <>
      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <Card key={user.id}>
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.initials}</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <CardTitle className="text-lg">{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
                <Badge className="w-fit capitalize" variant={user.role === "parent" ? "default" : "secondary"}>
                  {user.role}
                </Badge>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0 ml-auto">
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
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Completed Chores</span>
                  <span className="text-sm font-medium">{user.completedChores}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Pending Chores</span>
                  <span className="text-sm font-medium">{user.pendingChores}</span>
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
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-background border rounded-lg shadow-lg w-full max-w-md p-6 relative">
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

            <div className="flex justify-end gap-2 mt-6">
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
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-background border rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <h2 className="text-lg font-semibold mb-4">Are you sure?</h2>
            <p className="text-sm text-muted-foreground mb-4">
              This will permanently remove "{currentUser.name}" from your family members. This action cannot be undone.
            </p>

            <div className="flex justify-end gap-2 mt-6">
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

