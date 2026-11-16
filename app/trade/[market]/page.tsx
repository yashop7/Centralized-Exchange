"use client";
import { MarketBar } from "@/app/components/MarketBar";
import { MobileTradeBar } from "@/app/components/MobileTradeBar";
import { OrderTable } from "@/app/components/OrderTable";
import { SwapUI } from "@/app/components/SwapUI";
import { TradeView } from "@/app/components/TradeView";
import { Depth } from "@/app/components/depth/Depth";
import { BASE_URL } from "@/app/utils/httpClient";
import { Segmented } from "@/components/ui/segmented";
import { cn } from "@/lib/utils";
import axios from "axios";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export interface Order {
  price: number;
  quantity: number;
  orderId: string;
  filled: number;
  side: "buy" | "sell";
  userId: string;
}

export default function Page() {
  const pathname = usePathname();
  const segments = pathname.split("/");
  const market = segments[segments.length - 1];
  const [balance, setBalance] = useState("");
  const [inr, setInr] = useState("");
  const [openOrders, setOpenOrders] = useState<Order[]>([]);
  // Phones show one of chart / book / trades at a time. Layout only.
  const [mobileView, setMobileView] = useState<"chart" | "book" | "trades">("chart");

  useEffect(() => {
    async function fetchBalance() {
      try {
        const response = await axios.get(`${BASE_URL}/order/balance`, {
          params: { userId: "1", market: "TATA_INR" },
        });
        setOpenOrders(response.data.openOrders);
        setBalance(response.data.balance);
        setInr(response.data.inr);
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    }
    fetchBalance();
    setInterval(() => { fetchBalance(); }, 1000 * 10);
  }, []);

  return (
    <div className="hero-glow @container flex flex-1 flex-col gap-6 rounded-[inherit] p-4 max-sm:pb-[calc(6rem+env(safe-area-inset-bottom))] sm:gap-8 sm:p-5 md:p-8 xl:p-10">
      <MarketBar market={market as string} />

      <div className="flex flex-col gap-3">
        <Segmented
          aria-label="Market view"
          className="sm:hidden"
          fill
          onValueChange={setMobileView}
          options={[
            { value: "chart", label: "Chart" },
            { value: "book", label: "Book" },
            { value: "trades", label: "Trades" },
          ]}
          value={mobileView}
        />

        {/* Chart · order book · order form.
            Phone: one pane at a time, the form lives in the bottom sheet.
            Tablet: chart and book side by side, form below.
            Desktop: columns follow the card's own width. */}
        <div className="grid gap-3 sm:gap-4 sm:max-lg:grid-cols-2 @3xl:grid-cols-2 @6xl:grid-cols-[minmax(0,1fr)_300px_320px]">
          <TradeView
            className={cn(
              "h-[45dvh] min-h-[300px] sm:h-[420px] sm:min-h-[380px] sm:max-lg:col-span-1! sm:max-lg:h-auto! @3xl:col-span-2 @6xl:col-span-1 @6xl:h-auto",
              mobileView !== "chart" && "max-sm:hidden",
            )}
            market={market as string}
          />
          <Depth
            className={mobileView === "chart" ? "max-sm:hidden" : undefined}
            market={market as string}
            mobileView={mobileView === "trades" ? "trades" : "book"}
          />
          <SwapUI
            balance={balance}
            className="max-sm:hidden sm:max-lg:col-span-2"
            inr={inr}
            market={market as string}
          />
        </div>
      </div>

      <OrderTable balance={balance} inr={inr} openOrders={openOrders} />

      <MobileTradeBar balance={balance} inr={inr} market={market as string} />
    </div>
  );
}
