"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Separator } from "@/app/components/ui/separator"
import { Shield, Settings, Loader2, Eye, EyeOff } from "lucide-react"

const SecurityTab = () => {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError("")

    // Validate passwords
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Passwords do not match")
      return
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long")
      return
    }

    setIsUpdating(true)

    try {
      // In a real app, you would change password via API
      // await userApi.changePassword({
      //   currentPassword: passwordForm.currentPassword,
      //   newPassword: passwordForm.newPassword
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Reset form
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })

      // Show success message
    } catch (error) {
      console.error("Failed to change password:", error)
      setPasswordError("Current password is incorrect")
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5 text-purple-500" />
            Change Password
          </CardTitle>
          <CardDescription>Update your account password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="bg-gray-800/50 border-gray-700 focus:border-purple-500 pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="bg-gray-800/50 border-gray-700 focus:border-purple-500 pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="bg-gray-800/50 border-gray-700 focus:border-purple-500 pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {passwordError && (
              <div className="p-3 bg-red-900/30 border border-red-500/20 rounded-lg text-sm text-red-200">
                {passwordError}
              </div>
            )}

            <div className="flex justify-end">
              <Button type="submit" className="bg-gradient-to-r from-pink-500 to-purple-600" disabled={isUpdating}>
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                  </>
                ) : (
                  "Change Password"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border-0 glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="mr-2 h-5 w-5 text-purple-500" />
            Account Security
          </CardTitle>
          <CardDescription>Manage your account security settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
              </div>
              <Button variant="outline">Enable</Button>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Active Sessions</p>
                <p className="text-sm text-gray-400">Manage devices where you're currently logged in</p>
              </div>
              <Button variant="outline">Manage</Button>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Login History</p>
                <p className="text-sm text-gray-400">View recent login attempts</p>
              </div>
              <Button variant="outline">View</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SecurityTab
