import { useState, useEffect, useCallback } from "react";
import type { ThemeMode } from "../types";

function getSystemTheme(): "light" | "dark" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    return (localStorage.getItem("theme") as ThemeMode) || "auto";
  });

  const effective = theme === "auto" ? getSystemTheme() : theme;

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", effective);
  }, [effective]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (theme === "auto") {
        document.documentElement.setAttribute("data-theme", getSystemTheme());
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  const setTheme = useCallback((t: ThemeMode) => {
    localStorage.setItem("theme", t);
    setThemeState(t);
  }, []);

  const cycleTheme = useCallback(() => {
    const order: ThemeMode[] = ["light", "dark", "auto"];
    const next = order[(order.indexOf(theme) + 1) % 3];
    setTheme(next);
  }, [theme, setTheme]);

  return { theme, effective, cycleTheme, setTheme };
}
