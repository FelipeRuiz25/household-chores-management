import { MainNav } from "@/components/layout/main-nav"
import { MobileNav } from "@/components/layout/mobile-nav"

export function Header() {
  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center">
          <MobileNav />
          <span className="font-bold text-xl ml-2">ChoreTracker</span>
        </div>
        <div className="hidden lg:flex ml-6">
          <MainNav />
        </div>
        <div className="ml-auto flex items-center space-x-4">{/* Light theme only */}</div>
      </div>
    </header>
  )
}

