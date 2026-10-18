// Mini QR thumbnails for the preset tiles. Purely decorative: a fixed 15x15
// module pattern drawn with each preset's module shape, colors and background.

const N = 15;
const PATTERN = [
  '111111101011111', '100000101010001', '101110100110101', '101110101001101', '101110100101101',
  '100000101100001', '111111101010101', '000000001110000', '110101111001011', '011010010110100',
  '000000001011010', '111111101101101', '100000100010011', '101110101111000', '111111101001110',
].map((r) => [...r].map((c) => c === '1'));

const inFinder = (x, y) => (x < 7 && y < 7) || (x > N - 8 && y < 7) || (x < 7 && y > N - 8);

function module(shape, x, y, c, fill) {
  if (shape === 'dots') return `<circle cx="${x + c / 2}" cy="${y + c / 2}" r="${c * 0.45}" fill="${fill}"/>`;
  const r = shape === 'square' ? 0 : shape === 'classy' ? c * 0.3 : c * 0.35;
  return `<rect x="${x}" y="${y}" width="${c}" height="${c}" rx="${r}" fill="${fill}"/>`;
}

function stops(opts, fallback) {
  const g = opts.gradient;
  return g ? [g.colorStops[0].color, g.colorStops[1].color] : [opts.color || fallback, opts.color || fallback];
}

export function renderPresetThumb(key, p) {
  const [c1, c2] = stops(p.dotsOptions, '#000');
  const bg = p.backgroundOptions.color;
  const cs = p.cornersSquareOptions;
  const cd = p.cornersDotOptions;
  const pad = 5, cell = 30 / N;
  const gid = `pg-${key}`;
  let out = `<defs><linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="40" height="40" fill="${bg}"/>`;
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      if (!PATTERN[y][x] || inFinder(x, y)) continue;
      out += module(p.dotsOptions.type, pad + x * cell, pad + y * cell, cell, `url(#${gid})`);
    }
  }
  for (const [fx, fy] of [[0, 0], [N - 7, 0], [0, N - 7]]) {
    const x = pad + fx * cell, y = pad + fy * cell, s = cell * 7;
    const rr = cs.type === 'square' ? 0 : cs.type === 'dot' ? s / 2 : s * 0.3;
    out += `<rect x="${x + cell / 2}" y="${y + cell / 2}" width="${s - cell}" height="${s - cell}" rx="${rr}" fill="none" stroke="${cs.color || c1}" stroke-width="${cell}"/>`;
    const ix = x + cell * 2, is = cell * 3;
    out += cd.type === 'dot'
      ? `<circle cx="${ix + is / 2}" cy="${iy(y, cell) + is / 2}" r="${is / 2}" fill="${cd.color || c1}"/>`
      : `<rect x="${ix}" y="${iy(y, cell)}" width="${is}" height="${is}" fill="${cd.color || c1}"/>`;
  }
  return out;
}
const iy = (y, cell) => y + cell * 2;
