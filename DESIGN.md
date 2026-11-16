# Exchange design system

Dark, Apple-ish, tactile, quiet. The reference for the feel is rareui.com; nothing of its brand is copied.

**In one line:** a pure black canvas, slightly lifted charcoal panels with huge rounded corners, hairline inset borders that look machined, one hot orange accent, a rounded display face for headings, Inter for everything else, room to breathe, and every hover and press animated softly.

Review every primitive live at **`/design`**.

---

## 1. Where things live

| What | Where |
|---|---|
| Tokens, `border-apple`, utilities | `app/globals.css` |
| Fonts, providers | `app/layout.tsx`, `app/providers.tsx` |
| Primitives | `components/ui/*` |
| Motion pieces (beUI) | `components/motion/*`, `components/charts/sparkline.tsx` |
| App shell (sidebar, card, toolbar, ⌘K) | `app/components/shell/*` |
| Hero demo (stageshow) | `app/components/hero/*`, kit in `components/stageshow/kit` |
| Motion tokens | `lib/motion.ts` |

Stack: Tailwind CSS v4 (CSS-first, no `tailwind.config`), coss ui on Base UI for primitives, beUI for motion components, `motion/react` for animation, `next-themes` for the theme.

**Component sourcing rule.** Before building a control, look in coss (`npx shadcn@latest add @coss/<name>`), then beUI (`@beui/<name>`). Hand-write only what neither has. What is hand-written today: `IconButton`, `Pill`/`ChipButton`, `Segmented`, `Panel`/`Surface`, `CopyChip`, `HookNav`, `TokenIcon`.

> React 18 note: coss assumes React 19's ref-as-prop. `Button` is wrapped in `forwardRef` so it can be a trigger (`render={<Button />}`). Do the same for any other component you pass to a `render` prop. Re-running `shadcn add --overwrite` replaces restyled files, so add new components one at a time without `--overwrite`.

---

## 2. Tokens

Dark is the default and primary theme (`<html class="dark">`). Light is secondary.

| Token | Dark | Light | Use |
|---|---|---|---|
| `--background` | `#000000` | `#ffffff` | App canvas |
| `--card` | `#121212` | `#f5f5f7` | The floating panel |
| `--surface` | `#171717` | `#ebebeb` | Nested blocks, inputs, pills |
| `--surface-hover` | `#262626` | `#e2e2e4` | Hover on surfaces, thumbs |
| `--popover` | `#262626` | `#ffffff` | Tooltips, menus, toasts |
| `--foreground` | `#e5e5e5` | `#333333` | Body text |
| `--heading` | `#ffffff` | `#0a0a0a` | Headings, active states |
| `--muted-foreground` | `#a3a3a3` | `#6b7280` | Secondary text |
| `--subtle` | `white / 40%` | `black / 42%` | Section labels, placeholders |
| `--hairline` | `white / 6%` | `black / 6%` | Row separators |
| `--border-strong` | `#404040` | `#e5e7eb` | The spec's border, when a visible line is wanted |
| `--brand` | `#fc4c01` | `#fc4c01` | THE orange |
| `--buy` / `--sell` | `#22c55e` / `#ef4444` | `#16a34a` / `#dc2626` | Market direction only |

Tailwind classes follow the names: `bg-card`, `bg-surface`, `text-heading`, `text-subtle`, `border-hairline`, `bg-brand`, `text-buy`, `bg-sell/10`.

**Two deliberate departures from the original spec**

1. The orange is `--brand` (also `--primary` and `--ring`), not `--accent`. coss and beUI use `accent` for hover backgrounds on menu items and ghost buttons; mapping it to orange would turn every hover orange.
2. `--border` is `white / 8%`, not `#404040`. Every coss primitive applies `border-border` by default and `#404040` hairlines read heavy on `#121212`. `#404040` is kept as `--border-strong`.

### The signature edge: `border-apple`

Panels and pill buttons have no normal border. A stacked inset shadow fakes a machined edge, light catching the top and dark at the bottom:

```css
inset 0 0 0 1px rgba(255,255,255,0.07),
inset 0 1px 0 0 rgba(80,80,80,0.30),
inset 0 -1px 0 0 rgba(0,0,0,0.30);
```

Light mode: `inset 0 0 0 1px rgba(0,0,0,0.05)`.

It is a Tailwind utility that only owns the inset-shadow slot, so it composes with `ring-*` and `shadow-*` (a focused input keeps its edge and gains the ring). Use it on every panel, the toolbar pill, icon buttons, inputs, the order form, dropdowns, toasts.

---

## 3. Typography

Loaded with `next/font`:

- **Open Runde** (`font-runde`): headings and big numbers. 600 to 700, tight tracking. From `@fontsource/open-runde`.
- **Inter** (`font-sans`): body and UI.
- **Geist Mono** (`font-mono`, or the `num` utility): prices, sizes, order IDs, addresses.

| Role | Classes |
|---|---|
| Page hero / market name | `font-runde text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-balance` |
| Section title | `font-runde text-2xl sm:text-3xl font-bold tracking-tight` |
| Card title | `font-runde text-base font-semibold tracking-tight` (`SurfaceTitle`) |
| Body | Inter 16/24, `text-foreground`; long text `text-muted-foreground`; max ~65ch |
| Section label | `label-caps` (12px, 500, uppercase, 0.12em, `--subtle`) |
| Nav item | Inter 15px; inactive `foreground/50`, hover `foreground/80`, active `heading` |
| Number | `num` (Geist Mono, tabular). Numbers never jitter when they update |

No pure white body text. White is for headings and active states.

---

## 4. Layout

- The body is black. The page sits in **one** floating card: `Panel` = `bg-card rounded-[28px] md:rounded-[45px] border-apple`, inset from the viewport by `p-2 md:p-3` so a black frame shows around it.
- The sidebar lives outside the card, directly on black. Below `lg` it moves into a left drawer.
- Inside the card: `p-5 md:p-8 xl:p-10`, `gap-4` between sibling blocks, `gap-8` or more between sections.
- Nested blocks: `Surface` = `bg-surface rounded-2xl border-apple`.
- Radius steps down with depth: 45 → 16 → 12 → pill.
- Page grids use **container queries** (`@container`, `@3xl:`, `@6xl:`), because the card's width changes when the sidebar collapses, not only when the viewport does.
- Depth comes from layering (`#000 → #121212 → #171717 → #262626`) plus `border-apple`. Never from drop shadows.
- The only gradient on a surface is `hero-glow`: a very faint radial behind a page header.

---

## 5. Components

| Component | File | Notes |
|---|---|---|
| Button | `ui/button.tsx` (coss) | `default` is orange with an inner top highlight; `secondary`, `ghost`, `link`, `destructive` (tinted). `h-11 rounded-xl`. Press `scale-[0.97]`. `loading` prop |
| IconButton | `ui/icon-button.tsx` | Circular 40px, always has a tooltip. `bare` inside a pill, `solid` alone |
| Toolbar pill | `shell/Toolbar.tsx` | `rounded-full bg-surface border-apple p-1`, a text button, a `w-px h-6` divider, icon buttons |
| Tooltip | `ui/tooltip.tsx` (coss) | Below the trigger, fades and slides 4px, 150ms |
| Input / InputGroup | `ui/input.tsx`, `ui/input-group.tsx` (coss) | `h-11 rounded-xl`, mono, unit suffix inside. Focus is `ring-2 ring-brand/50`. `data-surface="nested"` when it sits on a Surface |
| ChipButton | `ui/pill.tsx` | Percentage chips, filters |
| Segmented | `ui/segmented.tsx` | Sliding thumb on a shared `layoutId`. `tone: "buy" \| "sell"` tints the thumb (15%), never a saturated fill. Arrow keys work |
| Tabs | `ui/tabs.tsx` (coss) | Pill list, sliding indicator |
| Pill | `ui/pill.tsx` | `neutral`, `buy`, `sell`, `brand`; `dot` and `live` |
| Kbd | `ui/kbd.tsx` (coss) | `bg-surface-hover rounded-md text-xs` |
| CopyChip | `ui/copy-chip.tsx` | Mono chip for IDs and hashes; copy icon morphs to a check |
| HookNav | `ui/hook-nav.tsx` | Text-only list. The active item gets a dotted orange hook (SVG, `stroke-dasharray: 2 3`) that curves out of the left rail and springs between items. `HookNavScope` shares one hook across several lists |
| Table | `ui/table.tsx` (coss) | No vertical lines, no zebra. `label-caps` header, hairline rows, hover `foreground/2%`. Always give the empty state an icon and a sentence |
| Dialog / Menu / Drawer | coss | `border-apple`, 28px / 16px radii |
| Toast | `ui/toast.tsx` (coss) | Bottom-centre, stacks with scale-down. Call through `hooks/use-toast.ts`: `toast({ variant, title, description, action })` |
| Command palette | `motion/command-palette.tsx` (beUI) | ⌘K. Items are built in `shell/AppShell.tsx` |
| NumberTicker | `motion/number-ticker.tsx` (beUI) | Rolling digits for the last price |
| Sparkline | `charts/sparkline.tsx` (beUI) | 7-day trend in the markets table |
| DepthRow | `app/components/depth/DepthRow.tsx` | 24px, mono 13px, depth bar from the right at 10%, flashes its colour for 400ms when the size changes |

**Chart.** `ChartManager` reads its colours from CSS variables: gridlines `--chart-grid` (4%), axis text `--chart-text` in Geist Mono 11px, crosshair labels in the orange. It is rebuilt when the theme changes.

---

## 6. Motion

- Default spring: `{ type: "spring", stiffness: 400, damping: 30 }` (`SPRING` in `lib/motion.ts`). Default tween: 150 to 200ms ease-out.
- Every interactive element has a colour transition. Presses scale to 0.97.
- Active indicators (sidebar hook, tabs, segmented thumb) move on a shared layout. They never jump.
- `MotionConfig reducedMotion="user"` plus a global `prefers-reduced-motion` rule: motion collapses, the hero demo shows its poster frame.

---

## 7. Rules

- Dark first. A screen is finished in dark before light is touched.
- Orange is rare: the primary CTA, the active indicator, the focus ring, the crosshair. If more than about 5% of a screen is orange, pull it back.
- Green and red mean market direction and nothing else, and fills are always tinted.
- No default shadcn look: no default borders, no small radii, no cramped spacing.
- Icons: lucide, stroke 1.5, 18 to 20px.
