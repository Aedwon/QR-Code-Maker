// Appearance controller: UI theme only. Never touches QR options.
const KEY = 'qr-studio:appearance';
const MODES = ['light', 'dark', 'system'];
const query = window.matchMedia('(prefers-color-scheme: dark)');

function read() {
  try {
    const v = localStorage.getItem(KEY);
    return MODES.includes(v) ? v : 'system';
  } catch {
    return 'system';
  }
}

function apply(mode) {
  const root = document.documentElement;
  root.dataset.appearance = mode;
  root.dataset.theme = mode === 'system' ? (query.matches ? 'dark' : 'light') : mode;
}

export function getAppearance() {
  return document.documentElement.dataset.appearance || read();
}

export function setAppearance(mode) {
  const next = MODES.includes(mode) ? mode : 'system';
  try { localStorage.setItem(KEY, next); } catch { /* storage unavailable */ }
  apply(next);
  document.dispatchEvent(new CustomEvent('appearancechange', { detail: next }));
}

export function initTheme() {
  apply(read());
  query.addEventListener('change', () => {
    if (getAppearance() === 'system') apply('system');
  });
}
