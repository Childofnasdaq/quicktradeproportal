"use client"

import { useAuth } from "@/components/auth-provider"
import { useState } from "react"
import Link from "next/link"
import { User, Settings, LogOut } from "lucide-react"
import Image from "next/image"

export function Header() {
  const { user, logout } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)

  if (!user) return null

  return (
    <div className="flex items-center justify-end p-4 border-b border-red-900">
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center space-x-2 p-2 rounded-md hover:bg-red-950/30 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-red-800 flex items-center justify-center text-white">
            {user.avatar ? (
              <Image
                src={user.avatar || "/placeholder.svg"}
                alt={user.displayName}
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <User size={18} />
            )}
          </div>
          <span className="text-red-200 hidden sm:inline-block">{user.email}</span>
        </button>

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-black border border-red-900 rounded-md shadow-lg z-50">
            <div className="p-3 border-b border-red-900">
              <p className="text-red-200 font-medium">{user.displayName}</p>
              <p className="text-red-400 text-sm">Mentor ID: {user.mentorId}</p>
              {user.isAdmin && <p className="text-red-400 text-sm font-bold">Admin</p>}
            </div>
            <div className="p-1">
              {!user.isAdmin && (
                <Link
                  href="/dashboard/profile"
                  className="flex items-center gap-x-2 p-2 text-red-300 hover:bg-red-950/30 rounded-md"
                  onClick={() => setShowDropdown(false)}
                >
                  <Settings size={16} />
                  <span>Profile</span>
                </Link>
              )}
              <button
                onClick={() => {
                  setShowDropdown(false)
                  logout()
                }}
                className="flex items-center gap-x-2 p-2 text-red-300 hover:bg-red-950/30 rounded-md w-full text-left"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

