# QR Studio Redesign Plan of Plans

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement each child plan independently. Do not start a later child plan before the previous child plan's acceptance criteria pass.

**Goal:** Replace the current single-sidebar interface with the approved floating three-zone QR Studio experience while preserving existing QR-generation behavior and local-first constraints.

**Architecture:** The redesign is a frontend structural refactor, not a rewrite of the QR engine. Existing QR state and generation behavior remain authoritative while the UI is migrated into a persistent floating navigation panel, center workspace, and contextual floating inspector. New pinning behavior is layered on after the existing controls have been successfully migrated.

**Tech Stack:** Vite, vanilla JavaScript, CSS, `qr-code-styling`, Playwright for browser-level regression coverage.

**Specs:** `DESIGN.md`, `DESIGN-TOKENS.md`, `UI-PATTERNS.md`, `README.md`

## Global Constraints

- Preserve all currently working QR-generation and export behavior unless a child plan explicitly identifies a bug.
- Do not implement README features marked `[NEW]` as part of the redesign unless the user separately authorizes them.
- Do not expose dead or placeholder controls for unimplemented capabilities.
- The left navigation contains only top-level feature areas and must not duplicate the workspace content selector.
- Desktop navigation and inspector are floating surfaces with visible canvas gutter on all sides.
- The center workspace remains visually dominant.
- Pinned controls live inside the inspector and must not create independent duplicated state.
- Preserve the local-first product principle. No new backend, account, telemetry, or required network dependency.
- Use the canonical palette, texture, typography, spacing, radii, motion, and responsive tokens from `DESIGN-TOKENS.md`.
- The redesign must support light, dark, and system appearance.
- Keep the implementation framework-free unless a later explicit decision changes that.

## Review Focus

1. Existing settings still produce the same QR output after their controls move.
2. No feature or content selector appears redundantly in multiple navigation surfaces.
3. Pinned controls modify the exact same setting as their native location and survive reload safely.
4. Narrow layouts do not collapse into three stacked permanent panels.
5. Texture, muted palette, and floating surfaces never reduce control or QR-preview legibility.

---

## Execution Sequence

### Plan 1: Behavior Baseline and Regression Harness

**Child plan:** `2026-10-14-qr-studio-redesign-01-baseline.md`

Inventory the current working product and capture it with browser-level regression tests before structural changes begin.

**Exit gate:** Every existing core behavior that must survive the redesign has a recorded baseline and repeatable regression check.

### Plan 2: Visual Foundation

**Child plan:** `2026-10-14-qr-studio-redesign-02-visual-foundation.md`

Move the approved semantic tokens, themes, texture, typography, spacing, surfaces, and component states into the implementation without changing page structure yet.

**Depends on:** Plan 1.

**Exit gate:** Existing interface builds and functions using the canonical design tokens in light, dark, and system modes.

### Plan 3: Floating App Shell

**Child plan:** `2026-10-14-qr-studio-redesign-03-floating-shell.md`

Establish the floating navigation, workspace region, and contextual inspector shell. This is the structural pivot from the current attached layout.

**Depends on:** Plans 1-2.

**Exit gate:** Three-zone desktop shell matches `UI-PATTERNS.md`, contains no redundant content-type navigation, and preserves the QR preview and existing controls during migration.

### Plan 4: Center Workspace

**Child plan:** `2026-10-14-qr-studio-redesign-04-workspace.md`

Move content entry, QR preview, and persistent quick actions into the center workspace. Implement only content modes whose behavior exists at that point; do not ship fake selectors for planned modes.

**Depends on:** Plan 3.

**Exit gate:** Core QR creation can be completed entirely from the workspace plus migrated inspector without regression.

### Plan 5: Contextual Inspector Migration

**Child plan:** `2026-10-14-qr-studio-redesign-05-inspector.md`

Map existing controls into user-facing top-level sections: Style, Colors, Logo, Scan Quality, and Output. Preserve one canonical control location per feature.

**Depends on:** Plans 3-4.

**Exit gate:** Every existing setting has a deliberate home, section switching is stable, and no old accordion/sidebar structure remains user-facing.

### Plan 6: Pinned Controls

**Child plan:** `2026-10-14-qr-studio-redesign-06-pinned-controls.md`

Add pin/unpin/reorder behavior for eligible compact controls, persisted locally. Prefer moving or centrally binding the canonical control rather than creating independent duplicate state.

**Depends on:** Plan 5.

**Exit gate:** Pins persist, can be reordered and removed, remain synchronized with native feature context, and disappear entirely when empty.

### Plan 7: Responsive, Accessibility, and Final QA

**Child plan:** `2026-10-14-qr-studio-redesign-07-qa-polish.md`

Finish tablet/phone adaptations, keyboard/focus behavior, reduced motion, visual QA, and regression coverage.

**Depends on:** Plans 1-6.

**Exit gate:** Build passes, regression suite passes, desktop/tablet/phone layouts meet the approved model, and light/dark/system are visually coherent.

---

## Rollout Strategy

Implement one child plan at a time on the same redesign branch. Each plan ends with a reviewable, buildable state. Do not combine the redesign with unrelated feature development.

Recommended order is strict because each phase reduces risk for the next:

`baseline → tokens → shell → workspace → inspector → pins → QA`

If a phase reveals a missing product decision, stop that phase and resolve the decision before continuing. Do not silently invent feature scope to make the new layout look complete.

## Definition of Done

The redesign is complete when:

- the current functional feature set remains intact,
- desktop uses the approved floating Navigation → Workspace → Inspector model,
- no content-type navigation is duplicated in the left panel,
- the contextual inspector owns feature-specific controls,
- the pin system works without duplicated state,
- light/dark/system themes use the canonical muted palette and textured canvas,
- responsive layouts replace permanent sidebars with appropriate temporary surfaces,
- keyboard, focus, contrast, reduced-motion, and touch-target requirements pass,
- regression and build checks pass,
- obsolete attached-layout CSS and markup are removed rather than left dormant.
