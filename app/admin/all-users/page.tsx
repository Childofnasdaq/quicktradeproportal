"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import type { User } from "@/lib/types"

export default function AllUsersPage() {
  const { getAllUsers, rejectUser } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  // Load all users
  useEffect(() => {
    setUsers(getAllUsers())
  }, [getAllUsers])

  const handleDelete = async (userId: string) => {
    setIsLoading(true)
    setMessage({ type: "", text: "" })

    const success = await rejectUser(userId)

    if (success) {
      setMessage({ type: "success", text: "User deleted successfully" })
      // Update the list
      setUsers(getAllUsers())
    } else {
      setMessage({ type: "error", text: "Failed to delete user" })
    }

    setIsLoading(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">All Users</h1>
        <p className="text-red-400 mt-1">Manage all registered users</p>
      </div>

      {message.text && (
        <div
          className={`${
            message.type === "success"
              ? "bg-green-900/30 border-green-500 text-green-200"
              : "bg-red-900/30 border-red-500 text-red-200"
          } px-4 py-2 rounded-md border`}
        >
          {message.text}
        </div>
      )}

      <div className="bg-black border border-red-900 rounded-lg overflow-hidden">
        {users.length === 0 ? (
          <div className="p-8 text-center text-red-400">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-red-950/30">
                  <th className="px-4 py-3 text-left text-red-300 font-medium">Name</th>
                  <th className="px-4 py-3 text-left text-red-300 font-medium">Display Name</th>
                  <th className="px-4 py-3 text-left text-red-300 font-medium">Email</th>
                  <th className="px-4 py-3 text-left text-red-300 font-medium">Mentor ID</th>
                  <th className="px-4 py-3 text-left text-red-300 font-medium">Status</th>
                  <th className="px-4 py-3 text-right text-red-300 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t border-red-900/30">
                    <td className="px-4 py-3 text-white">{user.name}</td>
                    <td className="px-4 py-3 text-white">{user.displayName}</td>
                    <td className="px-4 py-3 text-red-400">{user.email}</td>
                    <td className="px-4 py-3 text-red-400">{user.mentorId}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.approved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {user.approved ? "Approved" : "Pending"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(user.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-950/30"
                        disabled={isLoading}
                      >
                        <X className="h-4 w-4 mr-1" />
                        <span>Delete</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

