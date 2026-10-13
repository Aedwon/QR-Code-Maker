# QR Studio Redesign 01: Behavior Baseline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Freeze the current working behavior in a repeatable regression harness before any structural redesign work.

**Architecture:** Add one browser-level test layer around the existing Vite app. Tests should drive the real DOM and `qr-code-styling` integration instead of introducing a parallel unit architecture solely for the redesign.

**Tech Stack:** Vite, vanilla JavaScript, Playwright.

**Spec:** `docs/superpowers/plans/2026-10-14-qr-studio-redesign-plan-of-plans.md`

## Global Constraints

- Do not redesign the UI in this phase.
- Do not change intended behavior simply to make a test easier.
- Record only behavior that currently exists; `[NEW]` README features are outside the baseline.
- Keep tests deterministic and local.

## Review Focus

- QR updates after content changes.
- Presets and manual appearance edits remain distinguishable.
- Error correction, size, and margin still reach the QR options.
- Logo add/remove behavior still adjusts the QR configuration correctly.
- PNG/SVG/JPEG export paths still initiate downloads.

---

### Task 1: Add browser regression tooling

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `playwright.config.js`
- Create: `tests/e2e/fixtures/logo.png`

- [ ] Add `@playwright/test` as a dev dependency and `test:e2e` / `test:e2e:headed` scripts.
- [ ] Configure Playwright to start the Vite dev server locally and test the Chromium desktop project.
- [ ] Add a tiny deterministic image fixture for logo tests.
- [ ] Run `npm run build` and the empty Playwright suite to verify tooling works.
- [ ] Commit the test harness separately from behavior tests.

### Task 2: Record the current feature map

**Files:**
- Create: `docs/redesign/current-behavior-baseline.md`

- [ ] Inventory every user-visible control currently present in the app.
- [ ] For each control, record its current behavior and the future target area: Workspace, Style, Colors, Logo, Scan Quality, Output, utility/legal, or intentionally removed.
- [ ] Mark any control that depends on external network behavior so it cannot be mistaken for a local-first redesign requirement.
- [ ] Confirm no `[NEW]` README capability is treated as already implemented.
- [ ] Commit the baseline map.

### Task 3: Cover core QR editing behavior

**Files:**
- Create: `tests/e2e/qr-editing.spec.js`

- [ ] Add a test proving content changes regenerate/update the QR preview after the existing debounce.
- [ ] Add a test for each existing preset selection and one subsequent manual edit proving the preset active state detaches.
- [ ] Add tests for module style, corner-square style, and corner-dot style changes.
- [ ] Add tests for flat color and gradient enable/disable behavior.
- [ ] Run `npm run test:e2e` and confirm all editing tests pass.
- [ ] Commit.

### Task 4: Cover reliability, logo, and output behavior

**Files:**
- Create: `tests/e2e/qr-reliability-output.spec.js`

- [ ] Test error-correction level changes and capacity-counter state.
- [ ] Test quiet-zone/margin and output-size controls.
- [ ] Test adding and removing the logo fixture, including the expected error-correction change.
- [ ] Test PNG, SVG, and JPEG download actions.
- [ ] Run `npm run build && npm run test:e2e`.
- [ ] Commit.

## Exit Gate

- The baseline map accounts for all current controls.
- `npm run build` passes.
- Browser regression tests cover the core existing workflow.
- No redesign markup or styling has been introduced yet.
