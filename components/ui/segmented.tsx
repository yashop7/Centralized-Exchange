"use client";

import { motion, useReducedMotion } from "motion/react";
import * as React from "react";
import { SPRING } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "buy" | "sell";

export interface SegmentedOption<T extends string> {
  value: T;
  label: React.ReactNode;
  /** Tints the thumb for market direction. Never a saturated fill. */
  tone?: Tone;
}

export interface SegmentedProps<T extends string>
  extends Omit<React.ComponentProps<"div">, "onChange"> {
  options: readonly SegmentedOption<T>[];
  value: T;
  onValueChange: (value: T) => void;
  size?: "sm" | "default";
  /** Stretch options to share the container width. */
  fill?: boolean;
  "aria-label": string;
}

const THUMB: Record<Tone, string> = {
  neutral: "color-mix(in srgb, var(--surface-hover) 100%, transparent)",
  buy: "color-mix(in srgb, var(--buy) 15%, transparent)",
  sell: "color-mix(in srgb, var(--sell) 15%, transparent)",
};

const TEXT: Record<Tone, string> = {
  neutral: "text-heading",
  buy: "text-buy",
  sell: "text-sell",
};

/**
 * Pill segmented control with a sliding thumb (shared layoutId).
 * A radiogroup: arrow keys move the selection, one tab stop.
 */
export function Segmented<T extends string>({
  options,
  value,
  onValueChange,
  size = "default",
  fill = false,
  className,
  ...props
}: SegmentedProps<T>) {
  const id = React.useId();
  const reduce = useReducedMotion();
  const refs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const previousTone = React.useRef<Tone>("neutral");
  const activeTone =
    options.find((option) => option.value === value)?.tone ?? "neutral";

  React.useEffect(() => {
    previousTone.current = activeTone;
  }, [activeTone]);

  const move = (from: number, delta: number) => {
    const next = (from + delta + options.length) % options.length;
    onValueChange(options[next].value);
    refs.current[next]?.focus();
  };

  return (
    <div
      className={cn(
        "border-apple relative isolate inline-flex rounded-full bg-surface p-1",
        fill && "flex w-full",
        className,
      )}
      data-slot="segmented"
      role="radiogroup"
      {...props}
    >
      {options.map((option, index) => {
        const active = option.value === value;
        const tone = option.tone ?? "neutral";
        return (
          <button
            aria-checked={active}
            className={cn(
              "relative z-0 inline-flex cursor-pointer select-none items-center justify-center gap-1.5 whitespace-nowrap rounded-full font-medium outline-none transition-colors duration-150 ease-out focus-visible:ring-2 focus-visible:ring-ring/50",
              size === "default" ? "h-9 px-5 text-sm" : "h-7 px-3.5 text-xs",
              fill && "flex-1",
              active ? TEXT[tone] : "text-foreground/50 hover:text-foreground/80",
            )}
            key={option.value}
            onClick={() => onValueChange(option.value)}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                event.preventDefault();
                move(index, 1);
              } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                event.preventDefault();
                move(index, -1);
              }
            }}
            ref={(node) => {
              refs.current[index] = node;
            }}
            role="radio"
            tabIndex={active ? 0 : -1}
            type="button"
          >
            {active ? (
              <motion.span
                animate={{ backgroundColor: THUMB[tone] }}
                aria-hidden="true"
                className={cn(
                  "-z-10 absolute inset-0 rounded-full",
                  tone === "neutral" && "border-apple",
                )}
                initial={{ backgroundColor: THUMB[previousTone.current] }}
                layoutId={`segmented-thumb-${id}`}
                transition={reduce ? { duration: 0 } : SPRING}
              />
            ) : null}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
