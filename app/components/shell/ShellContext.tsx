"use client";

import * as React from "react";

export interface ShellState {
  openDeposit: () => void;
  openCommand: () => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  /**
   * A page can offer an element (the chart) for the toolbar's fullscreen
   * button. Without one, fullscreen applies to the whole app.
   */
  setFullscreenTarget: (element: HTMLElement | null) => void;
  fullscreenTarget: React.MutableRefObject<HTMLElement | null>;
}

export const ShellContext = React.createContext<ShellState | null>(null);

export function useShell(): ShellState {
  const value = React.useContext(ShellContext);
  if (!value) throw new Error("useShell must be used inside <AppShell>");
  return value;
}
