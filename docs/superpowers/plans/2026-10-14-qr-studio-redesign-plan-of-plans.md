# QR Studio Redesign Plan of Plans

> **Status:** Parent planning document. The existing numbered child documents are phase briefs only and must not be treated as final implementation plans. Detailed implementation plans will be written after this parent plan is approved.

**Goal:** Replace the current single-sidebar interface with the approved floating QR Studio experience while preserving the current QR-generation feature set and keeping the implementation proportional to the project's purpose: a personal tool and a portfolio showcase of product/design skill.

**Architecture:** This is a frontend structural refactor, not a rewrite of the QR engine and not an enterprise application architecture exercise. Existing QR behavior remains authoritative while the interface is reorganized into a floating left navigation panel, center workspace, and contextual right inspector. New structure should be introduced only where it materially improves correctness, usability, or the design concept.

**Tech Stack:** Vite, vanilla JavaScript, CSS, `qr-code-styling`, and a small amount of Playwright browser coverage for the highest-risk flows.

**Specs:** `DESIGN.md`, `DESIGN-TOKENS.md`, `UI-PATTERNS.md`, `README.md`

## Scope and Proportionality

This redesign should be engineered carefully, but proportionally.

Priorities are:

1. Preserve existing QR functionality.
2. Realize the approved visual and interaction design faithfully.
3. Keep state correct when controls move or are pinned.
4. Keep the code understandable and maintainable for a small personal project.
5. Add only enough automated coverage to protect the risky redesign paths.

Do **not** introduce generalized state-management frameworks, component systems, abstraction layers, registries, or testing infrastructure solely to anticipate hypothetical future complexity.

If a simple local solution is sufficient for the current feature set, prefer it.

## Global Constraints

- Preserve all currently working QR-generation and export behavior unless implementation reveals an actual bug.
- Do not implement README capabilities marked `[NEW]` as part of this redesign unless separately authorized.
- Do not expose dead or placeholder controls for unimplemented capabilities.
- The left navigation contains only top-level customization areas and must never duplicate the workspace content selector.
- At widths **>=900px**, keep the full floating three-zone layout: left navigation, center workspace, and right inspector. Compact desktop adapts dimensions and spacing, not the presence of either sidebar.
- At widths **<900px**, navigation and inspector become temporary floating surfaces while the workspace remains primary.
- On narrow layouts, selecting `Style`, `Colors`, `Logo`, `Scan Quality`, or `Output` from temporary Navigation must close Navigation and automatically open the Inspector to that selected section.
- The center workspace remains visually dominant.
- Byte/capacity feedback stays beside the content input because it describes the content being entered. `Scan Quality` owns reliability controls such as error correction and quiet zone/margin.
- Pinned controls remain convenience mirrors of native settings and must always share the same underlying value.
- Pinning must not require a generalized application-wide state framework. Use a small shared binding mechanism only for settings that actually need multiple synchronized views.
- Start with a curated pinnable set rather than making every control pinnable.
- Preserve the local-first product principle. Remove Google Analytics as part of the redesign cleanup. Replace the current networked feedback submission with a simple external feedback/contact destination if one already exists; otherwise remove in-app submission rather than adding backend infrastructure.
- Use the canonical palette, texture, typography, spacing, radii, motion, and responsive tokens from `DESIGN-TOKENS.md`.
- Support light, dark, and system appearance. Theme changes must never alter the user's QR design/output state.
- Establish theme state/tokens before the structural migration, but introduce the visible Light/Dark/System controls only once in their final left-navigation location.
- Keep the implementation framework-free unless a later explicit decision changes that.
- Do not create future-facing content-mode infrastructure while only one real content workflow exists. If fewer than two implemented content types exist, do not show a content-type selector.

## Required Design Decisions Before Structural Implementation

The first implementation plan must lock these decisions before controls are moved:

- Final control-to-section mapping for `Style`, `Colors`, `Logo`, `Scan Quality`, and `Output`.
- Which current controls are intentionally removed, if any.
- Exact treatment of current footer-only material after Privacy, Terms, and Feedback move into navigation, including whether compact copyright/legal copy remains and whether the existing verbose legal notice is removed.
- Initial curated pinnable-control list.

Do not defer the control map until after the shell is built.

## Review Focus

1. Existing settings still produce the same QR output after their controls move.
2. No navigation concept or setting is redundantly exposed without a deliberate convenience reason.
3. Pinned and native controls always represent one setting value.
4. Desktop preserves the three floating zones at `>=900px`; narrow layouts use temporary Navigation/Inspector surfaces instead of stacking all panels.
5. The temporary Navigation -> Inspector handoff feels direct and preserves QR state.
6. Texture, muted palette, and floating surfaces never reduce control or QR-preview legibility.
7. The finished result visually matches the approved floating/textured design direction closely enough to serve as a portfolio design showcase.

---

## Execution Sequence

The redesign is organized into **five workstreams**. These are planning boundaries, not heavyweight release gates.

### Workstream 1: Baseline, Information Architecture, and Privacy Cleanup

Record the current functional behavior, finalize where every existing control belongs, and remove contradictions with the local-first positioning before structural migration begins.

Includes:

- concise current-control inventory,
- final control-to-section map,
- a small browser regression baseline for core flows,
- Privacy/Terms/Feedback utility behavior smoke coverage,
- removal of Google Analytics,
- replacement/removal of networked Web3Forms feedback submission,
- decision on existing footer/copyright/legal-notice treatment.

**Minimum automated coverage:** content editing, representative Style/Colors changes, logo add/remove, error correction, export, and utility/modal smoke behavior.

**Exit condition:** We know what exists, where it is going, and what behavior must survive.

### Workstream 2: Visual System and Floating Shell

Apply the approved visual system and establish the final desktop composition.

Includes:

- canonical semantic design tokens,
- local Inter typography,
- light/dark/system theme state,
- canonical textured canvas,
- floating left navigation,
- center workspace region,
- floating contextual inspector,
- visible theme controls in their final navigation location,
- desktop/compact-desktop sizing that preserves all three zones at `>=900px`.

**Visual checkpoint:** compare the implementation against the approved reference at representative full-desktop and compact-desktop widths before proceeding.

**Exit condition:** The application has the correct visual identity and structural shell without breaking QR behavior.

### Workstream 3: Workspace and Inspector Migration

Move the actual working UI into its final homes.

Includes:

- content input and byte/capacity feedback in the workspace,
- QR preview as the center visual focus,
- persistent quick PNG download using the canonical export path,
- migration of current controls into Style, Colors, Logo, Scan Quality, and Output,
- removal of obsolete accordion/sidebar structure,
- no content-type selector until at least two real content modes exist.

`Scan Quality` owns reliability controls such as error correction and quiet zone/margin. Capacity feedback remains beside content input.

**Visual checkpoint:** review spacing, grouping, hierarchy, labels, inspector density, and QR prominence against the approved design before pinning is added.

**Exit condition:** Every existing setting has one deliberate native home and the primary QR workflow works entirely in the new layout.

### Workstream 4: Curated Pinned Controls

Implement the pinning concept without turning the project into a generalized state architecture.

Use a small shared setting-binding mechanism only for the curated pinnable settings so native and pinned views stay synchronized.

Initial scope should remain intentionally small, for example:

- QR/module shape,
- primary QR color,
- error correction,
- quiet zone/margin,
- output size.

Pinning requirements:

- native controls remain in their inspector sections,
- pinned controls mirror the same underlying values,
- no duplicated independent state,
- pins persist locally,
- empty pinned area disappears,
- pin/unpin and basic reordering remain keyboard/touch accessible.

No application-wide store, framework, or arbitrary-control pin engine is required.

**Minimum automated coverage:** one representative setting synchronized between native and pinned views, persistence across reload, pin/unpin, and section switching.

**Exit condition:** Pinning demonstrates the intended convenience feature reliably without unnecessary architecture.

### Workstream 5: Responsive Behavior and Portfolio Polish

Finish narrow-screen behavior, accessibility essentials, visual consistency, and cleanup.

At `600-899px` and `<600px`:

- workspace remains persistent,
- Navigation and Inspector are temporary surfaces,
- choosing a top-level feature in Navigation automatically hands off to the corresponding Inspector,
- Privacy/Terms/Feedback follow their own utility behavior rather than opening Inspector,
- theme changes apply in place,
- hidden panels are not interactable.

Accessibility essentials for temporary surfaces:

- clear close action,
- Escape dismissal where appropriate,
- sensible focus placement,
- focus return to the invoking control,
- prevent interaction with hidden/background surfaces while a temporary panel is active,
- avoid scroll conflicts,
- no essential hover-only behavior.

Representative QA widths are approximately:

- 390px phone,
- 768px tablet,
- 1024px compact desktop,
- 1440px desktop.

Manually resize around the `<900px` transition rather than building an exhaustive breakpoint test matrix.

**Visual checkpoint:** final light/dark/system review at representative desktop, tablet, and phone sizes. Treat fidelity to the approved composition as a first-class acceptance criterion because this project is a portfolio design piece.

**Exit condition:** The redesign is polished, understandable, responsive, and visually convincing without carrying obsolete layout code.

---

## Testing Strategy

Keep automated testing small and high-value.

Protect these flows:

- enter/edit QR content,
- representative Style and Colors changes,
- logo add/remove,
- error correction / Scan Quality change,
- PNG/SVG/JPEG export paths,
- theme switch preserving QR state,
- native <-> pinned control synchronization,
- temporary Navigation -> Inspector handoff,
- Privacy/Terms/Feedback utility smoke behavior.

Do not pursue exhaustive visual-regression infrastructure or every breakpoint permutation unless a real regression justifies it.

Use manual visual review for design fidelity, responsive polish, and texture strength.

## Visual Acceptance Strategy

The text specifications remain canonical, but implementation must also be reviewed visually against the approved concept/reference.

Required visual reviews occur after:

1. visual system + shell,
2. workspace + inspector migration,
3. final responsive/polish work.

The goal is not pixel-for-pixel imitation of generated concept art. The goal is faithful preservation of the approved composition, atmosphere, spacing hierarchy, floating surfaces, restrained palette, and QR prominence.

## Rollout Strategy

Implement the five workstreams sequentially on the redesign branch:

`baseline + IA -> visual system + shell -> workspace + inspector -> pins -> responsive + polish`

Each workstream should leave the application buildable and manually usable.

Do not combine unrelated product features with the redesign.

If implementation reveals a missing product decision, stop and resolve that decision instead of inventing feature scope.

## Planning Status

The existing seven numbered redesign documents were useful for decomposing the problem, but they are now **phase briefs/reference material rather than executable implementation plans**.

The next planning step is to write detailed, proportional implementation plans from this five-workstream parent plan. Those plans should contain exact files, interfaces, test cases, commands, and acceptance checks without expanding the scope beyond what this document requires.

## Definition of Done

The redesign is complete when:

- the current functional QR feature set remains intact,
- desktop at `>=900px` uses the approved floating Navigation -> Workspace -> Inspector model,
- narrow layouts use the approved temporary Navigation/Inspector model and automatic feature-selection handoff,
- no content-type navigation is redundantly duplicated in the left panel,
- every existing setting has one deliberate native location,
- capacity feedback remains beside content entry,
- the pin system keeps native and pinned controls synchronized without duplicated state,
- light/dark/system themes use the canonical muted palette and textured canvas without changing QR design state,
- Google Analytics and networked in-app feedback submission no longer contradict the local-first positioning,
- accessibility essentials for temporary surfaces are handled,
- the small regression suite and production build pass,
- visual checkpoints confirm the result is strong enough to represent the project as a design portfolio piece,
- obsolete attached-layout CSS, markup, and event wiring are removed rather than left dormant.
