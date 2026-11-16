"use client";

import { useState } from "react";
import {
  Drawer,
  DrawerPanel,
  DrawerPopup,
  DrawerTitle,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { SwapUI } from "./SwapUI";

type Side = "buy" | "sell";

/**
 * Phones only. A Buy / Sell bar pinned above the home indicator; either button
 * opens the order form in a bottom sheet, already on that side.
 * The form itself is the same SwapUI the desktop shows inline.
 */
export function MobileTradeBar({
  market,
  balance,
  inr,
}: {
  market: string;
  balance: string;
  inr: string;
}) {
  const [open, setOpen] = useState(false);
  // Kept apart from `open` so the sheet doesn't flip sides while it slides away.
  const [side, setSide] = useState<Side>("buy");

  const show = (next: Side) => {
    setSide(next);
    setOpen(true);
  };

  return (
    <>
      <div
        className="fixed inset-x-0 bottom-0 z-40 border-hairline border-t bg-background/80 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl sm:hidden"
        data-slot="trade-bar"
      >
        <div className="grid grid-cols-2 gap-3">
          {(["buy", "sell"] as const).map((option) => (
            <button
              className={cn(
                "h-12 cursor-pointer select-none rounded-xl font-medium text-base outline-none transition-[background-color,scale] duration-150 ease-out focus-visible:ring-2 focus-visible:ring-ring/50 active:scale-[0.97] motion-reduce:active:scale-100",
                option === "buy"
                  ? "bg-buy/15 text-buy active:bg-buy/25"
                  : "bg-sell/15 text-sell active:bg-sell/25",
              )}
              key={option}
              onClick={() => show(option)}
              type="button"
            >
              {option === "buy" ? "Buy" : "Sell"}
            </button>
          ))}
        </div>
      </div>

      <Drawer onOpenChange={setOpen} open={open} position="bottom">
        <DrawerPopup
          className="border-apple max-h-[92dvh] rounded-t-[24px] border-t-0 bg-card before:hidden"
          showBar
        >
          <DrawerTitle className="sr-only">Place an order</DrawerTitle>
          <DrawerPanel className="px-4 pt-6 pb-4" scrollFade={false}>
            <SwapUI
              balance={balance}
              bare
              initialSide={side}
              inr={inr}
              key={side}
              market={market}
            />
          </DrawerPanel>
        </DrawerPopup>
      </Drawer>
    </>
  );
}
