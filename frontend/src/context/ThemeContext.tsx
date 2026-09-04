"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
  setTheme: () => {}
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const queryTheme = params.get("theme") as Theme | null;
      if (queryTheme === "light" || queryTheme === "dark") {
        if (queryTheme === "dark") document.documentElement.classList.add("dark");
        return queryTheme;
      }
      const saved = localStorage.getItem("drishtikyc-theme") as Theme | null;
      if (saved === "light" || saved === "dark") {
        if (saved === "dark") document.documentElement.classList.add("dark");
        return saved;
      }
    }
    return "light";
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryTheme = params.get("theme") as Theme | null;
    if (queryTheme === "light" || queryTheme === "dark") {
      setThemeState(queryTheme);
      localStorage.setItem("drishtikyc-theme", queryTheme);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("drishtikyc-theme", next);
      if (next === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return next;
    });
  };

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem("drishtikyc-theme", t);
    if (t === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
