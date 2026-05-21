# Theme accessibility audit (Ze[hub] / Ze[meet])

Last reviewed: 2026-05-20

## Token contrast (WCAG AA targets)

| Pair | Light ratio | Dark ratio | Body (4.5:1) | Large UI (3:1) |
|------|-------------|------------|--------------|----------------|
| `--text-primary` on `--bg-base` | ~16.1:1 | ~15.2:1 | Pass | Pass |
| `--text-secondary` on `--bg-base` | ~4.6:1 | ~6.8:1 | Pass | Pass |
| `--text-tertiary` on `--surface-1` | ~3.4:1 | ~4.1:1 | Large text only | Pass |
| `--brand-primary` on `--bg-base` | ~4.8:1 | ~5.9:1 | Pass | Pass |
| `--brand-text-on` on `--brand-primary` (buttons) | ~8.2:1 | ~7.4:1 | Pass | Pass |
| `--success` on `--success-bg` | ~4.9:1 | ~5.1:1 | Pass | Pass |
| `--error` on `--error-bg` | ~5.2:1 | ~4.7:1 | Pass | Pass |

Ratios computed with WebAIM-style relative luminance on token hex values in `src/styles/tokens.css`.

## Non-color signals

- Status pills and form errors should pair **icon + text** (ongoing component pass).
- Focus rings use `2px solid var(--brand-primary)` with offset in shared button/input primitives.

## Motion

- Theme surface transitions: `200ms` on `background-color`, `color`, `border-color` only (`tokens.css`).
- Disabled when `prefers-reduced-motion: reduce`.

## Color blindness

Semantic hues in dark mode remain distinguishable when desaturated to grayscale (success/error/warning/info differ in lightness).

## ZeMeet exceptions

- Caption overlay on video may use `#FFFFFF` on `rgba(0,0,0,0.6)` (spec exception).
- Video stage uses `--zemeet-video-bg` (`#0A0A0D` dark) to reduce halation against camera feeds.

## QA checklist

- [ ] Toggle Light / Dark / System on every major route
- [ ] Keyboard-navigate modals, drawers, menus in dark mode
- [ ] Chrome DevTools — protanopia, deuteranopia, tritanopia, achromatopsia
- [ ] OLED + LCD spot check
- [ ] Hard refresh — no FOUC (`themeBootScript` + `ze-theme`)
