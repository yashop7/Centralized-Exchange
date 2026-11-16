"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { SectionLabel, Surface, SurfaceHeader } from "@/components/ui/panel";
import { Segmented } from "@/components/ui/segmented";
import { cn } from "@/lib/utils";
import { getDepth, getTicker, getTrades } from "../../utils/httpClient";
import { BidTable, ROWS } from "./BidTable";
import { AskTable } from "./AskTable";
import { SignalingManager } from "@/app/utils/SignalingManager";

export function Depth({ market, className }: { market: string; className?: string }) {
  const [bids, setBids] = useState<[string, string][]>();
  const [asks, setAsks] = useState<[string, string][]>();
  const [trade, setTrade] = useState<[string, string][]>();
  const [price, setPrice] = useState<string>("");
  const [priceUp, setPriceUp] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"book" | "trades">("book");
const sortedAsks = asks ? [...asks].sort((a, b) => parseFloat(a[0]) - parseFloat(b[0])) : [];
  const sortedBids = bids ? [...bids].sort((a, b) => parseFloat(b[0]) - parseFloat(a[0])) : [];

  const bestAsk = sortedAsks[0] ? parseFloat(sortedAsks[0][0]) : null;
  const bestBid = sortedBids[0] ? parseFloat(sortedBids[0][0]) : null;
  const spread = bestAsk && bestBid ? (bestAsk - bestBid).toFixed(2) : null;
  const spreadPct = bestAsk && bestBid ? (((bestAsk - bestBid) / bestAsk) * 100).toFixed(3) : null;

  let cumulativeBidVol = 0, cumulativeAskVol = 0;
  sortedBids.slice(0, ROWS).forEach(([, q]) => { cumulativeBidVol += parseFloat(q); });
  sortedAsks.slice(0, ROWS).forEach(([, q]) => { cumulativeAskVol += parseFloat(q); });
  const totalVol = cumulativeBidVol + cumulativeAskVol;
  const bidPct = totalVol ? (cumulativeBidVol / totalVol) * 100 : 50;
  const askPct = totalVol ? (cumulativeAskVol / totalVol) * 100 : 50;

  useEffect(() => {
    const instance = SignalingManager.getInstance(market);

    instance.registerCallback(
      "depth",
      (data: any) => {
        const updateBook = (
          original: [string, string][] | undefined,
          updates: [string, string][],
          isAsk: boolean
        ): [string, string][] => {
          const map = new Map(original || []);
          for (const [p, s] of updates) {
            if (s === "0" || parseFloat(s) === 0) map.delete(p);
            else map.set(p, s);
          }
          return Array.from(map).sort((a, b) =>
            isAsk ? parseFloat(a[0]) - parseFloat(b[0]) : parseFloat(b[0]) - parseFloat(a[0])
          );
        };
        setBids((prev) => updateBook(prev, data.bids, false));
        setAsks((prev) => updateBook(prev, data.asks, true));
      },
      `DEPTH-${market}`
    );

    instance.registerCallback(
      "trade",
      (data: any) => {
        setPrice((prev) => {
          setPriceUp(parseFloat(data.price) >= parseFloat(prev || data.price));
          return data.price;
        });
        setTrade((prev) => {
          const entry: [string, string] = [String(data.price), String(data.quantity)];
          return prev ? [entry, ...prev].slice(0, 30) : [entry];
        });
      },
      `TRADE-${market}`
    );

    instance.sendMessage({ method: "SUBSCRIBE", params: [`depth.200ms.${market}`] });
    instance.sendMessage({ method: "SUBSCRIBE", params: [`trade.${market}`] });

    getDepth(market).then((d) => { setBids(d.bids); setAsks(d.asks); }).catch(() => {});
    getTicker(market).then((t) => setPrice(t?.lastPrice ?? "")).catch(() => {});
    getTrades(market).then((t) => { if (t?.[0]) setPrice(t[0].price); }).catch(() => {});

    return () => {
      instance.sendMessage({ method: "UNSUBSCRIBE", params: [`depth.200ms.${market}`] });
      instance.sendMessage({ method: "UNSUBSCRIBE", params: [`trade.${market}`] });
      instance.deRegisterCallback("depth", `DEPTH-${market}`);
      instance.deRegisterCallback("trade", `TRADE-${market}`);
    };
  }, [market]);

  return (
    <Surface className={cn("flex flex-col overflow-hidden", className)}>
      <SurfaceHeader>
        <Segmented
          aria-label="Order book view"
          onValueChange={setActiveTab}
          options={[
            { value: "book", label: "Order book" },
            { value: "trades", label: "Trades" },
          ]}
          size="sm"
          value={activeTab}
        />
      </SurfaceHeader>

      {/* ORDER BOOK */}
      {activeTab === "book" && (
        <div className="flex flex-1 flex-col">
          <div className="grid grid-cols-3 px-5 pb-2">
            <SectionLabel>Price</SectionLabel>
            <SectionLabel className="text-right">Size</SectionLabel>
            <SectionLabel className="text-right">Total</SectionLabel>
          </div>

          {/* Asks: best ask hugs the spread row */}
          <AskTable asks={sortedAsks} />

          {/* Last price + spread */}
          <div className="my-1 flex items-center justify-between gap-3 border-hairline border-y px-5 py-3">
            <div className={cn("flex items-center gap-1.5", priceUp ? "text-buy" : "text-sell")}>
              <span className="num font-runde font-semibold text-2xl leading-none tracking-tight">
                {price
                  ? parseFloat(price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                  : "—"}
              </span>
              {priceUp
                ? <ArrowUp className="size-3.5" strokeWidth={2} />
                : <ArrowDown className="size-3.5" strokeWidth={2} />}
            </div>
            {spread && (
              <div className="flex flex-col items-end gap-1 leading-none">
                <SectionLabel className="text-[10px]">Spread</SectionLabel>
                <span className="num text-foreground/60 text-xs">
                  {spread} <span className="text-foreground/30">({spreadPct}%)</span>
                </span>
              </div>
            )}
          </div>

          <BidTable bids={sortedBids} />

          {/* Bid / ask balance */}
          <div className="mt-auto flex items-center gap-3 px-5 pt-4 pb-5">
            <span className="num w-11 text-buy text-xs">{bidPct.toFixed(1)}%</span>
            <div className="flex h-1.5 flex-1 gap-0.5 overflow-hidden rounded-full">
              <motion.div
                animate={{ width: `${bidPct}%` }}
                className="h-full rounded-full bg-buy/50"
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
              <motion.div
                animate={{ width: `${askPct}%` }}
                className="h-full rounded-full bg-sell/50"
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
            <span className="num w-11 text-right text-sell text-xs">{askPct.toFixed(1)}%</span>
          </div>
        </div>
      )}

      {/* TRADES */}
      {activeTab === "trades" && (
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex justify-between px-5 pb-2">
            <SectionLabel>Price</SectionLabel>
            <SectionLabel>Qty</SectionLabel>
          </div>
          {trade?.length ? (
            <div className="no-scrollbar max-h-[600px] flex-1 overflow-y-auto pb-3">
              <AnimatePresence initial={false}>
                {trade.map(([tradePrice, qty], i, arr) => {
                  const isUp = parseFloat(tradePrice) >= parseFloat(arr[i + 1]?.[0] ?? tradePrice);
                  return (
                    <motion.div
                      animate={{ opacity: 1, y: 0 }}
                      className="num flex h-6 items-center justify-between px-5 text-[13px] transition-colors duration-150 hover:bg-foreground/[0.03]"
                      exit={{ opacity: 0 }}
                      initial={{ opacity: 0, y: -4 }}
                      key={`${tradePrice}-${i}`}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                    >
                      <span className={cn("flex items-center gap-1.5", isUp ? "text-buy" : "text-sell")}>
                        {isUp ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />}
                        {parseFloat(tradePrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                      <span className="text-foreground/50">{parseFloat(qty).toFixed(4)}</span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 px-5 py-16 text-center">
              <span className="size-1.5 animate-pulse-dot rounded-full bg-foreground/40 text-foreground/40" />
              <p className="text-foreground/40 text-sm">Waiting for the next trade</p>
            </div>
          )}
        </div>
      )}
    </Surface>
  );
}
