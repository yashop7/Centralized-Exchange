import Image from "next/image";
import { cn } from "@/lib/utils";

export interface TokenIconProps {
  src?: string | null;
  symbol: string;
  size?: number;
  className?: string;
}

/** Round asset mark with a lettered fallback, so a missing image never leaves a hole. */
export function TokenIcon({ src, symbol, size = 28, className }: TokenIconProps) {
  return (
    <span
      className={cn(
        "border-apple relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-hover font-runde font-semibold text-foreground/70 uppercase",
        className,
      )}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.38) }}
    >
      {src ? (
        <Image
          alt=""
          className="size-full object-cover"
          height={size}
          src={src}
          width={size}
        />
      ) : (
        symbol.slice(0, 1)
      )}
    </span>
  );
}

/** Base over quote, overlapped. */
export function TokenPair({
  base,
  quote,
  size = 28,
}: {
  base: TokenIconProps;
  quote: TokenIconProps;
  size?: number;
}) {
  return (
    <span className="flex shrink-0 items-center">
      <TokenIcon {...base} className="z-10 ring-2 ring-card" size={size} />
      <TokenIcon {...quote} className="-ms-2" size={size} />
    </span>
  );
}
