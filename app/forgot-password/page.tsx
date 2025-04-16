"use client";

import type React from "react";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Mail, Check } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import Link from "next/link";
import { Navbar } from "@/app/components/shared/navbar";
import { Footer } from "@/app/components/shared/footer";
import { ForgotPasswordRequest, useAuth } from "../api/apiClient";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const auth = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const forgotPasswordData: ForgotPasswordRequest = {
        email,
      };

      await auth.forgotPassword(forgotPasswordData);
      setIsSubmitted(true);
    } catch (error: any) {
      // For security reasons, we don't show specific errors
      // Just set submitted to true anyway
      setIsSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

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
                    <Mail className="h-6 w-6 text-purple-400" />
                  </div>
                  <h1 className="text-2xl font-bold mb-2">
                    Forgot your password?
                  </h1>
                  <p className="text-gray-400">
                    Enter your email address and we'll send you a link to reset
                    your password.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-gray-800/50 border-gray-700 focus:border-purple-500"
                    />
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
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                        Sending...
                      </>
                    ) : (
                      "Send Reset Link"
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
                <h2 className="text-2xl font-bold mb-2">Check your email</h2>
                <p className="text-gray-400 mb-6">
                  We've sent a password reset link to{" "}
                  <span className="text-purple-400">{email}</span>
                </p>
                <div className="space-y-3">
                  <Button
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                    asChild
                  >
                    <Link href="/">Return to Home</Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-purple-500/50 hover:border-purple-500"
                    onClick={() => {
                      setIsSubmitted(false);
                      setEmail("");
                    }}
                  >
                    Try another email
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
