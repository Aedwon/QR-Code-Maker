# QR Studio Design Philosophy

## Scope

This document defines the product's design philosophy and interaction principles. It intentionally does **not** prescribe page structure, content hierarchy, navigation model, control placement, or a specific visual layout. Those decisions should be made separately while remaining consistent with the principles below.

Where this document draws from Apple's Human Interface Guidelines, it adopts **interaction and usability principles only**. It does not prescribe Apple-specific visual styling, component appearance, platform conventions, or imitation of Apple's interface aesthetic.

The implementation-level visual primitives that support this philosophy are defined in [`DESIGN-TOKENS.md`](./DESIGN-TOKENS.md). That companion specification is the canonical source for typography, spacing, semantic colors, radii, control sizing, icon sizing, borders, shadows, motion, responsive breakpoints, and component-state conventions.

## Core Philosophy

QR Studio should feel **clear, calm, immediate, and trustworthy**. The interface should make a capable QR tool feel simple without reducing what advanced users can do.

The product should optimize for three outcomes:

1. A first-time user can succeed without instruction.
2. A returning user can move quickly with minimal friction.
3. An advanced user can access precision controls without making the default experience feel complex.

## Principles

### 1. Clarity before density

Every visible element should have a clear purpose. Avoid presenting controls simply because they exist. Visual hierarchy should make the next useful action obvious without relying on excessive labels, decoration, or explanation.

### 2. Progressive disclosure

Keep common actions easy to reach and reveal advanced controls when they become relevant. Complexity should be available, not imposed.

Advanced capability should never require a permanently complicated interface.

### 3. Immediate feedback

The product should respond visibly and predictably to user input. Changes should feel direct, with the result updating close to the moment of interaction.

Users should not need to wonder whether an action worked.

### 4. Direct manipulation where practical

Prefer interactions that let users understand the relationship between a control and its visual result. Controls should feel connected to what they affect, especially for styling, sizing, color, and image customization.

### 5. Strong defaults

The default state should already produce a valid, attractive, and highly scannable QR code. A user who changes nothing beyond the encoded content should still receive a good result.

Defaults should reduce decision load, not merely fill empty fields.

### 6. Safe customization

Customization should preserve QR-code usability wherever possible. When a user chooses settings that may reduce reliability, the interface should communicate the risk clearly and help them recover.

Guardrails should guide without blocking legitimate advanced use.

### 7. Reversible and forgiving interactions

Users should feel comfortable experimenting. Actions should avoid destructive surprises, and temporary customization should be easy to change, reset, or undo where appropriate.

Errors should explain what happened and how to fix it.

### 8. User control over automation

Helpful automation is encouraged when its behavior is understandable and reversible. The product may suggest or adjust settings to protect scan reliability, but it should not make consequential changes invisibly.

Automation should reduce work while preserving user agency.

### 9. Consistency over novelty

Controls with similar purposes should behave similarly. Interaction patterns, labels, states, spacing, feedback, and visual language should remain coherent across the product.

Novel interactions should only be introduced when they materially improve usability.

### 10. Restraint in visual design

The interface should feel polished without competing with the QR code itself. Decorative effects should support hierarchy, orientation, and delight rather than becoming the focal point.

The generated QR code is the user's work. The interface should frame it, not overshadow it.

### 11. Theme as atmosphere, not identity lock-in

Light and dark appearances should both feel intentional and first-class. Color should create character and guide attention while preserving contrast, legibility, and neutrality around user-generated designs.

Accent color should be used selectively for emphasis, state, and primary actions rather than saturating the entire interface.

### 12. Accessibility by default

Accessibility should be treated as a design constraint from the start, not a later compliance pass.

The product should support:

- clear keyboard navigation,
- visible focus states,
- sufficient color contrast,
- touch-friendly target sizes,
- readable type at common viewport sizes,
- labels that do not depend on color alone,
- reduced-motion preferences,
- semantic control behavior,
- understandable error and status messaging.

### 13. Responsive adaptation, not compression

Smaller screens should not receive a squeezed desktop interface. The experience should adapt its interaction model, grouping, density, and prioritization to the available space while preserving the same capabilities wherever practical.

### 14. Performance is part of UX

The interface should feel instantaneous for normal interactions. Expensive visual treatment, unnecessary animation, and avoidable network dependency should not compromise responsiveness.

Because QR creation is fundamentally a direct-manipulation task, latency is especially noticeable.

### 15. Privacy and trust should be legible

The product's client-side behavior is a meaningful advantage and should be represented accurately in the experience. Privacy claims, export behavior, uploaded-image handling, and any analytics or third-party services should be communicated plainly.

Trust should come from predictable behavior and transparent language, not badges or marketing language alone.

### 16. Motion should explain

Animation should reinforce state changes, hierarchy, and spatial relationships. It should be brief, subtle, and interruptible.

Avoid motion whose only purpose is spectacle.

### 17. Copy should be concise and human

Interface language should be direct, specific, and easy to scan. Prefer familiar terms over internal or technical terminology unless precision requires it.

Explanatory text should appear when it changes a user's decision or prevents confusion.

### 18. Beginner-friendly, expert-efficient

Do not force a tradeoff between simplicity and capability. Beginners should be able to complete the primary task through obvious controls, while experienced users should be able to reach detailed settings quickly.

The interface should become more powerful as users look deeper, not more confusing as soon as they arrive.

## Apple HIG-Derived Principles

The following principles adapt relevant ideas from Apple's Human Interface Guidelines to QR Studio's web context. They reinforce the principles above and should be interpreted independently of Apple's visual style.

### Agency and forgiveness

Users should remain in control of their work. The interface should make experimentation safe, keep consequential actions understandable, and provide practical ways to reverse, reset, or recover from changes.

Avoid workflows that trap users in a state, make silent decisions on their behalf, or punish exploration.

### Clear hierarchy and purposeful emphasis

Importance should be communicated through hierarchy, grouping, contrast, and timing rather than by making everything prominent.

Primary actions, current state, warnings, and secondary options should be distinguishable without requiring users to study the interface.

### Familiarity before invention

Prefer interaction patterns that users already understand when they solve the problem well. Custom interaction models should earn their complexity by providing a substantial usability benefit.

A familiar control used well is preferable to a novel control that requires explanation.

### Feedback should match the consequence

Every meaningful action should produce appropriate feedback, but feedback should not be more disruptive than the action warrants.

Use lightweight state changes for routine interactions and reserve interruption for errors, risk, or decisions that genuinely require attention.

### Clear, action-oriented language

Labels, instructions, status messages, and errors should describe what users can do, what happened, or what needs attention in plain language.

Avoid unnecessary technical terminology, vague labels, and explanatory copy that does not help users make a decision or complete a task.

### Discoverability without permanent clutter

Important capabilities should be findable without forcing every option to remain visible at all times.

Use progressive disclosure, contextual controls, sensible grouping, and strong defaults so the interface can remain simple while preserving depth.

### Input method independence

Core tasks should remain understandable and operable across pointer, keyboard, and touch input. No essential interaction should depend on hover alone, precise pointer movement, gesture discovery, or visual state alone.

Interactive targets should be comfortably usable, focus should be visible, and equivalent paths should exist where an input method cannot support a particular interaction naturally.

### Transparency builds trust

When the product performs automation, analytics, file handling, image processing, or any behavior that may affect user expectations, the interface should communicate that behavior accurately and proportionately.

Do not use reassurance as a substitute for transparency. Users should be able to understand what the product is doing and retain meaningful control where it matters.

## Interaction Quality Bar

A design decision is strong when it answers most of these questions positively:

- Is the next action obvious without instruction?
- Can the user predict what will happen before acting?
- Is feedback immediate and easy to associate with the action?
- Does the interface expose only the complexity currently needed?
- Can the user recover easily from experimentation or mistakes?
- Does the design work for keyboard, touch, and pointer input?
- Does the decision preserve QR reliability and legibility?
- Does it remain understandable in both light and dark themes?
- Does it reduce cognitive load without hiding necessary capability?
- Is the interaction faster or clearer than a more conventional alternative?

If not, the design should be reconsidered.

## Visual Direction

The intended character is **minimal, clean, precise, modern, and calm**.

Prefer:

- generous breathing room,
- clear grouping,
- restrained borders and shadows,
- high legibility,
- deliberate contrast,
- simple iconography,
- subtle depth,
- neutral surfaces with selective accent color,
- visual emphasis proportional to importance.

Avoid:

- excessive gradients or glow,
- decorative glass effects that reduce clarity,
- crowded control surfaces,
- persistent visual noise,
- excessive card nesting,
- unclear icon-only actions,
- animation that delays work,
- visual styling that competes with user-generated QR designs.

## Decision Priority

When principles conflict, use this order:

1. Scan reliability and correctness
2. User comprehension
3. Accessibility
4. Task efficiency
5. User control
6. Visual consistency
7. Aesthetic refinement
8. Novelty

A beautiful interaction that makes the tool harder to understand or the QR code less reliable is not a successful design.

## Non-Goals of This Document

This philosophy does not determine:

- the number or position of sidebars,
- where the QR preview appears,
- where content input appears,
- navigation structure,
- which controls are grouped together,
- page or panel hierarchy,
- exact component inventory,
- final copy,
- feature scope,
- specific breakpoints,
- a fixed color palette.

Those belong in separate product, UX, and implementation decisions derived from these principles.
