"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { formatNumber } from "./BidTable";

/**
 * One price level. 24px tall, mono, tabular.
 * - A faint depth bar grows from the right (cumulative size).
 * - When the level's size changes, the row flashes its colour for 400ms
 *   and fades back, so the eye catches where the book just moved.
 */
export function DepthRow({
  price,
  quantity,
  total,
  maxTotal,
  side,
}: {
  price: string;
  quantity: string;
  total: number;
  maxTotal: number;
  side: "buy" | "sell";
}) {
  const depthPct = maxTotal > 0 ? (total / maxTotal) * 100 : 0;

  const previous = useRef(quantity);
  const [flash, setFlash] = useState(0);
  useEffect(() => {
    if (previous.current !== quantity) {
      previous.current = quantity;
      setFlash((n) => n + 1);
    }
  }, [quantity]);

  const buy = side === "buy";

  return (
    <div className="group relative h-6 cursor-default">
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-y-px right-0 rounded-l-[4px] transition-[width] duration-200 ease-out",
          buy ? "bg-buy/10" : "bg-sell/10"
        )}
        style={{ width: `${depthPct}%` }}
      />
      {flash > 0 ? (
        <div
          aria-hidden="true"
          className={cn(
            "absolute inset-0",
            buy ? "animate-flash-buy" : "animate-flash-sell"
          )}
          key={flash}
        />
      ) : null}
      <div className="num relative grid h-full grid-cols-3 items-center px-5 text-[13px] leading-none transition-colors duration-150 group-hover:bg-foreground/[0.03]">
        <span className={buy ? "text-buy" : "text-sell"}>
          {parseFloat(price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
        <span className="text-right text-foreground/80">
          {formatNumber(quantity)}
        </span>
        <span className="text-right text-foreground/50">
          {formatNumber(total.toFixed(2))}
        </span>
      </div>
    </div>
  );
}
