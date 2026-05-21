"use client";

import { hiringHeroRadialOverlay } from "./hiringTokens";
import { HiringHeroTexture } from "./HiringHeroTexture";

/**
 * In-hero decoration only (texture + subtle white radial highlights).
 * No external blur or accent-colored glow — prevents tint bleed outside the card.
 */
export function HiringHeroDecor() {
  return (
    <>
      <HiringHeroTexture />
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
        aria-hidden
        style={hiringHeroRadialOverlay}
      />
    </>
  );
}
