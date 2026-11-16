import { cn } from "@/lib/utils";

/** The exchange mark: one arrow up, one arrow down. */
export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "border-apple inline-flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-surface text-heading",
        className,
      )}
    >
      <svg
        aria-hidden="true"
        fill="none"
        height="18"
        viewBox="0 0 32 32"
        width="18"
      >
        <path
          d="M21 24V10M16.5 14.5 21 10l4.5 4.5"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
        />
        <path
          d="M11 8v14M6.5 17.5 11 22l4.5-4.5"
          stroke="var(--brand)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
        />
      </svg>
    </span>
  );
}
