"use client";

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import type React from "react";
import { cn } from "@/lib/utils";

export function Checkbox({
  className,
  ...props
}: CheckboxPrimitive.Root.Props): React.ReactElement {
  return (
    <CheckboxPrimitive.Root
      className={cn(
        "border-apple relative inline-flex size-[18px] shrink-0 cursor-pointer items-center justify-center rounded-md bg-surface outline-none ring-ring/50 transition-[box-shadow,background-color] duration-150 focus-visible:ring-2 data-disabled:cursor-default data-disabled:opacity-50 data-checked:bg-brand",
        className,
      )}
      data-slot="checkbox"
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className="flex items-center justify-center text-brand-foreground data-unchecked:hidden data-indeterminate:text-foreground"
        data-slot="checkbox-indicator"
        render={(
          props: React.ComponentProps<"span">,
          state: CheckboxPrimitive.Indicator.State,
        ) => (
          <span {...props}>
            {state.indeterminate ? (
              <svg
                aria-hidden="true"
                className="size-3.5 sm:size-3"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M5.252 12h13.496" />
              </svg>
            ) : (
              <svg
                aria-hidden="true"
                className="size-3.5 sm:size-3"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M5.252 12.7 10.2 18.63 18.748 5.37" />
              </svg>
            )}
          </span>
        )}
      />
    </CheckboxPrimitive.Root>
  );
}

export { CheckboxPrimitive };
