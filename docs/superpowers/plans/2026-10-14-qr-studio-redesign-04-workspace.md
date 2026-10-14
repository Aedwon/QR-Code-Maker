> **SUPERSEDED — DO NOT EXECUTE**
>
> This document is retained as planning history only. Use the approved parent plan and the `2026-10-14-qr-studio-redesign-impl-01-*` through `impl-05-*` implementation plans instead.

# QR Studio Redesign 04: Center Workspace Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the center workspace the primary QR creation surface for content entry, preview, and quick export actions.

**Architecture:** Move the current content input and QR preview out of settings/navigation chrome and into dedicated workspace components. Build the content-mode selector as extensible infrastructure, but only render modes with real implemented behavior.

**Tech Stack:** HTML, CSS, vanilla JavaScript, `qr-code-styling`, Playwright.

**Spec:** `UI-PATTERNS.md`

## Global Constraints

- Do not expose placeholder or dead content modes.
- If only one content mode is implemented at execution time, hide the selector instead of showing a meaningless one-item segmented control.
- Do not add Text/Link/Contact/Wi-Fi navigation to the left sidebar.
- QR preview remains the visual center of gravity.
- Quick download is a convenience action; detailed output settings remain in the inspector.

## Review Focus

- Existing free-form data entry still produces the same QR content.
- Content UI cannot silently alter or normalize data unless that behavior already exists.
- QR preview is visually protected from the textured canvas.
- Workspace remains usable when inspector/navigation state changes.
- Download shortcut does not duplicate independent export state.

---

### Task 1: Create workspace composition

**Files:**
- Modify: `index.html`
- Modify: `src/style.css`

- [ ] Place content entry at the top of the center workspace in its own floating surface.
- [ ] Place the QR preview in a dedicated neutral preview surface with generous clear space.
- [ ] Place the persistent quick action beneath or adjacent to the preview according to available width.
- [ ] Remove any duplicate content control left in the inspector/sidebar.
- [ ] Verify the workspace remains dominant at 900px+ desktop widths.
- [ ] Commit.

### Task 2: Isolate workspace behavior

**Files:**
- Create: `src/ui/workspace.js`
- Modify: `src/main.js`
- Modify: `index.html`

- [ ] Move workspace-specific DOM event wiring out of the generic bootstrap path without changing the underlying QR options contract.
- [ ] Keep the existing debounce timing and capacity feedback behavior.
- [ ] Provide a narrow workspace API for reading/updating active content and rendering capacity/status feedback.
- [ ] Keep QR generation state authoritative in the existing application state rather than duplicating it inside the workspace module.
- [ ] Run baseline tests.
- [ ] Commit.

### Task 3: Add content-mode selector infrastructure without fake features

**Files:**
- Modify: `src/ui/workspace.js`
- Modify: `index.html`
- Modify: `src/style.css`
- Create or modify: `tests/e2e/workspace.spec.js`

- [ ] Define a small content-mode registry whose entries require a real renderer and serialization behavior before they can be shown.
- [ ] Register only currently implemented modes.
- [ ] Hide the segmented selector when fewer than two real modes are available.
- [ ] Ensure future modes can be added without changing left navigation or inspector architecture.
- [ ] Add tests proving no unimplemented content mode is exposed.
- [ ] Commit.

### Task 4: Consolidate quick actions

**Files:**
- Modify: `index.html`
- Modify: `src/ui/workspace.js`
- Modify: `src/main.js`
- Create or modify: `tests/e2e/qr-reliability-output.spec.js`

- [ ] Make the workspace `Download PNG` action invoke the same canonical export path used by Output controls.
- [ ] Keep copy/reset actions only if they already exist or are separately authorized; do not invent them to match concept art.
- [ ] Verify the quick action stays available regardless of selected inspector section.
- [ ] Test download from at least Style and Colors inspector contexts.
- [ ] Commit.

## Exit Gate

- Content input and QR preview live in the center workspace.
- No content selector is duplicated elsewhere.
- No unimplemented content modes are exposed.
- Quick download uses canonical export behavior.
- Regression suite passes.
