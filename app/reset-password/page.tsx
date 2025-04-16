"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Loader2, Lock, Check, Eye, EyeOff } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import Link from "next/link"
import { Navbar } from "@/app/components/shared/navbar"
import { Footer } from "@/app/components/shared/footer"
import { useRouter, useSearchParams } from "next/navigation"
import { ResetPasswordRequest, useAuth } from "../api/apiClient"

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [token, setToken] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const auth = useAuth()
  
  // Get token from URL
  useEffect(() => {
    const tokenFromUrl = searchParams.get("token")
    if (tokenFromUrl) {
      setToken(tokenFromUrl)
    }
  }, [searchParams])

  // Password strength indicators
  const [passwordStrength, setPasswordStrength] = useState(0)

  const checkPasswordStrength = (password: string) => {
    let strength = 0

    if (password.length >= 8) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^A-Za-z0-9]/.test(password)) strength += 1

    setPasswordStrength(strength)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!token) {
      setError("Invalid or missing reset token")
      return
    }

    if (!password || !confirmPassword) {
      setError("Please fill in all fields")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsLoading(true)

    try {
      const resetPasswordData: ResetPasswordRequest = {
        token,
        password,
      }

      await auth.resetPassword(resetPasswordData)
      setIsSubmitted(true)

      // Redirect to home after success
      setTimeout(() => {
        router.push("/")
      }, 3000)
    } catch (error: any) {
      setError(error.message || "An error occurred while resetting your password")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="">
      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-md mx-auto">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-b from-gray-900 to-black border border-white/10 rounded-2xl overflow-hidden p-6"
          >
            {!isSubmitted ? (
              <>
                <div className="text-center mb-6">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="h-6 w-6 text-purple-400" />
                  </div>
                  <h1 className="text-2xl font-bold mb-2">Reset your password</h1>
                  <p className="text-gray-400">Create a new password for your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value)
                          checkPasswordStrength(e.target.value)
                        }}
                        className="bg-gray-800/50 border-gray-700 focus:border-purple-500 pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>

                    {/* Password strength indicator */}
                    {password && (
                      <div className="mt-2">
                        <div className="flex gap-1">
                          {[...Array(4)].map((_, i) => (
                            <div
                              key={i}
                              className={`h-1 flex-1 rounded-full ${
                                i < passwordStrength
                                  ? passwordStrength === 1
                                    ? "bg-red-500"
                                    : passwordStrength === 2
                                      ? "bg-yellow-500"
                                      : passwordStrength === 3
                                        ? "bg-green-500"
                                        : "bg-green-400"
                                  : "bg-gray-700"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs mt-1 text-gray-400">
                          {passwordStrength === 0 && "Very weak"}
                          {passwordStrength === 1 && "Weak"}
                          {passwordStrength === 2 && "Medium"}
                          {passwordStrength === 3 && "Strong"}
                          {passwordStrength === 4 && "Very strong"}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
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

                    {/* Password match indicator */}
                    {password && confirmPassword && (
                      <p className={`text-xs mt-1 ${password === confirmPassword ? "text-green-400" : "text-red-400"}`}>
                        {password === confirmPassword ? "Passwords match" : "Passwords don't match"}
                      </p>
                    )}
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-red-900/30 border border-red-500/20 rounded-lg text-sm text-red-200"
                    >
                      {error}
                    </motion.div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </Button>
                </form>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="h-8 w-8 text-green-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Password updated!</h2>
                <p className="text-gray-400 mb-6">
                  Your password has been successfully reset. You will be redirected to the login page shortly.
                </p>
                <div className="w-full bg-gray-800/50 h-2 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3 }}
                    className="h-full bg-gradient-to-r from-pink-500 to-purple-600"
                  />
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
