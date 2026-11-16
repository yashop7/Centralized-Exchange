"use client";

import { ArrowDownIcon, ArrowUpIcon, InboxIcon } from "lucide-react";
import { Pill } from "@/components/ui/pill";
import { Surface } from "@/components/ui/panel";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs";
import { TokenIcon } from "@/components/ui/token-icon";
import { Order } from "../trade/[market]/page";

export function OrderTable({
  openOrders,
  balance = "",
  inr = "",
}: {
  openOrders: Order[];
  balance?: string;
  inr?: string;
}) {
  const aggregated = openOrders.reduce((acc: Order[], order) => {
    const existing = acc.find((o) => o.price === order.price && o.side === order.side);
    if (existing) {
      existing.quantity += order.quantity;
      existing.filled += order.filled;
    } else {
      acc.push({ ...order });
    }
    return acc;
  }, []);

  const balances = [
    { src: "/usdc copy.webp", symbol: "USDC", name: "USD Coin", value: parseFloat(balance || "0").toFixed(2) },
    { src: "/TATA.png", symbol: "TATA", name: "Tata", value: parseFloat(inr || "0").toFixed(7) },
  ];

  return (
    <Surface className="overflow-hidden">
      <Tabs className="gap-0" defaultValue="orders">
        <div className="flex items-center justify-between px-5 pt-4 pb-3">
          <TabsList>
            <TabsTab className="h-8 px-4" value="orders">
              Open orders
              {aggregated.length > 0 ? (
                <span className="num ms-1 text-foreground/40 text-xs">{aggregated.length}</span>
              ) : null}
            </TabsTab>
            <TabsTab className="h-8 px-4" value="balances">
              Balances
            </TabsTab>
          </TabsList>
        </div>

        <TabsPanel value="orders">
          {aggregated.length === 0 ? (
            <EmptyState
              description="Orders you place will rest here until they fill."
              title="No open orders"
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  {["Market", "Price", "Quantity", "Filled", "Side"].map((h, i) => (
                    <TableHead className={i > 0 ? "text-right" : ""} key={h}>
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {aggregated.map((order) => {
                  const pct = order.quantity > 0 ? Math.min(100, (order.filled / order.quantity) * 100) : 0;
                  return (
                    <TableRow key={order.orderId}>
                      <TableCell>
                        <span className="flex items-center gap-3">
                          <TokenIcon size={24} src="/TATA.png" symbol="TATA" />
                          <span className="font-medium text-heading">TATA</span>
                        </span>
                      </TableCell>
                      <TableCell className="num text-right text-heading">{order.price}</TableCell>
                      <TableCell className="num text-right text-foreground/70">{order.quantity}</TableCell>
                      <TableCell className="text-right">
                        <span className="inline-flex items-center justify-end gap-3">
                          <span aria-hidden="true" className="h-1 w-14 overflow-hidden rounded-full bg-foreground/10">
                            <span
                              className="block h-full rounded-full bg-foreground/50 transition-[width] duration-300 ease-out"
                              style={{ width: `${pct}%` }}
                            />
                          </span>
                          <span className="num text-foreground/70">{order.filled}</span>
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Pill tone={order.side === "buy" ? "buy" : "sell"}>
                          {order.side === "buy" ? <ArrowUpIcon /> : <ArrowDownIcon />}
                          {order.side === "buy" ? "Buy" : "Sell"}
                        </Pill>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </TabsPanel>

        <TabsPanel value="balances">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead className="text-right">Available</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {balances.map(({ src, symbol, name, value }) => (
                <TableRow key={symbol}>
                  <TableCell>
                    <span className="flex items-center gap-3">
                      <TokenIcon size={24} src={src} symbol={symbol} />
                      <span className="font-medium text-heading">{symbol}</span>
                      <span className="text-foreground/40">{name}</span>
                    </span>
                  </TableCell>
                  <TableCell className="num text-right text-heading">{value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsPanel>
      </Tabs>
    </Surface>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 pt-10 pb-14 text-center">
      <span className="border-apple flex size-10 items-center justify-center rounded-xl bg-surface-hover text-foreground/50">
        <InboxIcon className="size-[18px]" strokeWidth={1.5} />
      </span>
      <div className="flex flex-col gap-1">
        <p className="font-medium text-foreground/80 text-sm">{title}</p>
        <p className="text-foreground/40 text-sm">{description}</p>
      </div>
    </div>
  );
}
