"use client";

import { useEffect } from "react";
import { useModalContext } from "@/app/context/ModalContext";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export function AuthGuard() {
  const { setLoginModalVisibility } = useModalContext();
  const router = useRouter();

  useEffect(() => {
    // Check if login is required from the response headers
    const requireLogin = document.documentElement.getAttribute("data-require-login") === "true";
    
    if (requireLogin) {
      setLoginModalVisibility(true);
    }
  }, [setLoginModalVisibility]);

  // Handle successful login
  const handleLoginSuccess = () => {
    const redirectPath = Cookies.get("redirect_after_login");
    if (redirectPath) {
      Cookies.remove("redirect_after_login");
      router.push(redirectPath);
    }
  };

  return null;
} 