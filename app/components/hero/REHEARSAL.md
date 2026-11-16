# Rehearsal: markets hero demo

`HeroDemo.tsx` + `hero-demo.css`, built with the stageshow kit in `components/stageshow/kit`.

**Gold it started from:** `dark-hero` (depth from surface steps on black, one lit colour, a list that moves by its height), with the cursor beats borrowed from `hero-demo`. Layout: corner bleed, off the right and the bottom.

**What changed from the gold**
- The window is the exchange's own chrome (a 24px panel with the machined edge) instead of a browser window; tokens are mapped from `app/globals.css`.
- Story: type a quantity, place a buy, the bid rests in the book, the market trades into it, a toast confirms. Reset has causes: the toast times out and the ticket clears, then the next trade prints at the ask.
- The slot bleeds 40px past its column so the page card, not an invisible box, cuts the screen.
- Poster (reduced motion, thumbnails): the filled state with the toast up.

**Filmed:** `film.mjs --gate` at 1440 dark, 12 frames, plus stills at 390 and in light.

**Gate result: not passed.** Lines left:
- `uneven gutters` on the ticket block (20px from the panel's left, the other columns to its right). It is a three-column screen inside one panel; I left it rather than flatten the nested surfaces the real product uses.
- Six `kit override` lines naming `.ss-phone…` selectors. No phone is used here; they come from the kit's own stylesheet as Next bundles it.
- `jump: ss-field__chars "2"` is a typed character landing.

**Not checked:** the compact (358px) design was looked at as a still only, not filmed as a loop; no fresh-eye review pass was run; hover/pause behaviour offscreen was not watched by hand.
