"use client";

import {
  ArrowDownRightIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  FlameIcon,
  SearchIcon,
  SearchXIcon,
  SparklesIcon,
  StarIcon,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Sparkline } from "@/components/charts/sparkline";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  SectionLabel,
  Surface,
  SurfaceHeader,
  SurfaceTitle,
} from "@/components/ui/panel";
import { ChipButton, Pill } from "@/components/ui/pill";
import { Segmented } from "@/components/ui/segmented";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TokenIcon } from "@/components/ui/token-icon";
import { EASE_OUT_QUINT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { HeroDemo } from "../components/hero/HeroDemo";
import { CombineData, CombinedCryptoData } from "../utils/combine-data";

export interface CurrencyData {
  price: number;
  market_cap: number;
  price_change_percentage_24hr: number;
  volume: number;
}

export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: null | number;
  last_updated: string;
  price_change_percentage_24h_in_currency: number;
  currencies: {
    cad: CurrencyData;
    cny: CurrencyData;
    eur: CurrencyData;
    gbp: CurrencyData;
    jpy: CurrencyData;
    usd: CurrencyData;
  };
}

export interface LineCryptoDataPoint {
  close: string;
  end: string;
}

export interface LineCryptoData {
  data: LineCryptoDataPoint[];
  symbol: string;
}

const FAVORITES_KEY = "exchange:favorites";

export default function Component() {
  const [data, setData] = useState<CombinedCryptoData[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = (await CombineData()) ?? null;
        setData(res);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getNewListings = (data: CryptoData[]): CryptoData[] =>
    [...data].sort((a, b) => new Date(b.last_updated).getTime() - new Date(a.last_updated).getTime()).slice(0, 5);

  const getTopGainers = (data: CryptoData[]): CryptoData[] =>
    data.filter((coin) => !Number.isNaN(coin.price_change_percentage_24h))
      .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
      .slice(0, 5);

  const getPopularCoins = (data: CryptoData[]): CryptoData[] => {
    const popularSymbols = ["SOL", "ETH", "BTC", "WEN", "DRIFT"];
    return data
      .filter((coin) => popularSymbols.includes(coin.symbol.toUpperCase()))
      .sort((a, b) => popularSymbols.indexOf(a.symbol.toUpperCase()) - popularSymbols.indexOf(b.symbol.toUpperCase()));
  };

  const panels = data
    ? [
        { label: "New listings", icon: <SparklesIcon />, items: getNewListings(data) },
        { label: "Top gainers", icon: <FlameIcon />, items: getTopGainers(data) },
        { label: "Popular", icon: <StarIcon />, items: getPopularCoins(data) },
      ]
    : null;

  return (
    <div className="hero-glow @container flex flex-1 flex-col gap-6 overflow-hidden rounded-[inherit] p-4 sm:gap-12 sm:p-5 md:p-8 xl:p-10">
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="grid items-center gap-x-12 gap-y-8 pt-14 sm:gap-y-10 sm:pt-12 @5xl:grid-cols-[minmax(0,1fr)_minmax(0,600px)] @5xl:pt-14">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-start gap-5 sm:gap-6"
          initial={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.5, ease: EASE_OUT_QUINT }}
        >
          <Pill dot live tone="buy">
            Live markets
          </Pill>
          <h1 className="text-balance font-bold font-runde text-[2rem] text-heading tracking-tight max-sm:leading-[1.1] sm:text-5xl md:text-6xl">
            Trade crypto, without limits.
          </h1>
          <p className="max-w-[46ch] text-muted-foreground">
            Real-time order books, limit and market orders, deep liquidity.
            Built for traders who demand precision.
          </p>
          <div className="flex w-full flex-col gap-3 pt-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
            <Button className="max-sm:w-full" render={<Link href="/trade/TATA_INR" />} size="lg">
              Start trading
              <ArrowRightIcon />
            </Button>
            <Button className="max-sm:w-full" render={<a href="#markets" />} size="lg" variant="secondary">
              View markets
            </Button>
          </div>
        </motion.div>

        <HeroDemo />
      </section>

      {/* ── STATS ────────────────────────────────────────────── */}
      <section className="grid grid-cols-2 gap-3 sm:gap-4 @4xl:grid-cols-4">
        {[
          { label: "24h volume", value: "$84.2B", delta: "+6.4%", up: true },
          { label: "Market cap", value: "$2.41T", delta: "+2.1%", up: true },
          { label: "Active markets", value: "1,248", delta: "Live", up: true },
          { label: "BTC dominance", value: "52.3%", delta: "-0.4%", up: false },
        ].map(({ label, value, delta, up }) => (
          <Surface className="flex flex-col gap-3 p-4 sm:p-5" key={label}>
            <SectionLabel>{label}</SectionLabel>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <span className="font-runde font-semibold text-2xl text-heading tabular-nums tracking-tight sm:text-3xl">
                {value}
              </span>
              <span className={cn("num text-xs", up ? "text-buy" : "text-sell")}>{delta}</span>
            </div>
          </Surface>
        ))}
      </section>

      {/* ── FEATURED MARKET ──────────────────────────────────── */}
      <Link
        className="group rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        href="/trade/TATA_INR"
      >
        <Surface className="flex items-center justify-between gap-4 p-4 transition-colors sm:p-5 duration-150 ease-out group-hover:bg-surface-hover group-active:scale-[0.995]">
          <div className="flex min-w-0 items-center gap-4">
            <TokenIcon size={44} src="/TATA.png" symbol="TATA" />
            <div className="flex min-w-0 flex-col gap-1.5">
              <div className="flex items-center gap-2.5">
                <span className="font-runde font-semibold text-heading text-lg leading-none tracking-tight">
                  TATA / INR
                </span>
                <Pill dot live size="sm" tone="buy">
                  Live
                </Pill>
              </div>
              <p className="truncate text-foreground/50 text-sm leading-none">
                The in-house order book. Place real limit orders against the matching engine.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-8">
            <div className="hidden flex-col items-end gap-1.5 sm:flex">
              <SectionLabel>24h change</SectionLabel>
              <span className="num text-[15px] text-buy leading-none">+12.5%</span>
            </div>
            <span className="border-apple flex size-10 items-center justify-center rounded-full bg-surface-hover text-foreground/80 transition-[color,translate] duration-200 ease-out group-hover:translate-x-0.5 group-hover:text-heading">
              <ArrowRightIcon className="size-[18px]" strokeWidth={1.5} />
            </span>
          </div>
        </Surface>
      </Link>

      {/* ── THREE LISTS ──────────────────────────────────────── */}
      <section className="grid gap-3 sm:gap-4 @3xl:grid-cols-2 @6xl:grid-cols-3">
        {(panels ?? PANEL_PLACEHOLDERS).map(({ label, icon, items }) => (
          <Surface className="flex flex-col" key={label}>
            <SurfaceHeader>
              <SurfaceTitle className="flex items-center gap-2.5 [&_svg]:size-4 [&_svg]:stroke-[1.5] [&_svg]:text-foreground/50">
                {icon}
                {label}
              </SurfaceTitle>
            </SurfaceHeader>
            <div className="px-2 pb-2">
              {items ? <CryptoList items={items} /> : <CryptoListSkeleton />}
            </div>
          </Surface>
        ))}
      </section>

      {/* ── ALL MARKETS ──────────────────────────────────────── */}
      <CryptoTable data={data} />
    </div>
  );
}

const PANEL_PLACEHOLDERS: { label: string; icon: React.ReactNode; items: CryptoData[] | null }[] = [
  { label: "New listings", icon: <SparklesIcon />, items: null },
  { label: "Top gainers", icon: <FlameIcon />, items: null },
  { label: "Popular", icon: <StarIcon />, items: null },
];

// ── UTILS ──────────────────────────────────────────────────────────────────────

const formatPercentage = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "percent", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value / 100);

// Sub-cent tokens would all read "$0.00" at two decimals.
function formatPrice(value: number) {
  const digits = value >= 1 ? 2 : value >= 0.01 ? 4 : 8;
  return value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: digits });
}

function formatNumber(value: number) {
  if (value >= 1e12) return (value / 1e12).toFixed(2) + "T";
  if (value >= 1e9)  return (value / 1e9).toFixed(2) + "B";
  if (value >= 1e6)  return (value / 1e6).toFixed(2) + "M";
  if (value >= 1e3)  return (value / 1e3).toFixed(2) + "K";
  return value;
}

function Change({ value, className }: { value: number; className?: string }) {
  const up = value >= 0;
  const Arrow = up ? ArrowUpRightIcon : ArrowDownRightIcon;
  return (
    <span className={cn("num inline-flex items-center justify-end gap-1", up ? "text-buy" : "text-sell", className)}>
      <Arrow className="size-3.5" strokeWidth={1.75} />
      {formatPercentage(Math.abs(value))}
    </span>
  );
}

// ── CRYPTO LIST ────────────────────────────────────────────────────────────────

function CryptoList({ items }: { items: CryptoData[] }) {
  return (
    <ul className="flex flex-col">
      {items.map((crypto, index) => (
        <motion.li
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 4 }}
          key={crypto.id}
          transition={{ duration: 0.25, delay: index * 0.04, ease: EASE_OUT_QUINT }}
        >
          <Link
            className="flex min-h-12 items-center justify-between gap-3 rounded-xl px-2 py-2.5 outline-none sm:px-3 transition-colors duration-150 ease-out hover:bg-foreground/[0.04] focus-visible:ring-2 focus-visible:ring-ring/50 active:bg-foreground/[0.06]"
            href={`/trade/${crypto.symbol.toUpperCase()}_USDC`}
          >
            <span className="flex min-w-0 items-center gap-3">
              <TokenIcon size={32} src={crypto.image} symbol={crypto.symbol} />
              <span className="flex min-w-0 flex-col gap-1.5">
                <span className="font-medium text-heading text-sm uppercase leading-none">{crypto.symbol}</span>
                <span className="truncate text-foreground/40 text-xs leading-none">{crypto.name}</span>
              </span>
            </span>
            <span className="flex flex-col items-end gap-1.5">
              <span className="num text-heading text-sm leading-none">${formatPrice(crypto.current_price)}</span>
              <Change className="text-xs leading-none" value={crypto.price_change_percentage_24h} />
            </span>
          </Link>
        </motion.li>
      ))}
    </ul>
  );
}

function CryptoListSkeleton() {
  return (
    <ul className="flex flex-col">
      {[0, 1, 2, 3, 4].map((i) => (
        <li className="flex items-center justify-between gap-3 px-3 py-2.5" key={i}>
          <span className="flex items-center gap-3">
            <Skeleton className="size-8 rounded-full" />
            <span className="flex flex-col gap-1.5">
              <Skeleton className="h-3.5 w-12" />
              <Skeleton className="h-3 w-20" />
            </span>
          </span>
          <span className="flex flex-col items-end gap-1.5">
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-3 w-12" />
          </span>
        </li>
      ))}
    </ul>
  );
}

// ── CRYPTO TABLE ──────────────────────────────────────────────────────────────

interface CryptoTableRowProps {
  name: string;
  image: string;
  symbol: string;
  price: number;
  marketCap: number;
  volume: number;
  change: number;
  klineData: LineCryptoDataPoint[] | undefined;
  favorite: boolean;
  onToggleFavorite: () => void;
}

function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(FAVORITES_KEY) ?? "[]");
      if (Array.isArray(stored)) setFavorites(stored);
    } catch {
      /* storage blocked or malformed: start empty */
    }
  }, []);
  const toggle = (symbol: string) =>
    setFavorites((current) => {
      const next = current.includes(symbol) ? current.filter((s) => s !== symbol) : [...current, symbol];
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  return { favorites, toggle };
}

type SortKey = "cap" | "gainers" | "losers" | "volume" | "price";

const SORTS: { key: SortKey; label: string; pick: (item: CombinedCryptoData) => number }[] = [
  { key: "cap", label: "Market cap", pick: (item) => item.market_cap },
  { key: "gainers", label: "Top gainers", pick: (item) => item.price_change_percentage_24h },
  { key: "losers", label: "Top losers", pick: (item) => -item.price_change_percentage_24h },
  { key: "volume", label: "Volume", pick: (item) => item.total_volume },
  { key: "price", label: "Price", pick: (item) => item.current_price },
];

function CryptoTable({ data }: { data: CombinedCryptoData[] | null }) {
  const [view, setView] = useState<"spot" | "favorites">("spot");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("cap");
  const { favorites, toggle } = useFavorites();

  const rows = useMemo(() => {
    if (!data) return null;
    return [...data]
      .sort((a, b) => b.market_cap - a.market_cap)
      .slice(0, -5)
      .filter((item) => !item.symbol.toLowerCase().includes("usdc"));
  }, [data]);

  const visible = useMemo(() => {
    if (!rows) return null;
    const q = query.trim().toLowerCase();
    const filtered = rows.filter(
      (item) =>
        (view === "spot" || favorites.includes(item.symbol)) &&
        (q === "" || item.name.toLowerCase().includes(q) || item.symbol.toLowerCase().includes(q)),
    );
    // "cap" is the order the rows already come in.
    if (sort === "cap") return filtered;
    const pick = SORTS.find((s) => s.key === sort)!.pick;
    return [...filtered].sort((a, b) => (pick(b) || 0) - (pick(a) || 0));
  }, [rows, query, view, favorites, sort]);

  return (
    <Surface className="scroll-mt-6 overflow-hidden" id="markets">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 px-4 pt-5 pb-4 sm:px-6 sm:pt-6 sm:pb-5">
        <div className="flex flex-col gap-1.5">
          <h2 className="font-bold font-runde text-xl text-heading tracking-tight sm:text-3xl">
            All markets
          </h2>
          <p className="text-foreground/50 text-sm">
            {rows ? `${rows.length} spot pairs, priced in USDC` : "Loading pairs…"}
          </p>
        </div>
        <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
          <InputGroup className="w-full sm:w-64" data-surface="nested">
            <InputGroupAddon>
              <SearchIcon className="size-4 text-foreground/40" strokeWidth={1.5} />
            </InputGroupAddon>
            <InputGroupInput
              aria-label="Search markets"
              className="font-sans"
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search markets"
              type="search"
              value={query}
            />
          </InputGroup>
          <Segmented
            aria-label="Market list"
            className="max-sm:flex max-sm:w-full max-sm:*:flex-1"
            onValueChange={setView}
            options={[
              { value: "spot", label: "Spot" },
              { value: "favorites", label: "Favorites" },
            ]}
            value={view}
          />
        </div>
      </div>

      {/* Phones: sort chips in a sideways scroller, then a tappable list */}
      <div className="relative sm:hidden">
        <div
          aria-label="Sort markets"
          className="no-scrollbar flex snap-x gap-2 overflow-x-auto px-4 pb-3 [mask-image:linear-gradient(to_right,#000_calc(100%-40px),transparent)]"
          role="group"
        >
          {SORTS.map(({ key, label }) => (
            <ChipButton
              active={sort === key}
              className="h-8 shrink-0 snap-start px-3.5 text-[13px] last:me-8"
              key={key}
              onClick={() => setSort(key)}
            >
              {label}
            </ChipButton>
          ))}
        </div>
      </div>

      <ul className="sm:hidden">
        {visible
          ? visible.map((item) => {
              const favorite = favorites.includes(item.symbol);
              const change = item.price_change_percentage_24h ?? 0;
              return (
                <li className="relative flex min-h-14 items-center border-hairline border-t" key={item.id}>
                  <button
                    aria-label={favorite ? `Remove ${item.name} from favorites` : `Add ${item.name} to favorites`}
                    aria-pressed={favorite}
                    className={cn(
                      "z-10 inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full outline-none transition-[color,scale] duration-150 ease-out focus-visible:ring-2 focus-visible:ring-ring/50 active:scale-90",
                      favorite ? "text-brand" : "text-foreground/25",
                    )}
                    onClick={() => toggle(item.symbol)}
                    type="button"
                  >
                    <StarIcon className="size-4" fill={favorite ? "currentColor" : "none"} strokeWidth={1.5} />
                  </button>
                  {/* The link stretches over the whole row; the star sits above it */}
                  <Link
                    className="flex min-w-0 flex-1 items-center justify-between gap-3 py-2.5 pe-4 outline-none after:absolute after:inset-0 focus-visible:after:ring-2 focus-visible:after:ring-ring/50 focus-visible:after:ring-inset active:after:bg-foreground/[0.04]"
                    href={`/trade/${item.symbol.toUpperCase()}_USDC`}
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <TokenIcon size={36} src={item.image} symbol={item.symbol} />
                      <span className="flex min-w-0 flex-col gap-1.5">
                        <span className="truncate font-medium text-heading leading-none">{item.name}</span>
                        <span className="num truncate text-foreground/40 text-xs leading-none">
                          <span className="font-sans uppercase">{item.symbol}</span> · Vol ${formatNumber(item.total_volume)}
                        </span>
                      </span>
                    </span>
                    <span className="flex shrink-0 flex-col items-end gap-1.5">
                      <span className="num text-heading text-sm leading-none">${formatPrice(item.current_price)}</span>
                      <Pill className="num" size="sm" tone={change >= 0 ? "buy" : "sell"}>
                        {change >= 0 ? "+" : "-"}
                        {formatPercentage(Math.abs(change))}
                      </Pill>
                    </span>
                  </Link>
                </li>
              );
            })
          : Array.from({ length: 8 }, (_, i) => (
              <li className="flex min-h-14 items-center justify-between gap-3 border-hairline border-t px-4" key={i}>
                <span className="flex items-center gap-3">
                  <Skeleton className="size-9 rounded-full" />
                  <span className="flex flex-col gap-1.5">
                    <Skeleton className="h-3.5 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </span>
                </span>
                <span className="flex flex-col items-end gap-1.5">
                  <Skeleton className="h-3.5 w-20" />
                  <Skeleton className="h-4 w-14 rounded-full" />
                </span>
              </li>
            ))}
      </ul>

      <div className="max-sm:hidden">
      <Table className="sm:min-w-[640px]">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right max-md:hidden">Market cap</TableHead>
            <TableHead className="text-right max-md:hidden">24h volume</TableHead>
            <TableHead className="text-right max-[420px]:hidden">24h change</TableHead>
            <TableHead className="w-40 text-right max-sm:hidden">7 days</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {visible
            ? visible.map((item) => (
                <CryptoTableRow
                  change={item.price_change_percentage_24h}
                  favorite={favorites.includes(item.symbol)}
                  image={item.image}
                  key={item.id}
                  klineData={item.KlineData}
                  marketCap={item.market_cap}
                  name={item.name}
                  onToggleFavorite={() => toggle(item.symbol)}
                  price={item.current_price}
                  symbol={item.symbol}
                  volume={item.total_volume}
                />
              ))
            : Array.from({ length: 8 }, (_, i) => (
                <TableRow className="hover:bg-transparent" key={i}>
                  <TableCell>
                    <span className="flex items-center gap-3">
                      <Skeleton className="size-9 rounded-full" />
                      <span className="flex flex-col gap-1.5">
                        <Skeleton className="h-3.5 w-24" />
                        <Skeleton className="h-3 w-10" />
                      </span>
                    </span>
                  </TableCell>
                  <TableCell><Skeleton className="ms-auto h-3.5 w-20" /></TableCell>
                  <TableCell className="max-md:hidden"><Skeleton className="ms-auto h-3.5 w-16" /></TableCell>
                  <TableCell className="max-md:hidden"><Skeleton className="ms-auto h-3.5 w-16" /></TableCell>
                  <TableCell className="max-[420px]:hidden"><Skeleton className="ms-auto h-3.5 w-14" /></TableCell>
                  <TableCell className="max-sm:hidden"><Skeleton className="ms-auto h-8 w-28" /></TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
      </div>

      {visible && visible.length === 0 ? (
        <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
          <span className="border-apple flex size-10 items-center justify-center rounded-xl bg-surface-hover text-foreground/50">
            {view === "favorites" && query === "" ? (
              <StarIcon className="size-[18px]" strokeWidth={1.5} />
            ) : (
              <SearchXIcon className="size-[18px]" strokeWidth={1.5} />
            )}
          </span>
          <div className="flex flex-col gap-1">
            <p className="font-medium text-foreground/80 text-sm">
              {view === "favorites" && query === "" ? "No favorites yet" : "No markets match"}
            </p>
            <p className="text-foreground/40 text-sm">
              {view === "favorites" && query === ""
                ? "Star a market and it will be kept here."
                : "Try a different name or symbol."}
            </p>
          </div>
        </div>
      ) : null}
    </Surface>
  );
}

function CryptoTableRow({ name, image, symbol, price, marketCap, volume, change, klineData, favorite, onToggleFavorite }: CryptoTableRowProps) {
  const router = useRouter();
  const up = change > 0;
  const href = `/trade/${symbol.toUpperCase()}_USDC`;
  const series = useMemo(() => (klineData ?? []).map((point) => parseFloat(point.close)), [klineData]);

  return (
    <TableRow className="group cursor-pointer" onClick={() => router.push(href)}>
      <TableCell>
        <span className="flex items-center gap-3">
          <button
            aria-label={favorite ? `Remove ${name} from favorites` : `Add ${name} to favorites`}
            aria-pressed={favorite}
            className={cn(
              "tap-target -ms-2 inline-flex size-7 cursor-pointer items-center justify-center rounded-full outline-none transition-[color,scale,opacity] duration-150 ease-out hover:text-heading focus-visible:ring-2 focus-visible:ring-ring/50 active:scale-90",
              favorite ? "text-brand" : "text-foreground/25",
            )}
            onClick={(event) => {
              event.stopPropagation();
              onToggleFavorite();
            }}
            type="button"
          >
            <StarIcon className="size-4" fill={favorite ? "currentColor" : "none"} strokeWidth={1.5} />
          </button>
          <TokenIcon size={36} src={image} symbol={symbol} />
          <span className="flex flex-col gap-1.5">
            <Link
              className="tap-target rounded-sm font-medium text-heading leading-none outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              href={href}
              onClick={(event) => event.stopPropagation()}
            >
              {name}
            </Link>
            <span className="text-foreground/40 text-xs uppercase leading-none">{symbol}</span>
          </span>
        </span>
      </TableCell>
      <TableCell className="num text-right text-heading">
        ${formatPrice(price)}
      </TableCell>
      <TableCell className="num text-right text-foreground/60 max-md:hidden">${formatNumber(marketCap)}</TableCell>
      <TableCell className="num text-right text-foreground/60 max-md:hidden">${formatNumber(volume)}</TableCell>
      <TableCell className="text-right max-[420px]:hidden">
        <Change value={change ?? 0} />
      </TableCell>
      <TableCell className="max-sm:hidden">
        <div className={cn("ms-auto w-28", up ? "text-buy" : "text-sell")}>
          {series.length > 1 ? (
            <Sparkline data={series} height={32} label={`${name}, last 7 days`} />
          ) : (
            <span aria-hidden="true" className="block h-8" />
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}
