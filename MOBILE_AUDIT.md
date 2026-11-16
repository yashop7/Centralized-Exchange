# Mobile audit

Screens checked at 360x800, 390x844, 430x932 and 768x1024 with Playwright (touch emulation on).
Routes: `/markets`, `/trade/TATA_INR`, `/trade/SOL_USDC`, `/design`, 404.

Status key: `[ ]` open, `[x]` fixed and re-checked.

## Global

- [ ] G1. Inputs are 14px or 15px, so iOS zooms the page on focus (search field, price, quantity, order value).
- [ ] G2. Tap targets under 44px: icon buttons (40), segmented options (28 and 36 tall), percentage chips (28), tabs (32), favourite stars (28), checkbox labels (20).
- [ ] G3. No `viewport-fit=cover`, and nothing fixed to the bottom respects the safe area.
- [ ] G4. Tooltips open on tap and stay stuck on touch screens.
- [ ] G5. Page padding is 20px inside a 28px-radius card with an 8px frame. The mobile top bar sits on a different left edge (20px) from the card content (28px).
- [ ] G6. Vertical gaps are the desktop ones (32px and 48px between sections), so phones scroll a lot.
- [x] G7. Horizontal page scroll: none on any route at any size (kept as a test).

## Trade page

- [ ] T1. Everything is stacked in one column: chart, book, form, orders. The page is about 3,000px tall at 390 and the order form is three screens down.
- [ ] T2. No way to place an order without scrolling: no sticky Buy / Sell.
- [ ] T3. The header leaves an empty 56px row above the pair name to clear the toolbar, and the pair name is 36px.
- [ ] T4. Ticker stats wrap unevenly: "24h change" sits on a different baseline from "Last price", and high / low start a ragged second row.
- [ ] T5. Order book reserves 11 rows per side even with 3 asks, leaving a 190px hole above the asks.
- [ ] T6. Open orders table is clipped on the right: the Filled and Side columns are cut off and can't be reached.
- [ ] T7. Chart is a fixed 420px whatever the screen height.
- [ ] T8. Tablet (768): still one column. Chart and book should sit side by side.
- [ ] T9. Toasts would land on top of a bottom action bar.

## Markets

- [ ] M1. "All markets" table is clipped on the right: prices are cut mid-number ("$64,517", "$0.9") and the 24h change is hidden under 420px.
- [ ] M2. Rows are a table, not a list: the name link is a 14px-tall target and the star is 28px.
- [ ] M3. Hero buttons sit side by side at their content width instead of full width and stacked.
- [ ] M4. Search and the Spot / Favorites switch wrap with uneven widths; the block uses 24px side padding while every other block uses 20px.
- [ ] M5. No way to change the sort on a phone.

## Design page and 404

- [ ] D1. Same global issues (G1, G2). No layout problems of their own.
