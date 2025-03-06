"use client"; // ✅ Ensures this runs only in the browser

import { useEffect } from "react";

const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes

export default function InactivityHandler() {
  useEffect(() => {
    const updateLastActive = () => {
      localStorage.setItem("lastActive", Date.now().toString());
    };

    const checkInactivity = () => {
      const lastActive = localStorage.getItem("lastActive");
      if (lastActive && Date.now() - parseInt(lastActive) > INACTIVITY_TIMEOUT) {
        localStorage.removeItem("lastActive");
        window.location.href = "/sign-in"; // Redirect to login
      }
    };

    document.addEventListener("mousemove", updateLastActive);
    document.addEventListener("keydown", updateLastActive);
    const interval = setInterval(checkInactivity, 60 * 1000); // Check every 60s

    return () => {
      document.removeEventListener("mousemove", updateLastActive);
      document.removeEventListener("keydown", updateLastActive);
      clearInterval(interval);
    };
  }, []);

  return null; // No UI needed
}
