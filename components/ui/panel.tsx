import type * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Depth comes from layering, never from drop shadows:
 *   #000 canvas → Panel (#121212, 45px) → Surface (#171717, 16px) → wells (12px) → pills
 */

/** The one big floating card a page lives in. */
export function Panel({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "border-apple relative rounded-[28px] bg-card md:rounded-[45px]",
        className,
      )}
      data-slot="panel"
      {...props}
    />
  );
}

/** A nested block inside the Panel: orderbook, chart, order form, table. */
export function Surface({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("border-apple relative rounded-2xl bg-surface", className)}
      data-slot="surface"
      {...props}
    />
  );
}

export function SurfaceHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex min-h-14 items-center justify-between gap-3 px-5 py-3",
        className,
      )}
      data-slot="surface-header"
      {...props}
    />
  );
}

export function SurfaceTitle({
  className,
  ...props
}: React.ComponentProps<"h3">) {
  return (
    <h3
      className={cn(
        "font-runde font-semibold text-base text-heading tracking-tight",
        className,
      )}
      data-slot="surface-title"
      {...props}
    />
  );
}

/** Uppercase tracked section label. */
export function SectionLabel({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return <span className={cn("label-caps", className)} {...props} />;
}
