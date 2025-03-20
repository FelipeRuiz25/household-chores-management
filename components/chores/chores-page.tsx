import { Header } from "@/components/layout/header"
import { ChoresList } from "@/components/chores/chores-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export function ChoresPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Chores</h1>
          <Button asChild>
            <Link href="/chores/new">
              <Plus className="mr-2 h-4 w-4" /> Add Chore
            </Link>
          </Button>
        </div>
        <ChoresList />
      </main>
    </div>
  )
}

