# QR Studio Redesign Implementation Plan 01: Baseline, IA, and Privacy

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Freeze the current behavior that must survive the redesign, lock the final control map, and remove the current analytics/feedback contradictions before structural UI work begins.

**Architecture:** Keep the current application structure intact in this workstream. Add a small Chromium Playwright harness around the real Vite app, document the exact migration map, and remove only the networked behaviors already authorized by the approved parent plan. Do not introduce redesign markup yet.

**Tech Stack:** Vite, vanilla JavaScript, `qr-code-styling`, Playwright.

**Spec:** `docs/superpowers/plans/2026-10-14-qr-studio-redesign-plan-of-plans.md`

## Global Constraints

- Do not implement the new floating shell in this workstream.
- Preserve current QR-generation, styling, logo, reliability, and export behavior.
- Do not implement any README capability marked `[NEW]`.
- Keep automated coverage intentionally small and focused on regression-prone flows.
- Remove Google Analytics and Web3Forms without replacing them with another telemetry or backend service.
- Because the repository currently contains no explicit external feedback destination, remove the embedded feedback action for this redesign rather than inventing a destination.
- Keep Terms and Privacy available. Their copy must accurately describe the resulting implementation.

## Review Focus

1. The control migration map is complete before any shell work starts.
2. Tests capture behavior rather than brittle visual structure.
3. Removing analytics/feedback cannot change QR state or output.
4. Privacy copy matches actual network behavior after cleanup.
5. No new product capability enters scope.

---

### Task 1: Lock the behavior inventory and final information architecture

**Files:**
- Create: `docs/redesign/current-behavior-baseline.md`

- [ ] Create the baseline document with these exact target homes:

```text
Workspace
  qr-data
  byte/capacity feedback
  qr-preview
  quick Download PNG (added later in Workstream 3)

Style
  presets
  module shape / dot-style-grid
  outer finder shape / corner-square-style-grid
  inner finder shape / corner-dot-style-grid

Colors
  module color + gradient + rotation
  outer finder color + gradient
  inner finder color + gradient
  background transparency + background color

Logo
  upload/remove
  logo size
  logo margin
  logo background shape
  logo background color

Scan Quality
  error correction
  quiet zone / margin

Output
  output size
  PNG / SVG / JPEG export

Utilities
  Terms of Use
  Privacy Policy
  Light / Dark / System theme controls (added in Workstream 2)
  compact copyright

Removed / deferred
  Google Analytics / gtag
  embedded Web3Forms feedback form
  Feedback utility until a real external destination is explicitly supplied
  content-type selector while only one real content workflow exists
  all README [NEW] reliability/content/output capabilities
```

- [ ] Record the current side effects that must survive: content updates are debounced 150 ms; manual appearance changes detach the active preset; logo upload forces H error correction; logo removal resets it to Q; capacity thresholds depend on the active error-correction level; gradients must be explicitly cleared when returning to flat color.
- [ ] Lock the footer decision: Terms, Privacy, and compact copyright move into the final Navigation utility area in Workstream 2; the verbose persistent reproduction notice is removed from chrome because the Terms already contain the relevant restrictions.
- [ ] Lock the initial pinnable set for Workstream 4: `module-shape`, `primary-color`, `error-correction`, `quiet-zone`, `output-size`.
- [ ] Explicitly state that capacity feedback remains in Workspace, not Scan Quality.
- [ ] Commit.

**Verification:**

```bash
git diff --check
grep -n "Workspace\|Style\|Colors\|Logo\|Scan Quality\|Output" docs/redesign/current-behavior-baseline.md
```

Expected: all six target areas are present; no `[NEW]` feature is listed as current behavior.

---

### Task 2: Add the proportional Playwright regression harness

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `.gitignore`
- Create: `playwright.config.js`
- Create: `tests/e2e/fixtures/logo.svg`
- Create: `tests/e2e/helpers/preview.js`

- [ ] Install Playwright test tooling:

```bash
npm install --save-dev @playwright/test
npx playwright install chromium
```

- [ ] Add scripts:

```json
"test:e2e": "playwright test",
"test:e2e:headed": "playwright test --headed"
```

- [ ] Configure one Chromium project with `baseURL: 'http://127.0.0.1:3000'` and a `webServer` command of `npm run dev -- --host 127.0.0.1`.
- [ ] Keep the harness local. Do not add CI workflows as part of this redesign.
- [ ] Add `test-results/` and `playwright-report/` to `.gitignore`.
- [ ] Use a tiny UTF-8 SVG fixture instead of a binary fixture, for example:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="12" fill="#503047"/>
  <circle cx="32" cy="32" r="14" fill="#D0E3C4"/>
</svg>
```

- [ ] Add `getPreviewSignature(page)` in `tests/e2e/helpers/preview.js`:

```js
export async function getPreviewSignature(page) {
  return page.locator('#qr-preview').evaluate((root) => {
    const canvas = root.querySelector('canvas');
    if (canvas) return canvas.toDataURL();
    const svg = root.querySelector('svg');
    return svg?.outerHTML ?? '';
  });
}
```

- [ ] Run the empty harness and production build.

**Verification:**

```bash
npm run build
npm run test:e2e
```

Expected: both exit 0.

- [ ] Commit.

---

### Task 3: Capture the core editing baseline

**Files:**
- Create: `tests/e2e/qr-editing.spec.js`

- [ ] Write a failing test for content regeneration before relying on it as a redesign invariant:

```js
test('content editing regenerates the QR after the existing debounce', async ({ page }) => {
  await page.goto('/');
  const before = await getPreviewSignature(page);
  await page.locator('#qr-data').fill('QR Studio redesign baseline');
  await page.waitForTimeout(220);
  const after = await getPreviewSignature(page);
  expect(after).not.toBe(before);
});
```

- [ ] Add one representative manual shape test: switch module shape to `dots`, assert the button becomes active, and assert the preview signature changes.
- [ ] Add one representative color test: enter a valid color in `#dot-color-hex`, assert the native color input synchronizes, then assert the preview changes.
- [ ] Add a preset-detachment test: choose a non-default preset, then manually change module shape and assert no `.preset-btn` remains active.
- [ ] Add one gradient round-trip test: enable module gradient, verify preview changes, disable it, then verify the flat color path still changes the preview. This specifically protects the current `gradient: undefined` clearing behavior.
- [ ] Do not test every preset and every color field. The goal is a regression tripwire, not exhaustive renderer testing.

**Verification:**

```bash
npm run test:e2e -- tests/e2e/qr-editing.spec.js
```

Expected: all editing baseline tests pass against the pre-redesign UI.

- [ ] Commit.

---

### Task 4: Capture logo, reliability, and export behavior

**Files:**
- Create: `tests/e2e/qr-reliability-output.spec.js`

- [ ] Add an error-correction/capacity test: switch from Q to H, assert H is active, fill enough content to make the displayed maximum change, and verify the counter reflects the H limit rather than the Q limit.
- [ ] Add a logo lifecycle test using `tests/e2e/fixtures/logo.svg`:

```js
await page.locator('#logo-upload').setInputFiles('tests/e2e/fixtures/logo.svg');
await expect(page.locator('.ec-btn[data-value="H"]')).toHaveClass(/active/);
await page.locator('#logo-remove').click();
await expect(page.locator('.ec-btn[data-value="Q"]')).toHaveClass(/active/);
```

- [ ] Add one quiet-zone test and one output-size test that assert the visible values change and the QR preview updates.
- [ ] Add download tests for PNG, SVG, and JPEG using Playwright's `download` event. Assert the suggested filename extension matches the clicked format.
- [ ] Do not add scan-score/decode tests; those are `[NEW]` and out of scope.

**Verification:**

```bash
npm run test:e2e -- tests/e2e/qr-reliability-output.spec.js
```

Expected: all tests pass against current behavior.

- [ ] Commit.

---

### Task 5: Remove analytics and networked feedback, then align privacy copy

**Files:**
- Modify: `index.html`
- Modify: `src/main.js`
- Modify: `src/style.css`
- Modify: `UI-PATTERNS.md`
- Create: `tests/e2e/utilities-privacy.spec.js`

- [ ] Remove the GA4 script and inline `gtag` bootstrap from `<head>`.
- [ ] Remove every `gtag(...)` call from `src/main.js`.
- [ ] Remove the Web3Forms feedback modal/form and its exposed access key from `index.html`.
- [ ] Remove the Web3Forms submit handler and feedback-specific status code from `src/main.js`.
- [ ] Remove feedback-form-only CSS once no element uses it. Do not remove generic modal styles used by Terms/Privacy.
- [ ] Remove the current `Feedback` link because no explicit external destination exists in the repository. Do not invent an email, URL, or backend.
- [ ] Update `UI-PATTERNS.md` so Feedback is conditional: show it only when a real external destination is configured; Privacy, Terms, and appearance remain canonical utilities.
- [ ] Update Privacy Policy copy so it no longer claims GA or Web3Forms use. Keep the local QR and uploaded-image statements accurate. A suitable replacement analytics statement is:

```text
Analytics. QR Studio does not include product analytics or usage telemetry. Normal use does not send QR content or usage behavior to Aedwon.
```

- [ ] Remove the final Privacy sentence that tells users to use the now-removed feedback form.
- [ ] Leave the existing footer layout in place for now. Workstream 2 relocates Terms/Privacy/copyright into final Navigation and removes the footer.
- [ ] Add smoke tests: Terms opens/closes; Privacy opens/closes; no Feedback control/form exists.
- [ ] Add a request audit that fails if normal page load requests any of these hosts:

```text
googletagmanager.com
fonts.googleapis.com
fonts.gstatic.com
api.web3forms.com
```

At this workstream, Google Fonts may still be present until Workstream 2, so gate only GA/Web3Forms now; expand the assertion to Google Fonts after local font bundling.

**Verification:**

```bash
grep -R "gtag\|googletagmanager\|web3forms" index.html src README.md UI-PATTERNS.md || true
npm run build
npm run test:e2e
```

Expected: no runtime GA/Web3Forms implementation remains; build and baseline suite pass.

- [ ] Commit.

---

## Workstream Exit Gate

- `docs/redesign/current-behavior-baseline.md` contains the locked control map, footer decision, and pin set.
- The small Playwright suite protects content, representative Style/Colors, logo lifecycle, error correction, quiet zone/output size, export, Terms, and Privacy.
- GA and Web3Forms are removed from runtime behavior.
- Privacy copy matches the implementation.
- No redesign shell or `[NEW]` product feature has been introduced.
- `npm run build && npm run test:e2e` pass.

## Commit Sequence

1. `docs: lock redesign behavior and control map`
2. `test: add qr studio browser regression harness`
3. `test: capture core qr editing behavior`
4. `test: capture logo reliability and export behavior`
5. `chore: remove analytics and networked feedback`
