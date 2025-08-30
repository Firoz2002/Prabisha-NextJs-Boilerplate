"use client";

import { useTheme } from "@/hooks/useTheme";
import { useEffect } from "react";

function applyFavicon(url?: string | null) {
  if (!url) return;
  const link =
    document.querySelector<HTMLLinkElement>('link[rel="icon"]') ||
    document.createElement("link");
  link.rel = "icon";
  link.type = "image/png";
  link.href = url;
  if (!link.parentNode) {
    document.head.appendChild(link);
  }
}

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  useEffect(() => {
    if (!theme) return;

    // Toggle dark mode class on <html>
    if (theme.mode === "DARK") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Apply CSS variables used across the app
    if (theme.primaryColor) {
      document.documentElement.style.setProperty("--primary", theme.primaryColor);
    }
    if (theme.secondaryColor) {
      document.documentElement.style.setProperty("--secondary", theme.secondaryColor);
    }
    if (theme.backgroundColor) {
      document.documentElement.style.setProperty("--background", theme.backgroundColor);
    }
    if (theme.textColor) {
      document.documentElement.style.setProperty("--foreground", theme.textColor);
    }

    // Optional: apply font family
    if (theme.font) {
      document.body.style.fontFamily = theme.font;
    }

    // Optional: apply favicon/logo if provided
    applyFavicon(theme.faviconUrl);
  }, [theme]);

  return <>{children}</>;
}
