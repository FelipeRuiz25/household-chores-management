"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"

export function DarkModeDebug() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check if dark class is present on mount
    setIsDark(document.documentElement.classList.contains("dark"))
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !isDark
    setIsDark(newDarkMode)

    if (newDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

    console.log("Dark mode toggled:", newDarkMode)
  }

  return (
    <Button variant="outline" size="icon" className="fixed bottom-4 right-4 z-50" onClick={toggleDarkMode}>
      {isDark ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
      <span className="sr-only">Toggle dark mode</span>
    </Button>
  )
}

