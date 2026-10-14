> **SUPERSEDED — DO NOT EXECUTE**
>
> This document is retained as planning history only. Use the approved parent plan and the `2026-10-14-qr-studio-redesign-impl-01-*` through `impl-05-*` implementation plans instead.

# QR Studio Redesign 05: Contextual Inspector Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the current settings into one contextual inspector with clear user-facing top-level sections and no redundant controls.

**Architecture:** Preserve existing control logic while regrouping DOM ownership by user goal. Section navigation changes which inspector feature container is active; it must never create a second copy of the same setting.

**Tech Stack:** HTML, CSS, vanilla JavaScript, Playwright.

**Spec:** `UI-PATTERNS.md`

## Global Constraints

- Canonical feature labels: Style, Colors, Logo, Scan Quality, Output.
- Internal implementation terms may differ from user-facing labels.
- One setting gets one canonical native location.
- Avoid excessive accordions and nested cards.
- Preserve existing QR state and event behavior.
- Do not surface `[NEW]` capabilities solely to fill a section.

## Review Focus

- Every current control has exactly one deliberate native home.
- Section switches never reset QR state.
- Hidden feature groups are inert and inaccessible to keyboard focus.
- User-facing wording is understandable without renderer terminology.
- Output and Scan Quality do not become dumping grounds for unrelated controls.

---

### Task 1: Finalize the control-to-section map

**Files:**
- Modify: `docs/redesign/current-behavior-baseline.md`

- [ ] Map presets, module shape, corner-square style, and corner-dot style to `Style`.
- [ ] Map module/finder/background colors, gradients, and transparency to `Colors` where they currently exist.
- [ ] Map logo upload/removal, size, margin, background shape, and logo-background color to `Logo`.
- [ ] Map error correction, quiet zone/margin, capacity/risk feedback, and other existing reliability-related controls to `Scan Quality`.
- [ ] Map output size and export formats to `Output`.
- [ ] Flag anything that does not fit cleanly instead of forcing it into a section.
- [ ] Commit the finalized map before moving controls.

### Task 2: Migrate Style and Colors

**Files:**
- Modify: `index.html`
- Modify: `src/style.css`
- Modify: `src/main.js`
- Create or modify: `tests/e2e/navigation.spec.js`
- Create or modify: `tests/e2e/qr-editing.spec.js`

- [ ] Recompose existing Style controls into clear control groups with user-facing labels.
- [ ] Recompose Colors without changing gradient/flat-color behavior.
- [ ] Remove old accordion wrappers that no longer serve progressive disclosure.
- [ ] Keep advanced color controls collapsed only where complexity genuinely warrants it.
- [ ] Verify tests for presets, shapes, colors, and gradients pass in their new locations.
- [ ] Commit.

### Task 3: Migrate Logo and Scan Quality

**Files:**
- Modify: `index.html`
- Modify: `src/style.css`
- Modify: `src/main.js`
- Create or modify: `tests/e2e/qr-reliability-output.spec.js`

- [ ] Move current logo controls into the Logo context without changing compositing behavior.
- [ ] Move error correction, capacity feedback, and quiet-zone/margin controls into Scan Quality.
- [ ] Keep scan/reliability messaging concise and action-oriented.
- [ ] Do not add scan-score or decode validation until those `[NEW]` features are separately implemented.
- [ ] Run logo and reliability tests.
- [ ] Commit.

### Task 4: Migrate Output and remove legacy structure

**Files:**
- Modify: `index.html`
- Modify: `src/style.css`
- Modify: `src/main.js`
- Create or modify: `tests/e2e/qr-reliability-output.spec.js`

- [ ] Move output size and existing PNG/SVG/JPEG export controls into Output.
- [ ] Keep workspace quick-download wired to the same export implementation.
- [ ] Remove obsolete sidebar accordion markup, CSS, and collapse JavaScript that no longer has a purpose.
- [ ] Search for orphaned IDs/classes/event bindings from the old structure and remove them.
- [ ] Run `npm run build && npm run test:e2e`.
- [ ] Commit.

## Exit Gate

- All existing settings have one canonical inspector home.
- Left navigation switches between the five approved contexts.
- No old settings accordion remains user-facing.
- Existing editing, logo, reliability, and export tests pass.
