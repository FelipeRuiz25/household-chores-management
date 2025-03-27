"use client"
import { Header } from "@/components/layout/header"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { UpcomingChores } from "@/components/dashboard/upcoming-chores"
import { FamilyProgress } from "@/components/dashboard/family-progress"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { AddChoreDialog } from "@/components/chores/add-chore-dialog"

export function DashboardPage() {
    // Adjust the grid layout for very small screens
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 p-2 sm:p-4 md:p-6">
                <div className="flex flex-col xs:flex-row xs:items-center justify-between mb-4 sm:mb-6 gap-2 xs:gap-0">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Dashboard</h1>
                    <AddChoreDialog
                        trigger={
                            <Button size="sm" className="w-full xs:w-auto">
                                <Plus className="mr-2 h-4 w-4" /> Add Chore
                            </Button>
                        }
                    />
                </div>
                <DashboardStats />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mt-4 md:mt-6 grid-rows-[auto]">
                    <UpcomingChores />
                    <FamilyProgress />
                </div>
            </main>
        </div>
    )
}

