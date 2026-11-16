"use client";

import {
  ArrowDownToLineIcon,
  CandlestickChartIcon,
  LayoutGridIcon,
  MenuIcon,
  PaletteIcon,
  SearchIcon,
  SunMoonIcon,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import * as React from "react";
import {
  CommandPalette,
  type CommandItem,
} from "@/components/motion/command-palette";
import { Drawer, DrawerPopup } from "@/components/ui/drawer";
import { Panel } from "@/components/ui/panel";
import { SPRING_SOFT } from "@/lib/motion";
import DepositModal from "../Deposit_button";
import { Logo } from "./Logo";
import { marketLabel, useNavMarkets } from "./markets";
import { ShellContext, type ShellState } from "./ShellContext";
import { Sidebar } from "./Sidebar";
import { Toolbar } from "./Toolbar";

const SIDEBAR_KEY = "exchange:sidebar-collapsed";

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const { resolvedTheme, setTheme } = useTheme();
  const markets = useNavMarkets();

  const [depositOpen, setDepositOpen] = React.useState(false);
  const [commandOpen, setCommandOpen] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const fullscreenTarget = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    try {
      setSidebarCollapsed(localStorage.getItem(SIDEBAR_KEY) === "1");
    } catch {
      /* storage blocked: stay expanded */
    }
  }, []);

  const shell = React.useMemo<ShellState>(
    () => ({
      openDeposit: () => setDepositOpen(true),
      openCommand: () => setCommandOpen(true),
      sidebarCollapsed,
      toggleSidebar: () =>
        setSidebarCollapsed((collapsed) => {
          try {
            localStorage.setItem(SIDEBAR_KEY, collapsed ? "0" : "1");
          } catch {
            /* ignore */
          }
          return !collapsed;
        }),
      setFullscreenTarget: (element) => {
        fullscreenTarget.current = element;
      },
      fullscreenTarget,
    }),
    [sidebarCollapsed],
  );

  const commands = React.useMemo<CommandItem[]>(
    () => [
      {
        id: "markets",
        label: "Markets",
        group: "Go to",
        icon: LayoutGridIcon,
        onSelect: () => router.push("/markets"),
      },
      {
        id: "design",
        label: "Design system",
        group: "Go to",
        icon: PaletteIcon,
        onSelect: () => router.push("/design"),
      },
      ...markets.map((market) => ({
        id: `trade-${market.symbol}`,
        label: `Trade ${marketLabel(market.symbol)}`,
        group: "Trade",
        keywords: [market.base, market.quote, market.symbol],
        icon: CandlestickChartIcon,
        onSelect: () => router.push(`/trade/${market.symbol}`),
      })),
      {
        id: "deposit",
        label: "Deposit funds",
        group: "Actions",
        icon: ArrowDownToLineIcon,
        onSelect: () => setDepositOpen(true),
      },
      {
        id: "theme",
        label: resolvedTheme === "dark" ? "Switch to light" : "Switch to dark",
        group: "Actions",
        keywords: ["theme", "dark", "light", "appearance"],
        icon: SunMoonIcon,
        onSelect: () => setTheme(resolvedTheme === "dark" ? "light" : "dark"),
      },
    ],
    [markets, resolvedTheme, router, setTheme],
  );

  return (
    <ShellContext.Provider value={shell}>
      <div className="isolate flex min-h-dvh flex-col p-2 md:p-3 lg:flex-row">
        {/* Desktop sidebar: lives on the black canvas, outside the card */}
        <AnimatePresence initial={false}>
          {!sidebarCollapsed ? (
            <motion.div
              animate={{ width: 280, opacity: 1 }}
              className="sticky top-3 hidden h-[calc(100dvh-1.5rem)] shrink-0 overflow-hidden lg:block"
              exit={{ width: 0, opacity: 0 }}
              initial={{ width: 0, opacity: 0 }}
              key="sidebar"
              transition={reduce ? { duration: 0 } : SPRING_SOFT}
            >
              <Sidebar className="h-full w-[280px]" markets={markets} />
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Mobile bar */}
        <div className="flex items-center justify-between px-3 pt-2 pb-3 lg:hidden">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="font-medium text-[15px] text-heading">
              Exchange
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              aria-label="Search"
              className="inline-flex size-10 cursor-pointer items-center justify-center rounded-full text-foreground/70 outline-none transition-colors duration-150 hover:bg-surface hover:text-heading focus-visible:ring-2 focus-visible:ring-ring/50"
              onClick={() => setCommandOpen(true)}
              type="button"
            >
              <SearchIcon className="size-[18px]" strokeWidth={1.5} />
            </button>
            <button
              aria-label="Open navigation"
              className="inline-flex size-10 cursor-pointer items-center justify-center rounded-full text-foreground/70 outline-none transition-colors duration-150 hover:bg-surface hover:text-heading focus-visible:ring-2 focus-visible:ring-ring/50"
              onClick={() => setDrawerOpen(true)}
              type="button"
            >
              <MenuIcon className="size-[18px]" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* The floating card */}
        <Panel className="flex min-h-[calc(100dvh-5rem)] min-w-0 flex-1 flex-col lg:min-h-[calc(100dvh-1.5rem)]">
          <div className="pointer-events-none absolute top-4 right-4 z-30 md:top-6 md:right-6">
            <Toolbar className="pointer-events-auto" />
          </div>
          {children}
        </Panel>
      </div>

      <Drawer onOpenChange={setDrawerOpen} open={drawerOpen} position="left">
        <DrawerPopup className="max-w-[300px] bg-background">
          <Sidebar
            className="h-full"
            markets={markets}
            onNavigate={() => setDrawerOpen(false)}
          />
        </DrawerPopup>
      </Drawer>

      <DepositModal onOpenChange={setDepositOpen} open={depositOpen} />
      <CommandPalette
        emptyMessage="Nothing matches that."
        items={commands}
        onOpenChange={setCommandOpen}
        open={commandOpen}
        placeholder="Search markets and actions…"
      />
    </ShellContext.Provider>
  );
}
