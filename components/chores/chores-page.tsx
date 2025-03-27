import { Header } from "@/components/layout/header"
import { ChoresList } from "@/components/chores/chores-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { AddChoreDialog } from "@/components/chores/add-chore-dialog"

export function ChoresPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 p-2 sm:p-4 md:p-6">
                <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 xs:gap-4 mb-4 sm:mb-6">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Chores</h1>
                    <AddChoreDialog
                        trigger={
                            <Button className="w-full xs:w-auto">
                                <Plus className="mr-2 h-4 w-4" /> Add Chore
                            </Button>
                        }
                    />
                </div>
                <ChoresList />
            </main>
        </div>
    )
}

