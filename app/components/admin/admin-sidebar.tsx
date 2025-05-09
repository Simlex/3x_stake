"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Users,
  Coins,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  Shield,
} from "lucide-react";
import { useAuthContext } from "@/app/context/AuthContext";

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuthContext();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: BarChart3,
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: Users,
    },
    {
      title: "Staking Positions",
      href: "/admin/staking-positions",
      icon: Coins,
    },
    {
      title: "Deposits",
      href: "/admin/deposits",
      icon: CreditCard,
    },
    // {
    //   title: "Settings",
    //   href: "/admin/settings",
    //   icon: Settings,
    // },
  ];

  return (
    <div className="flex h-screen w-64 flex-col border-r border-white/10 bg-black/30 backdrop-blur-md">
      <div className="flex h-14 items-center border-b border-white/10 px-4">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="relative h-8 w-8">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 blur-sm"></div>
            <div className="absolute inset-0.5 flex items-center justify-center rounded-full bg-black">
              <Shield className="h-4 w-4 text-purple-500" />
            </div>
          </div>
          <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
            Admin Panel
          </span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-purple-900/20 text-purple-400"
                  : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-white/10 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-400 transition-colors hover:bg-gray-800/50 hover:text-white"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
