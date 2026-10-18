/* ========================================
   QR Studio — Main Application Logic
   ======================================== */

import QRCodeStyling from 'qr-code-styling';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import { initTheme, setAppearance, getAppearance } from './theme.js';
import { initShell } from './ui/shell.js';
import { initPins } from './ui/pins.js';
import { initColorPicker } from './ui/color-picker.js';
import { initSlidingSegments } from './ui/sliding-segments.js';
import { renderPresetThumb, initShapeGlyphs } from './ui/preset-thumbs.js';
import './style.css';

initTheme();
initShapeGlyphs();
initColorPicker();
initSlidingSegments();

// ── Presets ──────────────────────────────────────────────────
const PRESETS = {
    classic: {
        dotsOptions: { type: 'square', color: '#000000' },
        cornersSquareOptions: { type: 'square', color: '#000000' },
        cornersDotOptions: { type: 'square', color: '#000000' },
        backgroundOptions: { color: '#FFFFFF' },
    },
    rounded: {
        dotsOptions: { type: 'rounded', color: '#2d2d2d' },
        cornersSquareOptions: { type: 'extra-rounded', color: '#1a1a1a' },
        cornersDotOptions: { type: 'dot', color: '#1a1a1a' },
        backgroundOptions: { color: '#FFFFFF' },
    },
    dots: {
        dotsOptions: { type: 'dots', color: '#333333' },
        cornersSquareOptions: { type: 'dot', color: '#111111' },
        cornersDotOptions: { type: 'dot', color: '#111111' },
        backgroundOptions: { color: '#FFFFFF' },
    },
    classy: {
        dotsOptions: { type: 'classy', color: '#1a1a2e' },
        cornersSquareOptions: { type: 'extra-rounded', color: '#16213e' },
        cornersDotOptions: { type: 'dot', color: '#0f3460' },
        backgroundOptions: { color: '#FAFAFA' },
    },
    elegant: {
        dotsOptions: { type: 'classy-rounded', color: '#0d1117' },
        cornersSquareOptions: { type: 'extra-rounded', color: '#161b22' },
        cornersDotOptions: { type: 'dot', color: '#0d1117' },
        backgroundOptions: { color: '#FFFFFF' },
    },
    neon: {
        dotsOptions: { type: 'dots', gradient: { type: 'linear', rotation: 0.7, colorStops: [{ offset: 0, color: '#00f260' }, { offset: 1, color: '#0575e6' }] } },
        cornersSquareOptions: { type: 'extra-rounded', color: '#00f260' },
        cornersDotOptions: { type: 'dot', color: '#0575e6' },
        backgroundOptions: { color: '#0a0a12' },
    },
    ocean: {
        dotsOptions: { type: 'rounded', gradient: { type: 'linear', rotation: 0.5, colorStops: [{ offset: 0, color: '#2193b0' }, { offset: 1, color: '#6dd5ed' }] } },
        cornersSquareOptions: { type: 'extra-rounded', color: '#2193b0' },
        cornersDotOptions: { type: 'dot', color: '#2193b0' },
        backgroundOptions: { color: '#FFFFFF' },
    },
    sunset: {
        dotsOptions: { type: 'extra-rounded', gradient: { type: 'linear', rotation: 0.4, colorStops: [{ offset: 0, color: '#f12711' }, { offset: 1, color: '#f5af19' }] } },
        cornersSquareOptions: { type: 'extra-rounded', color: '#f12711' },
        cornersDotOptions: { type: 'dot', color: '#f5af19' },
        backgroundOptions: { color: '#FFFDF6' },
    },
};


// ── State ───────────────────────────────────────────────────
let currentOptions = {
    width: 300,
    height: 300,
    data: 'https://example.com',
    margin: 10,
    qrOptions: {
        errorCorrectionLevel: 'Q',
    },
    dotsOptions: {
        type: 'square',
        color: '#000000',
    },
    cornersSquareOptions: {
        type: 'square',
        color: '#000000',
    },
    cornersDotOptions: {
        type: 'square',
        color: '#000000',
    },
    backgroundOptions: {
        color: '#FFFFFF',
    },
    imageOptions: {
        crossOrigin: 'anonymous',
        hideBackgroundDots: true,
        margin: 5,
        imageSize: 0.4,
    },
};

let logoDataUrl = null;
let logoOriginalDataUrl = null; // original unmodified logo
let logoBgShape = 'none'; // none | circle | square | rounded
let logoBgColor = '#FFFFFF';
let debounceTimer = null;
let skipPresetDeselect = false;
let pinController = null;

// ── Preset Deselection ──────────────────────────────────────
// Called by every manual control change to deselect the active preset.
// Skipped when changes are being driven by a preset application.
function deselectPreset() {
    if (skipPresetDeselect) return;
    document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
}

// Replace the flat swatches with mini QR thumbnails.
document.querySelectorAll('.preset-btn').forEach(btn => {
    const key = btn.dataset.preset;
    const holder = btn.querySelector('.preset-preview');
    if (!PRESETS[key] || !holder) return;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 40 40');
    svg.setAttribute('class', 'preset-preview');
    svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML = renderPresetThumb(key, PRESETS[key]);
    holder.replaceWith(svg);
});

// ── QR Code Instance ────────────────────────────────────────
const qrCode = new QRCodeStyling(currentOptions);

const previewEl = document.getElementById('qr-preview');
qrCode.append(previewEl);

// ── Debounced Update ────────────────────────────────────────
function pulsePreview() {
    previewEl.classList.remove('is-updating');
    void previewEl.offsetWidth;
    previewEl.classList.add('is-updating');
}

let rafId = 0;
// The library empties the preview and redraws from blank, which flashes while
// dragging. Keep the previous frame on top until the new one is drawn.
function renderQR(pulse) {
    const old = previewEl.firstElementChild;
    qrCode.update(buildOptions());
    if (old && !old.isConnected) {
        old.classList.add('qr-ghost');
        previewEl.append(old);
        const done = () => requestAnimationFrame(() => requestAnimationFrame(() => old.remove()));
        Promise.resolve(qrCode._canvasDrawingPromise).then(done, done);
    }
    if (pulse) pulsePreview();
}

// Sliders redraw on the next frame so the preview tracks the thumb live;
// everything else keeps a short debounce.
function updateQR() {
    clearTimeout(debounceTimer);
    const dragging = document.activeElement?.type === 'range';
    if (dragging) {
        if (!rafId) rafId = requestAnimationFrame(() => { rafId = 0; renderQR(false); });
        return;
    }
    debounceTimer = setTimeout(() => renderQR(true), 150);
}

function buildOptions() {
    const opts = JSON.parse(JSON.stringify(currentOptions));

    // qr-code-styling's update() does a shallow merge — if we omit `gradient`,
    // the library keeps the previously set gradient. We must explicitly pass
    // `gradient: undefined` to clear it when using a flat color.
    if (!currentOptions.dotsOptions.gradient) {
        opts.dotsOptions.gradient = undefined;
    }
    if (!currentOptions.cornersSquareOptions.gradient) {
        opts.cornersSquareOptions.gradient = undefined;
    }
    if (!currentOptions.cornersDotOptions.gradient) {
        opts.cornersDotOptions.gradient = undefined;
    }

    // Attach logo if present
    if (logoDataUrl) {
        opts.image = logoDataUrl;
    } else {
        opts.image = undefined;
    }

    return opts;
}

// ── Logo Compositing ────────────────────────────────────────
function compositeLogoWithBackground() {
    if (!logoOriginalDataUrl || logoBgShape === 'none') {
        logoDataUrl = logoOriginalDataUrl;
        return Promise.resolve();
    }

    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const padding = 0.15; // 15% padding around the logo
            const size = Math.max(img.width, img.height);
            const canvasSize = Math.round(size * (1 + padding * 2));
            const canvas = document.createElement('canvas');
            canvas.width = canvasSize;
            canvas.height = canvasSize;
            const ctx = canvas.getContext('2d');

            // Draw background shape
            ctx.fillStyle = logoBgColor;
            if (logoBgShape === 'circle') {
                ctx.beginPath();
                ctx.arc(canvasSize / 2, canvasSize / 2, canvasSize / 2, 0, Math.PI * 2);
                ctx.fill();
            } else if (logoBgShape === 'square') {
                ctx.fillRect(0, 0, canvasSize, canvasSize);
            } else if (logoBgShape === 'rounded') {
                const r = canvasSize * 0.15;
                ctx.beginPath();
                ctx.moveTo(r, 0);
                ctx.lineTo(canvasSize - r, 0);
                ctx.quadraticCurveTo(canvasSize, 0, canvasSize, r);
                ctx.lineTo(canvasSize, canvasSize - r);
                ctx.quadraticCurveTo(canvasSize, canvasSize, canvasSize - r, canvasSize);
                ctx.lineTo(r, canvasSize);
                ctx.quadraticCurveTo(0, canvasSize, 0, canvasSize - r);
                ctx.lineTo(0, r);
                ctx.quadraticCurveTo(0, 0, r, 0);
                ctx.closePath();
                ctx.fill();
            }

            // Draw logo centered
            const offsetX = (canvasSize - img.width) / 2;
            const offsetY = (canvasSize - img.height) / 2;
            ctx.drawImage(img, offsetX, offsetY);

            logoDataUrl = canvas.toDataURL('image/png');
            resolve();
        };
        img.src = logoOriginalDataUrl;
    });
}

// ── Content Input ───────────────────────────────────────────
const dataInput = document.getElementById('qr-data');
const charCounterFill = document.getElementById('char-counter-fill');
const charCounterText = document.getElementById('char-counter-text');
const charCounterMsg = document.getElementById('char-counter-msg');

// Max byte capacity per error correction level (binary/UTF-8 mode)
const EC_LIMITS = { L: 2953, M: 2331, Q: 1663, H: 1273 };

function updateCharCounter() {
    const len = new Blob([dataInput.value]).size; // byte length for UTF-8
    const ecLevel = currentOptions.qrOptions.errorCorrectionLevel || 'Q';
    const max = EC_LIMITS[ecLevel] || 1663;
    const pct = Math.min((len / max) * 100, 100);

    charCounterFill.style.width = pct + '%';
    charCounterFill.classList.remove('warn', 'danger');
    charCounterMsg.classList.remove('warn', 'danger');
    charCounterText.textContent = `${len.toLocaleString('en-US')} / ${max.toLocaleString('en-US')} bytes`;

    if (len > max) {
        charCounterFill.classList.add('danger');
        charCounterMsg.classList.add('danger');
        charCounterMsg.textContent = `Too long for level ${ecLevel}. Shorten the text or lower error correction.`;
    } else if (pct >= 75) {
        charCounterFill.classList.add('warn');
        charCounterMsg.classList.add('warn');
        charCounterMsg.textContent = `Nearly full for level ${ecLevel}.`;
    } else {
        charCounterMsg.textContent = `Fits at level ${ecLevel}.`;
    }
}

dataInput.addEventListener('input', () => {
    currentOptions.data = dataInput.value || 'https://example.com';
    updateCharCounter();
    updateQR();
});

// Initial counter
updateCharCounter();

// ── Presets ──────────────────────────────────────────────────
document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const preset = PRESETS[btn.dataset.preset];
        if (!preset) return;

        // Deep-clone preset values into currentOptions.
        // Explicitly handle gradient vs flat color: if the preset has no
        // gradient, delete any leftover gradient from the previous state.
        currentOptions.dotsOptions = JSON.parse(JSON.stringify(preset.dotsOptions));
        if (!preset.dotsOptions.gradient) delete currentOptions.dotsOptions.gradient;

        currentOptions.cornersSquareOptions = JSON.parse(JSON.stringify(preset.cornersSquareOptions));
        if (!preset.cornersSquareOptions.gradient) delete currentOptions.cornersSquareOptions.gradient;

        currentOptions.cornersDotOptions = JSON.parse(JSON.stringify(preset.cornersDotOptions));
        if (!preset.cornersDotOptions.gradient) delete currentOptions.cornersDotOptions.gradient;

        currentOptions.backgroundOptions = JSON.parse(JSON.stringify(preset.backgroundOptions));

        // Sync UI controls — guard so the UI sync doesn't deselect the preset
        skipPresetDeselect = true;
        syncUIFromOptions();
        skipPresetDeselect = false;

        updateQR();
        pinController?.syncAll();
    });
});

// ── Dot Style ───────────────────────────────────────────────
setupStyleGrid('dot-style-grid', (value) => setModuleShape(value));

function setModuleShape(value) {
    currentOptions.dotsOptions.type = value;
    syncStyleGrid('dot-style-grid', value);
    deselectPreset();
    updateQR();
    pinController?.sync('module-shape');
}

// ── Corner Square Style ─────────────────────────────────────
setupStyleGrid('corner-square-style-grid', (value) => {
    currentOptions.cornersSquareOptions.type = value;
    deselectPreset();
    updateQR();
});

// ── Corner Dot Style ────────────────────────────────────────
setupStyleGrid('corner-dot-style-grid', (value) => {
    currentOptions.cornersDotOptions.type = value;
    deselectPreset();
    updateQR();
});

function setupStyleGrid(gridId, callback) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    grid.querySelectorAll('.style-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            grid.querySelectorAll('.style-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            callback(btn.dataset.value);
        });
    });
}

// ── Color Controls ──────────────────────────────────────────

// Dot color
setupColorPair('dot-color', 'dot-color-hex', (color) => setPrimaryColor(color));

// Primary color is the flat module color, or the gradient start when a gradient is on.
function setPrimaryColor(value) {
    if (!currentOptions.dotsOptions.gradient) {
        currentOptions.dotsOptions.color = value;
    } else {
        currentOptions.dotsOptions.gradient.colorStops[0].color = value;
    }
    const colorEl = document.getElementById('dot-color');
    const hexEl = document.getElementById('dot-color-hex');
    if (colorEl.value.toLowerCase() !== value.toLowerCase()) colorEl.value = value;
    if (hexEl.value.toLowerCase() !== value.toLowerCase()) hexEl.value = value.toUpperCase();
    deselectPreset();
    updateQR();
    pinController?.sync('primary-color');
}

// Dot gradient
setupGradientToggle('dot-gradient-toggle', 'dot-gradient-controls', (enabled) => {
    if (enabled) {
        const baseColor = document.getElementById('dot-color').value;
        const endColor = document.getElementById('dot-color-2').value;
        const gradType = document.querySelector('input[name="dot-gradient-type"]:checked').value;
        const rotation = parseInt(document.getElementById('dot-gradient-rotation').value) / 180 * Math.PI;
        currentOptions.dotsOptions.gradient = {
            type: gradType,
            rotation: rotation,
            colorStops: [
                { offset: 0, color: baseColor },
                { offset: 1, color: endColor },
            ],
        };
        delete currentOptions.dotsOptions.color;
    } else {
        delete currentOptions.dotsOptions.gradient;
        currentOptions.dotsOptions.color = document.getElementById('dot-color').value;
    }
    deselectPreset();
    updateQR();
});

// Dot gradient end color
setupColorPair('dot-color-2', 'dot-color-2-hex', (color) => {
    if (currentOptions.dotsOptions.gradient) {
        currentOptions.dotsOptions.gradient.colorStops[1].color = color;
        deselectPreset();
        updateQR();
    }
});

// Dot gradient type
document.querySelectorAll('input[name="dot-gradient-type"]').forEach(radio => {
    radio.addEventListener('change', () => {
        if (currentOptions.dotsOptions.gradient) {
            currentOptions.dotsOptions.gradient.type = radio.value;
            deselectPreset();
            updateQR();
        }
    });
});

// Dot gradient rotation
setupRange('dot-gradient-rotation', 'dot-gradient-rotation-val', (val) => {
    if (currentOptions.dotsOptions.gradient) {
        currentOptions.dotsOptions.gradient.rotation = val / 180 * Math.PI;
        deselectPreset();
        updateQR();
    }
}, '°');

// Corner square color
setupColorPair('corner-square-color', 'corner-square-color-hex', (color) => {
    if (!currentOptions.cornersSquareOptions.gradient) {
        currentOptions.cornersSquareOptions.color = color;
    } else {
        currentOptions.cornersSquareOptions.gradient.colorStops[0].color = color;
    }
    deselectPreset();
    updateQR();
});

// Corner square gradient
setupGradientToggle('cs-gradient-toggle', 'cs-gradient-controls', (enabled) => {
    if (enabled) {
        const baseColor = document.getElementById('corner-square-color').value;
        const endColor = document.getElementById('corner-square-color-2').value;
        const gradType = document.querySelector('input[name="cs-gradient-type"]:checked').value;
        currentOptions.cornersSquareOptions.gradient = {
            type: gradType,
            rotation: 0,
            colorStops: [
                { offset: 0, color: baseColor },
                { offset: 1, color: endColor },
            ],
        };
        delete currentOptions.cornersSquareOptions.color;
    } else {
        delete currentOptions.cornersSquareOptions.gradient;
        currentOptions.cornersSquareOptions.color = document.getElementById('corner-square-color').value;
    }
    deselectPreset();
    updateQR();
});

setupColorPair('corner-square-color-2', 'corner-square-color-2-hex', (color) => {
    if (currentOptions.cornersSquareOptions.gradient) {
        currentOptions.cornersSquareOptions.gradient.colorStops[1].color = color;
        deselectPreset();
        updateQR();
    }
});

document.querySelectorAll('input[name="cs-gradient-type"]').forEach(radio => {
    radio.addEventListener('change', () => {
        if (currentOptions.cornersSquareOptions.gradient) {
            currentOptions.cornersSquareOptions.gradient.type = radio.value;
            deselectPreset();
            updateQR();
        }
    });
});

// Corner dot color
setupColorPair('corner-dot-color', 'corner-dot-color-hex', (color) => {
    if (!currentOptions.cornersDotOptions.gradient) {
        currentOptions.cornersDotOptions.color = color;
    } else {
        currentOptions.cornersDotOptions.gradient.colorStops[0].color = color;
    }
    deselectPreset();
    updateQR();
});

// Corner dot gradient
setupGradientToggle('cd-gradient-toggle', 'cd-gradient-controls', (enabled) => {
    if (enabled) {
        const baseColor = document.getElementById('corner-dot-color').value;
        const endColor = document.getElementById('corner-dot-color-2').value;
        const gradType = document.querySelector('input[name="cd-gradient-type"]:checked').value;
        currentOptions.cornersDotOptions.gradient = {
            type: gradType,
            rotation: 0,
            colorStops: [
                { offset: 0, color: baseColor },
                { offset: 1, color: endColor },
            ],
        };
        delete currentOptions.cornersDotOptions.color;
    } else {
        delete currentOptions.cornersDotOptions.gradient;
        currentOptions.cornersDotOptions.color = document.getElementById('corner-dot-color').value;
    }
    deselectPreset();
    updateQR();
});

setupColorPair('corner-dot-color-2', 'corner-dot-color-2-hex', (color) => {
    if (currentOptions.cornersDotOptions.gradient) {
        currentOptions.cornersDotOptions.gradient.colorStops[1].color = color;
        deselectPreset();
        updateQR();
    }
});

document.querySelectorAll('input[name="cd-gradient-type"]').forEach(radio => {
    radio.addEventListener('change', () => {
        if (currentOptions.cornersDotOptions.gradient) {
            currentOptions.cornersDotOptions.gradient.type = radio.value;
            deselectPreset();
            updateQR();
        }
    });
});

// Background color
setupColorPair('bg-color', 'bg-color-hex', (color) => {
    currentOptions.backgroundOptions.color = color;
    deselectPreset();
    updateQR();
});

// Background transparent
const bgTransToggle = document.getElementById('bg-transparent');
const bgColorGroup = document.getElementById('bg-color-group');
bgTransToggle.addEventListener('change', () => {
    if (bgTransToggle.checked) {
        currentOptions.backgroundOptions.color = 'transparent';
        if (bgColorGroup) bgColorGroup.classList.add('hidden');
    } else {
        currentOptions.backgroundOptions.color = document.getElementById('bg-color').value;
        if (bgColorGroup) bgColorGroup.classList.remove('hidden');
    }
    deselectPreset();
    updateQR();
});

// ── Logo Controls ───────────────────────────────────────────
const logoUpload = document.getElementById('logo-upload');
const logoUploadArea = document.getElementById('logo-upload-area');
const logoUploadText = document.getElementById('logo-upload-text');
const logoRemoveBtn = document.getElementById('logo-remove');
const logoOptionsEl = document.getElementById('logo-options');
const logoMarginGroup = document.getElementById('logo-margin-group');

logoUploadArea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); logoUpload.click(); }
});

logoUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
        logoOriginalDataUrl = evt.target.result;
        logoDataUrl = logoOriginalDataUrl;
        logoUploadArea.classList.add('has-logo');
        logoUploadText.textContent = file.name;
        logoRemoveBtn.classList.remove('hidden');
        logoOptionsEl.classList.remove('hidden');
        logoMarginGroup.classList.remove('hidden');
        document.getElementById('logo-bg-group').classList.remove('hidden');

        // Boost error correction when using a logo
        setErrorCorrection('H');

        compositeLogoWithBackground().then(() => updateQR());
    };
    reader.readAsDataURL(file);
});

logoRemoveBtn.addEventListener('click', () => {
    logoDataUrl = null;
    logoOriginalDataUrl = null;
    logoUpload.value = '';
    logoUploadArea.classList.remove('has-logo');
    logoUploadText.textContent = 'Click to upload a logo';
    logoRemoveBtn.classList.add('hidden');
    logoOptionsEl.classList.add('hidden');
    logoMarginGroup.classList.add('hidden');
    document.getElementById('logo-bg-group').classList.add('hidden');

    // Reset logo bg shape
    logoBgShape = 'none';
    document.querySelectorAll('.logo-shape-grid .style-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('.logo-shape-grid .style-btn[data-value="none"]').classList.add('active');
    document.getElementById('logo-bg-color-row').classList.add('hidden');

    // Reset error correction back to Q (was boosted to H for logo)
    setErrorCorrection('Q');
});

setupRange('logo-size', 'logo-size-val', (val) => {
    currentOptions.imageOptions.imageSize = parseFloat(val);
    updateQR();
}, '', true);

setupRange('logo-margin', 'logo-margin-val', (val) => {
    currentOptions.imageOptions.margin = parseInt(val);
    updateQR();
}, 'px');

// Logo background shape
document.querySelectorAll('.logo-shape-grid .style-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.logo-shape-grid .style-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        logoBgShape = btn.dataset.value;

        const colorRow = document.getElementById('logo-bg-color-row');
        if (logoBgShape === 'none') {
            colorRow.classList.add('hidden');
        } else {
            colorRow.classList.remove('hidden');
        }

        compositeLogoWithBackground().then(() => updateQR());
    });
});

// Logo background color
setupColorPair('logo-bg-color', 'logo-bg-color-hex', (color) => {
    logoBgColor = color;
    compositeLogoWithBackground().then(() => updateQR());
});

// ── Settings Controls ───────────────────────────────────────
setupRange('qr-size', 'qr-size-val', (val) => setOutputSize(val), 'px');
setupRange('qr-margin', 'qr-margin-val', (val) => setQuietZone(val), 'px');

function setOutputSize(value) {
    currentOptions.width = Number(value);
    currentOptions.height = Number(value);
    document.getElementById('qr-size').value = String(value);
    document.getElementById('qr-size-val').textContent = `${value}px`;
    updateQR();
    pinController?.sync('output-size');
}

function setQuietZone(value) {
    currentOptions.margin = Number(value);
    document.getElementById('qr-margin').value = String(value);
    document.getElementById('qr-margin-val').textContent = `${value}px`;
    updateQR();
    pinController?.sync('quiet-zone');
}

// Error correction buttons
document.querySelectorAll('.ec-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        setErrorCorrection(btn.dataset.value);
    });
});

function setErrorCorrection(value) {
    currentOptions.qrOptions.errorCorrectionLevel = value;
    syncECButtons(value);
    updateCharCounter();
    updateQR();
    pinController?.sync('error-correction');
}

// ── Export ───────────────────────────────────────────────────
// Single download path shared by Output exports and the Workspace quick download.
function downloadQR(extension) {
    qrCode.download({ name: 'qr-code', extension });
}

document.getElementById('export-png').addEventListener('click', () => downloadQR('png'));
document.getElementById('export-svg').addEventListener('click', () => downloadQR('svg'));
document.getElementById('export-jpeg').addEventListener('click', () => downloadQR('jpeg'));
document.getElementById('quick-download-png').addEventListener('click', () => downloadQR('png'));

// ── Helpers ─────────────────────────────────────────────────

function setupColorPair(colorId, hexId, callback) {
    const colorEl = document.getElementById(colorId);
    const hexEl = document.getElementById(hexId);
    if (!colorEl || !hexEl) return;

    colorEl.addEventListener('input', () => {
        hexEl.value = colorEl.value.toUpperCase();
        callback(colorEl.value);
    });

    hexEl.addEventListener('input', () => {
        let val = hexEl.value;
        if (!val.startsWith('#')) val = '#' + val;
        if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
            colorEl.value = val;
            callback(val);
        }
    });
}

function setupGradientToggle(toggleId, controlsId, callback) {
    const toggle = document.getElementById(toggleId);
    const controls = document.getElementById(controlsId);
    if (!toggle || !controls) return;

    toggle.addEventListener('change', () => {
        if (toggle.checked) {
            controls.classList.remove('hidden');
        } else {
            controls.classList.add('hidden');
        }
        callback(toggle.checked);
    });
}

function setupRange(inputId, displayId, callback, suffix = '', isFloat = false) {
    const input = document.getElementById(inputId);
    const display = document.getElementById(displayId);
    if (!input) return;

    input.addEventListener('input', () => {
        const val = isFloat ? parseFloat(input.value) : parseInt(input.value);
        if (display) display.textContent = val + suffix;
        callback(input.value);
    });
}

function syncECButtons(level) {
    document.querySelectorAll('.ec-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.value === level);
    });
}

// ── Sync UI from options (after preset) ─────────────────────
function syncUIFromOptions() {
    const opts = currentOptions;

    // Dot style
    syncStyleGrid('dot-style-grid', opts.dotsOptions.type);

    // Corner square style
    syncStyleGrid('corner-square-style-grid', opts.cornersSquareOptions.type);

    // Corner dot style
    syncStyleGrid('corner-dot-style-grid', opts.cornersDotOptions.type);

    // Colors
    if (opts.dotsOptions.gradient) {
        document.getElementById('dot-color').value = opts.dotsOptions.gradient.colorStops[0].color;
        document.getElementById('dot-color-hex').value = opts.dotsOptions.gradient.colorStops[0].color.toUpperCase();
        document.getElementById('dot-color-2').value = opts.dotsOptions.gradient.colorStops[1].color;
        document.getElementById('dot-color-2-hex').value = opts.dotsOptions.gradient.colorStops[1].color.toUpperCase();
        document.getElementById('dot-gradient-toggle').checked = true;
        document.getElementById('dot-gradient-controls').classList.remove('hidden');
    } else {
        document.getElementById('dot-color').value = opts.dotsOptions.color || '#000000';
        document.getElementById('dot-color-hex').value = (opts.dotsOptions.color || '#000000').toUpperCase();
        document.getElementById('dot-gradient-toggle').checked = false;
        document.getElementById('dot-gradient-controls').classList.add('hidden');
    }

    // Corner square color
    if (opts.cornersSquareOptions.gradient) {
        document.getElementById('corner-square-color').value = opts.cornersSquareOptions.gradient.colorStops[0].color;
        document.getElementById('corner-square-color-hex').value = opts.cornersSquareOptions.gradient.colorStops[0].color.toUpperCase();
        document.getElementById('cs-gradient-toggle').checked = true;
        document.getElementById('cs-gradient-controls').classList.remove('hidden');
    } else {
        document.getElementById('corner-square-color').value = opts.cornersSquareOptions.color || '#000000';
        document.getElementById('corner-square-color-hex').value = (opts.cornersSquareOptions.color || '#000000').toUpperCase();
        document.getElementById('cs-gradient-toggle').checked = false;
        document.getElementById('cs-gradient-controls').classList.add('hidden');
    }

    // Corner dot color
    if (opts.cornersDotOptions.gradient) {
        document.getElementById('corner-dot-color').value = opts.cornersDotOptions.gradient.colorStops[0].color;
        document.getElementById('corner-dot-color-hex').value = opts.cornersDotOptions.gradient.colorStops[0].color.toUpperCase();
        document.getElementById('cd-gradient-toggle').checked = true;
        document.getElementById('cd-gradient-controls').classList.remove('hidden');
    } else {
        document.getElementById('corner-dot-color').value = opts.cornersDotOptions.color || '#000000';
        document.getElementById('corner-dot-color-hex').value = (opts.cornersDotOptions.color || '#000000').toUpperCase();
        document.getElementById('cd-gradient-toggle').checked = false;
        document.getElementById('cd-gradient-controls').classList.add('hidden');
    }

    // Background
    const bgColor = opts.backgroundOptions.color || '#FFFFFF';
    if (bgColor === 'transparent') {
        document.getElementById('bg-transparent').checked = true;
    } else {
        document.getElementById('bg-transparent').checked = false;
        document.getElementById('bg-color').value = bgColor;
        document.getElementById('bg-color-hex').value = bgColor.toUpperCase();
    }
}

function syncStyleGrid(gridId, activeValue) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    grid.querySelectorAll('.style-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.value === activeValue);
    });
}

// ── Footer Year ─────────────────────────────────────────────
const footerYear = document.getElementById('footer-year');
if (footerYear) footerYear.textContent = new Date().getFullYear();

// ── Legal Modals ────────────────────────────────────────────
// Lightweight dialogs: Escape and the close button dismiss, focus returns to
// the trigger, and the app shell is inert while a dialog is open.
function setupModal(linkId, modalId, closeId) {
    const link = document.getElementById(linkId);
    const modal = document.getElementById(modalId);
    const close = document.getElementById(closeId);
    if (!link || !modal) return;
    const shell = document.getElementById('app-shell');

    function open() {
        modal.classList.remove('hidden');
        shell.inert = true;
        close?.focus();
    }
    function dismiss() {
        modal.classList.add('hidden');
        shell.inert = false;
        link.focus();
    }

    link.addEventListener('click', (e) => { e.preventDefault(); open(); });
    close?.addEventListener('click', dismiss);
    modal.addEventListener('click', (e) => { if (e.target === modal) dismiss(); });
    modal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') { e.stopPropagation(); dismiss(); }
    });
}

setupModal('terms-link', 'terms-modal', 'terms-close');
setupModal('privacy-link', 'privacy-modal', 'privacy-close');

// ── Right-click Protection ──────────────────────────────────
document.addEventListener('contextmenu', (e) => {
    // Allow right-click on inputs for paste, but block on the app itself
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    e.preventDefault();
});

// ── Appearance Controls ─────────────────────────────────────
const appearanceButtons = document.querySelectorAll('[data-appearance-mode]');
function syncAppearanceButtons() {
    appearanceButtons.forEach((b) => {
        b.setAttribute('aria-pressed', String(b.dataset.appearanceMode === getAppearance()));
    });
}
appearanceButtons.forEach((b) => b.addEventListener('click', () => setAppearance(b.dataset.appearanceMode)));
document.addEventListener('appearancechange', syncAppearanceButtons);
syncAppearanceButtons();

// ── Shell and Pinned Controls ───────────────────────────────
initShell({ defaultSection: 'style' });

pinController = initPins({
    root: document.getElementById('pinned-controls'),
    settings: {
        'module-shape': { get: () => currentOptions.dotsOptions.type, set: setModuleShape },
        'primary-color': { get: () => document.getElementById('dot-color').value, set: setPrimaryColor },
        'error-correction': { get: () => currentOptions.qrOptions.errorCorrectionLevel, set: setErrorCorrection },
        'quiet-zone': { get: () => currentOptions.margin, set: setQuietZone },
        'output-size': { get: () => currentOptions.width, set: setOutputSize },
    },
});
