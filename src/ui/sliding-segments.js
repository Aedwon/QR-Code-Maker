// Segmented controls (.seg, .ec-grid) get a pill that slides to the active
// button instead of the highlight appearing in place.

const isOn = (b) => b.getAttribute('aria-pressed') === 'true' || b.classList.contains('active');

function setup(group) {
  if (group.dataset.sliding) return;
  group.dataset.sliding = '1';
  const thumb = document.createElement('span');
  thumb.className = 'seg-thumb';
  thumb.setAttribute('aria-hidden', 'true');
  group.prepend(thumb);

  let placed = false;
  function place() {
    const on = [...group.children].find((b) => b !== thumb && isOn(b));
    if (!on || !on.offsetWidth) { thumb.style.opacity = '0'; return; }
    thumb.style.opacity = '1';
    thumb.style.width = `${on.offsetWidth}px`;
    thumb.style.height = `${on.offsetHeight}px`;
    thumb.style.transform = `translate(${on.offsetLeft}px, ${on.offsetTop}px)`;
    if (!placed) {
      placed = true;
      // First placement snaps; later ones animate.
      requestAnimationFrame(() => requestAnimationFrame(() => thumb.classList.add('ready')));
    }
  }

  new MutationObserver(place).observe(group, { subtree: true, attributes: true, attributeFilter: ['class', 'aria-pressed'] });
  new ResizeObserver(place).observe(group);
  place();
}

export function initSlidingSegments() {
  const scan = (root) => root.querySelectorAll?.('.seg, .ec-grid').forEach(setup);
  scan(document);
  new MutationObserver((muts) => {
    for (const m of muts) m.addedNodes.forEach((n) => {
      if (n.nodeType !== 1) return;
      if (n.matches?.('.seg, .ec-grid')) setup(n);
      scan(n);
    });
  }).observe(document.body, { childList: true, subtree: true });
}
