import { MainNav } from "@/components/layout/main-nav"
import { MobileNav } from "@/components/layout/mobile-nav"

export function Header() {
  // Adjust the header for small screens
  return (
      <header className="border-b">
        <div className="flex h-14 sm:h-16 items-center px-2 sm:px-4">
          <div className="flex items-center">
            <MobileNav />
            <span className="font-bold text-lg sm:text-xl ml-1 sm:ml-2 truncate">ChoreTracker</span>
          </div>
          <div className="hidden lg:flex ml-6">
            <MainNav />
          </div>
          <div className="ml-auto flex items-center space-x-2 sm:space-x-4">{/* Light theme only */}</div>
        </div>
      </header>
  )
}

