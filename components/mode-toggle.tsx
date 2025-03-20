"use client"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useEffect } from "react"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  // Function to manually toggle dark class
  const toggleDarkClass = (newTheme: string) => {
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  // Apply dark class on initial load and theme changes
  useEffect(() => {
    // Check system preference
    const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches

    // Set initial theme based on system or saved preference
    const initialTheme = theme || (isDarkMode ? "dark" : "light")
    toggleDarkClass(initialTheme)

    // Log for debugging
    console.log("Theme initialized:", initialTheme)
  }, [theme])

  // Custom theme setter that also toggles the class
  const handleSetTheme = (newTheme: string) => {
    console.log("Setting theme to:", newTheme)
    setTheme(newTheme)
    toggleDarkClass(newTheme)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleSetTheme("light")}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSetTheme("dark")}>Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSetTheme("system")}>System</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

