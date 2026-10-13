# QR Studio

QR Studio is a privacy-first, client-side QR code maker. QR content, uploaded files, designs, history, usage behavior, and generated output should remain on the user's device. The core product should not require backend processing, telemetry, or accounts.

## Product Principle

The app should remain local-first by default:

- QR content is encoded locally.
- Uploaded images are processed locally.
- Designs and history are stored locally.
- Generated files are created and downloaded locally.
- Normal use should not send user content or usage behavior to QR Studio or third parties.
- Features should continue working without an account or backend wherever practical.

## Features

### Content & Encoding

- Arbitrary URL/text input
- Live QR regeneration with a 150 ms debounce
- UTF-8 byte-capacity measurement
- Capacity adapts to error-correction level
- Warning at 75% capacity and error state when over capacity
- [NEW] Structured URL mode with validation and normalization
- [NEW] Plain text mode
- [NEW] Wi-Fi credentials
- [NEW] Contact/vCard
- [NEW] Email
- [NEW] Phone
- [NEW] SMS
- [NEW] Location
- [NEW] Calendar event

### Presets & Templates

- Classic
- Rounded
- Dots
- Classy
- Elegant
- Neon
- Ocean
- Sunset
- Presets configure shapes, colors, gradients, and backgrounds
- Manual appearance edits detach from the active preset
- [NEW] Save custom presets locally
- [NEW] Local design/history library
- [NEW] Import and export design configuration files

### QR Geometry

- Main module styles: Square, Dots, Rounded, Extra Rounded, Classy, Classy Rounded
- Finder outer-square styles: Square, Dot, Extra Rounded
- Finder inner-dot styles: Square, Dot
- [NEW] Scan-safe styling guardrails

### Colors & Appearance

- Independent module color
- Independent finder outer-square color
- Independent finder inner-dot color
- Visual color picker
- Hex color input
- Solid colors
- Linear gradients
- Radial gradients
- Independent gradient start and end colors
- Main-module gradient rotation from 0–360°
- [NEW] Contrast analysis
- [NEW] Color-accessibility warnings

### Background

- Custom solid color
- Fully transparent background
- [NEW] Additional scan-safe background customization where useful

### Logo & Branding

- Local image upload and removal
- Logo size from 0.10–0.50
- Logo margin from 0–20 px
- Logo background shapes: None, Circle, Square, Rounded Square
- Custom logo-background color
- Local Canvas compositing
- Automatic H error correction when a logo is added
- Automatic reset to Q when the logo is removed
- QR modules beneath the logo are hidden
- [NEW] QR frames
- [NEW] CTA labels such as “Scan to connect”

### Reliability & Validation

- Error correction levels L, M, Q, and H
- Quiet-zone control from 0–50 px
- [NEW] Continuous scan-safety score
- [NEW] Contrast validation
- [NEW] Logo-obstruction validation
- [NEW] QR-density validation
- [NEW] Quiet-zone validation
- [NEW] Local decode/scan test before export
- [NEW] Clear warnings with one-click recommended fixes

### Output

- QR output size from 150–600 px
- PNG export
- SVG export
- JPEG export
- [NEW] Arbitrary/high-resolution export
- [NEW] Configurable filenames
- [NEW] Print-oriented export presets
- [NEW] Transparent export controls
- [NEW] Batch generation from CSV or structured data
- [NEW] Local ZIP generation for batch exports

### Editing Workflow

- Live preview
- [NEW] Undo and redo
- [NEW] Reset individual sections
- [NEW] Reset the whole design
- [NEW] Import an existing QR image
- [NEW] Decode an imported QR locally
- [NEW] Restyle a decoded QR
- [NEW] Keyboard shortcuts

### Local Persistence

- [NEW] Save designs using IndexedDB or equivalent local storage
- [NEW] Recent designs
- [NEW] Favorite presets
- [NEW] Recent colors
- [NEW] Local backup/export
- [NEW] Clear all local data

### Privacy & Offline Use

- QR generation happens client-side
- Uploaded images are processed locally
- [NEW] Explicit “processed entirely on this device” guarantee in the product experience
- [NEW] Offline-capable/PWA operation
- [NEW] Self-host fonts and static assets so normal use does not require third-party requests

## Privacy Migration Notes

The current implementation still contains network-dependent behavior that should be removed or changed to fully satisfy the local-only product principle:

- Remove Google Analytics telemetry.
- Replace Google Fonts CDN loading with locally bundled fonts or system fonts.
- Replace the embedded Web3Forms feedback flow with an explicitly external feedback link, or remove feedback submission from the app.

These changes are part of bringing the existing implementation in line with the intended privacy model.

## Design Direction

See [`DESIGN.md`](./DESIGN.md) for the design philosophy and interaction principles that should guide future UX decisions.