import { Header } from "@/components/layout/header"
import { ChoreCalendar } from "@/components/schedule/chore-calendar"

export function SchedulePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Chore Schedule</h1>
        </div>
        <ChoreCalendar />
      </main>
    </div>
  )
}

