"use client";
import { ArrowDownRightIcon, ArrowUpRightIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { NumberTicker } from "@/components/motion/number-ticker";
import { SectionLabel } from "@/components/ui/panel";
import { Pill } from "@/components/ui/pill";
import { TokenPair } from "@/components/ui/token-icon";
import { cn } from "@/lib/utils";
import { Ticker } from "../utils/types";
import { getAllInfo, getTicker } from "../utils/httpClient";
import { SignalingManager } from "../utils/SignalingManager";

export const MarketBar = ({ market }: { market: string }) => {
  const [ticker, setTicker] = useState<Ticker | null>(null);
  const [tokenImage, settokenImage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchImage() {
      const data = await getAllInfo();
      const image = data?.find((d: any) => d.symbol.toLowerCase() === market.split("_")[0].toLowerCase())?.image;
      settokenImage(image);
    }
    fetchImage();
  }, [market]);

  useEffect(() => {
    getTicker(market).then(setTicker);
    SignalingManager.getInstance(market).registerCallback(
      "ticker",
      (data: Partial<Ticker>) =>
        setTicker((prevTicker) => ({
          firstPrice: data?.firstPrice ?? prevTicker?.firstPrice ?? "",
          high: data?.high ?? prevTicker?.high ?? "",
          lastPrice: data?.lastPrice ?? prevTicker?.lastPrice ?? "",
          low: data?.low ?? prevTicker?.low ?? "",
          priceChange: data?.priceChange ?? prevTicker?.priceChange ?? "",
          priceChangePercent: data?.priceChangePercent ?? prevTicker?.priceChangePercent ?? "",
          quoteVolume: data?.quoteVolume ?? prevTicker?.quoteVolume ?? "",
          symbol: data?.symbol ?? prevTicker?.symbol ?? "",
          trades: data?.trades ?? prevTicker?.trades ?? "",
          volume: data?.volume ?? prevTicker?.volume ?? "",
        })),
      `TICKER-${market}`
    );
    SignalingManager.getInstance(market).sendMessage({ method: "SUBSCRIBE", params: [`ticker.${market}`] });

    return () => {
      SignalingManager.getInstance(market).deRegisterCallback("ticker", `TICKER-${market}`);
      SignalingManager.getInstance(market).sendMessage({ method: "UNSUBSCRIBE", params: [`ticker.${market}`] });
    };
  }, [market]);

  const fmt = (num: string | undefined) =>
    parseFloat(num ?? "0").toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const isPositive = Number(ticker?.priceChange) >= 0;
  const [base, quote] = market.split("_");
  const lastPrice = parseFloat(ticker?.lastPrice ?? "0") || 0;
  // The feed reports the change as a fraction (0.0123 = 1.23%).
  const changePercent = Number(ticker?.priceChangePercent ?? 0) * 100;
  const Arrow = isPositive ? ArrowUpRightIcon : ArrowDownRightIcon;

  return (
    <header className="flex flex-col gap-5 sm:gap-8">
      {/* Market name. The right padding keeps it clear of the toolbar pill. */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-3 pt-13 sm:gap-x-5 sm:pt-0 sm:pe-72">
        {[32, 44].map((size) => (
          <span className={size === 32 ? "flex sm:hidden" : "hidden sm:flex"} key={size}>
            <TokenPair
              base={{
                src: market === "TATA_INR" ? "/TATA.png" : tokenImage || "/sol copy.webp",
                symbol: base,
              }}
              quote={{ src: "/usdc copy.webp", symbol: quote ?? "" }}
              size={size}
            />
          </span>
        ))}
        <h1 className="text-balance font-bold font-runde text-3xl text-heading tracking-tight sm:text-5xl md:text-6xl">
          {base}
          <span className="px-[0.18em] font-medium text-foreground/25">/</span>
          {quote}
        </h1>
      </div>

      <dl className="grid grid-cols-3 items-end gap-x-4 gap-y-4 sm:flex sm:flex-wrap sm:gap-x-10 sm:gap-y-5">
        <div className="col-span-3 flex flex-col gap-2">
          <dt>
            <SectionLabel>Last price</SectionLabel>
          </dt>
          <dd className="flex items-center gap-3">
            <NumberTicker
              className={cn(
                "font-runde font-semibold text-2xl tabular-nums tracking-tight transition-colors duration-300 sm:text-3xl",
                isPositive ? "text-buy" : "text-sell"
              )}
              decimals={2}
              duration={0.5}
              locale="en-US"
              startOnView={false}
              value={lastPrice}
            />
            <Pill tone={isPositive ? "buy" : "sell"}>
              <Arrow />
              <span className="num">
                {isPositive ? "+" : ""}
                {changePercent.toFixed(2)}%
              </span>
            </Pill>
          </dd>
        </div>

        <TickerStat
          label="24h change"
          value={
            <span className={isPositive ? "text-buy" : "text-sell"}>
              {isPositive ? "+" : ""}
              {fmt(ticker?.priceChange)}
            </span>
          }
        />
        <TickerStat label="24h high" value={fmt(ticker?.high)} />
        <TickerStat label="24h low" value={fmt(ticker?.low)} />
        <TickerStat className="max-sm:hidden" label="24h volume" value={fmt(ticker?.volume)} />
      </dl>
    </header>
  );
};

function TickerStat({ label, value, className = "" }: { label: string; value: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-2 pb-1", className)}>
      <dt>
        <SectionLabel>{label}</SectionLabel>
      </dt>
      <dd className="num truncate text-[15px] text-foreground leading-none">{value}</dd>
    </div>
  );
}
