"use client";
import axios from "axios";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { SectionLabel, Surface } from "@/components/ui/panel";
import { ChipButton } from "@/components/ui/pill";
import { Segmented } from "@/components/ui/segmented";
import { TokenIcon } from "@/components/ui/token-icon";
import { cn } from "@/lib/utils";
import { RateLimitError } from "../utils/httpClient";
import { orderLimiter } from "../utils/rateLimiter";
import { useToast } from "@/hooks/use-toast";

export function SwapUI({
  market,
  balance,
  inr,
  className,
}: {
  market: string;
  balance: string;
  inr: string;
  className?: string;
}) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("buy");
  const [type, setType] = useState("limit");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const isBuy = activeTab === "buy";
  const available = market === "TATA_INR";
  const base = market.split("_")[0];

  // Percentage chips: a share of what the balance can cover on this side.
  const maxQuantity = isBuy
    ? parseFloat(price) > 0
      ? parseFloat(balance || "0") / parseFloat(price)
      : 0
    : parseFloat(inr || "0");
  const fillQuantity = (share: number) => {
    if (!(maxQuantity > 0)) return;
    setQuantity((Math.floor(maxQuantity * share * 100) / 100).toString());
  };

  return (
    <Surface className={cn("flex flex-col gap-5 p-5", className)}>
      {/* Buy / Sell */}
      <Segmented
        aria-label="Side"
        fill
        onValueChange={setActiveTab}
        options={[
          { value: "buy", label: "Buy", tone: "buy" },
          { value: "sell", label: "Sell", tone: "sell" },
        ]}
        value={activeTab}
      />

      <div className="flex items-center justify-between">
        <SectionLabel>Order type</SectionLabel>
        <Segmented
          aria-label="Order type"
          onValueChange={setType}
          options={[
            { value: "limit", label: "Limit" },
            { value: "market", label: "Market" },
          ]}
          size="sm"
          value={type}
        />
      </div>

      {/* Balances */}
      <div className="flex flex-col gap-3">
        <SectionLabel>Available</SectionLabel>
        <dl className="border-apple flex flex-col rounded-xl bg-background/40">
          {[
            { src: "/usdc copy.webp", symbol: "USDC", value: parseFloat(balance || "0").toFixed(2) },
            { src: "/TATA.png", symbol: "TATA", value: parseFloat(inr || "0").toFixed(7) },
          ].map(({ src, symbol, value }) => (
            <div
              className="flex items-center justify-between border-hairline px-4 py-3 not-last:border-b"
              key={symbol}
            >
              <dt className="flex items-center gap-2.5 text-foreground/60 text-sm">
                <TokenIcon size={20} src={src} symbol={symbol} />
                {symbol}
              </dt>
              <dd className="num text-heading text-sm">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <InputField
        label="Price"
        onChange={(v) => setPrice(v)}
        placeholder="0.00"
        suffix="USDC"
        value={price ? parseFloat(price).toLocaleString("en-US") : ""}
      />

      <div className="flex flex-col gap-2.5">
        <InputField
          label="Quantity"
          onChange={(v) => setQuantity(v)}
          placeholder="0.00"
          suffix={base}
          value={quantity ? parseFloat(quantity).toLocaleString("en-US") : ""}
        />
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "25%", share: 0.25 },
            { label: "50%", share: 0.5 },
            { label: "75%", share: 0.75 },
            { label: "Max", share: 1 },
          ].map(({ label, share }) => (
            <ChipButton key={label} onClick={() => fillQuantity(share)}>
              {label}
            </ChipButton>
          ))}
        </div>
      </div>

      <InputField
        label="Order value"
        onChange={() => {}}
        placeholder="0.00"
        readOnly
        suffix="USDC"
        value={price && quantity ? (parseFloat(price) * parseFloat(quantity)).toLocaleString("en-US") : ""}
      />

      <div className="mt-auto flex flex-col gap-4 pt-1">
        <Button
          aria-disabled={!available}
          className={cn("w-full", !available && "cursor-not-allowed disabled:pointer-events-auto")}
          disabled={!available}
          loading={submitting}
          onClick={async () => {
            if (market !== "TATA_INR") {
              toast({ title: "Market unavailable", description: "Trading is only supported for TATA_INR at the moment.", duration: 4000 });
              return;
            }
            const rl = orderLimiter.check();
            if (!rl.allowed) {
              toast({
                variant: "destructive",
                title: "Order rate limit reached",
                description: `You've hit the 30 orders/min limit. Try again in ${rl.retryAfterSec}s.`,
                duration: 5000,
              });
              return;
            }
            setSubmitting(true);
            try {
              const res = await axios.post(`/api/engine/order`, {
                market,
                price: price.toString(),
                quantity: quantity.toString(),
                side: activeTab.toString(),
                userId: "1",
              });
              // Only report success when the engine actually accepted the order.
              const data = res.data;
              if (
                res.status < 200 ||
                res.status >= 300 ||
                !data ||
                typeof data !== "object" ||
                data.error ||
                !data.orderId
              ) {
                throw new Error("Order rejected by engine");
              }
              setOrderPlaced(!orderPlaced);
              toast({ variant: "success", title: "Order placed", description: `Order submitted · ${orderLimiter.remaining()} orders remaining this minute`, duration: 4000 });
            } catch (err) {
              if (err instanceof RateLimitError) {
                toast({ variant: "destructive", title: "Rate limit", description: err.message, duration: 5000 });
              } else {
                toast({ variant: "destructive", title: "Order failed", description: "Could not reach the exchange engine. Please try again.", duration: 5000 });
              }
            } finally {
              setSubmitting(false);
            }
          }}
          size="lg"
          variant={available ? "default" : "secondary"}
        >
          {isBuy ? "Place buy order" : "Place sell order"}
        </Button>

        <div className="flex items-center gap-6">
          {[
            { id: "postOnly", label: "Post only" },
            { id: "ioc", label: "IOC" },
          ].map(({ id, label }) => (
            <label
              className="flex cursor-pointer select-none items-center gap-2.5 text-foreground/50 text-sm transition-colors duration-150 hover:text-foreground/80"
              key={id}
            >
              <Checkbox id={id} />
              {label}
            </label>
          ))}
        </div>
      </div>
    </Surface>
  );
}

function InputField({
  label,
  placeholder,
  value,
  onChange,
  suffix,
  readOnly = false,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  suffix: string;
  readOnly?: boolean;
}) {
  const id = useId();
  return (
    <div className="flex flex-col gap-2">
      <label className="label-caps" htmlFor={id}>
        {label}
      </label>
      <InputGroup data-surface="nested">
        <InputGroupInput
          autoComplete="off"
          className="text-right"
          id={id}
          inputMode="decimal"
          onChange={(e) => {
            const v = e.target.value.replace(/,/g, "");
            if (v === "" || /^\d*\.?\d*$/.test(v)) onChange(v);
          }}
          placeholder={placeholder}
          readOnly={readOnly}
          type="text"
          value={value}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupText className="min-w-10 justify-end text-sm">{suffix}</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
