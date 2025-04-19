"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Switch } from "@/app/components/ui/switch"
import { Separator } from "@/app/components/ui/separator"
import { User, Bell, Loader2 } from "lucide-react"
import { profileApi } from "@/lib/profile"
import type { User as UserModel, UserPreference } from "@/app/model"
import { Skeleton } from "@/app/components/ui/skeleton"
import { toast } from "@/app/hooks/use-toast"

const SettingsTab = () => {
  const [profileData, setProfileData] = useState<UserModel | null>(null)
  const [preferences, setPreferences] = useState<UserPreference | null>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [isLoadingPreferences, setIsLoadingPreferences] = useState(true)
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [preferencesError, setPreferencesError] = useState<string | null>(null)

  // Form state
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
  })

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoadingProfile(true)
        const data = await profileApi.getUserProfile()
        setProfileData(data)
        setProfileForm({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email,
        })
        setProfileError(null)
      } catch (err) {
        console.error("Failed to fetch profile data:", err)
        setProfileError("Failed to load profile data. Please try again.")
      } finally {
        setIsLoadingProfile(false)
      }
    }

    const fetchPreferences = async () => {
      try {
        setIsLoadingPreferences(true)
        const data = await profileApi.getUserPreferences()
        setPreferences(data)
        setPreferencesError(null)
      } catch (err) {
        console.error("Failed to fetch preferences:", err)
        setPreferencesError("Failed to load preferences. Please try again.")
      } finally {
        setIsLoadingPreferences(false)
      }
    }

    fetchProfileData()
    fetchPreferences()
  }, [])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdatingProfile(true)

    try {
      const updatedProfile = await profileApi.updateUserProfile({
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
      })

      setProfileData(updatedProfile)
      toast({
        title: "Profile Updated",
        description: "Your profile information has been successfully updated.",
      })
    } catch (err) {
      console.error("Failed to update profile:", err)
      toast({
        title: "Update Failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  const handleNotificationUpdate = async (setting: string, value: boolean) => {
    if (!preferences) return

    // Optimistically update UI
    setPreferences((prev) => {
      if (!prev) return null
      return {
        ...prev,
        [setting]: value,
      }
    })

    try {
      // Update in the backend
      await profileApi.updateUserPreferences({
        [setting]: value,
      })
    } catch (err) {
      console.error("Failed to update notification settings:", err)

      // Revert the UI change on error
      setPreferences((prev) => {
        if (!prev) return null
        return {
          ...prev,
          [setting]: !value,
        }
      })

      toast({
        title: "Update Failed",
        description: "There was an error updating your notification settings. Please try again.",
        variant: "destructive",
      })
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
          {profileError ? (
            <div className="p-4 bg-red-900/20 border border-red-500/20 rounded-lg text-center">
              <p className="text-red-200">{profileError}</p>
              <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          ) : (
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  {isLoadingProfile ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <Input
                      id="firstName"
                      value={profileForm.firstName}
                      onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                      className="bg-gray-800/50 border-gray-700 focus:border-purple-500"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  {isLoadingProfile ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <Input
                      id="lastName"
                      value={profileForm.lastName}
                      onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                      className="bg-gray-800/50 border-gray-700 focus:border-purple-500"
                    />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                {isLoadingProfile ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <Input
                    id="email"
                    type="email"
                    value={profileForm.email}
                    className="bg-gray-800/50 border-gray-700 focus:border-purple-500"
                    disabled
                  />
                )}
                <p className="text-xs text-gray-400">Contact support to change your email address</p>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-pink-500 to-purple-600"
                  disabled={isUpdatingProfile || isLoadingProfile}
                >
                  {isUpdatingProfile ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          )}
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
          {preferencesError ? (
            <div className="p-4 bg-red-900/20 border border-red-500/20 rounded-lg text-center">
              <p className="text-red-200">{preferencesError}</p>
              <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-400">Receive notifications via email</p>
                </div>
                {isLoadingPreferences ? (
                  <Skeleton className="h-6 w-12" />
                ) : (
                  <Switch
                    checked={preferences?.emailNotifications || false}
                    onCheckedChange={(checked) => handleNotificationUpdate("emailNotifications", checked)}
                  />
                )}
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Staking Updates</p>
                  <p className="text-sm text-gray-400">Get notified about your staking positions</p>
                </div>
                {isLoadingPreferences ? (
                  <Skeleton className="h-6 w-12" />
                ) : (
                  <Switch
                    checked={preferences?.stakingUpdates || false}
                    onCheckedChange={(checked) => handleNotificationUpdate("stakingUpdates", checked)}
                  />
                )}
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Marketing Emails</p>
                  <p className="text-sm text-gray-400">Receive promotional offers and updates</p>
                </div>
                {isLoadingPreferences ? (
                  <Skeleton className="h-6 w-12" />
                ) : (
                  <Switch
                    checked={preferences?.marketingEmails || false}
                    onCheckedChange={(checked) => handleNotificationUpdate("marketingEmails", checked)}
                  />
                )}
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Security Alerts</p>
                  <p className="text-sm text-gray-400">Get notified about security events on your account</p>
                </div>
                {isLoadingPreferences ? (
                  <Skeleton className="h-6 w-12" />
                ) : (
                  <Switch
                    checked={preferences?.securityAlerts || false}
                    onCheckedChange={(checked) => handleNotificationUpdate("securityAlerts", checked)}
                  />
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default SettingsTab
