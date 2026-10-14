# QR Studio Redesign Implementation Plan 02: Visual System and Floating Shell

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the old black/yellow attached-page identity with the approved QR Studio visual system and establish the permanent three-zone desktop shell without changing QR-generation semantics.

**Architecture:** Introduce canonical semantic CSS tokens, locally bundled Inter, a small appearance controller, and a lightweight shell controller. Recompose the page into floating Navigation, Workspace, and Inspector zones while preserving existing control IDs and QR logic. Final control grouping is completed in Workstream 3; this workstream establishes the stable structure those controls live inside.

**Tech Stack:** Vite, vanilla JavaScript, CSS custom properties, `@fontsource/inter`, Playwright.

**Spec:** `docs/superpowers/plans/2026-10-14-qr-studio-redesign-plan-of-plans.md`, `DESIGN.md`, `DESIGN-TOKENS.md`, `UI-PATTERNS.md`

## Global Constraints

- Workstream 1 must be complete and green before this plan begins.
- At every width `>=900px`, Navigation, Workspace, and Inspector remain simultaneously visible.
- Nothing should visually attach to a desktop viewport edge.
- Do not add content-mode navigation or a one-item content selector.
- Do not rewrite QR state or rendering logic merely to support the shell.
- Preserve the exact canonical `#C05746` brand primitive. Use `#B04B3C` or a dark foreground when a filled action needs stronger text contrast.
- Theme state must be UI appearance only. It must never modify `currentOptions` or the generated QR.
- Keep the implementation framework-free.

## Review Focus

1. The old yellow/glow identity is fully replaced rather than layered under the new design.
2. The three floating zones are visually independent at 1024px and 1440px.
3. Compact desktop narrows dimensions, not information architecture.
4. Theme switching leaves QR controls and output state untouched.
5. Local fonts and static visual treatment require no third-party runtime request.

---

### Task 1: Bundle Inter locally and establish canonical semantic tokens

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `index.html`
- Modify: `src/main.js`
- Modify: `src/style.css`

- [ ] Install the local Inter package:

```bash
npm install @fontsource/inter
```

- [ ] Import only weights currently required by `DESIGN-TOKENS.md` in `src/main.js`:

```js
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
```

- [ ] Remove Google Fonts `preconnect` and stylesheet tags from `index.html`.
- [ ] Replace the old `:root` black/yellow/glow variables with semantic variables matching `DESIGN-TOKENS.md`. Keep primitive and semantic names distinct where useful:

```css
:root {
  --brand-copper: #C05746;
  --brand-olive: #ADC698;
  --brand-tea: #D0E3C4;
  --brand-white: #FFFFFF;
  --brand-blackberry: #503047;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;

  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --radius-xl: 18px;
  --radius-full: 999px;

  --motion-fast: 120ms;
  --motion-normal: 180ms;
  --motion-panel: 240ms;
  --motion-ease: cubic-bezier(.2, .8, .2, 1);
}
```

- [ ] Define light semantic values as the default and dark values under `html[data-theme="dark"]` exactly from `DESIGN-TOKENS.md`.
- [ ] Use the documented Inter fallback stack. Do not keep the current remote-font dependency as a fallback request.
- [ ] Remove old `--accent-glow`, yellow identity variables, and decorative glow shadows as components are migrated to semantic tokens. Do not leave them active under renamed aliases.
- [ ] Keep current layout functional while converting shared controls. Structural shell changes begin in Task 3.

**Verification:**

```bash
npm run build
grep -R "fonts.googleapis.com\|fonts.gstatic.com\|F2C21A\|accent-glow" index.html src || true
```

Expected: no Google Fonts runtime reference and no active old yellow/glow identity.

- [ ] Commit.

---

### Task 2: Add appearance state without visible controls yet

**Files:**
- Create: `src/theme.js`
- Modify: `src/main.js`
- Create: `tests/e2e/theme.spec.js`

**Interface:**

```js
// src/theme.js
export function initTheme();
export function setAppearance(mode); // 'light' | 'dark' | 'system'
export function getAppearance();
```

- [ ] Implement storage key `qr-studio:appearance`.
- [ ] Store the user choice on `document.documentElement.dataset.appearance`.
- [ ] Store the resolved visual theme (`light` or `dark`) on `document.documentElement.dataset.theme`.
- [ ] In `system` mode, listen to `matchMedia('(prefers-color-scheme: dark)')` changes and update only the resolved theme.
- [ ] Invalid/missing stored values resolve to `system` rather than throwing.
- [ ] Call `initTheme()` during bootstrap before the UI becomes interactive.
- [ ] Do **not** add Light/Dark/System buttons yet; their only visible instance is added in final Navigation in Task 3.
- [ ] Add a theme test that snapshots QR-relevant DOM control values before and after calling the visible controls once they exist. For this intermediate task, at minimum verify the dataset/storage behavior directly through page evaluation.

**Representative test contract:**

```js
expect(await page.evaluate(() => localStorage.getItem('qr-studio:appearance'))).toBe('dark');
expect(await page.locator('html').getAttribute('data-theme')).toBe('dark');
```

**Verification:**

```bash
npm run test:e2e -- tests/e2e/theme.spec.js
npm run build
```

Expected: appearance persistence and system resolution pass without touching QR behavior.

- [ ] Commit.

---

### Task 3: Recompose the document into the approved permanent desktop shell

**Files:**
- Modify: `index.html`
- Create: `src/ui/shell.js`
- Modify: `src/main.js`
- Modify: `src/style.css`
- Create: `tests/e2e/navigation.spec.js`

**Canonical desktop DOM contract:**

```html
<div id="app-shell" class="app-shell">
  <aside id="app-nav" class="app-nav">...</aside>
  <main id="workspace" class="workspace">...</main>
  <aside id="app-inspector" class="app-inspector">...</aside>
</div>
```

Primary navigation buttons use:

```html
<button data-feature="style">Style</button>
<button data-feature="colors">Colors</button>
<button data-feature="logo">Logo</button>
<button data-feature="scan-quality">Scan Quality</button>
<button data-feature="output">Output</button>
```

Inspector sections use matching `data-inspector-section` values.

**Shell interface:**

```js
// src/ui/shell.js
export function initShell({ defaultSection = 'style' } = {});
// returns:
// {
//   selectSection(section),
//   getSection()
// }
```

- [ ] Remove the attached top header. Move `QR Studio` / `by Aedwon` branding to the top of `#app-nav`.
- [ ] Add only the five approved top-level customization buttons. Do not put Content/Text/Link/Contact/Wi-Fi/More in Navigation.
- [ ] Add subordinate utility controls near the bottom for Terms, Privacy, appearance, and compact copyright. Do not add Feedback while no real destination exists.
- [ ] Remove the old persistent footer after its approved material has moved into Navigation. Remove the verbose persistent reproduction notice; retain the existing Terms modal content as the canonical legal detail.
- [ ] Create the five inspector section containers. During this workstream, existing setting groups may still carry their legacy internal wrappers; relocate them according to the locked baseline map without changing IDs or behavior.
- [ ] Keep content input and QR preview in the center area, even if their final surface composition waits for Workstream 3.
- [ ] `initShell()` defaults to `style`, applies `aria-current="page"` to the selected Navigation item, removes it from peers, and shows only the matching inspector section.
- [ ] Hidden inspector sections must use both `hidden` and `inert` so they are not keyboard-reachable.
- [ ] Selecting sections must never alter `currentOptions`, content, active preset, or preview.

**Representative navigation test:**

```js
await page.locator('[data-feature="colors"]').click();
await expect(page.locator('[data-feature="colors"]')).toHaveAttribute('aria-current', 'page');
await expect(page.locator('[data-inspector-section="colors"]')).toBeVisible();
await expect(page.locator('[data-inspector-section="style"]')).toBeHidden();
await expect(page.locator('#qr-data')).toHaveValue(beforeContent);
```

**Verification:**

```bash
npm run test:e2e -- tests/e2e/navigation.spec.js
npm run test:e2e
npm run build
```

Expected: section navigation changes Inspector only; all baseline behavior remains green.

- [ ] Commit.

---

### Task 4: Add the final visible appearance controls in Navigation

**Files:**
- Modify: `index.html`
- Modify: `src/main.js`
- Modify: `src/theme.js`
- Modify: `src/style.css`
- Modify: `tests/e2e/theme.spec.js`

- [ ] Add exactly one appearance control group at the bottom of Navigation for Light, Dark, and System.
- [ ] Use icon buttons or compact labeled controls consistent with the approved layout. Every icon-only control must have an accessible label.
- [ ] Bind the controls to `setAppearance(mode)`.
- [ ] Selected appearance must be expressed semantically with `aria-pressed="true"`, not color alone.
- [ ] Theme choice persists on reload.
- [ ] Add a regression proving appearance never changes the user's QR styling. Set a distinctive module color and shape, change Light → Dark → System, and assert those control values remain unchanged.

**Representative assertion:**

```js
await page.locator('#dot-color-hex').fill('#503047');
await page.locator('#dot-color-hex').press('Tab');
const before = await getPreviewSignature(page);
await page.getByRole('button', { name: 'Dark appearance' }).click();
await expect(page.locator('#dot-color-hex')).toHaveValue('#503047');
expect(await getPreviewSignature(page)).toBe(before);
```

If the QR renderer produces nondeterministic serialization, compare QR-relevant controls/state rather than using a fragile binary signature.

**Verification:**

```bash
npm run test:e2e -- tests/e2e/theme.spec.js
```

Expected: light/dark/system and persistence pass; QR state is unchanged.

- [ ] Commit.

---

### Task 5: Implement the canonical floating geometry and textured canvas

**Files:**
- Modify: `src/style.css`

- [ ] Implement the canvas texture from `DESIGN-TOKENS.md`: warm light canvas, static fine grain, and a small number of large organic copper/olive/tea/blackberry fields at the specified restrained opacity.
- [ ] Use the lower-opacity dark treatment. Do not create digital glow, glass, animated gradients, or high-frequency noise.
- [ ] Make texture pointer-inert and remove it under `forced-colors: active`.
- [ ] At `>=1200px`, use the full three-zone grid with visible outer gutter and inter-zone spacing.
- [ ] At `900-1199px`, keep all three zones visible. Narrow Navigation and Inspector, reduce gaps/padding, and allow the center preview region to scale. Do not switch to a drawer or two-column model.
- [ ] Keep Navigation narrower than Inspector. Inspector may be moderately wider because it contains controls. Avoid hard-coded widths that make the Workspace secondary.
- [ ] Make left and right zones self-contained rounded surfaces with restrained border/elevation. Keep the center as an unboxed workspace whose own controls/preview form surfaces.
- [ ] Use the canonical type sizes, radii, shadows, control heights, and motion tokens.
- [ ] Ensure normal-size white text is not placed directly on `#C05746` where contrast is marginal; use the approved darker derived filled-action treatment where required.

**Manual visual checkpoint:**

Capture and review these states locally before proceeding:

```text
1440×900 light
1440×900 dark
1024×768 light
1024×768 dark
```

Confirm:
- visible canvas gutter around both sidebars,
- QR/workspace remains the visual focus,
- no attached header/footer/sidebar chrome,
- compact desktop still shows all three zones,
- texture does not show strongly through inputs or preview,
- no old yellow/glow identity remains.

**Verification:**

```bash
npm run build
npm run test:e2e
grep -R "F2C21A\|accent-glow\|fonts.googleapis.com\|fonts.gstatic.com" index.html src || true
```

Expected: build/tests pass; no old identity or remote font reference remains.

- [ ] Commit.

---

## Workstream Exit Gate

- Inter is locally bundled; normal load does not require Google Fonts.
- Light/Dark/System state and controls work and persist without touching QR state.
- Desktop `>=900px` always shows floating Navigation, Workspace, and Inspector.
- Navigation contains only approved top-level features and utilities.
- Terms/Privacy/copyright are in final Navigation; the old attached header/footer chrome is gone.
- The canonical token system and restrained static textured canvas are active.
- The 1440px and 1024px visual checkpoints match the approved composition closely enough to proceed.
- Full baseline suite and production build pass.

## Commit Sequence

1. `style: adopt canonical qr studio tokens and local inter`
2. `feat: add persistent appearance state`
3. `feat: establish floating qr studio shell`
4. `feat: add final appearance controls`
5. `style: finish floating geometry and textured canvas`
