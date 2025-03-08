"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import type { User } from "@/lib/types"

export default function PendingUsersPage() {
  const { getPendingUsers, approveUser, rejectUser } = useAuth()
  const [pendingUsers, setPendingUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  // Load pending users
  useEffect(() => {
    setPendingUsers(getPendingUsers())
  }, [getPendingUsers])

  const handleApprove = async (userId: string) => {
    setIsLoading(true)
    setMessage({ type: "", text: "" })

    const success = await approveUser(userId)

    if (success) {
      setMessage({ type: "success", text: "User approved successfully" })
      // Update the list
      setPendingUsers(getPendingUsers())
    } else {
      setMessage({ type: "error", text: "Failed to approve user" })
    }

    setIsLoading(false)
  }

  const handleReject = async (userId: string) => {
    setIsLoading(true)
    setMessage({ type: "", text: "" })

    const success = await rejectUser(userId)

    if (success) {
      setMessage({ type: "success", text: "User rejected successfully" })
      // Update the list
      setPendingUsers(getPendingUsers())
    } else {
      setMessage({ type: "error", text: "Failed to reject user" })
    }

    setIsLoading(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Pending User Approvals</h1>
        <p className="text-red-400 mt-1">Approve or reject user registrations</p>
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
        {pendingUsers.length === 0 ? (
          <div className="p-8 text-center text-red-400">No pending users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-red-950/30">
                  <th className="px-4 py-3 text-left text-red-300 font-medium">Name</th>
                  <th className="px-4 py-3 text-left text-red-300 font-medium">Display Name</th>
                  <th className="px-4 py-3 text-left text-red-300 font-medium">Email</th>
                  <th className="px-4 py-3 text-left text-red-300 font-medium">Phone</th>
                  <th className="px-4 py-3 text-left text-red-300 font-medium">Mentor ID</th>
                  <th className="px-4 py-3 text-right text-red-300 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingUsers.map((user) => (
                  <tr key={user.id} className="border-t border-red-900/30">
                    <td className="px-4 py-3 text-white">{user.name}</td>
                    <td className="px-4 py-3 text-white">{user.displayName}</td>
                    <td className="px-4 py-3 text-red-400">{user.email}</td>
                    <td className="px-4 py-3 text-red-400">{user.phone || "N/A"}</td>
                    <td className="px-4 py-3 text-red-400">{user.mentorId}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleApprove(user.id)}
                          className="text-green-500 hover:text-green-400 hover:bg-green-950/30"
                          disabled={isLoading}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          <span>Approve</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReject(user.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-950/30"
                          disabled={isLoading}
                        >
                          <X className="h-4 w-4 mr-1" />
                          <span>Reject</span>
                        </Button>
                      </div>
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

