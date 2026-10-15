# QR Studio Current Behavior Baseline

This document is the pre-redesign behavior and information-architecture contract for the approved QR Studio redesign. It records what currently exists, what must survive, and where each control belongs after migration.

## Final control map

### Workspace

- `#qr-data`
- UTF-8 byte/capacity feedback (`#char-counter`, `#char-counter-fill`, `#char-counter-text`)
- `#qr-preview`
- Quick `Download PNG` convenience action, added in Workstream 3

Capacity feedback remains in Workspace because it describes the content being entered. It does not move to Scan Quality.

### Style

- Presets
- Module shape / `#dot-style-grid`
- Outer finder shape / `#corner-square-style-grid`
- Inner finder shape / `#corner-dot-style-grid`

### Colors

- Module color
- Module gradient enable/disable
- Module gradient end color
- Module gradient type
- Module gradient rotation
- Outer finder color and gradient controls
- Inner finder color and gradient controls
- Background transparency
- Background color

### Logo

- Local image upload and removal
- Logo size
- Logo margin
- Logo background shape
- Logo background color

### Scan Quality

- Error correction level
- Quiet zone / margin

### Output

- QR output size
- PNG export
- SVG export
- JPEG export

### Utilities

- Terms of Use
- Privacy Policy
- Light / Dark / System appearance controls, added in Workstream 2
- Compact copyright

### Removed or deferred

- Google Analytics / `gtag`
- Embedded Web3Forms feedback form
- Feedback utility until a real external destination is explicitly supplied
- Content-type selector while only one real URL/text workflow exists
- Every README capability marked `[NEW]`

## Current behavior that must survive

- Content changes regenerate the QR with the existing 150 ms debounce.
- Manual appearance edits detach the active preset.
- Logo upload forces error correction to `H`.
- Logo removal resets error correction to `Q`.
- Capacity thresholds depend on the active error-correction level.
- When a gradient is disabled, the QR renderer must be explicitly given a cleared gradient so a previous gradient cannot remain through the renderer's shallow merge behavior.
- PNG, SVG, and JPEG exports remain local browser downloads.
- Uploaded logo data remains browser-local.

## Footer and utility decision

During Workstream 1 the existing footer remains structurally intact while analytics and networked feedback are removed. In Workstream 2, Terms, Privacy, and compact copyright move into the Navigation utility area and the persistent footer is removed.

The verbose reproduction notice does not remain as persistent application chrome because the Terms of Use already contain the relevant restrictions.

## Initial pinnable controls

Workstream 4 is limited to these five pin keys:

- `module-shape`
- `primary-color`
- `error-correction`
- `quiet-zone`
- `output-size`

The native controls remain in their normal Inspector sections. Pinned controls are synchronized convenience mirrors, not independent values.

## Scope guard

This baseline does not authorize structured content modes, scan scoring, contrast validation, decode testing, arbitrary-resolution export, undo/redo, local design history, or any other capability marked `[NEW]` in the README.