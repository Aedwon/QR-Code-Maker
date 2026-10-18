// Shape geometry shared by the preset tiles and the shape picker glyphs.
// Matches the approved design reference.

const f = (n) => Math.round(n * 100) / 100;

const rr = (x, y, w, h, a, b, c, d) => {
  let s = `M${f(x + a)} ${f(y)}H${f(x + w - b)}`;
  if (b) s += `A${f(b)} ${f(b)} 0 0 1 ${f(x + w)} ${f(y + b)}`;
  s += `V${f(y + h - c)}`;
  if (c) s += `A${f(c)} ${f(c)} 0 0 1 ${f(x + w - c)} ${f(y + h)}`;
  s += `H${f(x + d)}`;
  if (d) s += `A${f(d)} ${f(d)} 0 0 1 ${f(x)} ${f(y + h - d)}`;
  s += `V${f(y + a)}`;
  if (a) s += `A${f(a)} ${f(a)} 0 0 1 ${f(x + a)} ${f(y)}`;
  return s + 'Z';
};
const circ = (cx, cy, r) =>
  `M${f(cx - r)} ${f(cy)}a${f(r)} ${f(r)} 0 1 0 ${f(2 * r)} 0a${f(r)} ${f(r)} 0 1 0 ${f(-2 * r)} 0Z`;

function mod(t, x, y, z) {
  if (t === 'dots') return circ(x + z / 2, y + z / 2, z * 0.46);
  if (t === 'rounded') return rr(x, y, z, z, z * 0.2, z * 0.2, z * 0.2, z * 0.2);
  if (t === 'extra-rounded') return rr(x, y, z, z, z * 0.4, z * 0.4, z * 0.4, z * 0.4);
  if (t === 'classy') return rr(x, y, z, z, z * 0.45, 0, z * 0.45, 0);
  if (t === 'classy-rounded') return rr(x, y, z, z, z * 0.5, z * 0.15, z * 0.5, z * 0.15);
  return rr(x - 0.15, y - 0.15, z + 0.3, z + 0.3, 0, 0, 0, 0);
}

function ring(t, x, y, z) {
  if (t === 'dot') return circ(x + 3.5 * z, y + 3.5 * z, 3.5 * z) + circ(x + 3.5 * z, y + 3.5 * z, 2.5 * z);
  if (t === 'extra-rounded') {
    return rr(x, y, 7 * z, 7 * z, 2.4 * z, 2.4 * z, 2.4 * z, 2.4 * z) +
      rr(x + z, y + z, 5 * z, 5 * z, 1.4 * z, 1.4 * z, 1.4 * z, 1.4 * z);
  }
  return rr(x, y, 7 * z, 7 * z, 0, 0, 0, 0) + rr(x + z, y + z, 5 * z, 5 * z, 0, 0, 0, 0);
}

const core = (t, x, y, z) =>
  t === 'dot' ? circ(x + 3.5 * z, y + 3.5 * z, 1.5 * z) : rr(x + 2 * z, y + 2 * z, 3 * z, 3 * z, 0, 0, 0, 0);

export const moduleGlyph = (t) =>
  [[1.5, 1.5], [13.5, 1.5], [1.5, 13.5], [13.5, 13.5]].map(([x, y]) => mod(t, x, y, 9)).join('');

const TILE = ['11011', '10110', '01101', '11010', '10111'];

export function renderPresetThumb(key, p) {
  const shape = p.dotsOptions.type;
  let d = '';
  TILE.forEach((row, r) => {
    for (let c = 0; c < 5; c++) if (row[c] === '1') d += mod(shape, 6 + c * 5.6, 6 + r * 5.6, 5.6);
  });
  const g = p.dotsOptions.gradient;
  const c1 = g ? g.colorStops[0].color : p.dotsOptions.color;
  const c2 = g ? g.colorStops[1].color : c1;
  return `<defs><linearGradient id="pg-${key}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>` +
    `<rect width="40" height="40" fill="${p.backgroundOptions.color}"/><path d="${d}" fill="url(#pg-${key})"/>`;
}

// Redraw the shape picker buttons with the reference glyphs and keep each
// group's current-value label in sync with the active button.
export function initShapeGlyphs() {
  const kinds = { 'dot-style-grid': moduleGlyph, 'corner-square-style-grid': (t) => ring(t, 2.5, 2.5, 19 / 7), 'corner-dot-style-grid': (t) => core(t, 2.5, 2.5, 19 / 7) };
  for (const [id, draw] of Object.entries(kinds)) {
    const grid = document.getElementById(id);
    if (!grid) continue;
    const label = grid.parentElement.querySelector('.group-val');
    const sync = () => {
      const on = grid.querySelector('.style-btn.active');
      if (label && on) label.textContent = on.title;
    };
    grid.querySelectorAll('.style-btn').forEach((b) => {
      b.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" fill="currentColor" d="${draw(b.dataset.value)}"/></svg>`;
    });
    new MutationObserver(sync).observe(grid, { subtree: true, attributes: true, attributeFilter: ['class'] });
    sync();
  }
}
