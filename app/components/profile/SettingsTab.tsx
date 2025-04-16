"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Switch } from "@/app/components/ui/switch"
import { Separator } from "@/app/components/ui/separator"
import { User, Bell, Loader2 } from "lucide-react"

// Mock user data - replace with actual data from your API
const userData = {
  firstName: "John",
  lastName: "Doe",
  email: "user@example.com",
  notificationSettings: {
    emailNotifications: true,
    stakingUpdates: true,
    marketingEmails: false,
    securityAlerts: true,
  },
}

const SettingsTab = () => {
  const [profileForm, setProfileForm] = useState({
    firstName: userData.firstName || "",
    lastName: userData.lastName || "",
    email: userData.email,
  })

  const [notificationSettings, setNotificationSettings] = useState(userData.notificationSettings)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)

    try {
      // In a real app, you would update profile via API
      // await userApi.updateProfile(profileForm)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Show success message
    } catch (error) {
      console.error("Failed to update profile:", error)
      // Show error message
    } finally {
      setIsUpdating(false)
    }
  }

  const handleNotificationUpdate = async (setting: string, value: boolean) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [setting]: value,
    }))

    try {
      // In a real app, you would update notification settings via API
      // await userApi.updatePreferences({
      //   notifications: {
      //     ...notificationSettings,
      //     [setting]: value
      //   }
      // })
    } catch (error) {
      console.error("Failed to update notification settings:", error)
      // Revert change on error
      setNotificationSettings((prev) => ({
        ...prev,
        [setting]: !value,
      }))
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="mr-2 h-5 w-5 text-purple-500" />
            Profile Information
          </CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={profileForm.firstName}
                  onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                  className="bg-gray-800/50 border-gray-700 focus:border-purple-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={profileForm.lastName}
                  onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                  className="bg-gray-800/50 border-gray-700 focus:border-purple-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                className="bg-gray-800/50 border-gray-700 focus:border-purple-500"
                disabled
              />
              <p className="text-xs text-gray-400">Contact support to change your email address</p>
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="bg-gradient-to-r from-pink-500 to-purple-600" disabled={isUpdating}>
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border-0 glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="mr-2 h-5 w-5 text-purple-500" />
            Notification Settings
          </CardTitle>
          <CardDescription>Manage how you receive notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-gray-400">Receive notifications via email</p>
              </div>
              <Switch
                checked={notificationSettings.emailNotifications}
                onCheckedChange={(checked) => handleNotificationUpdate("emailNotifications", checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Staking Updates</p>
                <p className="text-sm text-gray-400">Get notified about your staking positions</p>
              </div>
              <Switch
                checked={notificationSettings.stakingUpdates}
                onCheckedChange={(checked) => handleNotificationUpdate("stakingUpdates", checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Marketing Emails</p>
                <p className="text-sm text-gray-400">Receive promotional offers and updates</p>
              </div>
              <Switch
                checked={notificationSettings.marketingEmails}
                onCheckedChange={(checked) => handleNotificationUpdate("marketingEmails", checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Security Alerts</p>
                <p className="text-sm text-gray-400">Get notified about security events on your account</p>
              </div>
              <Switch
                checked={notificationSettings.securityAlerts}
                onCheckedChange={(checked) => handleNotificationUpdate("securityAlerts", checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SettingsTab
