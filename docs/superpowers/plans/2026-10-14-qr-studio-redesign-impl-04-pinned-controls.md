# QR Studio Redesign Implementation Plan 04: Curated Pinned Controls

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the approved pinned-controls convenience layer for five high-frequency settings while keeping native controls in place and avoiding a generalized state architecture.

**Architecture:** Refactor only the five pinnable settings behind small explicit setter functions in `src/main.js`. `src/ui/pins.js` renders compact mirror controls and receives a narrow settings interface of `{ get, set }` pairs. Native and pinned views therefore share `currentOptions` as the source of truth without cloning state, moving native DOM, or introducing an application store.

**Tech Stack:** Vanilla JavaScript, `localStorage`, existing DOM controls, Playwright.

**Spec:** `docs/superpowers/plans/2026-10-14-qr-studio-redesign-plan-of-plans.md`, `UI-PATTERNS.md`

## Global Constraints

- Workstreams 1–3 must be complete and green.
- Native controls remain in their approved Inspector sections at all times.
- The only initial pinnable keys are:
  - `module-shape`
  - `primary-color`
  - `error-correction`
  - `quiet-zone`
  - `output-size`
- Do not make arbitrary controls pinnable.
- Do not add Redux, signals, observable stores, a generic form framework, or a generalized renderer registry.
- Persist only ordered pin keys under `qr-studio:pins:v1`; QR settings themselves remain governed by the existing application state.
- Pin affordances must be usable without hover.

## Review Focus

1. Native and pinned controls always show one underlying value.
2. Presets and logo side effects also synchronize pinned mirrors.
3. Pin persistence cannot break startup when stored data is stale or malformed.
4. Empty pinned state takes no visible space.
5. The implementation remains obviously smaller than a general state-management system.

---

### Task 1: Refactor the five pinnable settings behind explicit setters

**Files:**
- Modify: `src/main.js`
- Modify: `tests/e2e/qr-editing.spec.js`
- Modify: `tests/e2e/qr-reliability-output.spec.js`

- [ ] Introduce explicit setters for only the settings that need two synchronized views:

```js
function setModuleShape(value) {
  currentOptions.dotsOptions.type = value;
  deselectPreset();
  syncStyleGrid('dot-style-grid', value);
  updateQR();
  pinController?.sync('module-shape');
}

function setPrimaryColor(value) {
  if (currentOptions.dotsOptions.gradient) {
    currentOptions.dotsOptions.gradient.colorStops[0].color = value;
  } else {
    currentOptions.dotsOptions.color = value;
  }
  document.getElementById('dot-color').value = value;
  document.getElementById('dot-color-hex').value = value.toUpperCase();
  deselectPreset();
  updateQR();
  pinController?.sync('primary-color');
}

function setErrorCorrection(value) {
  currentOptions.qrOptions.errorCorrectionLevel = value;
  syncECButtons(value);
  updateCharCounter();
  updateQR();
  pinController?.sync('error-correction');
}

function setQuietZone(value) {
  currentOptions.margin = Number(value);
  document.getElementById('qr-margin').value = String(value);
  document.getElementById('qr-margin-val').textContent = `${value}px`;
  updateQR();
  pinController?.sync('quiet-zone');
}

function setOutputSize(value) {
  currentOptions.width = Number(value);
  currentOptions.height = Number(value);
  document.getElementById('qr-size').value = String(value);
  document.getElementById('qr-size-val').textContent = `${value}px`;
  updateQR();
  pinController?.sync('output-size');
}
```

The exact implementation may be factored slightly differently, but keep the surface this small and explicit.

- [ ] Route the native module-shape buttons through `setModuleShape()`.
- [ ] Route the native primary-color pair through `setPrimaryColor()` while preserving gradient-start semantics.
- [ ] Route native EC buttons through `setErrorCorrection()`.
- [ ] Route quiet-zone and output-size range inputs through their setters.
- [ ] Route logo upload H and logo removal Q through `setErrorCorrection()` so an EC pin cannot become stale.
- [ ] After preset application calls `syncUIFromOptions()`, call `pinController?.syncAll()` so module-shape/primary-color mirrors follow preset changes.
- [ ] Keep all non-pinnable settings on their existing direct code paths. Do not expand this refactor merely for consistency.
- [ ] Run the existing regression suite before adding any pin UI.

**Verification:**

```bash
npm run test:e2e -- tests/e2e/qr-editing.spec.js tests/e2e/qr-reliability-output.spec.js
npm run build
```

Expected: no observable behavior change before pinning is initialized.

- [ ] Commit.

---

### Task 2: Implement the narrow pinned-controls module

**Files:**
- Create: `src/ui/pins.js`
- Modify: `src/main.js`
- Modify: `index.html`
- Modify: `src/style.css`
- Create: `tests/e2e/pins.spec.js`

**Interface:**

```js
// src/ui/pins.js
export function initPins({ root, settings, storage = window.localStorage });
// settings is a fixed object keyed by the five approved pin keys:
// {
//   'module-shape': { get, set },
//   'primary-color': { get, set },
//   'error-correction': { get, set },
//   'quiet-zone': { get, set },
//   'output-size': { get, set }
// }
// returns { sync(key), syncAll() }
```

- [ ] Add one `#pinned-controls` dock at the top of `#app-inspector`. It is `hidden` when there are zero pins.
- [ ] Add a small pin action to each approved native control group using `data-pin-action="<key>"` or equivalent. Do not expose pin actions on presets, gradient editors, logo upload, export formats, navigation, utilities, or content.
- [ ] In `pins.js`, hardcode compact renderers for the five approved control types. Do not build a generic schema/renderer engine.
- [ ] Mirror values through the supplied `{ get, set }` functions:
  - module shape: compact select/segmented control containing the same current module-shape values,
  - primary color: color input plus compact hex field or a single compact color control with an accessible value label,
  - error correction: compact L/M/Q/H control,
  - quiet zone: compact range/value pair,
  - output size: compact range/value pair.
- [ ] Every pinned control has a visible/accessible label including source context when needed, e.g. `Style · Module shape`.
- [ ] Do not duplicate native DOM IDs in the pin dock. Pinned inputs use their own IDs derived from the pin key.
- [ ] Native controls remain where they are; pinning adds/removes only the mirror in the dock.

**Initialization in `src/main.js`:**

```js
let pinController = null;

pinController = initPins({
  root: document.getElementById('pinned-controls'),
  settings: {
    'module-shape': {
      get: () => currentOptions.dotsOptions.type,
      set: setModuleShape,
    },
    'primary-color': {
      get: () => document.getElementById('dot-color').value,
      set: setPrimaryColor,
    },
    'error-correction': {
      get: () => currentOptions.qrOptions.errorCorrectionLevel,
      set: setErrorCorrection,
    },
    'quiet-zone': {
      get: () => currentOptions.margin,
      set: setQuietZone,
    },
    'output-size': {
      get: () => currentOptions.width,
      set: setOutputSize,
    },
  },
});
```

- [ ] Add a first test that pins `module-shape`, changes it from the pinned mirror, and asserts the native Style control updates and the QR changes.
- [ ] Add the reverse direction: change the native module-shape control and assert the pin updates.

**Verification:**

```bash
npm run test:e2e -- tests/e2e/pins.spec.js
```

Expected: bidirectional synchronization works with one source of truth.

- [ ] Commit.

---

### Task 3: Persist pin order and fail safely on stale data

**Files:**
- Modify: `src/ui/pins.js`
- Modify: `tests/e2e/pins.spec.js`

- [ ] Use storage key exactly `qr-studio:pins:v1`.
- [ ] Persist an ordered JSON array only:

```json
["module-shape", "error-correction", "output-size"]
```

- [ ] On startup, parse defensively. If JSON is invalid, not an array, or contains unknown values, ignore invalid entries and continue.
- [ ] De-duplicate repeated keys while preserving the first valid occurrence.
- [ ] Restore mirrors only after the settings interface and inspector DOM exist.
- [ ] Do not persist the actual QR setting values as part of the pin feature.
- [ ] Add tests for reload persistence and unknown/stale-key recovery:

```js
await page.evaluate(() => {
  localStorage.setItem('qr-studio:pins:v1', JSON.stringify(['module-shape', 'removed-key']));
});
await page.reload();
await expect(page.locator('[data-pinned-key="module-shape"]')).toBeVisible();
await expect(page.locator('[data-pinned-key="removed-key"]')).toHaveCount(0);
```

- [ ] Add malformed-JSON coverage to prove startup does not crash.

**Verification:**

```bash
npm run test:e2e -- tests/e2e/pins.spec.js
```

- [ ] Commit.

---

### Task 4: Add accessible unpin, reorder, and dock collapse behavior

**Files:**
- Modify: `src/ui/pins.js`
- Modify: `src/style.css`
- Modify: `tests/e2e/pins.spec.js`

- [ ] Each pinned item gets an `Unpin <label>` action.
- [ ] Add explicit `Move <label> up` and `Move <label> down` buttons. Disable the unavailable direction at list boundaries.
- [ ] Do not add drag-and-drop unless it can be implemented without becoming the only reorder path. Drag-and-drop is optional and unnecessary for this scope.
- [ ] Reordering updates DOM order and persisted key order immediately.
- [ ] Add a compact dock collapse/expand action when at least one pin exists. Collapse state does not need to persist across reloads.
- [ ] When the final pin is removed, set the entire dock to `hidden` so it consumes no vertical space.
- [ ] Native pin affordances must be keyboard/touch reachable. Hover reveal may be used as a pointer enhancement, but not as the sole access path.
- [ ] Use canonical focus and touch-target rules from `DESIGN-TOKENS.md`.

**Tests:**

- pin two settings, reorder with Move up/down, reload, assert order persists,
- unpin down to zero, assert `#pinned-controls` is hidden,
- collapse/expand does not change the pin list or values,
- keyboard focus can reach pin/unpin/reorder actions.

**Verification:**

```bash
npm run test:e2e -- tests/e2e/pins.spec.js
```

- [ ] Commit.

---

### Task 5: Verify synchronization across indirect state changes

**Files:**
- Modify: `tests/e2e/pins.spec.js`
- Modify as needed: `src/main.js`
- Modify as needed: `src/ui/pins.js`

- [ ] Pin `module-shape` and `primary-color`, apply a preset, and assert both pinned mirrors update to the preset-driven values.
- [ ] Pin `error-correction`, upload the logo fixture, and assert pinned EC becomes H; remove the logo and assert it becomes Q.
- [ ] Pin quiet zone/output size, switch Inspector sections several times, and assert pinned values remain interactive and unchanged.
- [ ] Verify the native controls are still present in their home sections after pinning. The test should fail if implementation accidentally reparents them.
- [ ] Verify pinning does not change active Inspector section or Workspace content.

**Representative invariant:**

```js
await expect(page.locator('[data-inspector-section="style"] #dot-style-grid')).toHaveCount(1);
await expect(page.locator('#pinned-controls [data-pinned-key="module-shape"]')).toHaveCount(1);
```

**Verification:**

```bash
npm run build
npm run test:e2e
```

Expected: full regression suite passes with pinning enabled.

- [ ] Commit.

---

## Workstream Exit Gate

- The five approved settings are pinnable; no others are.
- Native controls remain in their original Inspector sections.
- Pinned and native controls synchronize bidirectionally through the same underlying values.
- Presets and logo H/Q automation synchronize affected pins.
- Ordered pins persist under `qr-studio:pins:v1` and stale storage fails safely.
- Reorder and unpin are keyboard/touch accessible; drag-and-drop is not required.
- Empty dock disappears completely.
- No generalized app store or arbitrary-control pin engine was introduced.
- `npm run build && npm run test:e2e` pass.

## Commit Sequence

1. `refactor: expose setters for pinnable qr settings`
2. `feat: add curated pinned controls`
3. `feat: persist qr studio pin order`
4. `feat: add accessible pin management`
5. `test: cover indirect pin synchronization`
