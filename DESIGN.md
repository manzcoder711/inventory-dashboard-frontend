# Design Direction

Recorded before any component styling, per the project's design process — decide once, apply everywhere, rather than accumulating per-component defaults.

This is a working tool for managing inventory, not a marketing site. The design favours calm, legible, low-noise UI over anything vibrant or decorative.

## Palette

| Token | Hex | Role |
|---|---|---|
| `--color-surface` | `#FFFFFF` | Cards, table, form backgrounds |
| `--color-surface-alt` | `#F1F5F9` | Page background behind cards |
| `--color-text` | `#1E293B` | Primary text |
| `--color-text-muted` | `#64748B` | Secondary text, labels, placeholders |
| `--color-primary` | `#1D4ED8` | Buttons, links, focus ring |
| `--color-destructive` | `#DC2626` | Delete actions, error states |
| `--color-accent` | `#D97706` | Low-stock highlighting — used as a background tint or left-border, not solid button fill (doesn't carry enough contrast for white text) |

`--color-primary` is blue-700 rather than the more common blue-600, specifically so white button text sits at roughly 6.5:1 contrast instead of a borderline ~4.5:1. Full WCAG AA verification is a follow-up pass (Story 2.4); this choice is a head start on it, not a substitute for it.

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

## Density

**Comfortable dashboard**, not a dense data tool. This is a portfolio piece meant to read well at a glance — prioritise breathing room over cramming maximum rows on screen.

## Implementation

All tokens above are implemented as CSS custom properties in `src/styles.scss`, defined once at `:root`. Components reference `var(--token-name)` rather than hardcoding values.
