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

interface LayoutProps {
  children?: ReactNode;
  session: Session | null;
}

export default function LayoutWrapper({ children, session }: LayoutProps) {
  const {
    loginModalVisibility,
    setLoginModalVisibility,
    signupModalVisibility,
    setSignupModalVisibility,
  } = useModalContext();

  // Check for login requirement header
  useEffect(() => {
    const requireLogin = document.documentElement.getAttribute("data-require-login") === "true";
    if (requireLogin) {
      setLoginModalVisibility(true);
    }
  }, [setLoginModalVisibility]);

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
