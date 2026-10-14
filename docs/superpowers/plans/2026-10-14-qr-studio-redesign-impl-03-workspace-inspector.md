# QR Studio Redesign Implementation Plan 03: Workspace and Inspector Migration

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move every current QR Studio control into its approved final home, make the Workspace the obvious primary task surface, and remove the legacy accordion/sidebar structure without changing QR behavior.

**Architecture:** Keep `currentOptions` and the existing `qr-code-styling` instance authoritative. Preserve existing control IDs where practical, move the DOM into the final Workspace/Inspector composition, and centralize only the download action that must be shared between Workspace and Output. Do not add a content-mode registry or generalized component layer.

**Tech Stack:** Vite, vanilla JavaScript, CSS, `qr-code-styling`, Playwright.

**Spec:** `docs/superpowers/plans/2026-10-14-qr-studio-redesign-plan-of-plans.md`, `UI-PATTERNS.md`

## Global Constraints

- Workstreams 1–2 must be complete and green.
- The final control map from `docs/redesign/current-behavior-baseline.md` is authoritative.
- Capacity feedback remains physically with the content input in Workspace.
- `Scan Quality` contains only current reliability controls: error correction and quiet zone/margin.
- No content-type selector is rendered while only one real URL/text workflow exists.
- Do not add scan scoring, contrast validation, decode checks, reset/undo, or other `[NEW]` features.
- The persistent Workspace quick action is `Download PNG`; Output owns full export controls.
- Preserve the current 150 ms content debounce and existing logo/error-correction side effects.

## Review Focus

1. Users can understand the main task without opening the Inspector.
2. Every existing setting has exactly one native home.
3. Section switching never resets QR state.
4. Quick PNG and Output PNG use one implementation path.
5. Legacy accordion behavior is removed rather than hidden under the redesign.

---

### Task 1: Finalize the Workspace composition

**Files:**
- Modify: `index.html`
- Modify: `src/style.css`
- Modify: `src/main.js`
- Create or modify: `tests/e2e/workspace.spec.js`

**Final Workspace contract:**

```text
Content surface
  URL or Text label
  #qr-data
  #char-counter

Preview surface
  #qr-preview

Quick action
  #quick-download-png
```

- [ ] Move `#qr-data` and its existing byte/capacity feedback out of Inspector/legacy settings chrome into the top of `#workspace`.
- [ ] Keep the current label `URL or Text`. Do not split it into fake Text/Link modes.
- [ ] Keep capacity logic unchanged: UTF-8 byte count, threshold based on active EC level, warning at 75%, danger over maximum.
- [ ] Move `#qr-preview` into a dedicated neutral preview surface with enough opaque clear space that the canvas texture does not compete with the QR.
- [ ] Add `#quick-download-png` beneath or adjacent to the preview, following the approved visual reference and available width.
- [ ] Do not add Copy, Reset, Share, or any other concept-art-only action.
- [ ] Keep Workspace visible and unchanged when Inspector sections switch.
- [ ] Add a test asserting there is no content-type selector or Text/Link/Contact/Wi-Fi navigation.

**Representative test:**

```js
test('workspace remains stable while inspector section changes', async ({ page }) => {
  await page.goto('/');
  await page.locator('#qr-data').fill('workspace-state');
  await page.locator('[data-feature="colors"]').click();
  await expect(page.locator('#qr-data')).toHaveValue('workspace-state');
  await expect(page.locator('#qr-preview')).toBeVisible();
  await expect(page.locator('#quick-download-png')).toBeVisible();
});
```

**Verification:**

```bash
npm run test:e2e -- tests/e2e/workspace.spec.js
npm run build
```

- [ ] Commit.

---

### Task 2: Migrate Style into final Inspector groups

**Files:**
- Modify: `index.html`
- Modify: `src/style.css`
- Modify as needed: `src/main.js`
- Modify: `tests/e2e/qr-editing.spec.js`
- Modify: `tests/e2e/navigation.spec.js`

**Final Style groups:**

```text
Presets
Module shape
Outer finder
Inner finder
```

- [ ] Place the existing preset grid in the `Style` inspector section.
- [ ] Move `#dot-style-grid` under user-facing label `Module shape`.
- [ ] Move `#corner-square-style-grid` under user-facing label `Outer finder`.
- [ ] Move `#corner-dot-style-grid` under user-facing label `Inner finder`.
- [ ] Preserve every current style option and `data-value` accepted by `qr-code-styling`.
- [ ] Remove the old `Dot Style`, `Corner Square`, and `Corner Dot` accordion headers. They are implementation terminology and no longer serve progressive disclosure.
- [ ] Presets remain immediately visible because they are a common starting point.
- [ ] Manual module/finder changes must continue to deselect the active preset exactly as before.
- [ ] Update tests to locate controls in the new Style Inspector rather than by old accordion structure.

**Verification:**

```bash
npm run test:e2e -- tests/e2e/qr-editing.spec.js tests/e2e/navigation.spec.js
```

Expected: preset application and manual detachment still pass in the new location.

- [ ] Commit.

---

### Task 3: Migrate Colors without changing gradient semantics

**Files:**
- Modify: `index.html`
- Modify: `src/style.css`
- Modify as needed: `src/main.js`
- Modify: `tests/e2e/qr-editing.spec.js`

**Final Colors groups:**

```text
Modules
Outer finder
Inner finder
Background
```

- [ ] Place module flat color, optional gradient, gradient end color/type, and rotation in `Modules`.
- [ ] Place outer finder flat/gradient controls in `Outer finder`.
- [ ] Place inner finder flat/gradient controls in `Inner finder`.
- [ ] Place transparency and background color together under `Background`.
- [ ] Preserve these IDs: `dot-color`, `dot-color-hex`, `dot-gradient-toggle`, `dot-gradient-controls`, `dot-color-2`, `dot-color-2-hex`, `dot-gradient-rotation`, all corner color/gradient IDs, `bg-transparent`, `bg-color`, `bg-color-hex`.
- [ ] Keep gradient detail controls hidden until their existing toggle is enabled. This is appropriate progressive disclosure and is not the removed legacy accordion system.
- [ ] Preserve the explicit `gradient: undefined` clearing behavior in `buildOptions()`.
- [ ] Preserve preset-driven UI synchronization in `syncUIFromOptions()`.
- [ ] Do not add contrast warnings or color-accessibility analysis in this redesign.

**Verification:**

```bash
npm run test:e2e -- tests/e2e/qr-editing.spec.js
```

Expected: flat/gradient round trip, hex/color synchronization, and preset detachment remain green.

- [ ] Commit.

---

### Task 4: Migrate Logo and Scan Quality

**Files:**
- Modify: `index.html`
- Modify: `src/style.css`
- Modify as needed: `src/main.js`
- Modify: `tests/e2e/qr-reliability-output.spec.js`

**Final Logo groups:**

```text
Logo image
Size
Margin
Background
  shape
  color when shape != none
```

**Final Scan Quality groups:**

```text
Error correction
Quiet zone
```

- [ ] Move all current logo upload/removal and local Canvas compositing controls into `Logo`.
- [ ] Preserve logo behavior exactly: upload uses local `FileReader`, modules under logo stay hidden, H is selected on upload, Q is selected on removal, background shape/color remains locally composited.
- [ ] Keep logo size and logo margin controls hidden until a logo exists if that is current behavior.
- [ ] Move the existing L/M/Q/H controls into `Scan Quality` and keep the recovery hints concise.
- [ ] Move `#qr-margin` and `#qr-margin-val` into `Scan Quality` as `Quiet zone`.
- [ ] Do **not** move `#char-counter` or its status text into Scan Quality. It remains under content input in Workspace.
- [ ] Do not add scan score, contrast validation, density validation, local decode, or one-click fixes.

**Verification:**

```bash
npm run test:e2e -- tests/e2e/qr-reliability-output.spec.js
```

Expected: logo H/Q lifecycle, quiet-zone control, and capacity dependence on EC remain green.

- [ ] Commit.

---

### Task 5: Finalize Output and one canonical download path

**Files:**
- Modify: `index.html`
- Modify: `src/main.js`
- Modify: `src/style.css`
- Modify: `tests/e2e/qr-reliability-output.spec.js`
- Modify: `tests/e2e/workspace.spec.js`

**Final Output groups:**

```text
Output size
Export
  PNG
  SVG
  JPEG
```

- [ ] Move `#qr-size` and `#qr-size-val` into `Output` as `Output size`.
- [ ] Keep PNG/SVG/JPEG buttons in Output as the detailed export actions.
- [ ] Centralize export invocation in one internal function in `src/main.js`:

```js
function downloadQR(extension) {
  qrCode.download({ name: 'qr-code', extension });
}
```

- [ ] Bind only fixed trusted values from code:

```js
exportPng.addEventListener('click', () => downloadQR('png'));
exportSvg.addEventListener('click', () => downloadQR('svg'));
exportJpeg.addEventListener('click', () => downloadQR('jpeg'));
quickDownloadPng.addEventListener('click', () => downloadQR('png'));
```

Do not turn `extension` into user input or a generic export registry.

- [ ] Add a test proving Workspace quick PNG emits a `.png` download while Style is selected and again while Colors is selected.
- [ ] Keep Output size independent from actual browser viewport sizing.

**Verification:**

```bash
npm run test:e2e -- tests/e2e/qr-reliability-output.spec.js tests/e2e/workspace.spec.js
```

- [ ] Commit.

---

### Task 6: Remove the legacy accordion/sidebar implementation completely

**Files:**
- Modify: `index.html`
- Modify: `src/main.js`
- Modify: `src/style.css`
- Modify as needed: `tests/e2e/*.spec.js`

- [ ] Remove `.section-header` accordion buttons, `.control-section` legacy wrappers where no longer semantically useful, chevrons, and `.section-body.collapsed` behavior.
- [ ] Remove the `document.querySelectorAll('.section-header')` collapsing listener from `src/main.js`.
- [ ] Remove CSS selectors and keyframes that exist solely for old accordion/attached-sidebar behavior.
- [ ] Keep genuine progressive disclosure, such as gradient controls and logo-dependent options.
- [ ] Search for orphaned old layout IDs/classes and remove them only when no active code/test uses them.
- [ ] Do not rename stable QR control IDs merely for cosmetic consistency; preserving them lowers migration risk.

**Verification:**

```bash
grep -R "section-header\|section-body collapsed\|control-section" index.html src || true
npm run build
npm run test:e2e
```

Expected: no active legacy accordion implementation; all regression tests pass.

- [ ] Commit.

---

### Task 7: Perform the Workspace/Inspector visual checkpoint

**Files:**
- Modify as needed: `src/style.css`
- Modify as needed: `index.html`

- [ ] Review at 1440px and 1024px in both light and dark appearances.
- [ ] Confirm the Workspace visually dominates both sidebars.
- [ ] Confirm content input is easy to locate without scanning Navigation.
- [ ] Confirm QR preview is optically centered and protected by a neutral surface.
- [ ] Confirm Style/Colors/Logo/Scan Quality/Output labels and subgroups are understandable without renderer terminology.
- [ ] Confirm no excessive nested cards/accordions were introduced.
- [ ] Confirm `Download PNG` reads as a convenience shortcut, not a competing Output section.
- [ ] Confirm no dead content selector exists.
- [ ] Make only spec-alignment/polish corrections; do not expand scope.

**Verification:**

```bash
npm run build
npm run test:e2e
git diff --check
```

- [ ] Commit only if the checkpoint required corrections.

---

## Workstream Exit Gate

- Content input, capacity feedback, QR preview, and quick PNG live in Workspace.
- Style contains presets and the three current geometry groups.
- Colors contains all current foreground/finder/background color behavior.
- Logo contains all current logo behavior.
- Scan Quality contains only error correction and quiet zone.
- Output contains output size and PNG/SVG/JPEG.
- Every current setting has one native home.
- No content-mode selector or `[NEW]` capability is exposed.
- Quick PNG and Output PNG use the same `downloadQR()` path.
- Legacy accordion/sidebar code is gone.
- Visual checkpoint passes and the full baseline suite/build are green.

## Commit Sequence

1. `feat: make workspace the qr creation surface`
2. `refactor: migrate style controls to inspector`
3. `refactor: migrate color controls to inspector`
4. `refactor: migrate logo and scan quality controls`
5. `refactor: consolidate qr export actions`
6. `chore: remove legacy settings accordion`
7. `style: polish workspace and inspector composition` (only if needed)
