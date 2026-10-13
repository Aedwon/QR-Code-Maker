# QR Studio Redesign 02: Visual Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the current app use the approved visual tokens, themes, and textured canvas before changing its structural layout.

**Architecture:** Keep current markup and interaction structure temporarily. Replace hard-coded styling with semantic CSS custom properties and a small theme controller so later shell work inherits a stable visual system.

**Tech Stack:** CSS custom properties, vanilla JavaScript, Vite, Playwright.

**Spec:** `DESIGN-TOKENS.md`

## Global Constraints

- Use the canonical Rosy Copper, Muted Olive, Tea Green, White, and Blackberry Cream palette.
- Use the exact typography, spacing, radii, control heights, borders, shadows, and motion scales in `DESIGN-TOKENS.md`.
- Runtime use must remain local-first.
- Texture must be static, low-contrast, and decorative only.
- Do not structurally redesign the page in this phase.

## Review Focus

- No old yellow/glow identity survives accidentally.
- Light, dark, and system themes share semantic roles rather than separate component rules.
- Texture remains behind the interface and never reduces QR/control readability.
- Focus and interaction states remain visible in both themes.
- The design does not require remote fonts at runtime.

---

### Task 1: Convert the CSS foundation to canonical tokens

**Files:**
- Modify: `src/style.css`

- [ ] Replace current root color/radius/shadow/transition primitives with the canonical semantic tokens from `DESIGN-TOKENS.md`.
- [ ] Add explicit light and dark token scopes while keeping semantic token names stable.
- [ ] Replace one-off spacing and radius values in shared controls with the approved scale where practical.
- [ ] Preserve current layout dimensions until Plan 3.
- [ ] Run baseline tests and build.
- [ ] Commit.

### Task 2: Bundle typography locally

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `src/main.js`
- Modify: `index.html`

- [ ] Replace the Google Fonts runtime dependency with a locally bundled Inter source or an equivalent local package that produces bundled font assets.
- [ ] Remove font preconnect/remote stylesheet tags.
- [ ] Keep the documented fallback stack intact.
- [ ] Run the app with network disabled and verify typography still renders correctly.
- [ ] Run build and regression tests.
- [ ] Commit.

### Task 3: Add theme state and appearance switching

**Files:**
- Create: `src/theme.js`
- Modify: `src/main.js`
- Modify: `index.html`
- Modify: `src/style.css`
- Create or modify: `tests/e2e/theme.spec.js`

- [ ] Implement `light`, `dark`, and `system` appearance modes.
- [ ] Persist the explicit user choice locally.
- [ ] In system mode, react to `prefers-color-scheme` changes without reloading.
- [ ] Ensure the selected theme control exposes selected state accessibly.
- [ ] Add Playwright coverage for light/dark/system behavior and persistence.
- [ ] Commit.

### Task 4: Add the canonical textured canvas

**Files:**
- Modify: `src/style.css`

- [ ] Implement the warm canvas base, fine static grain, and large low-opacity organic color fields described in `DESIGN-TOKENS.md`.
- [ ] Keep texture outside working surfaces and non-interactive.
- [ ] Use the documented lower-opacity dark-mode treatment.
- [ ] Remove texture under forced-colors or equivalent accessibility fallback.
- [ ] Capture local screenshots at desktop light and dark sizes for review.
- [ ] Run build and baseline regression tests.
- [ ] Commit.

## Exit Gate

- The old visual identity is replaced by the approved token system.
- Light, dark, and system modes work and persist correctly.
- No runtime Google Fonts request remains.
- Texture matches the documented restrained treatment.
- Existing behavior regression suite still passes.
