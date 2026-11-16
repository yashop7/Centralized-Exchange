"use client";

import { motion, useReducedMotion } from "motion/react";
import * as React from "react";
import { SPRING } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Text-only nav list with the signature indicator: a thin dotted orange
 * "hook" that leaves the group's left rail and curves into the active item.
 * The hook is one shared-layout element, so it springs to the new item
 * instead of jumping. Used by the sidebar and by contents rails.
 */

const HookContext = React.createContext<string | null>(null);

/** Wrap several HookNav lists so one hook travels between them. */
export function HookNavScope({ children }: { children: React.ReactNode }) {
  const id = React.useId();
  return <HookContext.Provider value={id}>{children}</HookContext.Provider>;
}

export function HookNav({
  className,
  children,
  ...props
}: React.ComponentProps<"ul">) {
  const own = React.useId();
  const id = React.useContext(HookContext) ?? own;
  return (
    <HookContext.Provider value={id}>
      <ul
        className={cn(
          "relative flex flex-col before:absolute before:inset-y-1 before:left-0 before:w-px before:bg-foreground/10",
          className,
        )}
        data-slot="hook-nav"
        {...props}
      >
        {children}
      </ul>
    </HookContext.Provider>
  );
}

export interface HookNavItemProps extends React.ComponentProps<"li"> {
  active?: boolean;
}

export function HookNavItem({
  active = false,
  className,
  children,
  ...props
}: HookNavItemProps) {
  const id = React.useContext(HookContext);
  const reduce = useReducedMotion();
  return (
    <li
      className={cn(
        "relative flex min-h-9 items-center ps-6 text-[15px] transition-colors duration-150 ease-out *:outline-none",
        active
          ? "text-heading"
          : "text-foreground/50 hover:text-foreground/80",
        className,
      )}
      data-active={active || undefined}
      data-slot="hook-nav-item"
      {...props}
    >
      {active ? (
        <motion.svg
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 h-9 w-5 overflow-visible"
          fill="none"
          layoutId={`hook-${id}`}
          transition={reduce ? { duration: 0 } : SPRING}
          viewBox="0 0 20 36"
        >
          <path
            d="M0.5 0V8C0.5 13.5 5 18 10.5 18H17"
            stroke="var(--brand)"
            strokeDasharray="2 3"
            strokeLinecap="round"
            strokeWidth="1"
          />
        </motion.svg>
      ) : null}
      {children}
    </li>
  );
}
