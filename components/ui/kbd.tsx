import type * as React from "react";
import { cn } from "@/lib/utils";

export function Kbd({
  className,
  ...props
}: React.ComponentProps<"kbd">): React.ReactElement {
  return (
    <kbd
      className={cn(
        "pointer-events-none inline-flex h-6 min-w-6 select-none items-center justify-center gap-0.5 rounded-md bg-surface-hover px-2 font-medium font-sans text-foreground/60 text-xs [&_svg:not([class*='size-'])]:size-3",
        className,
      )}
      data-slot="kbd"
      {...props}
    />
  );
}

export function KbdGroup({
  className,
  ...props
}: React.ComponentProps<"kbd">): React.ReactElement {
  return (
    <kbd
      className={cn("inline-flex items-center gap-1", className)}
      data-slot="kbd-group"
      {...props}
    />
  );
}
