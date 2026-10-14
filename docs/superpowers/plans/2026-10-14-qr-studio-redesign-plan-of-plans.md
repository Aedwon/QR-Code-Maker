# QR Studio Redesign Plan of Plans

> **Status:** APPROVED parent plan. The Executive Review below is the product/design approval surface. Everything after it is an implementation contract for agents unless it introduces a new product decision, changes scope, or conflicts with the Executive Review.
>
> The existing seven numbered redesign documents are superseded phase briefs/reference material and must not be treated as executable implementation plans. New detailed implementation plans will be derived from this approved parent plan.

## Executive Review

### Purpose

Redesign QR Studio primarily as a personal tool and portfolio showcase. The goal is to demonstrate strong visual design, interaction design, and thoughtful frontend execution without introducing architecture appropriate for a much larger product.

### What the finished product should be

- Desktop at **900px and above** uses the approved floating three-part composition: **Navigation → Workspace → Inspector**. Both sidebars stay visible; compact desktop makes them narrower instead of collapsing them.
- Below **900px**, the workspace stays primary while Navigation and Inspector become temporary sheets/drawers. Choosing a feature from Navigation automatically hands off to its Inspector.
- The center workspace contains the content input, capacity feedback, QR preview, and quick download action. The QR itself remains the visual focus.
- Existing controls are reorganized into **Style, Colors, Logo, Scan Quality, and Output** without changing what the QR generator already does.
- No future content modes such as Wi-Fi, Contact, or structured Link mode are added as part of this redesign. A content-type selector should not appear until at least two real content modes exist.
- The approved muted palette, paper-like textured canvas, floating surfaces, typography, and light/dark/system themes define the visual identity.
- **Pinned controls:** a small curated set of frequently used settings can be pinned to a persistent dock at the top of the Inspector. The original controls remain in their normal sections, and pinned versions always edit the same underlying values. Pins persist locally, can be reordered or removed, and the dock disappears when empty.
- QR Studio becomes genuinely consistent with its local-first positioning by removing Google Analytics, removing the embedded networked feedback submission, and locally bundling required visual assets such as fonts.
- Responsive behavior, keyboard/focus basics, and touch usability should be polished enough that the result feels deliberately designed, but the project should not accumulate unnecessary infrastructure.
- Automated testing protects only the important regression-prone flows. Visual quality is primarily reviewed against the approved design references.

### Implementation principle

Prefer the simplest implementation that faithfully realizes the design and keeps existing QR behavior correct. Do not introduce generalized state management, component frameworks, future-feature abstractions, exhaustive test infrastructure, or other systems that the current project does not need.

### Delegated to implementation agents

Exact file organization, JavaScript module boundaries, CSS implementation, event wiring, test structure, accessibility mechanics, local persistence details, animation implementation, exact responsive dimensions, and similar engineering decisions may be decided by the implementing agents as long as they comply with the decisions above and the canonical design specifications.

### Approval rule

Approval of this Executive Review means the **parent plan is approved**. The implementation details below do not require executive review unless they introduce a new product/design decision, change scope, or conflict with this section.

---

# Agent Implementation Contract

**Goal:** Replace the current single-sidebar interface with the approved floating QR Studio experience while preserving the current QR-generation feature set and keeping the implementation proportional to the project's purpose.

**Architecture:** This is a frontend structural refactor, not a rewrite of the QR engine and not an enterprise application architecture exercise. Existing QR behavior remains authoritative while the interface is reorganized into a floating left navigation panel, center workspace, and contextual right inspector. New structure should be introduced only where it materially improves correctness, usability, or the design concept.

**Tech Stack:** Vite, vanilla JavaScript, CSS, `qr-code-styling`, and a small amount of Playwright browser coverage for the highest-risk flows.

**Canonical specs:** `DESIGN.md`, `DESIGN-TOKENS.md`, `UI-PATTERNS.md`, `README.md`

## Scope and Proportionality

Priorities are:

1. Preserve existing QR functionality.
2. Realize the approved visual and interaction design faithfully.
3. Keep state correct when controls move or are pinned.
4. Keep the code understandable and maintainable for a small personal project.
5. Add only enough automated coverage to protect risky redesign paths.

Do **not** introduce generalized state-management frameworks, component systems, abstraction layers, registries, or testing infrastructure solely to anticipate hypothetical future complexity.

If a simple local solution is sufficient for the current feature set, prefer it.

## Global Constraints

- Preserve all currently working QR-generation and export behavior unless implementation reveals an actual bug.
- Do not implement README capabilities marked `[NEW]` unless separately authorized.
- Do not expose dead or placeholder controls for unimplemented capabilities.
- The left navigation contains only top-level customization areas and must never duplicate workspace content selection.
- At widths **>=900px**, keep the full floating three-zone layout: left Navigation, center Workspace, and right Inspector. Compact desktop adapts dimensions and spacing, not the presence of either sidebar.
- At widths **<900px**, Navigation and Inspector become temporary floating surfaces while the Workspace remains primary.
- On narrow layouts, selecting `Style`, `Colors`, `Logo`, `Scan Quality`, or `Output` from temporary Navigation closes Navigation and automatically opens Inspector to that selected section.
- The center workspace remains visually dominant.
- Byte/capacity feedback stays beside the content input because it describes the content being entered. `Scan Quality` owns reliability controls such as error correction and quiet zone/margin.
- Pinned controls remain convenience mirrors of native settings and always share the same underlying value. Native controls stay in their normal sections.
- Pinning must not require a generalized application-wide state framework. Use a small shared binding mechanism only for settings that need multiple synchronized views.
- Start with a curated pinnable set rather than making every control pinnable.
- Preserve the local-first product principle. Remove Google Analytics. Replace the current networked feedback submission with a simple external feedback/contact destination if one already exists; otherwise remove in-app submission instead of adding backend infrastructure.
- Update Privacy/Terms/feedback copy where needed so public-facing statements accurately reflect the resulting implementation.
- Use the canonical palette, texture, typography, spacing, radii, motion, and responsive tokens from `DESIGN-TOKENS.md`.
- Retain canonical Rosy Copper `#C05746` exactly. Do not alter the brand primitive merely to change the white-on-copper contrast ratio. For normal-size white text on a filled copper action, prefer an accessible darker derived copper such as the existing `#B04B3C`; keep `#C05746` for brand identity, focus, borders, icons, accents, and treatments where text contrast is not compromised.
- Support light, dark, and system appearance. Theme changes must never alter the user's QR design/output state.
- Establish theme state/tokens before structural migration, but introduce visible Light/Dark/System controls only once in their final left-navigation location.
- Keep the implementation framework-free unless a later explicit decision changes that.
- Do not create future-facing content-mode infrastructure while only one real content workflow exists. If fewer than two implemented content types exist, do not show a content-type selector.

## Required Decisions Before Structural Migration

Workstream 1 must lock:

- final control-to-section mapping for `Style`, `Colors`, `Logo`, `Scan Quality`, and `Output`,
- which current controls are intentionally removed, if any,
- treatment of current footer-only material after Privacy, Terms, and Feedback move into navigation,
- initial curated pinnable-control list.

Do not defer the control map until after the shell is built.

## Execution Sequence

The redesign is organized into **five workstreams**. These are planning boundaries, not heavyweight release gates.

### Workstream 1: Baseline, Information Architecture, and Privacy Cleanup

Record current behavior, finalize where every existing control belongs, and remove contradictions with the local-first positioning before structural migration.

Includes:

- concise current-control inventory,
- final control-to-section map,
- small browser regression baseline for core flows,
- Privacy/Terms/Feedback utility smoke coverage,
- removal of Google Analytics,
- replacement/removal of networked Web3Forms feedback submission,
- update of privacy/legal copy to match the new implementation,
- decision on footer/copyright/legal-notice treatment.

**Minimum automated coverage:** content editing, representative Style/Colors changes, logo add/remove, error correction, export, and utility/modal smoke behavior.

**Exit condition:** We know what exists, where it is going, and what behavior must survive.

### Workstream 2: Visual System and Floating Shell

Apply the approved visual system and establish the final desktop composition.

Includes:

- canonical semantic design tokens,
- local Inter typography,
- light/dark/system theme state,
- canonical textured canvas,
- floating left Navigation,
- center Workspace region,
- floating contextual Inspector,
- visible theme controls in their final Navigation location,
- desktop/compact-desktop sizing that preserves all three zones at `>=900px`.

**Visual checkpoint:** compare against the approved reference at representative full-desktop and compact-desktop widths before proceeding.

**Exit condition:** The application has the correct visual identity and structural shell without breaking QR behavior.

### Workstream 3: Workspace and Inspector Migration

Move the working UI into its final homes.

Includes:

- content input and byte/capacity feedback in Workspace,
- QR preview as the center visual focus,
- persistent quick PNG download using the canonical export path,
- migration of current controls into Style, Colors, Logo, Scan Quality, and Output,
- removal of obsolete accordion/sidebar structure,
- no content-type selector until at least two real content modes exist.

`Scan Quality` owns reliability controls such as error correction and quiet zone/margin. Capacity feedback remains beside content input.

**Visual checkpoint:** review spacing, grouping, hierarchy, labels, inspector density, and QR prominence against the approved design before pinning is added.

**Exit condition:** Every existing setting has one deliberate native home and the primary QR workflow works entirely in the new layout.

### Workstream 4: Curated Pinned Controls

Implement pinning without turning the project into a generalized state architecture.

Use a small shared setting-binding mechanism only for curated pinnable settings so native and pinned views stay synchronized.

Initial candidate set:

- QR/module shape,
- primary QR color,
- error correction,
- quiet zone/margin,
- output size.

Requirements:

- native controls remain in their inspector sections,
- pinned controls mirror the same underlying values,
- no duplicated independent state,
- pins persist locally,
- empty pinned area disappears,
- pin/unpin and basic reordering remain keyboard/touch accessible.

No application-wide store, framework, or arbitrary-control pin engine is required.

**Minimum automated coverage:** one representative setting synchronized between native and pinned views, persistence across reload, pin/unpin, and section switching.

**Exit condition:** Pinning demonstrates the intended convenience reliably without unnecessary architecture.

### Workstream 5: Responsive Behavior and Portfolio Polish

Finish narrow-screen behavior, accessibility essentials, visual consistency, and cleanup.

At `600-899px` and `<600px`:

- Workspace remains persistent,
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

Representative QA widths:

- 390px phone,
- 768px tablet,
- **900px exact architecture boundary**, plus manual resizing immediately below and above it,
- 1024px compact desktop,
- 1440px desktop.

Do not build an exhaustive breakpoint matrix unless an actual regression justifies it.

**Visual checkpoint:** final light/dark/system review at representative desktop, tablet, and phone sizes. Fidelity to the approved composition is a first-class acceptance criterion because this project is a portfolio design piece.

**Exit condition:** The redesign is polished, understandable, responsive, and visually convincing without obsolete layout code.

## Testing Strategy

Keep automated testing small and high-value. Protect:

- enter/edit QR content,
- representative Style and Colors changes,
- logo add/remove,
- error correction / Scan Quality change,
- PNG/SVG/JPEG export paths,
- theme switch preserving QR state,
- native ↔ pinned control synchronization,
- temporary Navigation → Inspector handoff,
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

`baseline + IA → visual system + shell → workspace + inspector → pins → responsive + polish`

Each workstream should leave the application buildable and manually usable.

Do not combine unrelated product features with the redesign.

If implementation reveals a missing product decision, stop and elevate only that decision for executive review instead of inventing feature scope.

## Planning Status

The existing seven numbered redesign documents were useful for decomposing the problem, but they are **superseded phase briefs/reference material rather than executable implementation plans**.

The next planning step is to write detailed, proportional implementation plans from this five-workstream parent plan. Those plans should contain exact files, interfaces, test cases, commands, and acceptance checks without expanding scope beyond what this document requires.

## Definition of Done

The redesign is complete when:

- the current functional QR feature set remains intact,
- desktop at `>=900px` uses the approved floating Navigation → Workspace → Inspector model,
- narrow layouts use the approved temporary Navigation/Inspector model and automatic feature-selection handoff,
- no content-type navigation is redundantly duplicated in the left panel,
- every existing setting has one deliberate native location,
- capacity feedback remains beside content entry,
- the pin system keeps native and pinned controls synchronized without duplicated state,
- light/dark/system themes use the canonical muted palette and textured canvas without changing QR design state,
- Google Analytics and networked in-app feedback submission no longer contradict local-first positioning,
- Privacy/Terms/Feedback copy accurately reflects the resulting implementation,
- accessibility essentials for temporary surfaces are handled,
- the small regression suite and production build pass,
- visual checkpoints confirm the result is strong enough to represent the project as a design portfolio piece,
- obsolete attached-layout CSS, markup, and event wiring are removed rather than left dormant.
