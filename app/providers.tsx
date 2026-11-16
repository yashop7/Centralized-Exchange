"use client";

import { MotionConfig } from "motion/react";
import { ThemeProvider } from "next-themes";
import type * as React from "react";
import { ToastProvider } from "@/components/ui/toast";
import { TooltipProvider } from "@/components/ui/tooltip";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      disableTransitionOnChange
      enableSystem
    >
      {/* reducedMotion="user": every motion component honours the OS setting */}
      <MotionConfig reducedMotion="user">
        <TooltipProvider delay={300}>
          <ToastProvider position="bottom-center">{children}</ToastProvider>
        </TooltipProvider>
      </MotionConfig>
    </ThemeProvider>
  );
}
