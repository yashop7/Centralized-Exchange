import type * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "buy" | "sell" | "brand";

const TONE: Record<Tone, string> = {
  neutral: "border-apple bg-surface text-foreground/70",
  buy: "bg-buy/12 text-buy",
  sell: "bg-sell/12 text-sell",
  brand: "bg-brand/12 text-brand",
};

export interface PillProps extends React.ComponentProps<"span"> {
  tone?: Tone;
  size?: "sm" | "default";
  /** Small leading dot; pulses when `live`. */
  dot?: boolean;
  live?: boolean;
}

/** Status / tag pill. Fills are always tinted, never saturated. */
export function Pill({
  tone = "neutral",
  size = "default",
  dot = false,
  live = false,
  className,
  children,
  ...props
}: PillProps) {
  return (
    <span
      className={cn(
        "inline-flex w-fit shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full font-medium [&_svg]:size-3 [&_svg]:shrink-0",
        size === "default" ? "h-6 px-2.5 text-xs" : "h-5 px-2 text-[11px]",
        TONE[tone],
        className,
      )}
      data-slot="pill"
      {...props}
    >
      {dot ? (
        <span
          aria-hidden="true"
          className={cn(
            "size-1.5 rounded-full bg-current",
            live && "animate-pulse-dot",
          )}
        />
      ) : null}
      {children}
    </span>
  );
}

export interface ChipButtonProps extends React.ComponentProps<"button"> {
  active?: boolean;
}

/** Tiny pressable pill: percentage chips, filters. */
export function ChipButton({
  active = false,
  className,
  ...props
}: ChipButtonProps) {
  return (
    <button
      aria-pressed={active}
      className={cn(
        "border-apple inline-flex h-7 cursor-pointer items-center justify-center rounded-full px-3 font-medium text-xs outline-none transition-[background-color,color,scale] duration-150 ease-out focus-visible:ring-2 focus-visible:ring-ring/50 active:scale-[0.96] disabled:pointer-events-none disabled:opacity-40 motion-reduce:active:scale-100",
        active
          ? "bg-surface-hover text-heading"
          : "bg-surface text-foreground/50 hover:bg-surface-hover hover:text-heading",
        className,
      )}
      type="button"
      {...props}
    />
  );
}
