// Shell controller: Navigation → Workspace → Inspector.
// >=900px: all three zones are permanent. <900px: Navigation and Inspector are
// temporary sheets, and choosing a feature hands off from Navigation to Inspector.

const TITLES = {
  style: 'Style',
  colors: 'Colors',
  logo: 'Logo',
  'scan-quality': 'Scan Quality',
  output: 'Output',
};

export function initShell({ defaultSection = 'style' } = {}) {
  const $ = (id) => document.getElementById(id);
  const nav = $('app-nav');
  const inspector = $('app-inspector');
  const workspace = $('workspace');
  const backdrop = $('panel-backdrop');
  const openNavBtn = $('open-navigation');
  const openInsBtn = $('open-inspector');
  const title = $('inspector-title');
  const features = [...document.querySelectorAll('[data-feature]')];
  const sections = [...document.querySelectorAll('[data-inspector-section]')];
  const desktop = window.matchMedia('(min-width: 900px)');

  let section = defaultSection;
  let open = null; // 'navigation' | 'inspector' | null

  function selectSection(next) {
    if (!TITLES[next]) return;
    section = next;
    features.forEach((b) => {
      if (b.dataset.feature === next) b.setAttribute('aria-current', 'page');
      else b.removeAttribute('aria-current');
    });
    sections.forEach((s) => {
      const active = s.dataset.inspectorSection === next;
      s.hidden = !active;
      s.inert = !active;
    });
    title.textContent = TITLES[next];
  }

  function applyState() {
    const temporary = !desktop.matches;
    nav.classList.toggle('is-open', temporary && open === 'navigation');
    inspector.classList.toggle('is-open', temporary && open === 'inspector');
    backdrop.hidden = !(temporary && open);
    document.documentElement.classList.toggle('scroll-lock', temporary && !!open);
    openNavBtn.setAttribute('aria-expanded', String(temporary && open === 'navigation'));
    openInsBtn.setAttribute('aria-expanded', String(temporary && open === 'inspector'));
    // Background zones are inert while a temporary sheet is active.
    workspace.inert = temporary && !!open;
    nav.inert = temporary && open !== 'navigation';
    inspector.inert = temporary && open !== 'inspector';
  }

  function openNavigation() {
    open = 'navigation';
    applyState();
    $('close-navigation').focus();
  }

  function openInspector({ focus = true } = {}) {
    open = 'inspector';
    applyState();
    if (focus) title.focus();
  }

  function closeTemporarySurface({ restoreFocus = true } = {}) {
    const was = open;
    open = null;
    applyState();
    if (!restoreFocus) return;
    if (was === 'navigation') openNavBtn.focus();
    else if (was === 'inspector') openInsBtn.focus();
  }

  features.forEach((b) =>
    b.addEventListener('click', () => {
      selectSection(b.dataset.feature);
      // Temporary mode: one tap goes straight to the Inspector.
      if (!desktop.matches) openInspector();
    })
  );

  openNavBtn.addEventListener('click', openNavigation);
  openInsBtn.addEventListener('click', () => openInspector());
  $('close-navigation').addEventListener('click', () => closeTemporarySurface());
  $('close-inspector').addEventListener('click', () => closeTemporarySurface());
  backdrop.addEventListener('click', () => closeTemporarySurface());

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && open && !desktop.matches) closeTemporarySurface();
  });

  desktop.addEventListener('change', () => {
    open = null;
    applyState();
  });

  selectSection(defaultSection);
  applyState();

  return {
    selectSection,
    getSection: () => section,
    openNavigation,
    openInspector,
    closeTemporarySurface,
  };
}
