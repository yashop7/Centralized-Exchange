"use client";

/**
 * Thin adapter that keeps the app's original `toast({ variant, title,
 * description, duration })` call shape while rendering through the coss
 * toast (Base UI toast manager). Call sites did not have to change.
 */
import type * as React from "react";
import { toastManager } from "@/components/ui/toast";

type Variant = "default" | "success" | "destructive" | "info" | "warning";

export interface ToastOptions {
  variant?: Variant;
  title?: React.ReactNode;
  description?: React.ReactNode;
  duration?: number;
  /** Optional inline action, e.g. Undo. */
  action?: { label: React.ReactNode; onClick: () => void };
}

const TYPE: Record<Variant, string | undefined> = {
  default: undefined,
  success: "success",
  destructive: "error",
  info: "info",
  warning: "warning",
};

function toast({
  variant = "default",
  title,
  description,
  duration = 4000,
  action,
}: ToastOptions) {
  const id = toastManager.add({
    title,
    description,
    type: TYPE[variant],
    timeout: duration,
    actionProps: action
      ? { children: action.label, onClick: action.onClick }
      : undefined,
  });

  return {
    id,
    dismiss: () => toastManager.close(id),
  };
}

function useToast() {
  return {
    toast,
    dismiss: (id?: string) => {
      if (id) toastManager.close(id);
    },
  };
}

export { toast, useToast };
