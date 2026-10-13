# QR Studio Redesign 06: Pinned Controls Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a compact, persistent pinned-controls dock at the top of the inspector without duplicating control state.

**Architecture:** Treat each eligible pinnable group as one canonical DOM/control unit with a stable pin key. Pinning moves that unit into the pinned dock and leaves only lightweight origin metadata needed to restore it, avoiding duplicate IDs and independent values. Persist pin order locally.

**Tech Stack:** Vanilla JavaScript, DOM reparenting, `localStorage`, Playwright.

**Spec:** `UI-PATTERNS.md`

## Global Constraints

- Pin individual controls or compact control groups, never full inspector pages.
- Hide the pinned region entirely when empty.
- Pinned controls must change the exact same underlying QR state as before.
- Do not duplicate DOM IDs or create parallel setting values.
- Pinning is local-only and requires no backend/account.
- Do not allow navigation, legal, theme, or content-type controls to be pinned.

## Review Focus

- Pin/unpin cannot lose a control or its state.
- Reload restores pins in the same order.
- Changing inspector sections does not remove pinned access.
- Keyboard/touch users can pin and unpin without hover-only interaction.
- Empty pin state consumes no permanent vertical space.

---

### Task 1: Define the pinnable-control registry

**Files:**
- Create: `src/ui/pins.js`
- Modify: `index.html`

- [ ] Give each eligible compact control group a stable `data-pin-key`.
- [ ] Define eligibility explicitly; begin with a small useful set rather than every control.
- [ ] Store the native parent/anchor needed to restore each control when unpinned.
- [ ] Exclude whole sections and large upload/complex groups where pinning would make the dock unwieldy.
- [ ] Commit.

### Task 2: Implement pin/unpin behavior

**Files:**
- Modify: `src/ui/pins.js`
- Modify: `src/style.css`
- Modify: `index.html`
- Create: `tests/e2e/pins.spec.js`

- [ ] Add a hidden-by-default pinned dock at the top of the inspector.
- [ ] Implement pinning by moving the canonical control unit into the dock rather than cloning it.
- [ ] Implement unpinning by restoring the control at its original anchor.
- [ ] Keep section context labels compact enough that a pinned control remains understandable outside its native section.
- [ ] Add tests proving the setting retains its value and behavior across pin/unpin.
- [ ] Commit.

### Task 3: Persist and reorder pins

**Files:**
- Modify: `src/ui/pins.js`
- Modify: `src/style.css`
- Modify: `tests/e2e/pins.spec.js`

- [ ] Persist ordered pin keys under one versioned local-storage key.
- [ ] Ignore unknown/stale keys safely after future control changes.
- [ ] Add keyboard-accessible reorder controls; pointer drag-and-drop is optional and must not be the only path.
- [ ] Restore pin order on startup after the inspector DOM is available.
- [ ] Add tests for reload persistence, stale-key recovery, reorder, and clear-all.
- [ ] Commit.

### Task 4: Add compact dock behavior and affordances

**Files:**
- Modify: `src/ui/pins.js`
- Modify: `src/style.css`
- Modify: `index.html`
- Modify: `tests/e2e/pins.spec.js`

- [ ] Hide the entire dock when there are zero pins.
- [ ] Allow the populated dock to collapse/expand without losing pins.
- [ ] Provide accessible pin/unpin labels and visible focus states.
- [ ] Avoid persistent pin icons on every row when they create visual noise; reveal via hover/focus and an equivalent touch-accessible action.
- [ ] Verify pin behavior while switching through all five inspector sections.
- [ ] Run full regression suite and commit.

## Exit Gate

- Pins never create duplicated setting state.
- Pin order persists locally and stale data fails safely.
- Empty dock disappears completely.
- Pinning works with pointer, keyboard, and touch-equivalent interactions.
- Full regression suite passes.
