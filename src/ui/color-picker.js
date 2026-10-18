// Custom color popover that replaces the browser's native color dialog.
// Native color inputs stay the source of truth: the popover writes their value
// and fires `input`, so every existing listener keeps working.

const SWATCHES = ['#C05746', '#D9A24C', '#7CA96B', '#ADC698', '#503047', '#2E2A28', '#000000', '#FFFFFF'];

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

function hexToHsv(hex) {
  const n = parseInt(hex.slice(1), 16);
  const r = ((n >> 16) & 255) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  let h = 0;
  if (d) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h = (h * 60 + 360) % 360;
  }
  return { h, s: max ? d / max : 0, v: max };
}

function hsvToHex({ h, s, v }) {
  const f = (n) => {
    const k = (n + h / 60) % 6;
    return v - v * s * Math.max(0, Math.min(k, 4 - k, 1));
  };
  return '#' + [f(5), f(3), f(1)].map((x) => Math.round(x * 255).toString(16).padStart(2, '0')).join('').toUpperCase();
}

export function initColorPicker() {
  const pop = document.createElement('div');
  pop.className = 'cp';
  pop.hidden = true;
  pop.setAttribute('role', 'dialog');
  pop.setAttribute('aria-label', 'Choose color');
  pop.innerHTML = `
    <div class="cp-sv" tabindex="0" role="slider" aria-label="Saturation and brightness"><div class="cp-sv-dot"></div></div>
    <input class="cp-hue" type="range" min="0" max="360" step="1" aria-label="Hue" />
    <div class="cp-row">
      <span class="cp-preview" aria-hidden="true"></span>
      <input class="cp-hex hex-input" type="text" maxlength="7" spellcheck="false" aria-label="Hex color" />
    </div>
    <div class="cp-swatches" role="group" aria-label="Palette">
      ${SWATCHES.map((c) => `<button type="button" class="cp-swatch" style="--c:${c}" data-c="${c}" aria-label="${c}"></button>`).join('')}
    </div>`;
  document.body.append(pop);

  const sv = pop.querySelector('.cp-sv');
  const dot = pop.querySelector('.cp-sv-dot');
  const hue = pop.querySelector('.cp-hue');
  const hex = pop.querySelector('.cp-hex');
  const preview = pop.querySelector('.cp-preview');

  let target = null;
  let hsv = { h: 0, s: 0, v: 0 };

  function paint() {
    const color = hsvToHex(hsv);
    sv.style.setProperty('--hue', `hsl(${hsv.h} 100% 50%)`);
    dot.style.left = `${hsv.s * 100}%`;
    dot.style.top = `${(1 - hsv.v) * 100}%`;
    dot.style.background = color;
    hue.value = String(Math.round(hsv.h));
    preview.style.background = color;
    if (document.activeElement !== hex) hex.value = color;
    pop.querySelectorAll('.cp-swatch').forEach((b) => b.classList.toggle('on', b.dataset.c === color));
    return color;
  }

  function commit() {
    const color = paint();
    if (target && target.value.toUpperCase() !== color) {
      target.value = color.toLowerCase();
      target.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  function place() {
    const r = target.getBoundingClientRect();
    const w = pop.offsetWidth, h = pop.offsetHeight;
    let left = clamp(r.left, 8, window.innerWidth - w - 8) ;
    let top = r.bottom + 8;
    let origin = 'top';
    if (top + h > window.innerHeight - 8) { top = Math.max(8, r.top - h - 8); origin = 'bottom'; }
    pop.style.left = `${left}px`;
    pop.style.top = `${top}px`;
    pop.style.transformOrigin = `${Math.min(24, r.width / 2)}px ${origin}`;
  }

  function open(input) {
    target = input;
    hsv = hexToHsv(input.value || '#000000');
    pop.hidden = false;
    pop.classList.remove('is-open');
    paint();
    place();
    void pop.offsetWidth; // restart the entrance transition
    pop.classList.add('is-open');
    target.setAttribute('aria-expanded', 'true');
    sv.focus({ preventScroll: true });
  }

  function close({ restoreFocus = true } = {}) {
    if (pop.hidden) return;
    pop.hidden = true;
    pop.classList.remove('is-open');
    target?.setAttribute('aria-expanded', 'false');
    if (restoreFocus) target?.focus();
    target = null;
  }

  function drag(el, onMove) {
    el.addEventListener('pointerdown', (e) => {
      el.setPointerCapture(e.pointerId);
      const move = (ev) => onMove(ev);
      move(e);
      el.addEventListener('pointermove', move);
      const up = () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up); };
      el.addEventListener('pointerup', up);
      el.addEventListener('pointercancel', up);
    });
  }

  drag(sv, (e) => {
    const r = sv.getBoundingClientRect();
    hsv.s = clamp((e.clientX - r.left) / r.width);
    hsv.v = 1 - clamp((e.clientY - r.top) / r.height);
    commit();
  });
  sv.addEventListener('keydown', (e) => {
    const step = e.shiftKey ? 0.1 : 0.02;
    const d = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] }[e.key];
    if (!d) return;
    e.preventDefault();
    hsv.s = clamp(hsv.s + d[0]);
    hsv.v = clamp(hsv.v + d[1]);
    commit();
  });
  hue.addEventListener('input', () => { hsv.h = Number(hue.value); commit(); });
  hex.addEventListener('input', () => {
    const v = hex.value.startsWith('#') ? hex.value : `#${hex.value}`;
    if (/^#[0-9A-Fa-f]{6}$/.test(v)) { hsv = hexToHsv(v); commit(); }
  });
  hex.addEventListener('blur', () => paint());
  pop.querySelector('.cp-swatches').addEventListener('click', (e) => {
    const b = e.target.closest('[data-c]');
    if (b) { hsv = hexToHsv(b.dataset.c); commit(); }
  });

  // Intercept native color inputs.
  document.addEventListener('click', (e) => {
    const input = e.target.closest?.('input[type="color"]');
    if (input) {
      e.preventDefault();
      if (!pop.hidden && target === input) close();
      else open(input);
      return;
    }
    if (!pop.hidden && !pop.contains(e.target)) close({ restoreFocus: false });
  }, true);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !pop.hidden) { e.stopPropagation(); close(); }
  }, true);
  window.addEventListener('resize', () => close({ restoreFocus: false }));
  document.addEventListener('scroll', () => close({ restoreFocus: false }), true);
}
