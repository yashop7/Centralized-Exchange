import { DepthRow } from "./DepthRow";

export const ROWS = 11;
export const ROW_HEIGHT = 24;

const DEMO_BIDS: [string, string][] = [
  ["2402.50", "4.8072"], ["2402.38", "1.2353"], ["2402.27", "0.0009"],
  ["2402.19", "4.8069"], ["2402.11", "4.8049"], ["2402.02", "0.3729"],
  ["2401.96", "9.1560"], ["2401.91", "4.8072"], ["2401.83", "2.2700"],
  ["2401.75", "1.7335"], ["2401.60", "0.5243"], ["2401.48", "4.8072"],
  ["2401.37", "0.6000"], ["2401.22", "2.2350"],
];

export const BidTable = ({ bids }: { bids: [string, string][] }) => {
  const source = bids.length > 0 ? bids : DEMO_BIDS;
  const isDemoMode = bids.length === 0;

  const relevant = source.slice(0, ROWS);
  let cumulative = 0;
  const rows: [string, string, number][] = relevant.map(
    ([p, q]) => [p, q, (cumulative += Number(q))]
  );
  const maxTotal = cumulative;

  return (
    <div
      className={`overflow-hidden ${isDemoMode ? "pointer-events-none select-none opacity-30" : ""}`}
      style={{ height: `${ROWS * ROW_HEIGHT}px` }}
    >
      {rows.map(([price, quantity, total]) => (
        <DepthRow key={price} maxTotal={maxTotal} price={price} quantity={quantity} side="buy" total={total} />
      ))}
    </div>
  );
};

export function formatNumber(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '—';
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(2) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(2) + 'K';
  return num.toFixed(4);
}
