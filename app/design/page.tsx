"use client";

import {
  ArrowRightIcon,
  BellIcon,
  InboxIcon,
  MaximizeIcon,
  PanelLeftIcon,
  PlusIcon,
  SearchIcon,
  Settings2Icon,
  SunIcon,
  Trash2Icon,
} from "lucide-react";
import * as React from "react";
import { Sparkline } from "@/components/charts/sparkline";
import { NumberTicker } from "@/components/motion/number-ticker";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CopyChip } from "@/components/ui/copy-chip";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HookNav, HookNavItem } from "@/components/ui/hook-nav";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Label } from "@/components/ui/label";
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuSeparator,
  MenuShortcut,
  MenuTrigger,
} from "@/components/ui/menu";
import {
  Panel,
  SectionLabel,
  Surface,
  SurfaceHeader,
  SurfaceTitle,
} from "@/components/ui/panel";
import { ChipButton, Pill } from "@/components/ui/pill";
import { Segmented } from "@/components/ui/segmented";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs";
import { TokenIcon, TokenPair } from "@/components/ui/token-icon";
import {
  Tooltip,
  TooltipPopup,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { DepthRow } from "../components/depth/DepthRow";

const SECTIONS = [
  ["color", "Color"],
  ["type", "Typography"],
  ["surfaces", "Surfaces"],
  ["buttons", "Buttons"],
  ["toolbar", "Toolbar & tooltip"],
  ["inputs", "Inputs"],
  ["selection", "Selection"],
  ["status", "Pills & keys"],
  ["chip", "Code chip"],
  ["numbers", "Numbers"],
  ["table", "Tables"],
  ["overlays", "Overlays"],
  ["toasts", "Toasts"],
  ["loading", "Loading"],
] as const;

const SWATCHES = [
  ["background", "#000000", "bg-background"],
  ["card", "#121212", "bg-card"],
  ["surface", "#171717", "bg-surface"],
  ["surface-hover", "#262626", "bg-surface-hover"],
  ["brand", "#fc4c01", "bg-brand"],
  ["buy", "#22c55e", "bg-buy"],
  ["sell", "#ef4444", "bg-sell"],
  ["heading", "#ffffff", "bg-heading"],
  ["foreground", "#e5e5e5", "bg-foreground"],
  ["muted-foreground", "#a3a3a3", "bg-muted-foreground"],
] as const;

export default function DesignPage() {
  const [active, setActive] = React.useState<string>("color");
  const [side, setSide] = React.useState("buy");
  const [type, setType] = React.useState("limit");
  const [chip, setChip] = React.useState("50%");
  const [price, setPrice] = React.useState(134.2);
  const [book, setBook] = React.useState({ bid: "4.8072", ask: "1.2353" });

  // The contents rail follows the section in view.
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-15% 0px -70% 0px" },
    );
    for (const [id] of SECTIONS) {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div className="hero-glow flex flex-1 gap-12 rounded-[inherit] p-5 md:p-8 xl:p-10">
      <div className="flex min-w-0 flex-1 flex-col gap-16">
        <header className="flex max-w-[65ch] flex-col gap-5 pt-16 sm:pt-12">
          <Pill tone="brand">Review</Pill>
          <h1 className="text-balance font-bold font-runde text-4xl text-heading tracking-tight sm:text-5xl md:text-6xl">
            Design system
          </h1>
          <p className="text-muted-foreground">
            Every primitive the exchange is built from, in each of its states.
            Pure black canvas, lifted charcoal panels, a machined hairline edge
            and one hot orange. The rules live in DESIGN.md.
          </p>
        </header>

        {/* ── Color ── */}
        <Section id="color" title="Color" note="Depth is layering: canvas, card, surface, hover. Orange is rare.">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
            {SWATCHES.map(([name, hex, className]) => (
              <div className="flex flex-col gap-3" key={name}>
                <div className={cn("border-apple h-20 rounded-2xl", className)} />
                <div className="flex flex-col gap-1.5">
                  <span className="font-medium text-heading text-sm leading-none">{name}</span>
                  <span className="num text-foreground/40 text-xs leading-none">{hex}</span>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Type ── */}
        <Section id="type" title="Typography" note="Open Runde for headings and big numbers, Inter for UI, Geist Mono for every price.">
          <Surface className="flex flex-col divide-y divide-hairline">
            <Specimen label="Hero · Runde 700">
              <span className="font-bold font-runde text-5xl text-heading tracking-tight">SOL / USDC</span>
            </Specimen>
            <Specimen label="Section · Runde 700">
              <span className="font-bold font-runde text-3xl text-heading tracking-tight">All markets</span>
            </Specimen>
            <Specimen label="Card title · Runde 600">
              <span className="font-runde font-semibold text-base text-heading tracking-tight">Order book</span>
            </Specimen>
            <Specimen label="Body · Inter 16/24">
              <span className="max-w-[52ch] text-foreground">
                Real-time order books, limit and market orders, deep liquidity.
              </span>
            </Specimen>
            <Specimen label="Secondary · Inter">
              <span className="text-muted-foreground">Credited to your trading balance right away.</span>
            </Specimen>
            <Specimen label="Label · caps 0.12em">
              <SectionLabel>24h volume</SectionLabel>
            </Specimen>
            <Specimen label="Numbers · Geist Mono tabular">
              <span className="num text-heading text-lg">64,472.00 · 0.00048014 · +2.48%</span>
            </Specimen>
          </Surface>
        </Section>

        {/* ── Surfaces ── */}
        <Section id="surfaces" title="Surfaces" note="Radius steps down as you go deeper: 45 → 16 → 12 → pill. Every edge is border-apple, never a drop shadow.">
          <div className="rounded-[28px] bg-background p-3">
            <Panel className="p-6 md:rounded-[36px]">
              <SectionLabel>Panel · card</SectionLabel>
              <Surface className="mt-4">
                <SurfaceHeader>
                  <SurfaceTitle>Surface</SurfaceTitle>
                  <Pill>16px</Pill>
                </SurfaceHeader>
                <div className="grid gap-3 px-5 pb-5 sm:grid-cols-2">
                  <div className="border-apple rounded-xl bg-background/40 px-4 py-3 text-foreground/60 text-sm">
                    Well · 12px
                  </div>
                  <div className="border-apple rounded-xl bg-surface-hover px-4 py-3 text-foreground/80 text-sm">
                    Hover / popover
                  </div>
                </div>
              </Surface>
            </Panel>
          </div>
        </Section>

        {/* ── Buttons ── */}
        <Section id="buttons" title="Buttons" note="Primary is the only orange button on a screen. Press scales to 0.97.">
          <Surface className="flex flex-col divide-y divide-hairline">
            <Row label="Primary">
              <Button>Place order</Button>
              <Button>
                Start trading <ArrowRightIcon />
              </Button>
              <Button loading>Place order</Button>
              <Button disabled>Place order</Button>
            </Row>
            <Row label="Secondary">
              <Button variant="secondary">View markets</Button>
              <Button variant="secondary">
                <PlusIcon /> New order
              </Button>
              <Button loading variant="secondary">View markets</Button>
              <Button disabled variant="secondary">View markets</Button>
            </Row>
            <Row label="Ghost · link">
              <Button variant="ghost">Cancel</Button>
              <Button variant="link">Learn more</Button>
            </Row>
            <Row label="Destructive">
              <Button variant="destructive">
                <Trash2Icon /> Cancel order
              </Button>
              <Button variant="destructive-outline">Cancel all</Button>
            </Row>
            <Row label="Sizes">
              <Button size="xs">xs</Button>
              <Button size="sm">Small</Button>
              <Button>Default</Button>
              <Button size="lg">Large</Button>
              <Button size="xl">Extra large</Button>
            </Row>
          </Surface>
        </Section>

        {/* ── Toolbar ── */}
        <Section id="toolbar" title="Toolbar & tooltip" note="One pill, one text button, a divider, circular icon buttons. Hover an icon for the tooltip.">
          <Surface className="flex flex-col divide-y divide-hairline">
            <Row label="Toolbar pill">
              <div className="border-apple flex items-center gap-1 rounded-full bg-background/40 p-1">
                <button
                  className="inline-flex h-10 cursor-pointer items-center rounded-full px-4 font-medium text-foreground/80 text-sm outline-none transition-[background-color,color,scale] duration-150 hover:bg-surface-hover hover:text-heading focus-visible:ring-2 focus-visible:ring-ring/50 active:scale-[0.97]"
                  type="button"
                >
                  Deposit
                </button>
                <span aria-hidden="true" className="mx-1 h-6 w-px bg-foreground/10" />
                <IconButton label="Light theme"><SunIcon /></IconButton>
                <IconButton label="Fullscreen"><MaximizeIcon /></IconButton>
                <IconButton active label="Hide sidebar"><PanelLeftIcon /></IconButton>
                <IconButton label="Settings"><Settings2Icon /></IconButton>
              </div>
            </Row>
            <Row label="Icon button">
              <IconButton label="Notifications" variant="solid"><BellIcon /></IconButton>
              <IconButton active label="Active" variant="solid"><BellIcon /></IconButton>
              <IconButton disabled label="Disabled" variant="solid"><BellIcon /></IconButton>
              <IconButton label="Small" size="sm" variant="solid"><BellIcon /></IconButton>
            </Row>
            <Row label="Tooltip">
              <Tooltip>
                <TooltipTrigger render={<Button variant="secondary" />}>Hover me</TooltipTrigger>
                <TooltipPopup>Fades and slides 4px, 150ms</TooltipPopup>
              </Tooltip>
              <IconButton hint={<Kbd className="h-5 px-1.5">F</Kbd>} label="Fullscreen" variant="solid">
                <MaximizeIcon />
              </IconButton>
            </Row>
          </Surface>
        </Section>

        {/* ── Inputs ── */}
        <Section id="inputs" title="Inputs" note="Mono, tabular, unit suffix inside. Focus is a soft orange ring, never a hard outline.">
          <Surface className="grid gap-x-6 gap-y-5 p-5 sm:grid-cols-2">
            <Field label="Price · default">
              <InputGroup data-surface="nested">
                <InputGroupInput className="text-right" defaultValue="134.20" inputMode="decimal" />
                <InputGroupAddon align="inline-end"><InputGroupText className="text-sm">USDC</InputGroupText></InputGroupAddon>
              </InputGroup>
            </Field>
            <Field label="Size · placeholder">
              <InputGroup data-surface="nested">
                <InputGroupInput className="text-right" inputMode="decimal" placeholder="0.00" />
                <InputGroupAddon align="inline-end"><InputGroupText className="text-sm">SOL</InputGroupText></InputGroupAddon>
              </InputGroup>
            </Field>
            <Field label="Invalid">
              <InputGroup data-surface="nested">
                <InputGroupInput aria-invalid className="text-right" defaultValue="0.00" />
                <InputGroupAddon align="inline-end"><InputGroupText className="text-sm">SOL</InputGroupText></InputGroupAddon>
              </InputGroup>
            </Field>
            <Field label="Disabled">
              <InputGroup data-surface="nested">
                <InputGroupInput className="text-right" defaultValue="3,355.00" disabled />
                <InputGroupAddon align="inline-end"><InputGroupText className="text-sm">USDC</InputGroupText></InputGroupAddon>
              </InputGroup>
            </Field>
            <Field label="Search">
              <InputGroup data-surface="nested">
                <InputGroupAddon><SearchIcon className="size-4 text-foreground/40" strokeWidth={1.5} /></InputGroupAddon>
                <InputGroupInput className="font-sans" placeholder="Search markets" type="search" />
                <InputGroupAddon align="inline-end"><Kbd className="h-5 px-1.5">⌘K</Kbd></InputGroupAddon>
              </InputGroup>
            </Field>
            <Field label="Plain input">
              <Input data-surface="nested" placeholder="0.00" />
            </Field>
            <div className="flex flex-col gap-2 sm:col-span-2">
              <SectionLabel>Percentage chips</SectionLabel>
              <div className="grid max-w-sm grid-cols-4 gap-2">
                {["25%", "50%", "75%", "Max"].map((value) => (
                  <ChipButton active={chip === value} key={value} onClick={() => setChip(value)}>
                    {value}
                  </ChipButton>
                ))}
              </div>
            </div>
          </Surface>
        </Section>

        {/* ── Selection ── */}
        <Section id="selection" title="Selection" note="Active indicators slide on a shared layout, they never jump. Try the arrow keys.">
          <Surface className="flex flex-col divide-y divide-hairline">
            <Row label="Buy / Sell">
              <Segmented
                aria-label="Side"
                className="w-64"
                fill
                onValueChange={setSide}
                options={[
                  { value: "buy", label: "Buy", tone: "buy" },
                  { value: "sell", label: "Sell", tone: "sell" },
                ]}
                value={side}
              />
            </Row>
            <Row label="Segmented">
              <Segmented
                aria-label="Order type"
                onValueChange={setType}
                options={[
                  { value: "limit", label: "Limit" },
                  { value: "market", label: "Market" },
                  { value: "stop", label: "Stop" },
                ]}
                value={type}
              />
              <Segmented
                aria-label="Order type, small"
                onValueChange={setType}
                options={[
                  { value: "limit", label: "Limit" },
                  { value: "market", label: "Market" },
                ]}
                size="sm"
                value={type}
              />
            </Row>
            <Row label="Tabs">
              <Tabs defaultValue="orders">
                <TabsList>
                  <TabsTab className="h-8 px-4" value="orders">Open orders</TabsTab>
                  <TabsTab className="h-8 px-4" value="history">History</TabsTab>
                  <TabsTab className="h-8 px-4" value="balances">Balances</TabsTab>
                </TabsList>
              </Tabs>
            </Row>
            <Row label="Checkbox · switch">
              <label className="flex cursor-pointer items-center gap-2.5 text-foreground/70 text-sm">
                <Checkbox defaultChecked /> Post only
              </label>
              <label className="flex cursor-pointer items-center gap-2.5 text-foreground/70 text-sm">
                <Checkbox /> IOC
              </label>
              <label className="flex items-center gap-2.5 text-foreground/40 text-sm">
                <Checkbox disabled /> Disabled
              </label>
              <Label className="font-normal text-foreground/70">
                <Switch defaultChecked /> Flash price changes
              </Label>
            </Row>
            <Row label="Hook nav">
              <HookRail />
            </Row>
          </Surface>
        </Section>

        {/* ── Status ── */}
        <Section id="status" title="Pills & keys" note="Green and red mean market direction only, always as a tint.">
          <Surface className="flex flex-col divide-y divide-hairline">
            <Row label="Pill">
              <Pill>Neutral</Pill>
              <Pill dot live tone="buy">Live</Pill>
              <Pill tone="buy">+2.48%</Pill>
              <Pill tone="sell">-1.50%</Pill>
              <Pill tone="brand">New</Pill>
              <Pill size="sm">Soon</Pill>
            </Row>
            <Row label="Kbd">
              <Kbd>⌘K</Kbd>
              <KbdGroup><Kbd>⌘</Kbd><Kbd>⇧</Kbd><Kbd>P</Kbd></KbdGroup>
              <Kbd>Esc</Kbd>
            </Row>
            <Row label="Token">
              <TokenIcon src="/sol copy.webp" symbol="SOL" />
              <TokenIcon symbol="TATA" />
              <TokenPair base={{ src: "/sol copy.webp", symbol: "SOL" }} quote={{ src: "/usdc copy.webp", symbol: "USDC" }} size={36} />
            </Row>
          </Surface>
        </Section>

        {/* ── Chip ── */}
        <Section id="chip" title="Code chip" note="For order IDs, addresses and hashes. The copy icon morphs into a check.">
          <div className="grid gap-4 sm:grid-cols-2">
            <CopyChip prefix="$" value="curl https://api.exchange.dev/v1/depth?symbol=TATA_INR" />
            <CopyChip label="Copy order ID" truncate={8} value="ord_9f3c21b7a4e84d0b9c5e17f2a6d1b8c4" />
          </div>
        </Section>

        {/* ── Numbers ── */}
        <Section id="numbers" title="Numbers" note="Tabular everywhere, so nothing jitters when a value updates.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Surface className="flex flex-col gap-4 p-5">
              <SectionLabel>Last price · rolling digits</SectionLabel>
              <NumberTicker
                className="font-runde font-semibold text-4xl text-heading tracking-tight"
                decimals={2}
                duration={0.5}
                locale="en-US"
                startOnView={false}
                value={price}
              />
              <div className="flex gap-2">
                <Button onClick={() => setPrice((p) => +(p + 0.37).toFixed(2))} size="sm" variant="secondary">Tick up</Button>
                <Button onClick={() => setPrice((p) => +(p - 0.52).toFixed(2))} size="sm" variant="secondary">Tick down</Button>
              </div>
              <div className="w-40 text-buy">
                <Sparkline data={[4, 6, 5, 8, 7, 9, 8, 11, 10, 13, 12, 15]} height={36} label="Sample trend" />
              </div>
            </Surface>
            <Surface className="flex flex-col pb-4">
              <SurfaceHeader>
                <SurfaceTitle>Order book rows</SurfaceTitle>
                <Button
                  onClick={() =>
                    setBook({
                      bid: (Math.random() * 9 + 0.2).toFixed(4),
                      ask: (Math.random() * 9 + 0.2).toFixed(4),
                    })
                  }
                  size="xs"
                  variant="secondary"
                >
                  Change size
                </Button>
              </SurfaceHeader>
              <DepthRow maxTotal={20} price="134.31" quantity="4.1620" side="sell" total={12.3} />
              <DepthRow maxTotal={20} price="134.26" quantity={book.ask} side="sell" total={5.4} />
              <div className="my-1 border-hairline border-y px-5 py-3">
                <span className="num font-runde font-semibold text-2xl text-buy leading-none tracking-tight">134.20</span>
              </div>
              <DepthRow maxTotal={20} price="134.18" quantity={book.bid} side="buy" total={6.8} />
              <DepthRow maxTotal={20} price="134.11" quantity="9.1560" side="buy" total={15.9} />
            </Surface>
          </div>
        </Section>

        {/* ── Table ── */}
        <Section id="table" title="Tables" note="No vertical lines, no zebra. Hairline rows, a faint hover, and an empty state that says something.">
          <div className="grid gap-4 xl:grid-cols-2">
            <Surface className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Market</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Side</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    ["TATA", "1,019.00", "buy"],
                    ["TATA", "1,024.50", "sell"],
                    ["TATA", "1,012.25", "buy"],
                  ].map(([market, value, orderSide], i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <span className="flex items-center gap-3">
                          <TokenIcon size={24} src="/TATA.png" symbol="TATA" />
                          <span className="font-medium text-heading">{market}</span>
                        </span>
                      </TableCell>
                      <TableCell className="num text-right text-heading">{value}</TableCell>
                      <TableCell className="text-right">
                        <Pill tone={orderSide === "buy" ? "buy" : "sell"}>{orderSide === "buy" ? "Buy" : "Sell"}</Pill>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Surface>
            <Surface className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
              <span className="border-apple flex size-10 items-center justify-center rounded-xl bg-surface-hover text-foreground/50">
                <InboxIcon className="size-[18px]" strokeWidth={1.5} />
              </span>
              <div className="flex flex-col gap-1">
                <p className="font-medium text-foreground/80 text-sm">No open orders</p>
                <p className="text-foreground/40 text-sm">Orders you place will rest here until they fill.</p>
              </div>
            </Surface>
          </div>
        </Section>

        {/* ── Overlays ── */}
        <Section id="overlays" title="Overlays" note="Dialog and menu share the machined edge.">
          <Surface className="flex flex-col divide-y divide-hairline">
            <Row label="Dialog">
              <Dialog>
                <DialogTrigger render={<Button variant="secondary" />}>Open dialog</DialogTrigger>
                <DialogPopup className="sm:max-w-[420px]">
                  <DialogHeader>
                    <DialogTitle>Cancel this order?</DialogTitle>
                    <DialogDescription>
                      Your bid for 25 SOL at 134.20 will be removed from the book.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter variant="bare">
                    <DialogClose render={<Button variant="ghost" />}>Keep order</DialogClose>
                    <DialogClose render={<Button variant="destructive" />}>Cancel order</DialogClose>
                  </DialogFooter>
                </DialogPopup>
              </Dialog>
            </Row>
            <Row label="Menu">
              <Menu>
                <MenuTrigger render={<Button variant="secondary" />}>Open menu</MenuTrigger>
                <MenuPopup align="start" className="w-52">
                  <MenuItem>Amend order</MenuItem>
                  <MenuItem>
                    Duplicate
                    <MenuShortcut>⌘D</MenuShortcut>
                  </MenuItem>
                  <MenuSeparator />
                  <MenuItem variant="destructive">Cancel order</MenuItem>
                </MenuPopup>
              </Menu>
            </Row>
          </Surface>
        </Section>

        {/* ── Toasts ── */}
        <Section id="toasts" title="Toasts" note="Bottom-centre pill, springs up, older ones scale down behind. Undo where it makes sense.">
          <Surface>
            <Row label="Fire one">
              <Button
                onClick={() =>
                  toast({ variant: "success", title: "Order filled", description: "Bought 25 SOL at 134.20" })
                }
                size="sm"
                variant="secondary"
              >
                Filled
              </Button>
              <Button
                onClick={() =>
                  toast({
                    title: "Order cancelled",
                    description: "Bid for 25 SOL removed",
                    action: {
                      label: "Undo",
                      onClick: () => toast({ variant: "success", title: "Order restored" }),
                    },
                  })
                }
                size="sm"
                variant="secondary"
              >
                Cancelled, with Undo
              </Button>
              <Button
                onClick={() =>
                  toast({
                    variant: "destructive",
                    title: "Order failed",
                    description: "Could not reach the exchange engine.",
                  })
                }
                size="sm"
                variant="secondary"
              >
                Error
              </Button>
              <Button
                onClick={() => toast({ variant: "info", title: "Market unavailable", description: "Trading is TATA_INR only for now." })}
                size="sm"
                variant="secondary"
              >
                Info
              </Button>
            </Row>
          </Surface>
        </Section>

        {/* ── Loading ── */}
        <Section id="loading" title="Loading" note="Skeletons keep the geometry of the content they stand in for.">
          <Surface className="flex flex-col gap-4 p-5">
            {[0, 1, 2].map((i) => (
              <div className="flex items-center justify-between" key={i}>
                <span className="flex items-center gap-3">
                  <Skeleton className="size-9 rounded-full" />
                  <span className="flex flex-col gap-1.5">
                    <Skeleton className="h-3.5 w-24" />
                    <Skeleton className="h-3 w-12" />
                  </span>
                </span>
                <Skeleton className="h-3.5 w-20" />
              </div>
            ))}
          </Surface>
        </Section>
      </div>

      {/* Contents rail */}
      <aside className="sticky top-24 hidden h-fit w-44 shrink-0 flex-col gap-3 pt-28 xl:flex">
        <SectionLabel>Contents</SectionLabel>
        <HookNav>
          {SECTIONS.map(([id, label]) => (
            <HookNavItem active={active === id} key={id}>
              <a
                className="flex min-h-9 flex-1 items-center rounded-md focus-visible:ring-2 focus-visible:ring-ring/50"
                href={`#${id}`}
                onClick={() => setActive(id)}
              >
                {label}
              </a>
            </HookNavItem>
          ))}
        </HookNav>
      </aside>
    </div>
  );
}

function Section({
  id,
  title,
  note,
  children,
}: {
  id: string;
  title: string;
  note: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex scroll-mt-8 flex-col gap-6" id={id}>
      <div className="flex flex-col gap-2">
        <h2 className="font-bold font-runde text-2xl text-heading tracking-tight sm:text-3xl">{title}</h2>
        <p className="max-w-[65ch] text-muted-foreground text-sm">{note}</p>
      </div>
      {children}
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
      <SectionLabel className="w-36 shrink-0">{label}</SectionLabel>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

function Specimen({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-baseline">
      <SectionLabel className="w-56 shrink-0">{label}</SectionLabel>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <SectionLabel>{label}</SectionLabel>
      {children}
    </div>
  );
}

function HookRail() {
  const [value, setValue] = React.useState("book");
  return (
    <HookNav className="w-44">
      {[
        ["overview", "Overview"],
        ["book", "Order book"],
        ["fees", "Fees"],
      ].map(([id, label]) => (
        <HookNavItem active={value === id} key={id}>
          <button
            className="flex min-h-9 flex-1 cursor-pointer items-center rounded-md text-left focus-visible:ring-2 focus-visible:ring-ring/50"
            onClick={() => setValue(id)}
            type="button"
          >
            {label}
          </button>
        </HookNavItem>
      ))}
    </HookNav>
  );
}
