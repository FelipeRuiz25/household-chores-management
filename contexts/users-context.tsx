"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

// Define User type
export type User = {
  id: number
  name: string
  email: string
  role: string
  avatar: string
  initials: string
  completedChores: number
  pendingChores: number
}

// Initial users data
const initialUsers: User[] = [
  {
    id: 1,
    name: "Alex Johnson",
    email: "alex@example.com",
    role: "parent",
    avatar: "/placeholder.svg",
    initials: "AJ",
    completedChores: 8,
    pendingChores: 2,
  },
  {
    id: 2,
    name: "Sam Lee",
    email: "sam@example.com",
    role: "child",
    avatar: "/placeholder.svg",
    initials: "SL",
    completedChores: 6,
    pendingChores: 2,
  },
  {
    id: 3,
    name: "Jamie Davis",
    email: "jamie@example.com",
    role: "child",
    avatar: "/placeholder.svg",
    initials: "JD",
    completedChores: 9,
    pendingChores: 1,
  },
  {
    id: 4,
    name: "Taylor Smith",
    email: "taylor@example.com",
    role: "child",
    avatar: "/placeholder.svg",
    initials: "TS",
    completedChores: 7,
    pendingChores: 2,
  },
]

type UsersContextType = {
  users: User[]
  addUser: (user: Omit<User, "id" | "avatar" | "initials" | "completedChores" | "pendingChores">) => void
  updateUser: (id: number, user: Partial<User>) => void
  deleteUser: (id: number) => void
}

const UsersContext = createContext<UsersContextType | undefined>(undefined)

export function UsersProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(initialUsers)

  const addUser = (userData: Omit<User, "id" | "avatar" | "initials" | "completedChores" | "pendingChores">) => {
    // Generate a new ID (in a real app, this would come from the backend)
    const newId = Math.max(...users.map((user) => user.id), 0) + 1

    // Generate initials from name
    const nameParts = userData.name.split(" ")
    const initials = nameParts.length > 1 ? `${nameParts[0][0]}${nameParts[1][0]}` : userData.name.substring(0, 2)

    const newUser: User = {
      id: newId,
      avatar: "/placeholder.svg",
      initials: initials.toUpperCase(),
      completedChores: 0,
      pendingChores: 0,
      ...userData,
    }

    setUsers((prevUsers) => [...prevUsers, newUser])
  }

  const updateUser = (id: number, userData: Partial<User>) => {
    setUsers((prevUsers) => prevUsers.map((user) => (user.id === id ? { ...user, ...userData } : user)))
  }

  const deleteUser = (id: number) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id))
  }

  return <UsersContext.Provider value={{ users, addUser, updateUser, deleteUser }}>{children}</UsersContext.Provider>
}

export function useUsers() {
  const context = useContext(UsersContext)
  if (context === undefined) {
    throw new Error("useUsers must be used within a UsersProvider")
  }
  return context
}

