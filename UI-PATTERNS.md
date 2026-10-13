# QR Studio UI Patterns

## Purpose

This document defines the canonical interface structure and interaction patterns for QR Studio. It complements [`DESIGN.md`](./DESIGN.md) and [`DESIGN-TOKENS.md`](./DESIGN-TOKENS.md).

`DESIGN.md` defines product and interaction principles. `DESIGN-TOKENS.md` defines visual primitives. This document defines how the interface is composed so redesign work remains structurally consistent.

## Core Interface Model

QR Studio uses three visually independent zones:

1. **Persistent navigation panel** on the left.
2. **Primary workspace** in the center.
3. **Contextual inspector panel** on the right.

The interface must not read as a traditional page with attached sidebars, header bars, or edge-to-edge chrome. The left navigation, center workspace elements, and right inspector are all **floating surfaces placed within the textured canvas**.

Nothing should visually attach to the browser viewport edges unless required by a narrow-screen adaptation.

### Floating-surface rule

On desktop:

- Every major panel keeps visible breathing room from the viewport edge.
- The left navigation and right inspector are self-contained rounded surfaces.
- Neither sidebar should visually merge with the page background or extend edge-to-edge vertically.
- The center workspace is not a boxed page column. Its controls and QR preview may use their own floating surfaces as needed.
- The textured canvas remains visible around and between all three zones.
- Separation should come from spacing, surface color, restrained border, and subtle elevation rather than hard page divisions.

Use spacing, radii, border, shadow, color, and texture values from `DESIGN-TOKENS.md`.

## Redundancy Rule

Avoid duplicating controls or navigation concepts across the interface unless the duplicate has a clear, distinct convenience purpose.

Each concept should have one canonical home:

- Content type selection (`Text`, `Link`, `Contact`, `Wi-Fi`, `More`) belongs only in the top-middle workspace selector.
- Top-level customization areas (`Style`, `Colors`, `Logo`, `Scan Quality`, `Output`) belong only in the left navigation.
- Feature-specific configuration belongs in the right inspector.
- Theme selection belongs in the persistent utility area.

Do not repeat the content-type selector in the left sidebar. The top-middle selector already performs that job, so duplicating it in navigation adds noise and creates two competing mental models for the same action.

Exceptions must be intentional shortcuts rather than parallel navigation. The pinned-controls dock and the persistent `Download PNG` quick action are valid because they provide faster access to existing settings/actions while preserving a single underlying state and canonical location.

When a proposed element appears in more than one place, first ask whether the second instance materially reduces effort. If not, remove it.

## Left Navigation Panel

The left panel is the app's persistent top-level navigation. Its structure should remain stable while the user works.

### Responsibilities

- Brand identity at the top: `QR Studio` and `by Aedwon`.
- Top-level feature navigation only.
- Utility/legal items near the bottom.
- Theme controls at the bottom edge of the panel.

### Canonical top-level feature labels

Use user-facing language, not internal implementation terminology:

- Style
- Colors
- Logo
- Scan Quality
- Output

These labels are navigation concepts. Internal feature names may differ.

Do not add content-type choices such as Text, Link, Contact, or Wi-Fi to this sidebar. Those belong exclusively to the workspace content selector.

### Secondary items

The lower utility area contains:

- Privacy
- Terms of Use
- Feedback
- Light / dark / system theme controls

Keep these visually subordinate to the main feature navigation.

### Selection behavior

Selecting a top-level feature:

- changes the right inspector to that feature's controls,
- does not replace the center workspace,
- does not navigate to a separate page,
- preserves the current QR configuration and content.

The selected item must be visually clear without relying on color alone.

## Center Workspace

The center is the user's primary working area and must remain visually dominant.

It contains:

1. Content-type selector.
2. Content input that adapts to the selected type.
3. QR preview.
4. Primary quick action for export/download.

### Content-type selector

The content selector is a workspace control, not application navigation.

Expected primary choices:

- Text
- Link
- Contact
- Wi-Fi
- More

The selector may use a segmented-control treatment. `More` may reveal less common supported content types.

This selector is the **only** primary location for choosing content type. Do not mirror these choices in the left navigation or right inspector.

### Morphing content input

The input area changes according to the selected content type.

Examples:

- Text → multiline text input.
- Link → URL field.
- Contact → contact fields.
- Wi-Fi → network configuration fields.

The transition should preserve spatial continuity and use the motion tokens in `DESIGN-TOKENS.md`.

The content-input area must not become a second navigation layer.

### QR preview

The QR preview is the visual center of gravity.

- Keep it centered or optically centered within the available workspace.
- Keep enough clear space around it that user-generated QR styling is easy to inspect.
- Do not let decorative background texture show strongly through the preview surface.
- Configuration changes should update the preview immediately where practical.

### Primary quick action

A `Download PNG` action may remain immediately available beneath or near the preview even when another feature is selected in the inspector.

This is a deliberate convenience shortcut, not a second export-navigation system. Detailed export settings belong under the `Output` inspector section.

## Right Inspector Panel

The right panel is a contextual inspector, not a second navigation menu.

Selecting an item in the left navigation changes the inspector's contents while preserving its position and overall structure.

Examples:

- `Style` → module shape, corner style, pattern, related visual styling.
- `Colors` → foreground, background, gradients or supported color options.
- `Logo` → upload, placement, size, masking or related logo controls.
- `Scan Quality` → reliability-related configuration and feedback.
- `Output` → export format and export-specific settings.

The exact subfeatures are governed by product scope. Do not expose controls merely because an implementation supports them.

### Inspector organization

- Group related controls into clear sections.
- Prefer progressive disclosure for advanced options.
- Keep routine controls visible without forcing the user through accordions unnecessarily.
- Avoid excessive nested cards.
- Use concise user-facing labels instead of internal terminology.
- Do not duplicate controls that already have a canonical home elsewhere unless they qualify as an explicit convenience shortcut.

## Pinned Controls

Users may pin frequently used subfeatures so they remain accessible without switching top-level feature sections.

### Canonical behavior

- Pin **individual controls or compact control groups**, not entire feature panels.
- Pinned controls appear in a compact dock at the top of the right inspector.
- The dock remains available when the user changes the selected left-nav feature.
- If nothing is pinned, the pinned dock is hidden entirely. Do not reserve an empty card or blank area.
- Pinned controls remain fully interactive and change the same underlying setting as their original control.
- A setting must never exist as two independent values simply because it appears both pinned and in its native section.
- Pinned items can be reordered and unpinned.
- Provide a compact way to collapse the pinned area when it contains multiple controls.

Pinned controls are the intentional exception to the general anti-redundancy rule. They mirror an existing setting solely to reduce navigation effort, and both instances must always represent the same state.

### Pin affordance

A pinnable control should expose a pin action without making every row visually noisy.

Preferred behavior:

- show the pin affordance on hover/focus for pointer/keyboard users,
- keep it discoverable through an overflow or context action where appropriate,
- provide an explicit accessible label,
- provide an equivalent touch path that does not depend on hover.

### Scope

Pinning is for high-frequency configuration, not navigation. Do not allow users to pin Privacy, Terms, Feedback, entire pages, or content-type selectors.

## Floating Layout Geometry

The exact dimensions may adapt, but the desktop composition should preserve this relationship:

```text
┌──────────────────────────────── textured canvas ────────────────────────────────┐
│                                                                                 │
│   ╭────────────╮      content selector / adaptive input      ╭──────────────╮   │
│   │ persistent │                                            │   pinned     │   │
│   │ navigation │               QR preview                   │   controls   │   │
│   │            │                                            ├──────────────┤   │
│   │            │               quick action                 │ contextual   │   │
│   │            │                                            │ inspector    │   │
│   ╰────────────╯                                            ╰──────────────╯   │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

The diagram describes relationships, not fixed pixel positions.

### Desktop spacing

- Preserve a visible canvas gutter around every major floating surface.
- Maintain a clear gap between navigation, workspace, and inspector.
- Do not make either sidebar so wide that the QR preview becomes secondary.
- Prefer a narrower persistent navigation panel and a moderately wider inspector because the inspector contains form controls.
- The workspace receives the remaining width and visual priority.

## Responsive Behavior

Use the canonical breakpoints from `DESIGN-TOKENS.md`.

### Full and compact desktop

Preserve the three-zone model where space allows.

Both sidebars remain floating, self-contained surfaces.

### Tablet

Do not squeeze three permanent columns into the viewport.

Preferred adaptation:

- keep the workspace primary,
- expose navigation and inspector as independent floating sheets, popovers, or drawers,
- ensure the current feature and inspector are still easy to reopen,
- preserve pinned controls inside the inspector rather than creating a separate permanent panel.

### Phone

Use a workspace-first layout.

- Navigation becomes a temporary sheet/drawer.
- Inspector becomes a temporary sheet/drawer.
- The QR preview and current content input remain primary.
- Do not stack a full navigation panel, full workspace, and full inspector vertically as one long page.

## Component and State Rules

All interactive controls should follow the tokens and states defined in `DESIGN-TOKENS.md`.

At minimum, applicable controls must define:

- default,
- hover,
- focus-visible,
- pressed,
- selected,
- disabled,
- validation/error,
- loading where relevant.

Use one consistent component treatment for equivalent controls across all inspector sections.

## Copy Rules

User-facing labels should describe the user's goal, not the implementation.

Examples:

- Prefer `Style` over an internal rendering-system name.
- Prefer `Colors` over a renderer-specific color configuration label.
- Prefer `Scan Quality` when presenting settings that affect reliability, unless later usability testing identifies a clearer term.
- Prefer `Output` only if it remains intuitive in context; if export controls dominate the section, `Export` may be evaluated as a user-facing alternative before implementation is finalized.

Do not expose implementation terminology simply because it exists in code or documentation.

## Anti-Patterns

Do not:

- attach either sidebar visually to the viewport edge,
- turn the left navigation into a full list of every available subfeature,
- duplicate the top-middle content-type selector in the left sidebar,
- mirror the same control in multiple zones without a specific shortcut rationale,
- make the right inspector another navigation hierarchy,
- permanently reserve a large empty pinned-feature region,
- pin entire settings pages,
- duplicate setting state between pinned and native controls,
- add content-type navigation to the left sidebar,
- let the textured background reduce QR-preview or form readability,
- use large edge-to-edge header or footer chrome that breaks the floating-surface composition,
- compress the desktop three-zone layout onto mobile.

## Canonical Mental Model

The interface should be understood as:

**Navigation → Workspace → Inspector**

with **Pinned Controls** as a persistent convenience layer inside the Inspector.

All four elements float within the textured canvas. None should read as structurally attached to the page itself.
