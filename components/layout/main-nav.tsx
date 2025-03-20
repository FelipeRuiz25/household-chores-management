"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Users, CheckSquare, Calendar, Settings } from "lucide-react"

export function MainNav() {
  const pathname = usePathname()

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
    {
      href: "/settings",
      label: "Settings",
      icon: Settings,
      active: pathname === "/settings",
    },
  ]

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {routes.map((route) => {
        const Icon = route.icon
        return (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center text-sm font-medium transition-colors hover:text-primary",
              route.active ? "text-primary" : "text-muted-foreground",
            )}
          >
            <Icon className="w-4 h-4 mr-2" />
            {route.label}
          </Link>
        )
      })}
    </nav>
  )
}

