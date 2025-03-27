"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge-custom"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, User, AlertTriangle, X, Edit, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useChores } from "@/contexts/chores-context"
import { AddChoreDialog } from "@/components/chores/add-chore-dialog"
import { useUsers } from "@/contexts/users-context"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SimpleDatePickerV2 } from "@/components/ui/simple-date-picker-v2"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"

// Form schema for editing chores
const editChoreSchema = z.object({
    name: z.string().min(2, {
        message: "Chore name must be at least 2 characters.",
    }),
    description: z.string().min(5, {
        message: "Description must be at least 5 characters.",
    }),
    frequency: z.string({
        required_error: "Please select a frequency.",
    }),
    status: z.string({
        required_error: "Please select a status.",
    }),
    dueDate: z.date({
        required_error: "Please select a due date.",
    }),
    priority: z.string().optional(),
})

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
    const router = useRouter()
    const { chores, updateChore } = useChores()
    const { users } = useUsers()
    const [selectedChore, setSelectedChore] = useState<Chore | null>(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [editingChore, setEditingChore] = useState<any | null>(null)

    // Function to ensure consistent date formatting
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
    }

    // Edit form
    const editForm = useForm<z.infer<typeof editChoreSchema>>({
        resolver: zodResolver(editChoreSchema),
        defaultValues: {
            name: "",
            description: "",
            frequency: "",
            status: "",
            dueDate: undefined,
            priority: "medium",
        },
    })

    // Get pending chores from context
    const pendingChores = chores
        .filter((chore) => chore.status === "pending")
        .map((chore) => ({
            id: chore.id,
            name: chore.name,
            description: chore.description,
            dueDate: formatDate(chore.dueDate),
            assignedTo: chore.assignedTo,
            priority: chore.priority,
            completed: false,
        }))

    // State to track visible chores (for animation purposes)
    const [visibleChores, setVisibleChores] = useState<Chore[]>(pendingChores)

    // Update visible chores when pendingChores changes
    useEffect(() => {
        // Filter out any chores that are marked for removal but keep completed ones for animation
        const updatedVisibleChores = pendingChores.filter(
            (pendingChore) =>
                !visibleChores.find((visibleChore) => visibleChore.id === pendingChore.id && visibleChore.completed),
        )

        // Add back any completed chores that are still animating
        const completedChores = visibleChores.filter((chore) => chore.completed && !completedChoreIds.includes(chore.id))

        setVisibleChores([...updatedVisibleChores, ...completedChores])
    }, [chores])

    // State to track chores being completed
    const [completedChoreIds, setCompletedChoreIds] = useState<number[]>([])

    // Function to mark a chore as completed
    const markChoreAsCompleted = (choreId: number) => {
        // Update in the context
        updateChore(choreId, { status: "completed" })

        // Update local state
        setVisibleChores((prevChores) =>
            prevChores.map((chore) => (chore.id === choreId ? { ...chore, completed: true } : chore)),
        )

        // Find the chore to get its name for the toast
        const chore = visibleChores.find((c) => c.id === choreId)

        if (chore) {
            toast.success(`"${chore.name}" has been marked as completed.`, {
                description: "The chore has been marked as completed successfully.",
            })
        }
    }

    const handleCompleteChore = (choreId: number, e: React.MouseEvent) => {
        e.stopPropagation() // Prevent opening the modal when clicking the complete button

        // Mark as completed immediately for visual feedback
        markChoreAsCompleted(choreId)

        // Add to completed IDs list for removal
        setCompletedChoreIds((prev) => [...prev, choreId])

        // Remove from list after a delay (for animation)
        setTimeout(() => {
            setVisibleChores((prev) => prev.filter((chore) => chore.id !== choreId))
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

    // Handle edit chore
    const handleEditChore = (choreId: number) => {
        // Find the original chore from the context
        const originalChore = chores.find((c) => c.id === choreId)

        if (!originalChore) {
            toast.error("Chore not found.", {
                description: "Could not find chore to edit.",
            })
            return
        }

        setEditingChore(originalChore)

        // Set form values
        editForm.reset({
            name: originalChore.name,
            description: originalChore.description,
            frequency: originalChore.frequency,
            status: originalChore.status,
            dueDate: new Date(originalChore.dueDate),
            priority: originalChore.priority,
        })

        setIsEditModalOpen(true)
        closeChoreDetails() // Close the details modal
    }

    // Handle save edited chore
    const handleSaveEdit = (values: z.infer<typeof editChoreSchema>) => {
        if (!editingChore) return

        const updatedChore = {
            ...editingChore,
            name: values.name,
            description: values.description,
            frequency: values.frequency,
            status: values.status,
            dueDate: values.dueDate.toISOString().split("T")[0],
            priority: values.priority || editingChore.priority,
        }

        updateChore(editingChore.id, updatedChore)

        toast.success(`${values.name} has been updated successfully.`, {
            description: "The chore has been updated.",
        })

        // Reset states
        setIsEditModalOpen(false)
        setEditingChore(null)
        editForm.reset()
    }

    // Filter out completed chores for display
    const displayChores = visibleChores.filter((chore) => !completedChoreIds.includes(chore.id))

    return (
        <>
            <Card className="col-span-1 flex flex-col h-full">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Upcoming Chores</CardTitle>
                    <AddChoreDialog
                        trigger={
                            <Button variant="outline" size="sm" className="h-8">
                                <Plus className="h-4 w-4 mr-1" /> Add Chore
                            </Button>
                        }
                        onChoreAdded={() => {
                            // This callback will be triggered when a chore is added
                            // The component will automatically update due to the useEffect
                        }}
                    />
                </CardHeader>
                <CardContent className="flex-grow">
                    <div className="space-y-4">
                        {displayChores.length === 0 ? (
                            <div className="text-center py-6 text-muted-foreground">No upcoming chores. Great job!</div>
                        ) : (
                            displayChores.map((chore) => (
                                <div
                                    key={chore.id}
                                    className={`flex items-center justify-between border-b pb-4 last:border-0 last:pb-0 transition-opacity duration-500 cursor-pointer hover:bg-muted/50 p-2 rounded-md ${
                                        chore.completed ? "opacity-50" : "opacity-100"
                                    }`}
                                    onClick={() => openChoreDetails(chore)}
                                >
                                    <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
                                        <Avatar className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0">
                                            <AvatarImage src={chore.assignedTo.avatar} alt={chore.assignedTo.name} />
                                            <AvatarFallback>{chore.assignedTo.initials}</AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium truncate">{chore.name}</p>
                                            <p className="text-xs text-muted-foreground">Due: {chore.dueDate}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0 ml-2">
                                        <Badge
                                            variant={
                                                chore.priority === "high"
                                                    ? "destructive"
                                                    : chore.priority === "medium"
                                                        ? "warning"
                                                        : "secondary"
                                            }
                                            className="text-xs"
                                        >
                                            {chore.priority}
                                        </Badge>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 sm:h-8 sm:w-8 hover:bg-green-100 hover:text-green-600 dark:hover:bg-green-900 dark:hover:text-green-400 transition-colors"
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
                <CardFooter className="flex justify-center mt-auto border-t">
                    <Button variant="ghost" className="w-full text-sm" onClick={() => router.push("/chores")}>
                        View All Chores
                    </Button>
                </CardFooter>
            </Card>

            {/* Chore Details Modal */}
            {selectedChore && (
                <div
                    className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center overflow-y-auto"
                    aria-describedby="chore-details-description"
                    style={{ minHeight: "100vh" }}
                >
                    <div className="bg-background border rounded-lg shadow-lg w-full max-w-md p-6 relative my-8 mx-auto max-h-[90vh] overflow-y-auto">
                        <button
                            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
                            onClick={closeChoreDetails}
                        >
                            <X className="h-5 w-5" />
                            <span className="sr-only">Close</span>
                        </button>

                        <h2 className="text-xl font-semibold mb-4">{selectedChore.name}</h2>

                        <div className="sr-only" id="chore-details-description">
                            View and manage details for the selected chore.
                        </div>

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

                        <div className="flex flex-col gap-2 mt-6">
                            <Button
                                onClick={() => {
                                    handleCompleteChore(selectedChore.id, { stopPropagation: () => {} } as React.MouseEvent)
                                    closeChoreDetails()
                                }}
                            >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Complete
                            </Button>
                            <Button variant="outline" onClick={() => handleEditChore(selectedChore.id)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                            </Button>
                            <Button variant="outline" onClick={closeChoreDetails}>
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {isEditModalOpen && editingChore && (
                <div
                    className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center overflow-y-auto"
                    aria-describedby="edit-chore-description"
                    style={{ minHeight: "100vh" }}
                >
                    <div className="bg-background border rounded-lg shadow-lg w-full max-w-md p-6 relative my-8 mx-auto max-h-[90vh] overflow-y-auto">
                        <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                            onClick={() => {
                                setIsEditModalOpen(false)
                                setEditingChore(null)
                                editForm.reset()
                            }}
                        >
                            <X className="h-5 w-5" />
                            <span className="sr-only">Close</span>
                        </button>

                        <h2 className="text-lg font-semibold mb-4">Edit Chore</h2>

                        <div className="sr-only" id="edit-chore-description">
                            Make changes to the chore details.
                        </div>

                        <p className="text-sm text-muted-foreground mb-4">Make changes to the chore details below.</p>
                        <Badge
                            variant={
                                editingChore.priority === "high"
                                    ? "destructive"
                                    : editingChore.priority === "medium"
                                        ? "warning"
                                        : "secondary"
                            }
                            className="ml-2"
                        >
                            {editingChore.priority}
                        </Badge>

                        <Form {...editForm}>
                            <form onSubmit={editForm.handleSubmit(handleSaveEdit)} className="space-y-4">
                                <FormField
                                    control={editForm.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={editForm.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={editForm.control}
                                        name="frequency"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Frequency</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select frequency" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="Daily">Daily</SelectItem>
                                                        <SelectItem value="Weekly">Weekly</SelectItem>
                                                        <SelectItem value="Bi-weekly">Bi-weekly</SelectItem>
                                                        <SelectItem value="Monthly">Monthly</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={editForm.control}
                                        name="status"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Status</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select status" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="pending">Pending</SelectItem>
                                                        <SelectItem value="completed">Completed</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={editForm.control}
                                        name="priority"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Priority</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value || editingChore.priority}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select priority" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="low">Low</SelectItem>
                                                        <SelectItem value="medium">Medium</SelectItem>
                                                        <SelectItem value="high">High</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={editForm.control}
                                        name="dueDate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Due Date</FormLabel>
                                                <FormControl>
                                                    <SimpleDatePickerV2
                                                        date={field.value}
                                                        setDate={(date) => {
                                                            field.onChange(date)
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="flex justify-end gap-2 mt-6">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setIsEditModalOpen(false)
                                            setEditingChore(null)
                                            editForm.reset()
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit">Save Changes</Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </div>
            )}
        </>
    )
}

