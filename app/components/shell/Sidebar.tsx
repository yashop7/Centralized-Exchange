"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Kbd } from "@/components/ui/kbd";
import { HookNav, HookNavItem, HookNavScope } from "@/components/ui/hook-nav";
import { SectionLabel } from "@/components/ui/panel";
import { Pill } from "@/components/ui/pill";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { marketLabel, type NavMarket } from "./markets";
import { useShell } from "./ShellContext";

function crumb(pathname: string) {
  if (pathname.startsWith("/trade")) return "Trade";
  if (pathname.startsWith("/design")) return "Design";
  return "Markets";
}

const linkClass =
  "flex min-h-9 flex-1 items-center justify-between gap-3 rounded-md pe-2 focus-visible:ring-2 focus-visible:ring-ring/50";

export function Sidebar({
  markets,
  onNavigate,
  className,
}: {
  markets: NavMarket[];
  /** Called after a link is followed; the mobile drawer uses it to close. */
  onNavigate?: () => void;
  className?: string;
}) {
  const pathname = usePathname();
  const { openCommand, openDeposit } = useShell();
  const activeMarket = pathname.startsWith("/trade/")
    ? decodeURIComponent(pathname.split("/")[2] ?? "")
    : null;
  // A market that isn't in the top list still needs a home for the hook.
  const listed = markets.some((market) => market.symbol === activeMarket);
  const rows: NavMarket[] =
    activeMarket && !listed
      ? [
          ...markets,
          {
            symbol: activeMarket,
            base: activeMarket.split("_")[0],
            quote: activeMarket.split("_")[1] ?? "",
            change: null,
          },
        ]
      : markets;

  return (
    <aside
      className={cn("flex min-h-0 flex-col gap-8 px-5 pt-5 pb-4", className)}
    >
      {/* Brand + breadcrumb + command */}
      <div className="flex items-center justify-between gap-3">
        <Link
          className="flex min-w-0 items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          href="/"
          onClick={onNavigate}
        >
          <Logo />
          <span className="flex min-w-0 items-center gap-1.5 text-[15px]">
            <span className="font-medium text-heading">Exchange</span>
            <span className="text-foreground/25">/</span>
            <span className="truncate text-foreground/50">
              {crumb(pathname)}
            </span>
          </span>
        </Link>
        <button
          aria-label="Open command menu"
          className="cursor-pointer rounded-md outline-none transition-opacity duration-150 hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring/50"
          onClick={() => {
            onNavigate?.();
            openCommand();
          }}
          type="button"
        >
          <Kbd>⌘K</Kbd>
        </button>
      </div>

      <HookNavScope>
        <nav
          aria-label="Primary"
          className="fade-mask-y no-scrollbar -my-4 flex min-h-0 flex-1 flex-col gap-8 overflow-y-auto py-6"
        >
          <div className="flex flex-col gap-3">
            <SectionLabel>Exchange</SectionLabel>
            <HookNav>
              <HookNavItem active={pathname.startsWith("/markets")}>
                <Link className={linkClass} href="/markets" onClick={onNavigate}>
                  Markets
                </Link>
              </HookNavItem>
              <HookNavItem>
                <button
                  className={cn(linkClass, "cursor-pointer text-left")}
                  onClick={() => {
                    onNavigate?.();
                    openDeposit();
                  }}
                  type="button"
                >
                  Deposit
                </button>
              </HookNavItem>
              <HookNavItem className="text-foreground/30 hover:text-foreground/30">
                <span className={linkClass}>
                  Withdraw
                  <Pill size="sm">Soon</Pill>
                </span>
              </HookNavItem>
            </HookNav>
          </div>

          <div className="flex flex-col gap-3">
            <SectionLabel>Trade</SectionLabel>
            <HookNav>
              {rows.map((market) => {
                const up = (market.change ?? 0) >= 0;
                return (
                  <HookNavItem
                    active={market.symbol === activeMarket}
                    key={market.symbol}
                  >
                    <Link
                      className={linkClass}
                      href={`/trade/${market.symbol}`}
                      onClick={onNavigate}
                    >
                      <span className="truncate">
                        {marketLabel(market.symbol)}
                      </span>
                      {market.change !== null ? (
                        <span
                          className={cn(
                            "num text-xs",
                            up ? "text-buy/80" : "text-sell/80",
                          )}
                        >
                          {up ? "+" : ""}
                          {market.change.toFixed(2)}%
                        </span>
                      ) : null}
                    </Link>
                  </HookNavItem>
                );
              })}
            </HookNav>
          </div>

          <div className="flex flex-col gap-3">
            <SectionLabel>System</SectionLabel>
            <HookNav>
              <HookNavItem active={pathname.startsWith("/design")}>
                <Link className={linkClass} href="/design" onClick={onNavigate}>
                  Design system
                </Link>
              </HookNavItem>
            </HookNav>
          </div>
        </nav>
      </HookNavScope>

      <p className="flex items-center gap-2 text-foreground/40 text-xs">
        <span className="size-1.5 animate-pulse-dot rounded-full bg-buy text-buy" />
        All systems live
      </p>
    </aside>
  );
}
