"use client";

import { Input as InputPrimitive } from "@base-ui/react/input";
import type * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = Omit<
  InputPrimitive.Props & React.RefAttributes<HTMLInputElement>,
  "size"
> & {
  size?: "sm" | "default" | "lg" | number;
  unstyled?: boolean;
  nativeInput?: boolean;
};

export function Input({
  className,
  size = "default",
  unstyled = false,
  nativeInput = false,
  style,
  ...props
}: InputProps): React.ReactElement {
  const inputClassName = cn(
    "num h-11 w-full min-w-0 rounded-[inherit] bg-transparent px-4 text-[15px] text-heading outline-none [transition:background-color_5000000s_ease-in-out_0s] placeholder:text-foreground/30 read-only:text-foreground/60 autofill:[-webkit-text-fill-color:var(--heading)]",
    size === "sm" && "h-9 px-3 text-sm",
    size === "lg" && "h-12 text-base",
    props.type === "search" &&
      "font-sans [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none",
  );

  return (
    <span
      className={
        cn(
          !unstyled &&
            "border-apple relative inline-flex w-full items-center rounded-xl bg-surface ring-ring/50 transition-[box-shadow,background-color] duration-150 ease-out has-focus-visible:ring-2 has-disabled:opacity-50 has-aria-invalid:ring-2 has-aria-invalid:ring-sell/50 has-[[data-size=sm]]:rounded-[10px] in-data-[surface=nested]:bg-background/40",
          className,
        ) || undefined
      }
      data-size={size}
      data-slot="input-control"
    >
      {nativeInput ? (
        <input
          className={inputClassName}
          data-slot="input"
          size={typeof size === "number" ? size : undefined}
          style={typeof style === "function" ? undefined : style}
          {...props}
        />
      ) : (
        <InputPrimitive
          className={inputClassName}
          data-slot="input"
          size={typeof size === "number" ? size : undefined}
          style={style}
          {...props}
        />
      )}
    </span>
  );
}

export { InputPrimitive };
