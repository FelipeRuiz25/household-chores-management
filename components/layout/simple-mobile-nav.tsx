"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Users, CheckSquare, Calendar, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SimpleMobileNav() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const routes = [
    {
      href: "/",
      label: "Dashboard",
      icon: Home,
      active: pathname === "/",
    },
    {
      href: "/chores",
      label: "Chores",
      icon: CheckSquare,
      active: pathname === "/chores" || pathname.startsWith("/chores/"),
    },
    {
      href: "/users",
      label: "Users",
      icon: Users,
      active: pathname === "/users" || pathname.startsWith("/users/"),
    },
    {
      href: "/schedule",
      label: "Schedule",
      icon: Calendar,
      active: pathname === "/schedule" || pathname.startsWith("/schedule/"),
    },
  ]

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="lg:hidden">
      <Button variant="ghost" size="icon" className="h-9 w-9" onClick={toggleMenu}>
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        <span className="sr-only">Toggle menu</span>
      </Button>

      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-background border-b z-50">
          <nav className="flex flex-col p-4">
            {routes.map((route) => {
              const Icon = route.icon
              return (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex items-center py-3 text-sm font-medium transition-colors hover:text-primary",
                    route.active ? "text-primary" : "text-muted-foreground",
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {route.label}
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </div>
  )
}

