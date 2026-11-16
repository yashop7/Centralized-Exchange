"use client";

import * as React from "react";
import { getTickers } from "@/app/utils/httpClient";
import type { Ticker } from "@/app/utils/types";

/** The in-house market. Always listed first. */
export const HOME_MARKET = "TATA_INR";

export interface NavMarket {
  symbol: string;
  base: string;
  quote: string;
  change: number | null;
}

export function splitMarket(symbol: string) {
  const [base, quote = ""] = symbol.split("_");
  return { base, quote };
}

export function marketLabel(symbol: string) {
  const { base, quote } = splitMarket(symbol);
  return quote ? `${base} / ${quote}` : base;
}

const FALLBACK = ["SOL_USDC", "BTC_USDC", "ETH_USDC"];

/** Sidebar / palette market list: the home market plus the most traded spot pairs. */
export function useNavMarkets(limit = 12): NavMarket[] {
  const [tickers, setTickers] = React.useState<Ticker[] | null>(null);

  React.useEffect(() => {
    let alive = true;
    const load = () =>
      getTickers().then((result) => {
        if (alive && Array.isArray(result)) setTickers(result);
      });
    load();
    const interval = setInterval(load, 30_000);
    return () => {
      alive = false;
      clearInterval(interval);
    };
  }, []);

  return React.useMemo(() => {
    const home: NavMarket = {
      symbol: HOME_MARKET,
      ...splitMarket(HOME_MARKET),
      change: null,
    };
    const rest: NavMarket[] = tickers
      ? tickers
          .filter(
            (ticker) =>
              ticker.symbol.endsWith("_USDC") && !ticker.symbol.includes("PERP"),
          )
          .sort((a, b) => Number(b.quoteVolume) - Number(a.quoteVolume))
          .slice(0, limit)
          .map((ticker) => ({
            symbol: ticker.symbol,
            ...splitMarket(ticker.symbol),
            change: Number(ticker.priceChangePercent) * 100,
          }))
      : FALLBACK.map((symbol) => ({
          symbol,
          ...splitMarket(symbol),
          change: null,
        }));
    return [home, ...rest];
  }, [tickers, limit]);
}
