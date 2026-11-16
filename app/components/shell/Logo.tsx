import { cn } from "@/lib/utils";

/** The exchange mark: one orange arrowhead pointing up-right. Same shape as app/icon.svg. */
export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "border-apple inline-flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-surface",
        className,
      )}
    >
      <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 32 32" width="18">
        <g transform="rotate(45 16 16) translate(4 4)">
          <polygon
            fill="var(--brand)"
            points="12 2 19 21 12 17 5 21 12 2"
            stroke="var(--brand)"
            strokeLinejoin="round"
            strokeWidth="1.6"
          />
        </g>
      </svg>
    </span>
  );
}
