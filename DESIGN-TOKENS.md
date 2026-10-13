# QR Studio Design Tokens

## Purpose

This document is the implementation-level companion to [`DESIGN.md`](./DESIGN.md). `DESIGN.md` defines the product's design philosophy and interaction principles. This document defines the visual primitives that should make those principles consistent in the interface.

These tokens are intentionally small and restrained. Components should reuse them instead of introducing one-off values unless a documented exception is necessary.

## Token Principles

- Use semantic names instead of color names so light, dark, and system themes can share the same component definitions.
- Use the 4px spacing base consistently.
- Prefer a small number of type, radius, sizing, shadow, and motion values over component-specific values.
- Default surfaces should remain visually quiet. Elevation and accent color should communicate hierarchy, not decoration.
- The QR code remains the visual focus of the product.
- Touch targets must remain at least 44px where touch interaction is expected, even when the visible control is smaller.

## Color Tokens

### Light theme

| Token | Value | Use |
| --- | --- | --- |
| `canvas` | `#FAFAFB` | App background |
| `surface` | `#FFFFFF` | Primary surfaces |
| `surface-raised` | `#F5F7FA` | Raised or grouped surfaces |
| `control` | `#F3F4F6` | Neutral control backgrounds |
| `border` | `#E5E7EB` | Default borders and dividers |
| `border-hover` | `#D1D5DB` | Hovered neutral borders |
| `text-primary` | `#0F172A` | Primary text |
| `text-secondary` | `#475569` | Supporting text |
| `text-muted` | `#94A3B8` | Low-emphasis metadata and hints |
| `text-inverse` | `#FFFFFF` | Text on strongly colored surfaces |
| `accent` | `#2563EB` | Primary actions, focus, selected state |
| `accent-hover` | `#1D4ED8` | Accent hover state |
| `success` | `#16A34A` | Successful state |
| `warning` | `#F59E0B` | Warning state |
| `danger` | `#DC2626` | Destructive or invalid state |
| `info` | `#0EA5E9` | Informational state |

### Dark theme

Dark mode must use the same semantic token names. It should preserve the same hierarchy instead of mechanically inverting the light theme.

| Token | Value |
| --- | --- |
| `canvas` | `#09090B` |
| `surface` | `#111113` |
| `surface-raised` | `#18181B` |
| `control` | `#1C1C1F` |
| `border` | `#27272A` |
| `border-hover` | `#3F3F46` |
| `text-primary` | `#FAFAFA` |
| `text-secondary` | `#C4C4CC` |
| `text-muted` | `#8B8B95` |
| `text-inverse` | `#0F172A` |
| `accent` | `#3B82F6` |
| `accent-hover` | `#60A5FA` |
| `success` | `#22C55E` |
| `warning` | `#F59E0B` |
| `danger` | `#EF4444` |
| `info` | `#38BDF8` |

`system` follows the operating system or browser color-scheme preference and resolves to the corresponding light or dark semantic token set.

## Typography

Primary typeface: **Inter**.

Fallback stack: `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`.

| Style | Size | Line height | Weight | Intended use |
| --- | ---: | ---: | ---: | --- |
| Page title | 28px | 36px | 600 | Primary page identity |
| Section title | 20px | 28px | 600 | Major content groups |
| Subheading | 16px | 24px | 600 | Nested groups and prominent labels |
| Body | 14px | 20px | 400 | General interface copy |
| Control | 14px | 20px | 500 | Buttons, inputs, menus, tabs |
| Label | 13px | 18px | 500 | Form labels and compact descriptors |
| Caption | 12px | 16px | 400 | Hints, metadata, secondary explanation |

Guidance:

- Do not introduce smaller UI text than 12px.
- Prefer weight and spacing over excessive size changes for hierarchy.
- Labels should normally use sentence case. Uppercase should be reserved for rare cases where it improves scanning.
- Use tabular numerals where changing numeric values need to remain visually stable.

## Spacing

Base unit: **4px**.

Canonical spacing scale:

| Token | Value |
| --- | ---: |
| `space-1` | 4px |
| `space-2` | 8px |
| `space-3` | 12px |
| `space-4` | 16px |
| `space-5` | 20px |
| `space-6` | 24px |
| `space-8` | 32px |
| `space-10` | 40px |
| `space-12` | 48px |
| `space-16` | 64px |

Use the smallest token that preserves clear grouping. Avoid introducing intermediate values such as 18px, 22px, or 30px without a specific visual reason.

## Corner Radius

| Token | Value | Intended use |
| --- | ---: | --- |
| `radius-sm` | 6px | Small controls and compact elements |
| `radius-md` | 10px | Inputs and buttons |
| `radius-lg` | 14px | Panels and grouped surfaces |
| `radius-xl` | 18px | Dialogs and large surfaces |
| `radius-full` | 999px | Pills and circles |

Avoid mixing multiple radii inside the same component family without a structural reason.

## Control Heights

| Token | Value | Intended use |
| --- | ---: | --- |
| `control-compact` | 32px | Dense secondary controls |
| `control-standard` | 36px | Default desktop controls |
| `control-prominent` | 40px | Primary actions |
| `touch-target` | 44px | Minimum touch interaction target |

A visible desktop control may be 32-40px tall while retaining a 44px interactive target when needed.

## Icon System

Use one consistent outline icon family and stroke treatment.

| Token | Value | Intended use |
| --- | ---: | --- |
| `icon-inline` | 16px | Inline context |
| `icon-control` | 18px | Buttons and controls |
| `icon-navigation` | 20px | Navigation, tabs, menus |
| `icon-standalone` | 24px | Illustrative standalone actions or empty states |
| `icon-stroke` | 1.75px | Default outline stroke |

Icon-only actions require an accessible label or equivalent text alternative.

## Borders and Dividers

| Token | Value |
| --- | --- |
| Default border | `1px solid var(--border)` |
| Hover border | `1px solid var(--border-hover)` |
| Focus border | `2px solid var(--accent)` |
| Divider | `1px solid var(--border)` |

Routine cards and controls should not use 2px decorative borders. Reserve thicker borders for focus, selection, validation, or other meaningful state.

## Shadows and Elevation

| Level | Value | Intended use |
| --- | --- | --- |
| Default | `none` | Most surfaces |
| Raised | `0 1px 2px rgba(0, 0, 0, 0.06)` | Cards and dropdowns |
| Floating | `0 8px 24px rgba(0, 0, 0, 0.10)` | Dialogs, popovers, temporarily floating UI |

Elevation should be communicated primarily through surface, border, and placement. Shadows are supporting cues, not decoration.

## Motion

Canonical easing: `cubic-bezier(0.2, 0.8, 0.2, 1)`.

| Purpose | Duration | Use |
| --- | ---: | --- |
| Micro feedback | 120ms | Hover, press, selection feedback |
| Normal state change | 180ms | Routine control and state transitions |
| Disclosure / panel | 240ms | Expand, collapse, drawers, panels |

Motion must be interruptible and must not delay input. Under `prefers-reduced-motion: reduce`, nonessential animation should be removed and state changes should remain immediately understandable.

## Responsive Breakpoints

| Range | Classification | Default adaptation |
| --- | --- | --- |
| `< 600px` | Phone | Single-column or mobile-specific arrangement |
| `600-899px` | Tablet | Single adaptive column or simplified split layout |
| `900-1199px` | Compact desktop | Two-column layout where useful, reduced density |
| `>= 1200px` | Full desktop | Full intended desktop layout, with sensible max widths |

Breakpoints are adaptation thresholds, not instructions to compress the desktop UI. Layout and interaction models may change when space becomes insufficient.

## Component Density and States

Components should use the token system above rather than defining independent visual scales.

Every interactive component should define, where applicable:

- default,
- hover,
- focus-visible,
- pressed/active,
- selected,
- disabled,
- loading,
- success,
- warning,
- error.

State should not rely on color alone. Selection, validation, or status should also be conveyed through shape, border, iconography, text, or another non-color cue when necessary.

### Focus

Keyboard focus must use a clearly visible accent treatment. Prefer an outer focus ring or equivalent treatment that does not shift layout.

### Disabled

Disabled controls should remain legible but visibly unavailable. Do not reduce opacity so far that labels or control boundaries fail contrast requirements.

### Destructive actions

Danger color is reserved for destructive actions, invalid states, and errors. It should not be used as general emphasis.

## Visual Hierarchy Reference

A typical hierarchy should read approximately as:

```text
28px / 36px / 600    QR Studio
20px / 28px / 600    Appearance
16px / 24px / 600    Shape
14px / 20px / 400    General body content
14px / 20px / 500    Square
13px / 18px / 500    Error correction
12px / 16px / 400    Higher levels improve reliability
```

## Implementation Rule

When implementing or revising the interface:

1. Use these tokens before creating a new value.
2. If a new value is necessary, confirm that it solves a recurring design need rather than a one-off alignment issue.
3. Promote recurring exceptions into this document instead of allowing silent token drift.
4. Keep light, dark, and system themes semantically equivalent.
5. Treat accessibility, QR scan reliability, and clarity as higher priorities than visual consistency when a genuine conflict exists.

This token system defines visual consistency. It does not override the product and interaction principles in `DESIGN.md`.