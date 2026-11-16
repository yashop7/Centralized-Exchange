/** Shared motion tokens. See DESIGN.md §7. */

/** Default spring: active indicators, thumbs, toasts. */
export const SPRING = { type: "spring", stiffness: 400, damping: 30 } as const;

/** Softer spring for larger surfaces entering. */
export const SPRING_SOFT = {
  type: "spring",
  stiffness: 260,
  damping: 30,
} as const;

/** Default tween: hovers, fades. */
export const TWEEN = { duration: 0.18, ease: [0.22, 1, 0.36, 1] } as const;

export const EASE_OUT_QUINT = [0.22, 1, 0.36, 1] as const;
