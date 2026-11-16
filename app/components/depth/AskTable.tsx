import { ROW_HEIGHT, ROWS } from "./BidTable";
import { DepthRow } from "./DepthRow";

const DEMO_ASKS: [string, string][] = [
  ["2403.31", "4.1620"], ["2403.28", "4.8049"], ["2403.17", "4.8072"],
  ["2403.12", "4.8072"], ["2403.11", "1.4709"], ["2403.06", "4.8072"],
  ["2403.05", "0.0305"], ["2402.99", "4.8072"], ["2402.93", "0.7200"],
  ["2402.91", "4.8072"], ["2402.82", "2.2700"], ["2402.75", "1.7335"],
  ["2402.64", "0.5243"], ["2402.60", "0.4541"],
];

export const AskTable = ({ asks }: { asks: [string, string][] }) => {
  const source = asks.length > 0 ? asks : DEMO_ASKS;
  const isDemoMode = asks.length === 0;

  const relevant = source.slice(0, ROWS);
  let cumulative = 0;
  const rows: [string, string, number][] = relevant.map(
    ([p, q]) => [p, q, (cumulative += Number(q))]
  );
  const maxTotal = cumulative;

  const display = [...rows].reverse();

  return (
    <div
      className={`flex flex-col justify-end overflow-hidden ${isDemoMode ? "pointer-events-none select-none opacity-30" : ""}`}
      style={{ height: `${ROWS * ROW_HEIGHT}px` }}
    >
      {display.map(([price, quantity, total]) => (
        <DepthRow key={price} maxTotal={maxTotal} price={price} quantity={quantity} side="sell" total={total} />
      ))}
    </div>
  );
};
