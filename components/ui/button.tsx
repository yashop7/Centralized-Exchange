"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

export const buttonVariants = cva(
  "relative inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-2 whitespace-nowrap font-medium outline-none transition-[background-color,color,filter,scale,box-shadow] duration-150 ease-out pointer-coarse:after:absolute pointer-coarse:after:size-full pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11 focus-visible:ring-2 focus-visible:ring-ring/50 not-disabled:active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 data-loading:select-none data-loading:text-transparent motion-reduce:transition-colors motion-reduce:active:scale-100 [&_svg:not([class*='size-'])]:size-[18px] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:stroke-[1.5]",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        default: "h-11 rounded-xl px-5 text-[15px]",
        lg: "h-12 rounded-xl px-6 text-base",
        sm: "h-9 rounded-[10px] px-3.5 text-sm",
        xs: "h-7 gap-1 rounded-lg px-2.5 text-xs [&_svg:not([class*='size-'])]:size-3.5",
        icon: "size-10 rounded-full [&_svg:not([class*='size-'])]:size-[18px]",
        "icon-sm":
          "size-8 rounded-full [&_svg:not([class*='size-'])]:size-4",
        "icon-xs":
          "size-7 rounded-full [&_svg:not([class*='size-'])]:size-3.5",
        "icon-lg": "size-11 rounded-full [&_svg:not([class*='size-'])]:size-5",
        "icon-xl": "size-12 rounded-full [&_svg:not([class*='size-'])]:size-5",
        xl: "h-14 rounded-2xl px-7 text-base",
      },
      variant: {
        // The orange. Primary CTA only.
        default:
          "highlight-top bg-brand text-brand-foreground hover:brightness-110 data-pressed:brightness-110 *:data-[slot=button-loading-indicator]:text-brand-foreground",
        secondary:
          "border-apple bg-surface text-foreground/80 hover:bg-surface-hover hover:text-heading data-pressed:bg-surface-hover data-pressed:text-heading *:data-[slot=button-loading-indicator]:text-heading",
        outline:
          "border-apple bg-surface text-foreground/80 hover:bg-surface-hover hover:text-heading data-pressed:bg-surface-hover data-pressed:text-heading *:data-[slot=button-loading-indicator]:text-heading",
        ghost:
          "text-foreground/70 hover:bg-accent hover:text-heading data-pressed:bg-accent data-pressed:text-heading *:data-[slot=button-loading-indicator]:text-heading",
        destructive:
          "border-apple bg-sell/12 text-sell hover:bg-sell/18 data-pressed:bg-sell/18 *:data-[slot=button-loading-indicator]:text-sell",
        "destructive-outline":
          "border-apple bg-surface text-sell hover:bg-sell/10 data-pressed:bg-sell/10 *:data-[slot=button-loading-indicator]:text-sell",
        link: "h-auto rounded-md px-0 text-foreground/70 underline-offset-4 hover:text-heading hover:underline active:scale-100 *:data-[slot=button-loading-indicator]:text-heading",
      },
    },
  },
);

export interface ButtonProps extends useRender.ComponentProps<"button"> {
  variant?: VariantProps<typeof buttonVariants>["variant"];
  size?: VariantProps<typeof buttonVariants>["size"];
  loading?: boolean;
}

/**
 * forwardRef because this app runs React 18: Base UI triggers
 * (`render={<Button />}`) need the ref to anchor menus, dialogs and tooltips.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      className,
      variant,
      size,
      render,
      children,
      loading = false,
      disabled: disabledProp,
      ...props
    },
    ref,
  ): React.ReactElement {
    const isDisabled: boolean = Boolean(loading || disabledProp);
    const typeValue: React.ButtonHTMLAttributes<HTMLButtonElement>["type"] =
      render ? undefined : "button";

    const defaultProps = {
      children: (
        <>
          {children}
          {loading && (
            <Spinner
              className="pointer-events-none absolute"
              data-slot="button-loading-indicator"
            />
          )}
        </>
      ),
      className: cn(buttonVariants({ className, size, variant })),
      "aria-disabled": loading || undefined,
      "data-loading": loading ? "" : undefined,
      "data-slot": "button",
      disabled: isDisabled,
      type: typeValue,
    };

    return useRender({
      defaultTagName: "button",
      props: mergeProps<"button">(defaultProps, props),
      ref,
      render,
    });
  },
);
