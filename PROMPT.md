# Redesign prompt: Centralized Exchange (Rare UI aesthetic)

Paste everything below into Claude Code from the repo root.

---

Redesign the whole frontend of this exchange app (github.com/yashop7/Centralized-Exchange). Keep all logic, data fetching, WebSocket wiring and routes exactly as they are. This is a visual + interaction redesign only.

Reference aesthetic: rareui.com (dark, Apple-ish, tactile, quiet). Don't copy its logo or brand, copy the *feel*. Read this whole spec first, then write `DESIGN.md` + the tokens, then migrate screen by screen.

## 1. The feel in one line
Pure black canvas, slightly lifted charcoal panels with huge rounded corners, hairline inset borders that look machined, one hot orange accent, rounded display font for headings, Inter for everything else, lots of breathing room, and every hover/active state animated softly.

## 2. Design tokens (put in globals.css as CSS vars + Tailwind theme)

Dark is the default and primary theme.

```css
.dark {
  --background: #000000;      /* app canvas */
  --card: #121212;            /* main floating panel */
  --surface: #171717;         /* nested blocks inside a panel (neutral-900) */
  --surface-hover: #262626;   /* hover on surfaces (neutral-800) */
  --popover: #262626;
  --foreground: #e5e5e5;      /* body text */
  --heading: #ffffff;
  --muted-foreground: #a3a3a3;/* secondary text */
  --subtle: rgba(255,255,255,0.4); /* section labels, placeholders */
  --border: #404040;
  --accent: #fc4c01;          /* THE orange. primary CTA, active states, focus ring */
  --accent-foreground: #ffffff;
  --ring: #fc4c01;
  --buy: #22c55e;             /* keep green/red but slightly desaturated in use */
  --sell: #ef4444;
  --radius: 0.375rem;
}
:root { /* light mode, secondary */
  --background: #ffffff; --card: #F5F5F7; --surface: #ebebeb;
  --foreground: #333333; --muted-foreground: #6b7280; --border: #e5e7eb;
  --accent: #fc4c01;
}
```

### The signature border ("border-apple")
This is the most important detail. Panels and pill buttons have NO normal border. They use a stacked inset shadow that fakes a machined edge (light catching the top, dark at the bottom):

```css
.border-apple {
  box-shadow:
    inset 0 0 0 1px rgba(255,255,255,0.07),
    inset 0 1px 0 0 rgba(80,80,80,0.30),
    inset 0 -1px 0 0 rgba(0,0,0,0.30);
}
```
Light mode equivalent: `border border-black/[0.04]`.
Use `.border-apple` on: every panel, the toolbar pill, icon buttons, inputs, the order form, dropdowns, toasts.

## 3. Typography
Load via `next/font`:
- **Open Runde** (rounded sans) for headings and big numbers: `font-runde`. Weight 600-700, tight tracking.
- **Inter** for body/UI: `font-sans`.
- **Geist Mono** for prices, sizes, order IDs, addresses, CLI-ish bits: `font-mono`.

Scale (copy these exactly):
- Page hero / market name: `font-runde text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-balance` (letter-spacing about -0.025em)
- Section title: `font-runde text-2xl sm:text-3xl font-bold tracking-tight`
- Card title: `font-runde text-base font-semibold tracking-tight`
- Body: Inter 16px / 24px, `text-foreground`, long text in `text-muted-foreground`
- Section labels (sidebar groups, table group headers): `text-xs font-medium uppercase tracking-[0.12em] text-foreground/40`
- Nav items: Inter 15px, inactive `text-white/50`, hover `text-white/80`, active `text-white`
- ALL numbers: `tabular-nums`. Prices and sizes in Geist Mono. Numbers must never jitter when they update.

## 4. Layout & spacing
- Body is pure black. The main content sits in ONE big floating card: `bg-card rounded-[28px] md:rounded-[45px] border-apple`, inset from the viewport by `p-2 md:p-3` so a black frame shows around it. This "card floating on black" is the core look.
- Left sidebar lives OUTSIDE the card, directly on black.
- Inside the card: generous padding (`p-6 md:p-10`), gaps of `gap-4` between sibling blocks, `gap-8`+ between sections. Never cramp.
- Nested blocks inside the card (orderbook, chart, order form, tables) use `bg-surface rounded-2xl border-apple`. Corner radius steps down as you go deeper: 45px → 16px → 12px → full pills.
- Max text line length ~65ch.

## 5. Components (build these as reusable primitives in `components/ui`)

**Sidebar (markets / nav)**
- Group labels in the uppercase-tracked style above.
- Items are plain text, no backgrounds. Active item: white text + a **thin dotted orange "hook" line** that curves from the group's left rail into the active item (SVG path, `stroke: var(--accent)`, `stroke-dasharray: 2 3`, 1px). The hook animates to the new item with a spring when selection changes (framer-motion `layoutId`).
- Top of sidebar: logo + breadcrumb (`Exchange / Markets`) and a `⌘K` kbd chip (`bg-neutral-800 rounded-md text-xs px-2 py-1 text-white/60`).
- Items near the top/bottom edges of the scroll area fade + blur out (mask-image gradient) like Rare UI's sidebar.

**Floating toolbar pill (top-right of the card)**
- One `rounded-full bg-neutral-900 border-apple p-1` container holding a text button and a row of circular icon buttons, separated by a 1px vertical divider (`w-px h-6 bg-white/10`).
- Icon buttons: `h-10 w-10 rounded-full flex items-center justify-center text-white/80 hover:bg-neutral-800 hover:text-white transition-colors`, icons 18-20px, stroke 1.5.
- Use it for: theme toggle, fullscreen chart, layout switch, settings.

**Tooltip**
- Small dark pill below the trigger: `bg-neutral-800 text-white text-sm rounded-lg px-3 py-1.5 border-apple`, fades + slides 4px in, 150ms.

**Buttons**
- Primary (Buy / Place order / Connect): `bg-[#fc4c01] text-white rounded-xl h-11 px-5 font-medium` with a subtle inner top highlight (`inset 0 1px 0 rgba(255,255,255,0.25)`), hover brightens slightly, active `scale-[0.97]`.
- Secondary: `bg-neutral-900 border-apple text-white/80 rounded-xl`, hover `bg-neutral-800 text-white`.
- Buy/Sell segmented control: pill container `bg-neutral-900 rounded-full p-1 border-apple`, sliding thumb animated with `layoutId`; thumb is green-tinted for Buy, red-tinted for Sell (`bg-buy/15 text-buy`), never fully saturated fills.

**Inputs (price, size, search)**
- `bg-neutral-900 border-apple rounded-xl h-11 px-4 font-mono tabular-nums`, placeholder `text-white/30`, focus: `ring-2 ring-[#fc4c01]/50` with no harsh outline. Unit suffix (USDC, SOL) inside the input, right-aligned in `text-white/40`.
- Percentage chips under size input (25/50/75/Max) as tiny pills.

**Code/command style chip** (for addresses, tx hashes, API keys)
- `bg-neutral-900 rounded-xl px-4 py-3 font-mono text-sm` with the important part white and the rest `text-white/40`, plus a copy icon button on the right that morphs into a check on click.

**Orderbook**
- Mono, tabular, 13px. Rows 24px tall. Depth bars as faint fills (`bg-sell/10`, `bg-buy/10`) growing from the right.
- Price that just changed flashes its color for 400ms then fades back.
- Spread row in the middle: big `font-runde` last price, colored by direction, with a tiny arrow.

**Chart panel**
- Chart sits in a `bg-surface rounded-2xl` block, no gridline noise: gridlines `rgba(255,255,255,0.04)`, axis labels `text-white/40` mono 11px. Crosshair label in the orange accent.

**Tables (open orders, trade history, balances)**
- No vertical lines, no zebra. Header row in the uppercase-label style. Rows separated by `border-white/[0.06]`, hover `bg-white/[0.02]`. Empty state: centered muted text + small icon, not a blank box.

**Toasts (order filled, cancelled, error)**
- Bottom-center dark pill, `border-apple`, slides up with spring, stacks with slight scale-down for older ones. Include an Undo action where it makes sense (cancel order).

**Contents / right rail (for docs, market info, FAQ pages)**
- Simple text list, inactive `text-white/50`, active white with the same dotted orange hook indicator.

## 6. Texture & depth
- No gradients on surfaces except: very subtle radial glow behind hero/market header (`radial-gradient(circle at 50% 0%, rgba(255,255,255,0.04), transparent 60%)`).
- Optional large, very low-contrast background shape (like Rare UI's giant flower) behind the landing hero only: `#1a1a1a` on `#121212`.
- Depth comes from layering (#000 → #121212 → #171717 → #262626) + border-apple, NOT from drop shadows.

## 7. Motion
- Use framer-motion. Default spring: `{ type: "spring", stiffness: 400, damping: 30 }`. Default tween: 150-200ms `ease-out`.
- Every interactive element has `transition-colors`. Press states use `active:scale-[0.97]`.
- Active indicators (sidebar hook, tabs, segmented control) move with shared `layoutId`, never jump.
- Respect `prefers-reduced-motion`.

## 8. Rules
- Dark first. Every screen must look finished in dark before touching light.
- Orange is rare: only primary CTA, active indicator, focus ring, crosshair. If more than ~5% of a screen is orange, pull it back.
- Green/red only for market direction, always at reduced opacity for fills.
- No pure white body text; white is reserved for headings and active states.
- No default shadcn look anywhere: replace every default border with border-apple, bump radii, loosen spacing.
- Icons: lucide, stroke 1.5, 18-20px.

## 9. Process
1. Write `DESIGN.md` from this spec and set up tokens, fonts, `.border-apple`, and base primitives (Button, IconButton, Input, Pill, Tooltip, Card, Label, Kbd, SegmentedControl, Toast).
2. Build a `/design` route that renders every primitive in all states so I can review them first. Stop and show me.
3. Then migrate screens in this order: app shell (sidebar + floating card + toolbar) → trade page (chart, orderbook, order form, tables) → markets list → landing page → remaining pages.
4. After each screen, run the app, take a screenshot, compare against the spec, fix spacing/contrast issues before moving on.