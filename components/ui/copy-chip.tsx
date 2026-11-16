"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import * as React from "react";
import { cn } from "@/lib/utils";

export interface CopyChipProps extends React.ComponentProps<"div"> {
  /** The full string that gets copied. */
  value: string;
  /** Quiet lead-in, e.g. `$` or `0x`. */
  prefix?: string;
  /** Middle-truncate long values: keeps this many chars at each end. */
  truncate?: number;
  label?: string;
}

/** Code/command chip for addresses, order IDs, tx hashes. */
export function CopyChip({
  value,
  prefix,
  truncate,
  label = "Copy",
  className,
  ...props
}: CopyChipProps) {
  const [copied, setCopied] = React.useState(false);
  const reduce = useReducedMotion();
  const timer = React.useRef<ReturnType<typeof setTimeout>>();

  React.useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable: leave the icon as it is */
    }
  };

  const long = truncate !== undefined && value.length > truncate * 2 + 1;

  return (
    <div
      className={cn(
        "border-apple flex min-w-0 items-center gap-3 rounded-xl bg-surface py-1.5 ps-4 pe-1.5 text-sm",
        className,
      )}
      data-slot="copy-chip"
      {...props}
    >
      <code className="num min-w-0 flex-1 truncate text-foreground/40">
        {prefix ? <span className="me-2 select-none">{prefix}</span> : null}
        {long ? (
          <>
            <span className="text-heading">{value.slice(0, truncate)}</span>
            <span>…</span>
            <span className="text-heading">{value.slice(-(truncate ?? 0))}</span>
          </>
        ) : (
          <span className="text-heading">{value}</span>
        )}
      </code>
      <button
        aria-label={copied ? "Copied" : label}
        className="relative inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-foreground/50 outline-none transition-[background-color,color,scale] duration-150 hover:bg-surface-hover hover:text-heading focus-visible:ring-2 focus-visible:ring-ring/50 active:scale-[0.94]"
        onClick={copy}
        type="button"
      >
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            className="flex"
            exit={{ opacity: 0, scale: 0.6, filter: "blur(3px)" }}
            initial={{ opacity: 0, scale: 0.6, filter: "blur(3px)" }}
            key={copied ? "check" : "copy"}
            transition={{ duration: reduce ? 0 : 0.15, ease: "easeOut" }}
          >
            {copied ? (
              <CheckIcon className="size-4 text-buy" strokeWidth={2} />
            ) : (
              <CopyIcon className="size-4" strokeWidth={1.5} />
            )}
          </motion.span>
        </AnimatePresence>
      </button>
    </div>
  );
}
