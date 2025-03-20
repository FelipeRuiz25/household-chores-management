import { Header } from "@/components/layout/header"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { UpcomingChores } from "@/components/dashboard/upcoming-chores"
import { FamilyProgress } from "@/components/dashboard/family-progress"
import { DarkModeDebug } from "@/components/dark-mode-debug"

export function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
        </div>
        <DashboardStats />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mt-4 md:mt-6">
          <UpcomingChores />
          <RecentActivity />
        </div>
        <div className="mt-4 md:mt-6">
          <FamilyProgress />
        </div>
      </main>
      <DarkModeDebug />
    </div>
  )
}

