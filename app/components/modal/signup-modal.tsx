"use client";

import type React from "react";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Eye, EyeOff, Check } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Checkbox } from "@/app/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { SignupRequest, useAuth } from "@/app/api/apiClient";

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export function SignupModal({
  isOpen,
  onClose,
  onSwitchToLogin,
}: SignupModalProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const auth = useAuth();

  // Password strength indicators
  const [passwordStrength, setPasswordStrength] = useState(0);

  const checkPasswordStrength = (password: string) => {
    let strength = 0;

    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    setPasswordStrength(strength);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  //   const handleSubmit = async (e: React.FormEvent) => {
  //     e.preventDefault()
  //     setError("")

  //     // Validate all fields
  //     if (!username || !email || !password || !confirmPassword) {
  //       setError("Please fill in all fields")
  //       return
  //     }

  //     if (!validateEmail(email)) {
  //       setError("Please enter a valid email address")
  //       return
  //     }

  //     if (password.length < 8) {
  //       setError("Password must be at least 8 characters long")
  //       return
  //     }

  //     if (password !== confirmPassword) {
  //       setError("Passwords do not match")
  //       return
  //     }

  //     if (!agreedToTerms) {
  //       setError("You must agree to the Terms and Conditions")
  //       return
  //     }

  //     setIsLoading(true)

  //     // Simulate API call
  //     setTimeout(() => {
  //       setIsLoading(false)
  //       setIsSubmitted(true)

  //       // Close modal after success
  //       setTimeout(() => {
  //         onSwitchToLogin()
  //         setIsSubmitted(false)
  //         // Reset form
  //         setUsername("")
  //         setEmail("")
  //         setPassword("")
  //         setConfirmPassword("")
  //         // setAgreedToTerms(false)
  //       }, 3000)
  //     }, 1500)
  //   }

  // Animation variants

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate all fields
    if (!username || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!agreedToTerms) {
      setError("You must agree to the Terms and Conditions");
      return;
    }

    setIsLoading(true);

    try {
      const signupData: SignupRequest = {
        username: username.toLowerCase(),
        email,
        password,
      };

      await auth.signup(signupData);
      setIsSubmitted(true);

      // Close modal after success
      setTimeout(() => {
        onSwitchToLogin()
        setIsSubmitted(false);
        // Reset form
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        // setAgreedToTerms(false)
      }, 3000);
    } catch (error: any) {
      setError(error.message || "An error occurred during signup");
    } finally {
      setIsLoading(false);
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", damping: 25, stiffness: 500 },
    },
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={overlayVariants}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          variants={modalVariants}
          className="w-full max-w-md bg-gradient-to-b from-gray-900 to-black border border-white/10 rounded-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h3 className="text-lg font-medium">Create an Account</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-username">Username</Label>
                  <Input
                    id="signup-username"
                    placeholder="Choose a username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-gray-800/50 border-gray-700 focus:border-purple-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email Address</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-800/50 border-gray-700 focus:border-purple-500"
                  />
                  {email && !validateEmail(email) && (
                    <p className="text-xs text-red-400">
                      Please enter a valid email address
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        checkPasswordStrength(e.target.value);
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
                  <Label htmlFor="signup-confirm-password">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="signup-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-gray-800/50 border-gray-700 focus:border-purple-500 pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>

                  {/* Password match indicator */}
                  {password && confirmPassword && (
                    <p
                      className={`text-xs mt-1 ${
                        password === confirmPassword
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {password === confirmPassword
                        ? "Passwords match"
                        : "Passwords don't match"}
                    </p>
                  )}
                </div>

                {/* <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                    className="data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-gray-300 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the{" "}
                    <a href="/terms" className="text-purple-400 hover:text-purple-300 transition-colors">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" className="text-purple-400 hover:text-purple-300 transition-colors">
                      Privacy Policy
                    </a>
                  </label>
                </div> */}

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
                  className={cn(
                    "w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700",
                    isLoading && "opacity-80 pointer-events-none"
                  )}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating
                      account...
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </Button>

                <div className="mt-6 text-center text-sm text-gray-400">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={onSwitchToLogin}
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Log in
                  </button>
                </div>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="h-8 w-8 text-green-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Account created!</h2>
                <p className="text-gray-400 mb-6">
                  Your account has been successfully created. You can now log in
                  with your credentials.
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
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
