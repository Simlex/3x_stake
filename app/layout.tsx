import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/app/components/theme-provider";
import { Navbar } from "./components/shared/navbar";
import { Footer } from "./components/shared/footer";
import LayoutWrapper from "./components/shared/layout-wrapper";
import GlobalProvider from "./providers/Provider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Yieldra | Stake on your terms",
  description: "Stake USDT and earn rewards with our flexible staking plans"
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    
    const session = await getServerSession(authOptions);
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen bg-gradient-to-b from-black via-purple-950/20 to-black dark:from-black dark:via-purple-950/20 dark:to-black`}
      >
        <GlobalProvider>
          <LayoutWrapper children={children} session={session} />
        </GlobalProvider>
      </body>
    </html>
  );
}
