"use client";

import type React from "react";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import {
  Menu,
  X,
  User,
  ChevronDown,
  LogOut,
  Settings,
  Wallet,
} from "lucide-react";
import { LoginModal } from "../modal/login-modal";
import { SignupModal } from "../modal/signup-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useModalContext } from "@/app/context/ModalContext";
import { useAuthContext } from "@/app/context/AuthContext";
import Image from "next/image";

export function Navbar() {
  const {
    loginModalVisibility: isLoginModalOpen,
    setLoginModalVisibility: setIsLoginModalOpen,
    signupModalVisibility: isSignupModalOpen,
    setSignupModalVisibility: setIsSignupModalOpen,
  } = useModalContext();

  const [isOpen, setIsOpen] = useState(false);
  const { user, isLoading, logout } = useAuthContext();

  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Get first 2 characters of username for avatar
  const getUserInitials = () => {
    if (!user?.username) return "U";
    return user.username.substring(0, 2).toUpperCase();
  };

  const { push } = useRouter();

  if (user?.isAdmin) return <></>;

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 backdrop-blur-md bg-black/30 dark:bg-black/30"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-10 h-10 rounded-full relative overflow-hidden">
              <Image
                alt="logo"
                src={"/logo.jpg"}
                fill
                className="w-full h-full object-cover"
              />
            </span>
            <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
              Yieldra
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/about-us">About Us</NavLink>
            <Button onClick={() => push("/#plans")}>Stake</Button>
            <Button onClick={() => push("/#rewards")}>Rewards</Button>
            {user && <NavLink href="/referrals">Referrals</NavLink>}
            <Button onClick={() => push("/#faq")}>FAQ</Button>
          </nav>

          {/* <div className="hidden md:flex items-center gap-4">
          <ThemeSwitcher />
          <Button variant="outline" className="border-purple-500/50 hover:border-purple-500 text-white dark:text-white">
            <Wallet className="mr-2 h-4 w-4" /> Connect Wallet
          </Button>
        </div> */}
          {!isLoading && (
            <>
              {user ? (
                <div className="hidden md:flex">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="border-purple-500/50 hover:border-purple-500 flex items-center gap-2"
                      >
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                          {getUserInitials()}
                        </div>
                        <span className="hidden sm:inline">
                          {user.username}
                        </span>
                        <ChevronDown className="h-4 w-4 opacity-70" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-56 bg-gray-900 border border-white/10"
                    >
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => router.push("/profile")}
                      >
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => router.push("/#plans")}
                      >
                        <Wallet className="mr-2 h-4 w-4" />
                        <span>Stake</span>
                      </DropdownMenuItem>
                      {/* <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => router.push("/profile?tab=settings")}
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </DropdownMenuItem> */}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="cursor-pointer text-red-400 focus:text-red-400"
                        onClick={handleLogout}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Logout</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <Button
                  onClick={() => setIsLoginModalOpen(true)}
                  variant="outline"
                  className="border-purple-500/50 hover:border-purple-500 text-white dark:text-white"
                >
                  <Wallet className="mr-2 h-4 w-4 ml-auto" /> Login
                </Button>
              )}
            </>
          )}

          <div className="flex md:hidden items-center gap-4">
            {/* <ThemeSwitcher /> */}

            {!isLoading && user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-purple-500/50 hover:border-purple-500 rounded-full w-8 h-8 p-0"
                  >
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                      {getUserInitials()}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-gray-900 border border-white/10"
                >
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => router.push("/profile")}
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => router.push("/#plans")}
                  >
                    <Wallet className="mr-2 h-4 w-4" />
                    <span>Stake</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-400 focus:text-red-400"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
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
              <MobileNavLink href="/about-us" onClick={() => setIsOpen(false)}>
                About Us
              </MobileNavLink>
              <Button
                className="text-lg text-left justify-start pl-0"
                onClick={() => {
                  setIsOpen(false);
                  push("/#plans");
                }}
              >
                Stake
              </Button>
              <Button
                className="text-lg text-left justify-start pl-0"
                onClick={() => {
                  setIsOpen(false);
                  push("/#rewards");
                }}
              >
                Rewards
              </Button>
              {user && (
                <MobileNavLink
                  href="/referrals"
                  onClick={() => setIsOpen(false)}
                >
                  Referrals
                </MobileNavLink>
              )}
              <Button
                className="text-lg text-left justify-start pl-0"
                onClick={() => {
                  setIsOpen(false);
                  push("/#faq");
                }}
              >
                FAQ
              </Button>
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

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToSignup={() => {
          setIsSignupModalOpen(true);
          setIsLoginModalOpen(false);
        }}
      />
      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
        onSwitchToLogin={() => {
          setIsLoginModalOpen(true);
          setIsSignupModalOpen(false);
        }}
      />
    </>
  );
}

function NavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLAnchorElement> | undefined;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="relative text-sm font-medium text-gray-200 hover:text-white dark:text-gray-200 dark:hover:text-white transition-colors duration-200 group"
    >
      {children}
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
    </Link>
  );
}

function MobileNavLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="text-lg font-medium text-gray-200 hover:text-white dark:text-gray-200 dark:hover:text-white py-2 transition-colors"
    >
      {children}
    </Link>
  );
}
