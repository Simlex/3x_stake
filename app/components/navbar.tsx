"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Menu, X, Wallet } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { ThemeSwitcher } from "@/app/components/theme-switcher"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 backdrop-blur-md bg-black/30 dark:bg-black/30"
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full blur-sm"></div>
            <div className="absolute inset-0.5 bg-black rounded-full flex items-center justify-center">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 font-bold">
                Y
              </span>
            </div>
          </div>
          <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
            USDT Yield
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/stake">Stake</NavLink>
          <NavLink href="/rewards">Rewards</NavLink>
          <NavLink href="/referrals">Referrals</NavLink>
          <NavLink href="/faq">FAQ</NavLink>
        </nav>

        {/* <div className="hidden md:flex items-center gap-4">
          <ThemeSwitcher />
          <Button variant="outline" className="border-purple-500/50 hover:border-purple-500 text-white dark:text-white">
            <Wallet className="mr-2 h-4 w-4" /> Connect Wallet
          </Button>
        </div> */}
        <Button variant="outline" className="border-purple-500/50 hover:border-purple-500 text-white dark:text-white">
            <Wallet className="mr-2 h-4 w-4" /> Login
          </Button>

        <div className="flex md:hidden items-center gap-4">
          <ThemeSwitcher />
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-black/90 dark:bg-black/90 backdrop-blur-md border-b border-white/10"
        >
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <MobileNavLink href="/" onClick={() => setIsOpen(false)}>
              Home
            </MobileNavLink>
            <MobileNavLink href="/stake" onClick={() => setIsOpen(false)}>
              Stake
            </MobileNavLink>
            <MobileNavLink href="/rewards" onClick={() => setIsOpen(false)}>
              Rewards
            </MobileNavLink>
            <MobileNavLink href="/referrals" onClick={() => setIsOpen(false)}>
              Referrals
            </MobileNavLink>
            <MobileNavLink href="/faq" onClick={() => setIsOpen(false)}>
              FAQ
            </MobileNavLink>
            {/* <Button
              variant="outline"
              className="border-purple-500/50 hover:border-purple-500 text-white dark:text-white w-full mt-2"
            >
              <Wallet className="mr-2 h-4 w-4" /> Connect Wallet
            </Button> */}
          </div>
        </motion.div>
      )}
    </motion.header>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="relative text-sm font-medium text-gray-200 hover:text-white dark:text-gray-200 dark:hover:text-white transition-colors duration-200 group"
    >
      {children}
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
    </Link>
  )
}

function MobileNavLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="text-lg font-medium text-gray-200 hover:text-white dark:text-gray-200 dark:hover:text-white py-2 transition-colors"
    >
      {children}
    </Link>
  )
}
