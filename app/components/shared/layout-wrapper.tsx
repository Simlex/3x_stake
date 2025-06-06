"use client";
import React, { ReactNode, useEffect } from "react";
import NextTopLoader from "nextjs-toploader";
import { ThemeProvider } from "../theme-provider";
import { Footer } from "./footer";
import { Session } from "next-auth";
import { LoginModal } from "../modal/login-modal";
import { SignupModal } from "../modal/signup-modal";
import { useModalContext } from "@/app/context/ModalContext";
import { AuthGuard } from "./auth-guard";
import { Navbar } from "./navbar";
import { useAuthContext } from "@/app/context/AuthContext";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Toaster } from "sonner";

interface LayoutProps {
  children?: ReactNode;
  session: Session | null;
}

export default function LayoutWrapper({ children, session }: LayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    loginModalVisibility,
    setLoginModalVisibility,
    signupModalVisibility,
    setSignupModalVisibility,
  } = useModalContext();
  const { user } = useAuthContext();
  const searchParams = useSearchParams();

  // Get the referral code from the search params
  const referralCode = searchParams.get("ref");

  // Check for login requirement header
  useEffect(() => {
    const requireLogin =
      document.documentElement.getAttribute("data-require-login") === "true";
    if (requireLogin) {
      setLoginModalVisibility(true);
    }
  }, [setLoginModalVisibility]);

  useEffect(() => {
    if (user && user.isAdmin && !pathname.includes("/admin")) {
      console.log("🚀 ~ useEffect ~ isAdmin: true");
      router.push("/admin");
    }
  }, [user, pathname]);

  useEffect(() => {
    if (referralCode) {
      // save the referral code to localstorage
      localStorage.setItem("ref", JSON.stringify(referralCode));

      setSignupModalVisibility(true);
    }
  }, [referralCode]);

  return (
    <>
      <NextTopLoader
        color="#ffffff"
        initialPosition={0.08}
        crawlSpeed={200}
        height={3}
        crawl={true}
        showSpinner={false}
        easing="ease"
        speed={200}
        shadow="0 0 10px #f1fa9e,0 0 5px #ceb0fa"
      />
      <Toaster richColors position="top-right" />
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <AuthGuard />
        <Navbar />
        {children}
        <LoginModal
          isOpen={loginModalVisibility}
          onClose={() => setLoginModalVisibility(false)}
          onSwitchToSignup={() => {
            setSignupModalVisibility(true);
            setLoginModalVisibility(false);
          }}
        />
        <SignupModal
          isOpen={signupModalVisibility}
          onClose={() => setSignupModalVisibility(false)}
          onSwitchToLogin={() => {
            setLoginModalVisibility(true);
            setSignupModalVisibility(false);
          }}
        />
        <Footer />
      </ThemeProvider>
    </>
  );
}
