"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Users, CheckSquare, Calendar, Settings, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function MobileNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Add console log when open state changes
  useEffect(() => {
    console.log("Mobile menu state:", open ? "open" : "closed")
  }, [open])

  const handleOpenChange = (newOpen: boolean) => {
    console.log("Menu click detected! Setting open to:", newOpen)
    setOpen(newOpen)
  }

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

  // Let's also add a direct click handler to the button as a fallback
  const handleButtonClick = () => {
    console.log("Button clicked directly!")
    setOpen(true)
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 lg:hidden" onClick={handleButtonClick}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[240px] sm:w-[300px]">
        <div className="font-bold text-xl py-4">ChoreTracker</div>
        <nav className="flex flex-col gap-4 mt-4">
          {routes.map((route) => {
            const Icon = route.icon
            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center py-2 text-sm font-medium transition-colors hover:text-primary",
                  route.active ? "text-primary" : "text-muted-foreground",
                )}
                onClick={() => {
                  console.log("Navigation link clicked, closing menu")
                  setOpen(false)
                }}
              >
                <Icon className="w-4 h-4 mr-2" />
                {route.label}
              </Link>
            )
          })}
        </nav>
      </SheetContent>
    </Sheet>
  )
}

