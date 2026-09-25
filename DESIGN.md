# Design Direction

Recorded before any component styling, per the project's design process — decide once, apply everywhere, rather than accumulating per-component defaults.

This is a working tool for managing inventory, not a marketing site. The design favours calm, legible, low-noise UI over anything vibrant or decorative.

## Palette

| Token | Hex | Role |
|---|---|---|
| `--color-surface` | `#FFFFFF` | Cards, table, form backgrounds |
| `--color-surface-alt` | `#F1F5F9` | Page background behind cards |
| `--color-text` | `#1E293B` | Primary text |
| `--color-text-muted` | `#475569` | Secondary text, labels, placeholders |
| `--color-primary` | `#1D4ED8` | Buttons, links, focus ring |
| `--color-destructive` | `#B91C1C` | Delete actions, error states (`.field-error`, `.form-error`) |
| `--color-accent` | `#D97706` | Low-stock highlighting — used only as a background tint, left border, or badge border, **never as text** (2.91:1 on the page background) |

`--color-primary` is blue-700 rather than the more common blue-600, so white button text sits at roughly 6.5:1 contrast instead of a borderline ~4.5:1.

### Contrast (WCAG AA, verified 2026-09-25 — Story 2.4)

Calculated with the WCAG relative-luminance formula, not by eye. AA needs 4.5:1 for body text, 3:1 for large text and UI components such as borders and focus rings.

| Pair | Ratio |
|---|---|
| `--color-text` on `--color-surface-alt` | 13.35:1 |
| `--color-primary` on `--color-surface-alt` / white | 6.12 / 6.70:1 |
| `--color-text-muted` on `--color-surface-alt` / white | 6.92 / 7.58:1 |
| `--color-destructive` on `--color-surface-alt` / white | 5.91 / 6.47:1 |

`--color-text-muted` and `--color-destructive` were darkened on 2026-09-25 (from `#64748B` / `#DC2626`, which measured 4.34 / 4.41:1 on the page background, just under AA).

## Type

System font stack — no webfont load, renders natively on every OS:

```
-apple-system, "Segoe UI", Roboto, sans-serif
```

| Token | Size | Used for |
|---|---|---|
| `--font-size-caption` | 12px | Table meta text, timestamps |
| `--font-size-body` | 14px | Default body text, table cells, form inputs |
| `--font-size-base` | 16px | Emphasized body text |
| `--font-size-subheading` | 20px | Section headings |
| `--font-size-heading` | 24px | Page titles |

Body line-height: `1.5`.

## Spacing scale

One scale, used everywhere — no one-off pixel values in component styles:

```
--space-1: 4px
--space-2: 8px
--space-3: 12px
--space-4: 16px
--space-6: 24px
--space-8: 32px
--space-12: 48px
```

## Layout

- **Page gutter:** `--space-4` (16px) on phones, `--space-6` (24px) from 768px up, set once on the app root (`app.scss`). Content never touches the screen edge.
- **Wide tables:** scroll sideways inside their own container (`overflow-x: auto`, cells don't wrap) rather than squashing or making the whole page scroll. The container is keyboard-focusable and labelled, so keyboard and screen-reader users can reach it.
- **Minimum supported width:** 375px.

## Density

**Comfortable dashboard**, not a dense data tool. This is a portfolio piece meant to read well at a glance — prioritise breathing room over cramming maximum rows on screen.

## Implementation

All tokens above are implemented as CSS custom properties in `src/styles.scss`, defined once at `:root`. Components reference `var(--token-name)` rather than hardcoding values.
