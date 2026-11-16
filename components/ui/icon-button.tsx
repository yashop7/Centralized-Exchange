"use client";

import type * as React from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipPopup,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface IconButtonProps
  extends Omit<React.ComponentProps<"button">, "aria-label"> {
  /** Required: names the button and fills the tooltip. */
  label: string;
  /** Extra hint rendered after the label inside the tooltip, e.g. a shortcut. */
  hint?: React.ReactNode;
  size?: "sm" | "default";
  /** "bare" sits inside a toolbar pill; "solid" stands on its own. */
  variant?: "bare" | "solid";
  active?: boolean;
  tooltipSide?: "top" | "bottom" | "left" | "right";
}

/** Circular icon button. Always has a tooltip, because an icon alone is a guess. */
export function IconButton({
  label,
  hint,
  size = "default",
  variant = "bare",
  active = false,
  tooltipSide = "bottom",
  className,
  children,
  ...props
}: IconButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <button
            aria-label={label}
            aria-pressed={active || undefined}
            className={cn(
              "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full text-foreground/80 outline-none transition-[background-color,color,scale] duration-150 ease-out hover:bg-surface-hover hover:text-heading focus-visible:ring-2 focus-visible:ring-ring/50 active:scale-[0.94] disabled:pointer-events-none disabled:opacity-40 motion-reduce:active:scale-100 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:stroke-[1.5]",
              size === "default"
                ? "size-10 [&_svg:not([class*='size-'])]:size-[18px]"
                : "size-8 [&_svg:not([class*='size-'])]:size-4",
              variant === "solid" && "border-apple bg-surface",
              active && "bg-surface-hover text-heading",
              className,
            )}
            type="button"
            {...props}
          />
        }
      >
        {children}
      </TooltipTrigger>
      <TooltipPopup side={tooltipSide}>
        <span className="flex items-center gap-2">
          {label}
          {hint ? <span className="text-foreground/50">{hint}</span> : null}
        </span>
      </TooltipPopup>
    </Tooltip>
  );
}
