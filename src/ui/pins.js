import { moduleGlyph } from './preset-thumbs.js';

// Curated pinned controls: a small dock at the top of the Inspector that mirrors
// five approved settings. Native controls stay in their home sections; both views
// read and write through the supplied { get, set } pair, so there is one value.

const STORAGE_KEY = 'qr-studio:pins:v1';

const DEFS = {
  'module-shape': { label: 'Style · Module shape', pinLabel: 'Module shape' },
  'primary-color': { label: 'Colors · Primary color', pinLabel: 'Primary color' },
  'error-correction': { label: 'Scan Quality · Error correction', pinLabel: 'Error correction' },
  'quiet-zone': { label: 'Scan Quality · Quiet zone', pinLabel: 'Quiet zone' },
  'output-size': { label: 'Output · Output size', pinLabel: 'Output size' },
};
const KEYS = Object.keys(DEFS);

const SHAPES = [
  ['square', 'Square'],
  ['dots', 'Dots'],
  ['rounded', 'Rounded'],
  ['extra-rounded', 'Extra rounded'],
  ['classy', 'Classy'],
  ['classy-rounded', 'Classy rounded'],
];
const EC_LEVELS = ['L', 'M', 'Q', 'H'];

const icon = (name, cls = '') =>
  `<svg class="ic ${cls}" aria-hidden="true"><use href="#ph-${name}"/></svg>`;

function loadPins(storage) {
  try {
    const raw = JSON.parse(storage.getItem(STORAGE_KEY));
    if (!Array.isArray(raw)) return [];
    return raw.filter((k, i) => KEYS.includes(k) && raw.indexOf(k) === i);
  } catch {
    return [];
  }
}

export function initPins({ root, settings, storage = window.localStorage }) {
  let pins = loadPins(storage);
  let collapsed = false;
  const updaters = new Map(); // key -> () => void, refreshes the mirror from settings

  const nativePinButtons = [...document.querySelectorAll('[data-pin-action]')];

  function save() {
    try { storage.setItem(STORAGE_KEY, JSON.stringify(pins)); } catch { /* storage unavailable */ }
  }

  function togglePin(key) {
    pins = pins.includes(key) ? pins.filter((k) => k !== key) : [...pins, key];
    save();
    render();
  }

  function move(key, delta) {
    const i = pins.indexOf(key);
    const j = i + delta;
    if (i < 0 || j < 0 || j >= pins.length) return;
    [pins[i], pins[j]] = [pins[j], pins[i]];
    save();
    render();
    root.querySelector(`[data-pinned-key="${key}"] [data-move="${delta < 0 ? 'up' : 'down'}"]:not(:disabled), [data-pinned-key="${key}"] [data-move]:not(:disabled)`)?.focus();
  }

  function control(key) {
    const set = settings[key].set;
    const id = `pin-${key}`;
    if (key === 'module-shape') {
      const grp = document.createElement('div');
      grp.className = 'seg mini';
      grp.setAttribute('role', 'group');
      grp.setAttribute('aria-label', DEFS[key].label);
      grp.innerHTML = SHAPES.map(([v, l]) =>
        `<button type="button" class="seg-btn" data-shape="${v}" aria-label="${l}" title="${l}"><svg class="glyph" viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" fill="currentColor" d="${moduleGlyph(v)}"/></svg></button>`).join('');
      grp.addEventListener('click', (e) => {
        const b = e.target.closest('[data-shape]');
        if (b) set(b.dataset.shape);
      });
      updaters.set(key, () => {
        const v = settings[key].get();
        grp.querySelectorAll('[data-shape]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.shape === v)));
      });
      return grp;
    }
    if (key === 'primary-color') {
      const row = document.createElement('div');
      row.className = 'pin-color';
      row.innerHTML = `<input type="color" id="${id}" class="color-input" aria-label="${DEFS[key].label}" />
        <input type="text" id="${id}-hex" class="hex-input" maxlength="7" aria-label="${DEFS[key].label} hex value" />`;
      const [picker, hex] = row.querySelectorAll('input');
      picker.addEventListener('input', () => set(picker.value));
      hex.addEventListener('input', () => {
        const v = hex.value.startsWith('#') ? hex.value : `#${hex.value}`;
        if (/^#[0-9A-Fa-f]{6}$/.test(v)) set(v);
      });
      updaters.set(key, () => {
        const v = settings[key].get();
        picker.value = v;
        if (document.activeElement !== hex) hex.value = v.toUpperCase();
      });
      return row;
    }
    if (key === 'error-correction') {
      const grp = document.createElement('div');
      grp.className = 'seg mini';
      grp.setAttribute('role', 'group');
      grp.setAttribute('aria-label', DEFS[key].label);
      grp.innerHTML = EC_LEVELS.map((l) => `<button type="button" class="seg-btn" data-level="${l}">${l}</button>`).join('');
      grp.addEventListener('click', (e) => {
        const b = e.target.closest('[data-level]');
        if (b) set(b.dataset.level);
      });
      updaters.set(key, () => {
        const v = settings[key].get();
        grp.querySelectorAll('[data-level]').forEach((b) => {
          const on = b.dataset.level === v;
          b.setAttribute('aria-pressed', String(on));
        });
      });
      return grp;
    }
    // Range mirrors: quiet-zone, output-size. Bounds are copied from the native input.
    const nativeId = key === 'quiet-zone' ? 'qr-margin' : 'qr-size';
    const native = document.getElementById(nativeId);
    const row = document.createElement('div');
    row.className = 'pin-range';
    row.innerHTML = `<input type="range" id="${id}" min="${native.min}" max="${native.max}" step="${native.step}" aria-label="${DEFS[key].label}" />
      <span class="range-value" aria-hidden="true"></span>`;
    const input = row.querySelector('input');
    const out = row.querySelector('.range-value');
    input.addEventListener('input', () => set(input.value));
    updaters.set(key, () => {
      const v = settings[key].get();
      input.value = String(v);
      out.textContent = `${v}px`;
    });
    return row;
  }

  function render() {
    updaters.clear();
    root.hidden = pins.length === 0;
    root.replaceChildren();

    nativePinButtons.forEach((b) => {
      const on = pins.includes(b.dataset.pinAction);
      b.setAttribute('aria-pressed', String(on));
      const name = DEFS[b.dataset.pinAction].pinLabel;
      b.setAttribute('aria-label', `${on ? 'Unpin' : 'Pin'} ${name}`);
    });
    if (!pins.length) return;

    const head = document.createElement('div');
    head.className = 'dock-head';
    head.innerHTML = `<span class="dock-title">${icon('push-pin-fill')}Pinned</span>
      <button type="button" class="icon-btn" data-collapse aria-expanded="${!collapsed}" aria-label="${collapsed ? 'Expand' : 'Collapse'} pinned controls">${icon(collapsed ? 'caret-down' : 'caret-up')}</button>`;
    head.querySelector('[data-collapse]').addEventListener('click', () => {
      collapsed = !collapsed;
      render();
      root.querySelector('[data-collapse]')?.focus();
    });
    root.append(head);

    if (collapsed) return;

    const list = document.createElement('div');
    list.className = 'dock-list';
    pins.forEach((key, i) => {
      const item = document.createElement('div');
      item.className = 'dock-item';
      item.dataset.pinnedKey = key;
      const label = DEFS[key].label;
      item.innerHTML = `<div class="dock-item-top">
          ${icon('dots-six-vertical', 'grip')}<span class="dock-label">${DEFS[key].pinLabel}</span>
          <button type="button" class="icon-btn sm" data-move="up" aria-label="Move ${label} up" ${i === 0 ? 'disabled' : ''}>${icon('caret-up')}</button>
          <button type="button" class="icon-btn sm" data-move="down" aria-label="Move ${label} down" ${i === pins.length - 1 ? 'disabled' : ''}>${icon('caret-down')}</button>
          <button type="button" class="icon-btn sm on" data-unpin aria-label="Unpin ${label}">${icon('push-pin-fill')}</button>
        </div>`;
      item.append(control(key));
      item.querySelector('[data-move="up"]').addEventListener('click', () => move(key, -1));
      item.querySelector('[data-move="down"]').addEventListener('click', () => move(key, 1));
      item.querySelector('[data-unpin]').addEventListener('click', () => togglePin(key));
      list.append(item);
    });
    root.append(list);
    syncAll();
  }

  function sync(key) {
    updaters.get(key)?.();
  }
  function syncAll() {
    updaters.forEach((fn) => fn());
  }

  nativePinButtons.forEach((b) => b.addEventListener('click', () => togglePin(b.dataset.pinAction)));

  render();
  return { sync, syncAll };
}
