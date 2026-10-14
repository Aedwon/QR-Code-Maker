# QR Studio Redesign Implementation Plan 05: Responsive Behavior and Portfolio Polish

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish QR Studio across tablet/phone input models, close the remaining accessibility gaps, remove migration leftovers, and perform the final visual/functional release review.

**Architecture:** Keep the permanent three-zone shell untouched at `>=900px`. Below 900px, reuse the same Navigation and Inspector DOM as temporary surfaces controlled by `src/ui/shell.js`; never create duplicate mobile menus or settings. Add minimal focus/inert/scroll management, preserve the approved Navigation → Inspector handoff, and finish with manual visual review plus the existing focused Playwright suite.

**Tech Stack:** Vanilla JavaScript, CSS media queries, Playwright, existing Vite app.

**Spec:** `docs/superpowers/plans/2026-10-14-qr-studio-redesign-plan-of-plans.md`, `DESIGN.md`, `DESIGN-TOKENS.md`, `UI-PATTERNS.md`

## Global Constraints

- Workstreams 1–4 must be complete and green.
- `>=900px` means permanent Navigation + Workspace + Inspector, including exactly 900px.
- `<900px` means workspace-first with temporary Navigation and Inspector.
- Do not duplicate Navigation/Inspector markup for mobile.
- Selecting a top-level feature from temporary Navigation must automatically hand off to its Inspector with no second tap.
- Do not leave Navigation and Inspector stacked as competing full-height surfaces.
- Essential behavior must work with keyboard, pointer, and touch-equivalent controls.
- Keep testing proportional: automate the architectural boundary and high-risk interactions, manually review visual fidelity.

## Review Focus

1. 899px and 900px use the correct different interaction models.
2. Temporary Navigation → Inspector feels like one action sequence.
3. Hidden/background UI cannot receive accidental keyboard/pointer interaction.
4. Focus returns predictably after temporary surfaces and legal modals close.
5. Final CSS/JS contains one active layout system, not legacy and redesign code in parallel.

---

### Task 1: Add temporary-surface controls to the existing shell

**Files:**
- Modify: `index.html`
- Modify: `src/ui/shell.js`
- Modify: `src/style.css`
- Create: `tests/e2e/responsive.spec.js`

**Required narrow-screen controls:**

```html
<button id="open-navigation" aria-controls="app-nav" aria-expanded="false">...</button>
<button id="open-inspector" aria-controls="app-inspector" aria-expanded="false">...</button>
<div id="panel-backdrop" hidden></div>
```

Navigation and Inspector each include a close button that is hidden/irrelevant in permanent desktop mode.

**Shell interface additions:**

```js
export function initShell({ defaultSection = 'style' } = {});
// returned controller additionally supports:
// openNavigation(trigger)
// openInspector(trigger, { focus = true } = {})
// closeTemporarySurface({ restoreFocus = true } = {})
// selectSection(section)
// getSection()
```

- [ ] Use `matchMedia('(min-width: 900px)')` or equivalent to distinguish permanent from temporary shell behavior.
- [ ] At `<900px`, hide the permanent visual presence of Navigation/Inspector until opened. Keep them in the DOM so state and pinned controls are shared with desktop.
- [ ] Opening one temporary surface closes the other before/while it becomes visible. Never keep both open after transition completion.
- [ ] Toggle `aria-expanded` on the corresponding workspace trigger.
- [ ] Show one shared backdrop while either temporary surface is active.
- [ ] Lock body scrolling only while a temporary panel is open.
- [ ] At `>=900px`, hide temporary triggers/backdrop and clear all temporary `open`/scroll-lock state.
- [ ] If the viewport crosses from `<900px` to `>=900px` while a panel is open, immediately normalize to permanent three-zone state without requiring a reload.

**Boundary tests:**

```js
test('899px uses temporary panels', async ({ page }) => {
  await page.setViewportSize({ width: 899, height: 800 });
  await page.goto('/');
  await expect(page.locator('#open-navigation')).toBeVisible();
  await expect(page.locator('#app-nav')).not.toBeVisible();
});

test('900px keeps all three zones permanently visible', async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 800 });
  await page.goto('/');
  await expect(page.locator('#app-nav')).toBeVisible();
  await expect(page.locator('#workspace')).toBeVisible();
  await expect(page.locator('#app-inspector')).toBeVisible();
  await expect(page.locator('#open-navigation')).toBeHidden();
});
```

**Verification:**

```bash
npm run test:e2e -- tests/e2e/responsive.spec.js
```

- [ ] Commit.

---

### Task 2: Implement the canonical Navigation → Inspector handoff below 900px

**Files:**
- Modify: `src/ui/shell.js`
- Modify: `src/style.css`
- Modify: `tests/e2e/responsive.spec.js`

- [ ] In temporary mode, clicking `Style`, `Colors`, `Logo`, `Scan Quality`, or `Output` performs this exact sequence:
  1. update selected section state,
  2. begin closing Navigation,
  3. open Inspector to the selected section as part of the same short panel transition,
  4. finish with Navigation closed and Inspector open.
- [ ] Selecting the already-active feature must still perform the handoff if Inspector is currently closed.
- [ ] Do not require the user to tap `#open-inspector` after choosing a feature in Navigation.
- [ ] Terms and Privacy are utility exceptions: they open their legal surface, not Inspector.
- [ ] Appearance controls apply Light/Dark/System in place and leave temporary Navigation open.
- [ ] There is no Feedback utility unless a real external destination has been added outside this redesign.
- [ ] Pinned controls remain at the top of the same Inspector surface and are available after the handoff.

**Representative test:**

```js
test('tablet feature selection hands Navigation directly to Inspector', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 900 });
  await page.goto('/');
  await page.locator('#open-navigation').click();
  await page.locator('[data-feature="colors"]').click();
  await expect(page.locator('#app-nav')).not.toBeVisible();
  await expect(page.locator('#app-inspector')).toBeVisible();
  await expect(page.locator('[data-inspector-section="colors"]')).toBeVisible();
});
```

- [ ] Repeat the same core assertion at a representative 390px phone viewport.
- [ ] Test selecting the already-active Style item after reopening Navigation still opens Inspector.

**Verification:**

```bash
npm run test:e2e -- tests/e2e/responsive.spec.js
```

- [ ] Commit.

---

### Task 3: Add focus, inertness, Escape, and scroll behavior for temporary surfaces

**Files:**
- Modify: `src/ui/shell.js`
- Modify: `index.html`
- Modify: `src/style.css`
- Create: `tests/e2e/accessibility.spec.js`

- [ ] When temporary Navigation is open:
  - move focus to its close button or first meaningful control,
  - mark Workspace and Inspector inert,
  - keep backdrop active,
  - Escape closes Navigation and returns focus to the invoking `#open-navigation` button.
- [ ] When temporary Inspector is open:
  - move focus to its heading or first active control,
  - mark Workspace and Navigation inert,
  - Escape closes Inspector and returns focus to `#open-inspector` in Workspace.
- [ ] During the Navigation → Inspector handoff, do not restore focus to the Navigation trigger between panels. Move focus directly into Inspector; when Inspector finally closes, return to `#open-inspector`.
- [ ] Ensure an inactive hidden Inspector section remains `hidden` + `inert` even when the Inspector surface itself is open.
- [ ] Backdrop click may close the active temporary surface, but it is not the only close path.
- [ ] Apply `overflow: hidden` or equivalent body scroll lock only for the duration of an open temporary surface.
- [ ] At desktop transition (`>=900px`), remove inertness from all three permanent zones and clear stale focus/scroll state.
- [ ] Ensure all temporary open/close buttons and pin actions meet the documented 44px touch target at tablet/phone sizes.

**Representative focus test:**

```js
await page.locator('#open-inspector').click();
await page.keyboard.press('Escape');
await expect(page.locator('#open-inspector')).toBeFocused();
```

**Verification:**

```bash
npm run test:e2e -- tests/e2e/accessibility.spec.js tests/e2e/responsive.spec.js
```

- [ ] Commit.

---

### Task 4: Upgrade Terms/Privacy modal accessibility without adding a modal framework

**Files:**
- Modify: `index.html`
- Modify: `src/main.js`
- Modify: `src/style.css`
- Modify: `tests/e2e/utilities-privacy.spec.js`
- Modify: `tests/e2e/accessibility.spec.js`

- [ ] Keep the existing lightweight modal implementation; do not add a dialog library.
- [ ] Give each modal surface `role="dialog"`, `aria-modal="true"`, and `aria-labelledby` pointing to its heading.
- [ ] On open, remember the trigger and focus the close button or heading.
- [ ] Escape closes the modal.
- [ ] On close, return focus to the triggering Terms/Privacy button.
- [ ] While open, prevent background shell interaction using `inert` on the app shell or an equivalent minimal mechanism.
- [ ] Backdrop click may close, but close button + Escape remain available.
- [ ] Ensure reduced-motion mode removes modal/panel entrance animation rather than merely making it faster.

**Verification:**

```bash
npm run test:e2e -- tests/e2e/utilities-privacy.spec.js tests/e2e/accessibility.spec.js
```

- [ ] Commit.

---

### Task 5: Finish responsive CSS for tablet and phone

**Files:**
- Modify: `src/style.css`

- [ ] Replace the old `max-width: 900px` stacked-sidebar rules completely. Do not leave them underneath the new temporary-surface model.
- [ ] Use canonical ranges:

```text
>=1200px    full desktop, full three-zone geometry
900-1199px  compact desktop, full three-zone geometry
600-899px   tablet, workspace persistent + temporary Navigation/Inspector
<600px      phone, workspace persistent + temporary Navigation/Inspector
```

- [ ] Tablet sheets/drawers remain floating surfaces with visible relationship to the canvas; they do not need to consume the full viewport width.
- [ ] Phone surfaces may use most/full available height/width as necessary, but must retain clear close affordances and not stack Navigation and Inspector.
- [ ] Keep Workspace content input and QR preview primary on both tablet and phone.
- [ ] Scale the preview responsively without modifying the user's configured QR output size value.
- [ ] Maintain 12px minimum UI text and 44px touch targets where touch interaction is expected.
- [ ] Add `@media (prefers-reduced-motion: reduce)` to remove nonessential panel/modal/control motion.
- [ ] Add/retain `@media (forced-colors: active)` treatment that removes decorative canvas texture if needed.
- [ ] Theme controls remain usable inside temporary Navigation; pin dock remains inside temporary Inspector.

**Manual resize check:**

Resize continuously through 880 → 920px and confirm only one clean mode switch occurs at 900px. There must be no width where both temporary triggers and permanent sidebars compete.

**Verification:**

```bash
npm run build
npm run test:e2e -- tests/e2e/responsive.spec.js tests/e2e/accessibility.spec.js
```

- [ ] Commit.

---

### Task 6: Perform the final visual portfolio review

**Files:**
- Modify as needed: `src/style.css`
- Modify as needed: `index.html`

- [ ] Capture local screenshots for review at:

```text
390×844  phone light + dark
768×1024 tablet light + dark
900×800  exact desktop boundary light
1024×768 compact desktop light + dark
1440×900 desktop light + dark
```

System mode can be reviewed by emulating both system preferences rather than creating a third duplicate screenshot set unless a bug appears.

- [ ] Compare the implementation to the approved design/reference and canonical specs for:
  - floating left/right surfaces,
  - visible canvas gutter,
  - Workspace/QR visual dominance,
  - restrained paper/pigment texture,
  - canonical muted palette,
  - typography hierarchy,
  - sidebar density,
  - selected/focus states,
  - empty vs populated pin dock,
  - tablet/phone handoff behavior.
- [ ] Confirm the result does not look like a generic dashboard: no attached sidebars, no large header bar, no excessive nested cards, no glowing glass effects.
- [ ] Confirm `#C05746` is visually present as the brand accent while filled text-bearing actions use an accessible treatment where required.
- [ ] Fix only deviations from the approved design/spec. Do not add feature scope during polish.

- [ ] Run build/tests after any visual correction and commit only if changes were required.

---

### Task 7: Final cleanup, README alignment, and release gate

**Files:**
- Modify: `README.md`
- Modify as needed: `index.html`
- Modify as needed: `src/main.js`
- Modify as needed: `src/style.css`
- Modify as needed: `src/ui/shell.js`
- Modify as needed: `src/ui/pins.js`

- [ ] Remove obsolete attached-header/sidebar/footer selectors, old stacked-mobile rules, old yellow/glow variables, and feedback-form styles.
- [ ] Remove dead event bindings and comments that describe the old accordion/sidebar architecture.
- [ ] Search for `gtag`, `googletagmanager`, `fonts.googleapis`, `fonts.gstatic`, and `web3forms`; none should remain as runtime dependencies/references.
- [ ] Update README Privacy Migration Notes to describe completed state rather than pending migration. Do not claim offline/PWA support; it remains `[NEW]`.
- [ ] Expand README Design Direction links to all three canonical design documents: `DESIGN.md`, `DESIGN-TOKENS.md`, and `UI-PATTERNS.md`.
- [ ] Keep future `[NEW]` feature list unchanged unless a line has become truly implemented by this redesign. Theme/pinning are design-redesign scope, not permission to mark unrelated roadmap items done.
- [ ] From a clean dependency install, run:

```bash
rm -rf node_modules dist test-results playwright-report
npm ci
npx playwright install chromium
npm run build
npm run test:e2e
```

- [ ] Perform one final manual smoke path:

```text
edit content
→ choose preset
→ change module shape and primary color
→ add/remove logo
→ change error correction and quiet zone
→ change output size
→ export PNG/SVG/JPEG
→ pin/unpin/reorder a setting
→ switch Light/Dark/System
→ test 1024 desktop
→ test 768 Navigation → Inspector handoff
→ test 390 phone handoff
```

- [ ] Confirm normal page load makes no request to GA, Google Fonts, or Web3Forms.
- [ ] Confirm no content selector or unapproved `[NEW]` feature appears.
- [ ] Commit final cleanup only after every gate passes.

**Verification:**

```bash
npm run build
npm run test:e2e
git diff --check
grep -R "googletagmanager\|fonts.googleapis\|fonts.gstatic\|web3forms\|F2C21A\|accent-glow" index.html src README.md || true
```

Expected: clean output for obsolete runtime dependencies/old identity, aside from any historical prose that is intentionally retained and accurately marked as historical.

---

## Workstream Exit Gate

- `>=900px` always uses permanent Navigation → Workspace → Inspector.
- 899px and below uses Workspace + temporary Navigation/Inspector.
- Feature selection in temporary Navigation automatically opens the matching Inspector.
- Temporary surfaces have close, Escape, focus return, inert-background behavior, scroll locking, and touch-usable controls.
- Terms/Privacy dialogs have basic modal semantics and focus behavior.
- Pinned controls remain inside Inspector and work in responsive mode.
- Light/Dark/System remain coherent and do not alter QR state.
- Final visual review passes at phone/tablet/900/compact/full desktop sizes.
- No active legacy layout, analytics, remote font, or Web3Forms code remains.
- README accurately reflects privacy/design state without claiming unimplemented roadmap features.
- Clean install, production build, and full focused Playwright suite pass.

## Commit Sequence

1. `feat: add temporary responsive shell surfaces`
2. `feat: hand navigation selections to inspector`
3. `fix: add focus and inert handling for temporary panels`
4. `fix: improve legal modal accessibility`
5. `style: finish tablet and phone layouts`
6. `style: polish final responsive design` (only if checkpoint requires changes)
7. `chore: finalize redesign cleanup and docs`
