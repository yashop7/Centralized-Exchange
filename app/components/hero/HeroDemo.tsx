"use client";

import { CheckIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  type Act,
  Bar,
  Button,
  Collapse,
  Count,
  Field,
  Roll,
  Segmented,
  Stage,
  Toast,
} from "@/components/stageshow/kit";
import "./hero-demo.css";

// The markets hero: one order, start to finish.
// Beats: the cursor types a quantity into the ticket; presses Place buy
// order; the bid opens in the book at its price and pushes the bids below
// it down; the market trades into it (its size runs down to nothing, the
// row closes, the last price rolls to the fill); a toast says so.
// Reset, each with a cause: the toast times out and the ticket clears with
// it, then the next trade prints at the ask and the last price ticks back.
//
// Real strings: the pair, the two prices that matter (ask and our bid),
// the quantity typed, the order value, the button, the fill. The rest of
// the book and the chart are placeholder lines.

type S = {
  qty: string;
  focus: boolean;
  resting: boolean;
  size: number;
  last: number;
  up: boolean;
  toast: boolean;
};

const BID = 134.2;
const ASK = 134.26;

const REST = { wide: { x: 300, y: 262 }, compact: { x: 250, y: 330 } };

const initial: S = {
  qty: "",
  focus: false,
  resting: false,
  size: 25,
  last: ASK,
  up: true,
  toast: false,
};

const poster: S = {
  qty: "25",
  focus: false,
  resting: false,
  size: 25,
  last: BID,
  up: false,
  toast: true,
};

async function script(a: Act<S>) {
  await a.wait(900);

  // 1. A quantity
  await a.move("qty");
  await a.click();
  await a.set({ focus: true });
  await a.wait(250);
  await a.type("qty", "25", { interval: 140 });
  await a.wait(500);

  // 2. Place it
  await a.move("place");
  await a.wait(200);
  await a.click();
  a.mark("resting");
  await a.set({ focus: false, resting: true });
  void a.move(REST[a.layout]);
  await a.wait(1400);

  // 3. The market trades into it
  a.mark("fill");
  await a.set({ size: 11.5 });
  await a.wait(620);
  await a.set({ size: 0, last: BID, up: false });
  await a.wait(380);
  await a.set({ resting: false });
  await a.wait(250);
  await a.set({ toast: true });
  await a.wait(2400);

  // The toast times out and the ticket clears with it…
  await a.set({ toast: false, qty: "" });
  await a.wait(700);
  // …then the next trade prints at the ask.
  await a.set({ last: ASK, up: true });
  await a.move(REST[a.layout]);
  await a.wait(600);
  await a.snap({ size: 25 });
}

const money = (n: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function HeroDemo() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const theme = mounted && resolvedTheme === "light" ? "light" : "dark";

  return (
    <div aria-hidden="true" className="xd-slot">
      <Stage<S>
        className="xd"
        compact={{ below: 520, width: 358, height: 420 }}
        cursor={{ at: REST }}
        height={440}
        initial={initial}
        poster={poster}
        script={script}
        theme={theme}
        width={640}
      >
        {(s, _rect, layout) => (
          <>
            <div className="xd-panel">
              <header className="xd-head">
                <span className="xd-pair">
                  {/* biome-ignore lint: project assets, decorative */}
                  <img alt="" height={26} src="/sol copy.webp" width={26} />
                  <img alt="" height={26} src="/usdc copy.webp" width={26} />
                </span>
                <div className="xd-title">SOL / USDC</div>
                <span className="xd-live">
                  <i />
                  Live
                </span>
              </header>

              <div className="xd-cols">
                {/* Ticket */}
                <section className="xd-block xd-ticket">
                  <Segmented className="xd-side" items={["Buy", "Sell"]} value={0} />
                  <Field
                    className="xd-field"
                    label="Price"
                    trailing={<span className="xd-unit">USDC</span>}
                    value={money(BID)}
                  />
                  <Field
                    box={{ "data-target": "qty" }}
                    className="xd-field"
                    focused={s.focus}
                    label="Quantity"
                    placeholder="0.00"
                    trailing={<span className="xd-unit">SOL</span>}
                    value={s.qty}
                  />
                  <div className="xd-total">
                    <span>Order value</span>
<Roll>{money(Number(s.qty || 0) * BID)}</Roll>
                  </div>
                  <Button className="xd-place" data-cursor="pointer" data-target="place" size="large" variant="primary">
                    Place buy order
                  </Button>
                </section>

                {/* Book */}
                <section className="xd-block xd-book">
                  <div className="xd-cap">
                    <span>Price</span>
                    <span>Size</span>
                  </div>
                  <FillerRow depth={38} side="sell" w={44} />
                  <FillerRow depth={23} side="sell" w={44} />
                  <div className="xd-row" data-side="sell">
                    <i style={{ width: "22%" }} />
                    <span>{money(ASK)}</span>
                    <span>8.40</span>
                  </div>

                  <div className="xd-mid" data-up={s.up || undefined}>
                    <Count format={money} value={s.last} />
                    <span className="xd-mid__cap">Last</span>
                  </div>

                  <Collapse open={s.resting}>
                    <div className="xd-row xd-row--mine" data-side="buy">
                      <i style={{ width: `${(s.size / 25) * 64}%` }} />
                      <span>
                        {money(BID)}
                        <em>You</em>
                      </span>
                      <Roll>{money(s.size)}</Roll>
                    </div>
                  </Collapse>
                  <div className="xd-row" data-side="buy">
                    <i style={{ width: "30%" }} />
                    <span>134.18</span>
                    <span>12.75</span>
                  </div>
                  <FillerRow depth={28} side="buy" w={44} />
                  <FillerRow depth={35} side="buy" w={44} />
                  <FillerRow depth={45} side="buy" w={44} />
                  <FillerRow depth={53} side="buy" w={44} />
                  <FillerRow depth={58} side="buy" w={44} />
                  <FillerRow depth={62} side="buy" w={44} />
                </section>

                {/* Chart: filler, runs off the right edge */}
                {layout === "compact" ? null : (
                  <section className="xd-block xd-chart">
                    {CANDLES.map(([top, height, up], i) => (
                      <b data-up={up || undefined} key={i} style={{ top, height, left: 16 + i * 14 }} />
                    ))}
                  </section>
                )}
              </div>
            </div>

            <div className="xd-toast">
              <Toast
                icon={
                  <span className="xd-check">
                    <CheckIcon size={11} strokeWidth={3} />
                  </span>
                }
                show={s.toast}
              >
                Bought 25 SOL at {money(BID)}
              </Toast>
            </div>
          </>
        )}
      </Stage>
    </div>
  );
}

function FillerRow({ side, w, depth }: { side: "buy" | "sell"; w: number; depth: number }) {
  return (
    <div className="xd-row xd-row--filler" data-side={side}>
      <i style={{ width: `${depth}%` }} />
      <Bar h={6} r={3} tone={2} w={w} />
    </div>
  );
}

// top, height, up
const CANDLES: [number, number, boolean][] = [
  [150, 44, false],
  [168, 30, false],
  [140, 52, true],
  [112, 46, true],
  [124, 28, false],
  [96, 50, true],
  [70, 42, true],
  [84, 34, false],
  [58, 48, true],
  [40, 36, true],
];
