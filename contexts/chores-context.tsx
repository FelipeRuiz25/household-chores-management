"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

// Define Chore type
export type User = {
  name: string
  avatar: string
  initials: string
}

export type Chore = {
  id: number
  name: string
  description: string
  frequency: string
  assignedTo: User
  status: string
  dueDate: string
  priority: string
}

// Initial chores data
const initialChores: Chore[] = [
  {
    id: 1,
    name: "Vacuum Living Room",
    description: "Use the vacuum cleaner to clean the living room floor and under furniture",
    frequency: "Weekly",
    assignedTo: {
      name: "Alex",
      avatar: "/placeholder.svg",
      initials: "AJ",
    },
    status: "pending",
    dueDate: "2023-06-15",
    priority: "high",
  },
  {
    id: 2,
    name: "Take Out Trash",
    description: "Empty all trash cans and take bags to outdoor bin",
    frequency: "Daily",
    assignedTo: {
      name: "Sam",
      avatar: "/placeholder.svg",
      initials: "SL",
    },
    status: "completed",
    dueDate: "2023-06-14",
    priority: "low",
  },
  {
    id: 3,
    name: "Clean Bathroom",
    description: "Clean toilet, sink, shower, and floor",
    frequency: "Weekly",
    assignedTo: {
      name: "Jamie",
      avatar: "/placeholder.svg",
      initials: "JD",
    },
    status: "pending",
    dueDate: "2023-06-16",
    priority: "medium",
  },
  {
    id: 4,
    name: "Mow Lawn",
    description: "Cut grass in front and back yard",
    frequency: "Bi-weekly",
    assignedTo: {
      name: "Taylor",
      avatar: "/placeholder.svg",
      initials: "TS",
    },
    status: "pending",
    dueDate: "2023-06-18",
    priority: "high",
  },
  {
    id: 5,
    name: "Do Dishes",
    description: "Wash all dishes in the sink and load/unload dishwasher",
    frequency: "Daily",
    assignedTo: {
      name: "Alex",
      avatar: "/placeholder.svg",
      initials: "AJ",
    },
    status: "completed",
    dueDate: "2023-06-14",
    priority: "medium",
  },
]

type ChoresContextType = {
  chores: Chore[]
  addChore: (chore: Omit<Chore, "id" | "status">) => void
  updateChore: (id: number, chore: Partial<Chore>) => void
  deleteChore: (id: number) => void
  getChoreById: (id: number) => Chore | undefined
}

const ChoresContext = createContext<ChoresContextType | undefined>(undefined)

export function ChoresProvider({ children }: { children: ReactNode }) {
  const [chores, setChores] = useState<Chore[]>(initialChores)

  const addChore = (choreData: Omit<Chore, "id" | "status">) => {
    // Generate a new ID (in a real app, this would come from the backend)
    const newId = Math.max(...chores.map((chore) => chore.id), 0) + 1

    const newChore: Chore = {
      id: newId,
      status: "pending",
      ...choreData,
    }

    setChores((prevChores) => [...prevChores, newChore])
    return newChore
  }

  const updateChore = (id: number, choreData: Partial<Chore>) => {
    setChores((prevChores) => prevChores.map((chore) => (chore.id === id ? { ...chore, ...choreData } : chore)))
  }

  const deleteChore = (id: number) => {
    setChores((prevChores) => prevChores.filter((chore) => chore.id !== id))
  }

  const getChoreById = (id: number) => {
    return chores.find((chore) => chore.id === id)
  }

  return (
    <ChoresContext.Provider value={{ chores, addChore, updateChore, deleteChore, getChoreById }}>
      {children}
    </ChoresContext.Provider>
  )
}

export function useChores() {
  const context = useContext(ChoresContext)
  if (context === undefined) {
    throw new Error("useChores must be used within a ChoresProvider")
  }
  return context
}

