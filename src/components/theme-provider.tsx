// Simple ThemeProvider fallback (no external dependency)
"use client";

import * as React from "react";

export interface ThemeProviderProps {
  children: React.ReactNode;
  // additional props can be added as needed
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // No theme toggling logic; just pass through children.
  return <>{children}</>;
}
