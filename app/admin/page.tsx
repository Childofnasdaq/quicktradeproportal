"use client"

import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from "react"

export default function AdminDashboardPage() {
  const { user, getPendingUsers, getAllUsers } = useAuth()
  const [currentDate, setCurrentDate] = useState("")
  const [pendingCount, setPendingCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    const date = new Date()
    setCurrentDate(
      date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    )

    // Get counts
    setPendingCount(getPendingUsers().length)
    setTotalCount(getAllUsers().length)
  }, [getPendingUsers, getAllUsers])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <div className="text-red-400">Today ({currentDate})</div>
      </div>

      <div className="bg-red-950/20 border border-red-900/50 rounded-lg p-4 text-red-200">
        Welcome to the QuickTrade Pro Approval Portal. You can manage user approvals from here.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-blue-600/20 border-blue-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-blue-200 text-sm font-medium">Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-100">{pendingCount}</div>
            <p className="text-blue-300 text-sm mt-1">Users waiting for approval</p>
          </CardContent>
        </Card>

        <Card className="bg-green-600/20 border-green-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-green-200 text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-100">{totalCount}</div>
            <p className="text-green-300 text-sm mt-1">Registered users</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

