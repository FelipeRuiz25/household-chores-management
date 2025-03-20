import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash, Award } from "lucide-react"

export function UsersList() {
  const users = [
    {
      id: 1,
      name: "Alex Johnson",
      email: "alex@example.com",
      role: "parent",
      avatar: "/placeholder.svg",
      initials: "AJ",
      completedChores: 8,
      pendingChores: 2,
    },
    {
      id: 2,
      name: "Sam Lee",
      email: "sam@example.com",
      role: "child",
      avatar: "/placeholder.svg",
      initials: "SL",
      completedChores: 6,
      pendingChores: 2,
    },
    {
      id: 3,
      name: "Jamie Davis",
      email: "jamie@example.com",
      role: "child",
      avatar: "/placeholder.svg",
      initials: "JD",
      completedChores: 9,
      pendingChores: 1,
    },
    {
      id: 4,
      name: "Taylor Smith",
      email: "taylor@example.com",
      role: "child",
      avatar: "/placeholder.svg",
      initials: "TS",
      completedChores: 7,
      pendingChores: 2,
    },
  ]

  return (
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
                <DropdownMenuItem>
                  <Pencil className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
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
  )
}

