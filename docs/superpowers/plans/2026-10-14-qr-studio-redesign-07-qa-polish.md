# QR Studio Redesign 07: Responsive, Accessibility, and Final QA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish the redesign across viewport sizes and input methods, then remove migration leftovers and prove the redesign is ready to ship.

**Architecture:** Keep the three-zone model on desktop. At tablet/phone widths, preserve the workspace and convert navigation/inspector into temporary floating sheets or drawers instead of stacking permanent panels. Use the existing browser regression layer for functional and layout acceptance.

**Tech Stack:** CSS media queries, vanilla JavaScript, Playwright.

**Spec:** `DESIGN.md`, `DESIGN-TOKENS.md`, `UI-PATTERNS.md`

## Global Constraints

- Follow the documented breakpoints: `<600`, `600-899`, `900-1199`, `>=1200`.
- Mobile/tablet must not become one long stack of navigation + workspace + inspector.
- Essential interaction cannot depend on hover.
- Respect `prefers-reduced-motion`.
- Maintain at least the documented 44px touch target where touch interaction is expected.
- Do not reduce text below the documented 12px minimum.

## Review Focus

- No hidden panel traps focus or remains reachable by keyboard.
- Opening one temporary panel does not obscure an unrecoverable state.
- Texture and color fields remain quiet at every viewport.
- QR preview stays usable on narrow screens.
- Final cleanup removes old layout code instead of leaving parallel systems.

---

### Task 1: Implement compact-desktop and tablet adaptation

**Files:**
- Modify: `src/style.css`
- Modify: `src/ui/shell.js`
- Modify: `index.html`
- Create or modify: `tests/e2e/responsive.spec.js`

- [ ] Tune the three-zone layout for `900-1199px` without shrinking the workspace below useful QR-preview width.
- [ ] At `600-899px`, keep the workspace primary and convert navigation/inspector into independently invoked temporary surfaces.
- [ ] Provide clear controls to open/close both temporary surfaces.
- [ ] Return focus to the invoking control when a temporary surface closes.
- [ ] Add tests for visibility, opening/closing, and preserved QR state across transitions.
- [ ] Commit.

### Task 2: Implement phone workspace-first behavior

**Files:**
- Modify: `src/style.css`
- Modify: `src/ui/shell.js`
- Modify: `index.html`
- Modify: `tests/e2e/responsive.spec.js`

- [ ] At `<600px`, render the content workspace and QR preview as the persistent primary UI.
- [ ] Expose navigation and inspector via temporary sheets/drawers rather than permanent columns.
- [ ] Ensure inspector controls remain usable at touch sizes and pinned controls remain inside the inspector surface.
- [ ] Prevent body/background scroll conflicts while a modal sheet is open.
- [ ] Test at representative 390px and 600px-adjacent widths.
- [ ] Commit.

### Task 3: Keyboard, focus, motion, and semantics audit

**Files:**
- Modify as needed: `index.html`
- Modify as needed: `src/style.css`
- Modify as needed: `src/ui/shell.js`
- Modify as needed: `src/ui/pins.js`
- Create or modify: `tests/e2e/accessibility.spec.js`

- [ ] Verify logical tab order through workspace, navigation, inspector, and pin actions.
- [ ] Verify focus-visible treatment in light and dark themes.
- [ ] Ensure selected navigation and theme states are conveyed semantically and not by color alone.
- [ ] Remove nonessential motion under `prefers-reduced-motion: reduce`.
- [ ] Test keyboard operation of navigation, inspector opening/closing, pins, theme selection, and core QR controls.
- [ ] Commit.

### Task 4: Visual regression and consistency review

**Files:**
- Create or modify: `tests/e2e/visual.spec.js`
- Modify as needed: `src/style.css`

- [ ] Capture deterministic screenshots for desktop light, desktop dark, compact desktop, tablet, and phone.
- [ ] Review spacing, radii, typography, palette, texture strength, panel floating gutters, and QR-preview prominence against the design specs.
- [ ] Check that no redundant Text/Link/Contact/Wi-Fi navigation appears in the left panel.
- [ ] Check empty and populated pinned-dock states.
- [ ] Fix only spec deviations discovered during this review; do not add new feature scope.
- [ ] Commit.

### Task 5: Final cleanup and release gate

**Files:**
- Modify as needed: `index.html`
- Modify as needed: `src/main.js`
- Modify as needed: `src/style.css`
- Modify as needed: `src/ui/*`
- Modify: `README.md`

- [ ] Remove unused legacy selectors, event bindings, CSS variables, and dead old-layout markup.
- [ ] Update README design references to include `DESIGN.md`, `DESIGN-TOKENS.md`, and `UI-PATTERNS.md`.
- [ ] Confirm no new runtime network dependency was introduced.
- [ ] Run `npm run build && npm run test:e2e` from a clean install state.
- [ ] Perform one final manual smoke test: edit content → customize Style/Colors → add/remove logo → adjust Scan Quality → export → pin/unpin → switch theme → resize viewport.
- [ ] Commit the cleanup only after every gate passes.

## Exit Gate

- Build and full browser regression suite pass.
- Desktop, compact desktop, tablet, and phone all follow the approved interaction model.
- Light/dark/system are coherent and accessible.
- Pinning, navigation, inspector state, and QR generation survive responsive transitions.
- No legacy attached-layout implementation remains active.
- No unapproved product features were added during the redesign.
