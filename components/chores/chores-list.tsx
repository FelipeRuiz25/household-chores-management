"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge-custom"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash, UserPlus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ChoresList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const chores = [
    {
      id: 1,
      name: "Vacuum Living Room",
      description: "Use the vacuum cleaner to clean the living room floor and under furniture",
      frequency: "Weekly",
      assignedTo: {
        name: "Alex",
        avatar: "/placeholder.svg",
        initials: "AJ",
      },
      status: "pending",
      dueDate: "2023-06-15",
    },
    {
      id: 2,
      name: "Take Out Trash",
      description: "Empty all trash cans and take bags to outdoor bin",
      frequency: "Daily",
      assignedTo: {
        name: "Sam",
        avatar: "/placeholder.svg",
        initials: "SL",
      },
      status: "completed",
      dueDate: "2023-06-14",
    },
    {
      id: 3,
      name: "Clean Bathroom",
      description: "Clean toilet, sink, shower, and floor",
      frequency: "Weekly",
      assignedTo: {
        name: "Jamie",
        avatar: "/placeholder.svg",
        initials: "JD",
      },
      status: "pending",
      dueDate: "2023-06-16",
    },
    {
      id: 4,
      name: "Mow Lawn",
      description: "Cut grass in front and back yard",
      frequency: "Bi-weekly",
      assignedTo: {
        name: "Taylor",
        avatar: "/placeholder.svg",
        initials: "TS",
      },
      status: "pending",
      dueDate: "2023-06-18",
    },
    {
      id: 5,
      name: "Do Dishes",
      description: "Wash all dishes in the sink and load/unload dishwasher",
      frequency: "Daily",
      assignedTo: {
        name: "Alex",
        avatar: "/placeholder.svg",
        initials: "AJ",
      },
      status: "completed",
      dueDate: "2023-06-14",
    },
  ]

  const filteredChores = chores.filter((chore) => {
    const matchesSearch =
      chore.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chore.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || chore.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Chores</CardTitle>
        <CardDescription>Manage and track all household chores</CardDescription>
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 mt-4">
          <Input
            placeholder="Search chores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <div className="min-w-[700px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredChores.map((chore) => (
                <TableRow key={chore.id}>
                  <TableCell className="font-medium">{chore.name}</TableCell>
                  <TableCell>{chore.frequency}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={chore.assignedTo.avatar} alt={chore.assignedTo.name} />
                        <AvatarFallback>{chore.assignedTo.initials}</AvatarFallback>
                      </Avatar>
                      <span>{chore.assignedTo.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={chore.status === "completed" ? "success" : "default"}>
                      {chore.status === "completed" ? "Completed" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(chore.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <UserPlus className="mr-2 h-4 w-4" />
                          <span>Reassign</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Trash className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

