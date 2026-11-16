# Mobile pass prompt: Centralized Exchange

Paste everything below into Claude Code from the repo root.

---

The desktop redesign is done and approved. Don't change the look. Now make every screen feel native on mobile. Same tokens, same border-apple, same fonts, same orange. This is a layout + interaction pass for small screens only.

## 0. First, audit before you touch anything
1. Run the app and use Playwright to screenshot every route at **360x800, 390x844 and 430x932** (and 768x1024 for tablet).
2. On each screenshot, list every problem: horizontal scroll, overflowing text, cramped padding, uneven gaps, misaligned edges, tiny tap targets, clipped tables, elements overlapping, things hidden behind the browser bar.
3. Write the list to `MOBILE_AUDIT.md`, grouped by screen. Show me the list before fixing.

## 1. Global rules (fix these everywhere)
- **No horizontal scroll, ever.** Add a test: `document.documentElement.scrollWidth <= window.innerWidth` on every route at 360px.
- Use `min-h-dvh` / `h-dvh`, not `100vh` (mobile browser bars break vh).
- Respect safe areas: `pb-[env(safe-area-inset-bottom)]` on anything fixed to the bottom, `viewport-fit=cover` in the viewport meta.
- Tap targets minimum **44x44px**. Icon buttons stay 40px visually but get a 44px hit area.
- All inputs **16px font-size minimum** on mobile so iOS doesn't zoom on focus.
- Nothing relies on hover. Every hover state needs a matching `active:` state; tooltips become long-press or are dropped on touch (`@media (hover: none)`).
- One consistent horizontal page padding on mobile: `px-4`. Every block's left edge must line up on that same line. This is where most of the "unevenness" comes from, so check it hardest.
- Vertical rhythm on mobile: `gap-3` between sibling blocks, `gap-6` between sections. Don't mix random values.

## 2. Shell changes
- **Floating card:** on mobile the outer black frame shrinks to `p-1.5` and the card radius drops to `rounded-[24px]` (45px looks bloated on a phone). Inner padding `p-4`.
- **Sidebar:** hidden below `md`. It becomes a left drawer or bottom sheet opened from a menu icon button, same group labels, same dotted orange hook indicator. Drawer slides with the default spring, backdrop `bg-black/60 backdrop-blur-sm`, closes on swipe and on route change.
- **Toolbar pill:** keep it, but only the 2-3 most important icons. Overflow the rest into a `•••` icon button that opens a small popover.
- **Headings:** scale down. Market name hero `text-3xl` on mobile, section titles `text-xl`. Keep `text-balance`.

## 3. Trade page (most important screen)
Desktop shows chart + orderbook + form + tables side by side. On mobile that can't work, so restructure:
- **Top:** compact market header: pair name, last price in `font-runde text-2xl tabular-nums`, 24h change pill. Pair switcher opens a full-height bottom sheet with search.
- **Middle:** a segmented tab control (same sliding-thumb style as Buy/Sell): **Chart / Book / Trades**. Only one visible at a time. Chart height `~45dvh`.
- **Orderbook on mobile:** show 8-10 levels per side, drop the total column if it doesn't fit, keep depth bars and price flashes.
- **Bottom:** a sticky action bar fixed to the bottom with two big buttons, **Buy** (green-tinted) and **Sell** (red-tinted), full width split 50/50, `h-12`, above the safe area.
- Tapping Buy/Sell opens the **order form as a bottom sheet** (drag handle, rounded top 24px, border-apple, snaps to content height, swipe down to close). Order type tabs, price, size, % chips and the orange submit button live inside it. Keyboard must not cover the submit button: sheet scrolls and the button stays visible.
- **Open orders / history / balances:** below the main area as tabs. Tables become **stacked cards** on mobile: each row is a card with pair + side on top line, price/size/filled in a 2-col grid of label/value, cancel as a full-width secondary button or swipe-to-cancel with an Undo toast.

## 4. Other screens
- **Markets list:** table becomes a list. Each row: pair + volume on the left, price + 24h change pill on the right, 56px tall, whole row tappable. Sort options in a horizontal scroll chip row (`overflow-x-auto snap-x`, hide scrollbar, fade mask on the right edge).
- **Landing:** hero text scales down, CTA buttons full width and stacked, any background shape scaled so it doesn't cause overflow.
- **Forms / auth / settings:** single column, full-width inputs and buttons.
- **Toasts:** bottom-center, but sit above the sticky Buy/Sell bar, not on top of it.

## 5. Breakpoints
- `< 640` phone layout (everything above)
- `640-1023` tablet: sidebar still a drawer, trade page shows chart + book side by side, order form inline below them (no sheet)
- `>= 1024` keep the current desktop exactly as is. Don't regress desktop.

## 6. Done means
- Re-run the Playwright screenshots at all 4 sizes, compare with the audit, and tick off every item in `MOBILE_AUDIT.md`.
- No horizontal scroll test passes on every route.
- Desktop screenshots at 1440 are pixel-identical to before (or show me the diff).
- Then show me before/after screenshots for the trade page and markets list at 390px.