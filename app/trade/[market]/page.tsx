"use client";
import { MarketBar } from "@/app/components/MarketBar";
import { OrderTable } from "@/app/components/OrderTable";
import { SwapUI } from "@/app/components/SwapUI";
import { TradeView } from "@/app/components/TradeView";
import { Depth } from "@/app/components/depth/Depth";
import { BASE_URL } from "@/app/utils/httpClient";
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
    <div className="hero-glow @container flex flex-1 flex-col gap-8 rounded-[inherit] p-5 md:p-8 xl:p-10">
      <MarketBar market={market as string} />

      {/* Chart · order book · order form. Columns follow the card's own width. */}
      <div className="grid gap-4 @3xl:grid-cols-2 @6xl:grid-cols-[minmax(0,1fr)_300px_320px]">
        <TradeView
          className="h-[420px] @3xl:col-span-2 @6xl:col-span-1 @6xl:h-auto"
          market={market as string}
        />
        <Depth market={market as string} />
        <SwapUI balance={balance} inr={inr} market={market as string} />
      </div>

      <OrderTable balance={balance} inr={inr} openOrders={openOrders} />
    </div>
  );
}
