"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, Users, Award } from "lucide-react"
import { useRouter } from "next/navigation"
import { useChores } from "@/contexts/chores-context"
import { useUsers } from "@/contexts/users-context"

export function DashboardStats() {
    const router = useRouter()
    const { chores } = useChores()
    const { users } = useUsers()

    // Calculate stats
    const completedChores = chores.filter((chore) => chore.status === "completed").length
    const pendingChores = chores.filter((chore) => chore.status === "pending").length
    const activeUsers = users.length

    // Calculate completion rate
    const totalChores = chores.length
    const completionRate = totalChores > 0 ? Math.round((completedChores / totalChores) * 100) : 0

    // Adjust the grid to stack on very small screens
    return (
        <div className="grid gap-4 grid-cols-1 xs:grid-cols-2 lg:grid-cols-4">
            <Card
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => router.push("/chores?filter=completed")}
            >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Completed Chores</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{completedChores}</div>
                </CardContent>
            </Card>

            <Card
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => router.push("/chores?filter=pending")}
            >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Chores</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{pendingChores}</div>
                </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push("/users")}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{activeUsers}</div>
                    <p className="text-xs text-muted-foreground">All family members</p>
                </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                    <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{completionRate}%</div>
                </CardContent>
            </Card>
        </div>
    )
}

