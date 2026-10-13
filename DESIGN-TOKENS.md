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
- The textured canvas is part of QR Studio's visual identity. It belongs behind the interface, never inside controls or in a way that competes with the QR preview.

## Visual Identity Palette

The following five colors are the canonical QR Studio identity palette. These are brand primitives, not interchangeable semantic roles.

| Token | Value | Name | Role |
| --- | --- | --- | --- |
| `brand-copper` | `#C05746` | Rosy Copper | Primary brand color and primary action emphasis |
| `brand-olive` | `#ADC698` | Muted Olive | Secondary brand color, supporting selections, and ambient color |
| `brand-tea` | `#D0E3C4` | Tea Green | Soft supporting tint and ambient texture color |
| `brand-white` | `#FFFFFF` | White | Clean work surfaces |
| `brand-blackberry` | `#503047` | Blackberry Cream | Deep contrast color and occasional tertiary brand accent |

### Derived brand tokens

Derived colors may be used where interaction states require them. They should remain visually related to the five canonical colors rather than introducing unrelated saturated hues.

| Token | Value | Use |
| --- | --- | --- |
| `primary` | `#C05746` | Primary actions, active emphasis, key focus cues |
| `primary-hover` | `#B04B3C` | Primary hover/pressed progression |
| `primary-soft` | `#F3D7D4` | Low-emphasis copper tint |
| `secondary` | `#ADC698` | Supporting selection and secondary emphasis |
| `secondary-hover` | `#98B482` | Secondary hover/pressed progression |
| `secondary-soft` | `#E8F1DE` | Low-emphasis olive/tea tint |
| `deep-accent` | `#503047` | Deep contrast accent; use sparingly |

The primary interaction color is Rosy Copper. Muted Olive is complementary, not a competing primary CTA color. Blackberry Cream should provide depth and contrast without becoming a second dominant action color.

## Semantic Color Tokens

### Light theme

| Token | Value | Use |
| --- | --- | --- |
| `canvas` | `#FAF9F6` | Warm app background beneath the texture layer |
| `surface` | `#FFFFFF` | Primary work surfaces |
| `surface-raised` | `#F3F1EC` | Raised or grouped neutral surfaces |
| `control` | `#F6F3EE` | Neutral control backgrounds |
| `border` | `#E5E0D9` | Default borders and dividers |
| `border-hover` | `#D4CCC3` | Hovered neutral borders |
| `text-primary` | `#2E2A28` | Primary text |
| `text-secondary` | `#6B645F` | Supporting text |
| `text-muted` | `#9A928C` | Low-emphasis metadata and hints |
| `text-inverse` | `#FFFFFF` | Text on strongly colored surfaces |
| `accent` | `#C05746` | Primary actions, focus, selected state |
| `accent-hover` | `#B04B3C` | Accent hover/pressed state |
| `accent-soft` | `#F3D7D4` | Soft selected or highlighted surface |
| `support` | `#ADC698` | Secondary brand emphasis |
| `support-soft` | `#E8F1DE` | Quiet supportive tint |
| `deep-accent` | `#503047` | Occasional deep visual anchor |
| `success` | `#7CA96B` | Successful state |
| `warning` | `#D9A24C` | Warning state |
| `danger` | `#D96B64` | Destructive or invalid state |
| `info` | `#6B8BA4` | Informational state |

### Dark theme

Dark mode uses the same semantic roles and preserves the warm, muted character rather than mechanically inverting the light theme.

| Token | Value |
| --- | --- |
| `canvas` | `#21191F` |
| `surface` | `#2B2129` |
| `surface-raised` | `#352831` |
| `control` | `#3D2F39` |
| `border` | `#594651` |
| `border-hover` | `#6D5663` |
| `text-primary` | `#FAF7F4` |
| `text-secondary` | `#D4C9C3` |
| `text-muted` | `#A997A0` |
| `text-inverse` | `#2E2A28` |
| `accent` | `#D47766` |
| `accent-hover` | `#E18A79` |
| `accent-soft` | `#4E302F` |
| `support` | `#B8CDA7` |
| `support-soft` | `#394335` |
| `deep-accent` | `#9A718F` |
| `success` | `#8EB57C` |
| `warning` | `#E0AE61` |
| `danger` | `#E27C74` |
| `info` | `#81A0B8` |

`system` follows the operating system or browser color-scheme preference and resolves to the corresponding light or dark semantic token set.

## Background Texture

The textured background is a canonical part of QR Studio's identity. It should feel tactile, quiet, and slightly editorial without reducing the clarity of the working interface.

### Light appearance

- Base canvas: `#FAF9F6`.
- Add a fine paper-like grain at approximately **3-4% visible opacity**.
- Add a small number of **large, irregular organic color fields** using Rosy Copper, Muted Olive, Tea Green, and Blackberry Cream.
- Color fields should be strongly muted by opacity, normally **8-16%** over the canvas.
- Individual forms should be large enough to read as atmosphere rather than decoration: approximately **28-56vw** across on desktop.
- Forms may extend beyond viewport edges and overlap lightly.
- The texture should resemble pigment or paper grain, not digital noise, glow, glass, or a glossy gradient.
- Keep the central working surfaces mostly opaque. The texture should frame the interface, not show strongly through inputs, cards, menus, or QR preview surfaces.

### Dark appearance

- Preserve the same tactile concept against the dark canvas.
- Grain should be slightly quieter, approximately **2-3% visible opacity**.
- Use copper, olive, tea, and blackberry fields at approximately **6-10% opacity**.
- Do not brighten dark-mode forms enough to create glowing patches behind the interface.

### Texture behavior

- Texture is decorative and must never carry information.
- Texture must not animate.
- Texture may be fixed to the viewport while content scrolls.
- Avoid small repeated motifs or high-frequency patterns.
- Do not place a high-contrast color field directly behind text that is rendered without an opaque or sufficiently protective surface.
- Under forced-colors or other accessibility modes where the texture would interfere, it may be removed entirely.

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
| Raised | `0 1px 2px rgba(46, 42, 40, 0.06)` | Cards and dropdowns |
| Floating | `0 8px 24px rgba(46, 42, 40, 0.10)` | Dialogs, popovers, temporarily floating UI |

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

Keyboard focus must use a clearly visible Rosy Copper accent treatment. Prefer an outer focus ring or equivalent treatment that does not shift layout.

### Selected and supporting states

Use Rosy Copper for the primary active/focus cue. Muted Olive or Tea Green may support low-emphasis selected surfaces, secondary state, or ambient grouping, but should not compete with the primary action hierarchy.

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
2. Treat the five-color identity palette and textured canvas as canonical unless this specification is explicitly revised.
3. If a new value is necessary, confirm that it solves a recurring design need rather than a one-off alignment issue.
4. Promote recurring exceptions into this document instead of allowing silent token drift.
5. Keep light, dark, and system themes semantically equivalent.
6. Treat accessibility, QR scan reliability, and clarity as higher priorities than visual consistency when a genuine conflict exists.

This token system defines visual consistency. It does not override the product and interaction principles in `DESIGN.md`.