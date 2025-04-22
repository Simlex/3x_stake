"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/app/components/admin/admin-sidebar"
import { useAuthContext } from "../context/AuthContext"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, isLoading } = useAuthContext()
  console.log("🚀 ~ AdminLayout ~ user:", user)

  // Check if user is admin
  useEffect(() => {
    if (!isLoading && (!user || !user.isAdmin)) {
      router.push("/")
    }
  }, [user, isLoading, router])

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  // If not loading and we're still on this page, render admin layout
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-gray-950 to-black">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-6 py-8">{children}</div>
      </div>
    </div>
  )
}
