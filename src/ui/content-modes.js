// Content types: each mode shows a small form and composes the text that the
// QR encodes. The textarea (#qr-data) stays the single source the rest of the
// app reads; non-text modes write their composed string into it.

const MODES = [
  { key: 'text', label: 'Text' },
  { key: 'wifi', label: 'Wi-Fi' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'sms', label: 'SMS' },
];

const wifiEsc = (v) => v.replace(/([\;,:"])/g, '\\$1');

export const encoders = {
  wifi: ({ ssid, password, security, hidden }) => {
    if (!ssid) return '';
    const t = security === 'nopass' ? 'nopass' : security;
    return `WIFI:T:${t};S:${wifiEsc(ssid)};${security === 'nopass' ? '' : `P:${wifiEsc(password || '')};`}${hidden ? 'H:true;' : ''};`;
  },
  email: ({ to, subject, body }) => {
    if (!to) return '';
    const q = [subject && `subject=${encodeURIComponent(subject)}`, body && `body=${encodeURIComponent(body)}`].filter(Boolean).join('&');
    return `mailto:${to}${q ? `?${q}` : ''}`;
  },
  phone: ({ number }) => (number ? `tel:${number.replace(/[^\d+]/g, '')}` : ''),
  sms: ({ number, message }) => (number ? `SMSTO:${number.replace(/[^\d+]/g, '')}:${message || ''}` : ''),
};

const FORMS = {
  wifi: `
    <label class="mf"><span class="field-label">Network name</span><input class="text-input" data-f="ssid" autocomplete="off" spellcheck="false" /></label>
    <label class="mf"><span class="field-label">Password</span><input class="text-input" data-f="password" autocomplete="off" spellcheck="false" /></label>
    <div class="mf-row">
      <div class="mf"><span class="field-label" id="wifi-sec-label">Security</span>
        <div class="seg" role="group" aria-labelledby="wifi-sec-label">
          <button type="button" class="seg-btn" data-sec="WPA" aria-pressed="true">WPA</button>
          <button type="button" class="seg-btn" data-sec="WEP" aria-pressed="false">WEP</button>
          <button type="button" class="seg-btn" data-sec="nopass" aria-pressed="false">None</button>
        </div>
      </div>
      <div class="mf mf-toggle"><span class="field-label">Hidden</span>
        <label class="toggle-switch"><input type="checkbox" data-f="hidden" aria-label="Hidden network" /><span class="toggle-slider"></span></label>
      </div>
    </div>`,
  email: `
    <label class="mf"><span class="field-label">To</span><input class="text-input" type="email" data-f="to" autocomplete="off" spellcheck="false" /></label>
    <label class="mf"><span class="field-label">Subject</span><input class="text-input" data-f="subject" autocomplete="off" /></label>
    <label class="mf"><span class="field-label">Message</span><textarea class="text-input" rows="2" data-f="body"></textarea></label>`,
  phone: `<label class="mf"><span class="field-label">Phone number</span><input class="text-input" type="tel" data-f="number" autocomplete="off" placeholder="+1 555 123 4567" /></label>`,
  sms: `
    <label class="mf"><span class="field-label">Phone number</span><input class="text-input" type="tel" data-f="number" autocomplete="off" placeholder="+1 555 123 4567" /></label>
    <label class="mf"><span class="field-label">Message</span><textarea class="text-input" rows="2" data-f="message"></textarea></label>`,
};

export function initContentModes() {
  const area = document.getElementById('qr-data');
  const label = document.querySelector('label[for="qr-data"]');
  const host = document.getElementById('content-modes');
  if (!area || !host) return;

  host.innerHTML = `<div class="seg content-seg" role="group" aria-label="Content type">${MODES.map(
    (m, i) => `<button type="button" class="seg-btn" data-mode="${m.key}" aria-pressed="${i === 0}">${m.label}</button>`
  ).join('')}</div><div class="mode-form" id="mode-form" hidden></div>`;
  const form = host.querySelector('#mode-form');

  let mode = 'text';
  let textValue = area.value;
  const state = { wifi: { security: 'WPA' }, email: {}, phone: {}, sms: {} };

  function push(value) {
    area.value = value;
    area.dispatchEvent(new Event('input', { bubbles: true }));
  }

  function compose() {
    if (mode !== 'text') push(encoders[mode](state[mode]));
  }

  function setMode(next) {
    if (next === mode) return;
    if (mode === 'text') textValue = area.value;
    mode = next;
    host.querySelectorAll('[data-mode]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.mode === mode)));
    const isText = mode === 'text';
    area.hidden = !isText;
    label.hidden = !isText;
    form.hidden = isText;
    if (isText) {
      form.replaceChildren();
      push(textValue);
      return;
    }
    form.innerHTML = FORMS[mode];
    form.querySelectorAll('[data-f]').forEach((el) => {
      const k = el.dataset.f;
      if (el.type === 'checkbox') el.checked = !!state[mode][k];
      else el.value = state[mode][k] || '';
    });
    form.querySelectorAll('[data-sec]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.sec === state.wifi.security)));
    compose();
  }

  host.addEventListener('click', (e) => {
    const m = e.target.closest('[data-mode]');
    if (m) setMode(m.dataset.mode);
    const s = e.target.closest('[data-sec]');
    if (s) {
      state.wifi.security = s.dataset.sec;
      form.querySelectorAll('[data-sec]').forEach((b) => b.setAttribute('aria-pressed', String(b === s)));
      compose();
    }
  });
  form.addEventListener('input', (e) => {
    const el = e.target.closest('[data-f]');
    if (!el) return;
    state[mode][el.dataset.f] = el.type === 'checkbox' ? el.checked : el.value;
    compose();
  });
}
