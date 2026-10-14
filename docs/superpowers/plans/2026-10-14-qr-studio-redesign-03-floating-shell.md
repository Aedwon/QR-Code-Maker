> **SUPERSEDED — DO NOT EXECUTE**
>
> This document is retained as planning history only. Use the approved parent plan and the `2026-10-14-qr-studio-redesign-impl-01-*` through `impl-05-*` implementation plans instead.

# QR Studio Redesign 03: Floating App Shell Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the attached header/sidebar layout with the approved floating Navigation → Workspace → Inspector shell.

**Architecture:** Recompose the existing page into three independent desktop zones without changing QR-generation semantics. The left navigation remains stable, the center owns the main task, and the right inspector becomes the destination for migrated settings.

**Tech Stack:** HTML, CSS Grid/Flexbox, vanilla JavaScript, Playwright.

**Spec:** `UI-PATTERNS.md`

## Global Constraints

- Nothing should visually attach to viewport edges on desktop.
- Keep visible textured-canvas gutter around all major floating surfaces.
- Left navigation contains only top-level features plus utility/legal/theme items.
- Do not duplicate content-type choices in the left navigation.
- Workspace remains visually dominant.
- This phase may temporarily host unmigrated controls in the inspector, but must not change their behavior.

## Review Focus

- Sidebars read as floating surfaces rather than page chrome.
- No old top header remains as an attached bar.
- Left navigation selection changes inspector context without replacing the workspace.
- QR preview retains sufficient width at compact desktop sizes.
- Existing controls continue to work while being repositioned.

---

### Task 1: Recompose the page structure

**Files:**
- Modify: `index.html`

- [ ] Remove the attached header structure and introduce a root textured-canvas shell.
- [ ] Add independent containers for floating left navigation, center workspace, and right inspector.
- [ ] Move `QR Studio` / `by Aedwon` branding into the left navigation.
- [ ] Add only `Style`, `Colors`, `Logo`, `Scan Quality`, and `Output` as primary feature navigation.
- [ ] Keep Privacy, Terms of Use, Feedback, and theme controls in a subordinate lower area.
- [ ] Do not add Text/Link/Contact/Wi-Fi/More to the left panel.
- [ ] Commit structural markup separately from styling.

### Task 2: Implement desktop floating geometry

**Files:**
- Modify: `src/style.css`

- [ ] Implement a three-zone desktop layout with explicit canvas gutters and inter-panel gaps using tokenized spacing.
- [ ] Make left and right panels self-contained rounded floating surfaces with restrained border/elevation.
- [ ] Keep the center workspace unboxed as a page column; only its actual controls/previews should form floating surfaces.
- [ ] Cap panel widths so the workspace retains visual priority.
- [ ] Remove obsolete attached-header/sidebar layout styles.
- [ ] Verify 1200px and wide desktop layouts manually and with screenshots.
- [ ] Commit.

### Task 3: Add top-level navigation state

**Files:**
- Create: `src/ui/shell.js`
- Modify: `src/main.js`
- Modify: `index.html`
- Create or modify: `tests/e2e/navigation.spec.js`

- [ ] Implement one selected top-level feature state.
- [ ] Make selection update the right inspector context without changing workspace content or QR state.
- [ ] Expose selected state via both styling and accessible semantics.
- [ ] Default to `Style` without hard-resetting user QR settings.
- [ ] Add tests proving navigation changes only inspector context.
- [ ] Commit.

### Task 4: Establish inspector host and migration bridge

**Files:**
- Modify: `index.html`
- Modify: `src/ui/shell.js`
- Modify: `src/style.css`

- [ ] Add one canonical inspector host region.
- [ ] Temporarily place existing setting groups into feature containers without rewriting their behavior yet.
- [ ] Ensure hidden feature containers are not keyboard-focusable or exposed as active UI.
- [ ] Preserve IDs/event bindings needed by the existing application logic.
- [ ] Run full baseline regression suite.
- [ ] Commit.

## Exit Gate

- Desktop shows three independent floating zones.
- Left navigation is stable and non-redundant.
- Inspector context switches independently of workspace state.
- No attached header/sidebar chrome remains.
- Existing regression suite passes.
