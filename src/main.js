/* ========================================
   QR Studio — Main Application Logic
   ======================================== */

import QRCodeStyling from 'qr-code-styling';
import './style.css';

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
        margin: 5,
        imageSize: 0.4,
    },
};

let logoDataUrl = null;
let debounceTimer = null;
let skipPresetDeselect = false;

// ── Preset Deselection ──────────────────────────────────────
// Called by every manual control change to deselect the active preset.
// Skipped when changes are being driven by a preset application.
function deselectPreset() {
    if (skipPresetDeselect) return;
    document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
}

// ── QR Code Instance ────────────────────────────────────────
const qrCode = new QRCodeStyling(currentOptions);

const previewEl = document.getElementById('qr-preview');
qrCode.append(previewEl);

// ── Debounced Update ────────────────────────────────────────
function updateQR() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        const opts = buildOptions();
        qrCode.update(opts);
    }, 150);
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

// ── Section Collapsing ──────────────────────────────────────
document.querySelectorAll('.section-header').forEach(header => {
    header.addEventListener('click', () => {
        const expanded = header.getAttribute('aria-expanded') === 'true';
        header.setAttribute('aria-expanded', !expanded);
        const body = header.nextElementSibling;
        if (expanded) {
            body.classList.add('collapsed');
        } else {
            body.classList.remove('collapsed');
        }
    });
});

// ── Content Input ───────────────────────────────────────────
const dataInput = document.getElementById('qr-data');
dataInput.addEventListener('input', () => {
    currentOptions.data = dataInput.value || 'https://example.com';
    updateQR();
});

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
    });
});

// ── Dot Style ───────────────────────────────────────────────
setupStyleGrid('dot-style-grid', (value) => {
    currentOptions.dotsOptions.type = value;
    deselectPreset();
    updateQR();
});

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
setupColorPair('dot-color', 'dot-color-hex', (color) => {
    if (!currentOptions.dotsOptions.gradient) {
        currentOptions.dotsOptions.color = color;
    } else {
        currentOptions.dotsOptions.gradient.colorStops[0].color = color;
    }
    deselectPreset();
    updateQR();
});

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

logoUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
        logoDataUrl = evt.target.result;
        logoUploadArea.classList.add('has-logo');
        logoUploadText.textContent = file.name;
        logoRemoveBtn.classList.remove('hidden');
        logoOptionsEl.classList.remove('hidden');
        logoMarginGroup.classList.remove('hidden');

        // Boost error correction when using a logo
        currentOptions.qrOptions.errorCorrectionLevel = 'H';
        syncECButtons('H');

        updateQR();
    };
    reader.readAsDataURL(file);
});

logoRemoveBtn.addEventListener('click', () => {
    logoDataUrl = null;
    logoUpload.value = '';
    logoUploadArea.classList.remove('has-logo');
    logoUploadText.textContent = 'Click to upload a logo';
    logoRemoveBtn.classList.add('hidden');
    logoOptionsEl.classList.add('hidden');
    logoMarginGroup.classList.add('hidden');

    // Reset error correction back to Q (was boosted to H for logo)
    currentOptions.qrOptions.errorCorrectionLevel = 'Q';
    syncECButtons('Q');

    updateQR();
});

setupRange('logo-size', 'logo-size-val', (val) => {
    currentOptions.imageOptions.imageSize = parseFloat(val);
    updateQR();
}, '', true);

setupRange('logo-margin', 'logo-margin-val', (val) => {
    currentOptions.imageOptions.margin = parseInt(val);
    updateQR();
}, 'px');

// ── Settings Controls ───────────────────────────────────────
setupRange('qr-size', 'qr-size-val', (val) => {
    currentOptions.width = parseInt(val);
    currentOptions.height = parseInt(val);
    updateQR();
}, 'px');

setupRange('qr-margin', 'qr-margin-val', (val) => {
    currentOptions.margin = parseInt(val);
    updateQR();
}, 'px');

// Error correction buttons
document.querySelectorAll('.ec-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.ec-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentOptions.qrOptions.errorCorrectionLevel = btn.dataset.value;
        updateQR();
    });
});

// ── Export ───────────────────────────────────────────────────
document.getElementById('export-png').addEventListener('click', () => {
    qrCode.download({ name: 'qr-code', extension: 'png' });
});

document.getElementById('export-svg').addEventListener('click', () => {
    qrCode.download({ name: 'qr-code', extension: 'svg' });
});

document.getElementById('export-jpeg').addEventListener('click', () => {
    qrCode.download({ name: 'qr-code', extension: 'jpeg' });
});

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

// ── Modal Logic ─────────────────────────────────────────────
function setupModal(linkId, modalId, closeId) {
    const link = document.getElementById(linkId);
    const modal = document.getElementById(modalId);
    const close = document.getElementById(closeId);
    if (!link || !modal) return;

    link.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.remove('hidden');
    });

    if (close) {
        close.addEventListener('click', () => modal.classList.add('hidden'));
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.add('hidden');
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

