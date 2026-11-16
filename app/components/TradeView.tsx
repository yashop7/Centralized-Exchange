"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";
import { Pill } from "@/components/ui/pill";
import { Surface, SurfaceHeader, SurfaceTitle } from "@/components/ui/panel";
import { cn } from "@/lib/utils";
import { useShell } from "./shell/ShellContext";
import { ChartManager } from "../utils/ChartManager";
import { getKlines, RateLimitError } from "../utils/httpClient";
import { KLine } from "../utils/types";
import { toast } from "@/hooks/use-toast";

function generateDummyKlines(count = 120, basePrice = 1000): { open: number; high: number; low: number; close: number; timestamp: Date }[] {
  const now = Date.now();
  const intervalMs = 60 * 60 * 1000; // 1h
  let price = basePrice;
  const candles = [];

  for (let i = count; i >= 0; i--) {
    const open = price;
    const change = (Math.random() - 0.485) * price * 0.012;
    const close = Math.max(open + change, 1);
    const wick = price * (0.003 + Math.random() * 0.008);
    const high = Math.max(open, close) + wick;
    const low = Math.min(open, close) - wick;
    candles.push({ open: +open.toFixed(2), high: +high.toFixed(2), low: +low.toFixed(2), close: +close.toFixed(2), timestamp: new Date(now - i * intervalMs) });
    price = close;
  }
  return candles;
}

function readChartTheme() {
  const root = getComputedStyle(document.documentElement);
  const read = (name: string) => root.getPropertyValue(name).trim();
  return {
    color: read("--chart-text"),
    grid: read("--chart-grid"),
    crosshair: read("--subtle"),
    accent: read("--brand"),
    up: read("--buy"),
    down: read("--sell"),
    fontFamily: `${getComputedStyle(document.body).getPropertyValue("--font-geist-mono").trim()}, ui-monospace, monospace`,
  };
}

export function TradeView({
  market,
  className,
}: {
  market: string;
  className?: string;
}) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartManagerRef = useRef<ChartManager>(null);
  const { resolvedTheme } = useTheme();
  const { setFullscreenTarget } = useShell();

  // Offer the chart to the toolbar's fullscreen button while this page is up.
  useEffect(() => {
    setFullscreenTarget(
      chartRef.current?.closest<HTMLElement>('[data-slot="surface"]') ?? null
    );
    return () => setFullscreenTarget(null);
  }, [setFullscreenTarget]);

  useEffect(() => {
    const init = async () => {
      let data: { open: number; high: number; low: number; close: number; timestamp: Date }[] = [];

      try {
        const klineData: KLine[] = await getKlines(
          market,
          "1h",
          Math.floor((Date.now() - 1000 * 60 * 60 * 24 * 10) / 1000),
          Math.floor(Date.now() / 1000)
        );
        if (klineData?.length) {
          data = klineData
            .map((x) => ({
              close: parseFloat(x.close),
              high: parseFloat(x.high),
              low: parseFloat(x.low),
              open: parseFloat(x.open),
              timestamp: new Date(x.end),
            }))
            .sort((a, b) => (a.timestamp < b.timestamp ? -1 : 1));
        }
      } catch (err) {
        if (err instanceof RateLimitError) {
          toast({ variant: "destructive", title: "Chart rate limit", description: err.message, duration: 5000 });
        }
      }

      if (!data.length) {
        data = generateDummyKlines(120);
      }

      if (chartRef.current) {
        chartManagerRef.current?.destroy();
        // @ts-ignore
        chartManagerRef.current = new ChartManager(
          chartRef.current,
          data,
          readChartTheme()
        );
      }
    };

    init();
  }, [market, chartRef, resolvedTheme]);

  return (
    <Surface
      className={cn("flex min-h-[380px] flex-col overflow-hidden", className)}
    >
      <SurfaceHeader>
        <SurfaceTitle>Price</SurfaceTitle>
        <div className="flex items-center gap-2">
          <Pill>1H candles</Pill>
          <Pill>10D</Pill>
        </div>
      </SurfaceHeader>
      <div className="min-h-0 flex-1 px-2 pb-2">
        <div className="size-full" ref={chartRef} />
      </div>
    </Surface>
  );
}
