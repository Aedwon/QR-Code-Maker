# QR Studio Redesign: Current Behavior Baseline and Control Map

This document freezes what must survive the redesign and locks where every existing control lands. It is the authoritative control map for implementation plans 02–05.

## Final control map

```text
Workspace
  qr-data
  byte/capacity feedback
  qr-preview
  quick Download PNG (added later in Workstream 3)

Style
  presets
  module shape / dot-style-grid
  outer finder shape / corner-square-style-grid
  inner finder shape / corner-dot-style-grid

Colors
  module color + gradient + rotation
  outer finder color + gradient
  inner finder color + gradient
  background transparency + background color

Logo
  upload/remove
  logo size
  logo margin
  logo background shape
  logo background color

Scan Quality
  error correction
  quiet zone / margin

Output
  output size
  PNG / SVG / JPEG export

Utilities
  Terms of Use
  Privacy Policy
  Light / Dark / System theme controls (added in Workstream 2)
  compact copyright

Removed / deferred
  Google Analytics / gtag
  embedded Web3Forms feedback form
  Feedback utility until a real external destination is explicitly supplied
  content-type selector while only one real content workflow exists
  all README [NEW] reliability/content/output capabilities
```

## Side effects that must survive

- Content updates are debounced by 150 ms.
- A manual appearance change detaches the active preset.
- Uploading a logo forces error correction to H.
- Removing the logo resets error correction to Q.
- Capacity thresholds depend on the active error-correction level; the warning starts at 75% and the error state applies over the maximum.
- Gradients must be explicitly cleared when returning to a flat color (`gradient: undefined` in `buildOptions()`).

## Decisions locked

- **Footer:** Terms, Privacy, and a compact copyright move into the final Navigation utility area in Workstream 2. The verbose persistent reproduction notice is removed from chrome because the Terms already contain the relevant restrictions.
- **Feedback:** omitted. The repository has no real external feedback destination, so no Feedback utility is shown.
- **Initial pinnable set (Workstream 4):** `module-shape`, `primary-color`, `error-correction`, `quiet-zone`, `output-size`.
- **Capacity feedback** stays in Workspace beside the content input. It is not part of Scan Quality.
- **Scan Quality** contains only error correction and quiet zone/margin.
