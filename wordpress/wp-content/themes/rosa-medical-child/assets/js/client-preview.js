(() => {
  const trigger = document.querySelector('[data-rosa-preview-menu-trigger]');
  const drawer = document.querySelector('[data-rosa-preview-menu-drawer]');
  const overlay = document.querySelector('[data-rosa-preview-menu-overlay]');
  const closeButton = document.querySelector('[data-rosa-preview-menu-close]');
  const announcement = document.querySelector('.rosa-preview-announcement');
  const headerInner = document.querySelector('.rosa-preview-header__inner');
  const main = document.querySelector('.rosa-site-main');
  const footer = document.querySelector('[data-rosa-preview-footer]');

  if (!(trigger instanceof HTMLElement) || !(drawer instanceof HTMLElement) || !(overlay instanceof HTMLElement)) return;

  const focusables = () => Array.from(
    drawer.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),[tabindex]:not([tabindex="-1"])')
  ).filter((node) => node instanceof HTMLElement && !node.hasAttribute('hidden'));

  const inertTargets = [announcement, headerInner, main, footer].filter((node) => node instanceof HTMLElement);
  const setInert = (value) => inertTargets.forEach((node) => { node.inert = value; });

  const open = () => {
    trigger.setAttribute('aria-expanded', 'true');
    drawer.hidden = false;
    overlay.hidden = false;
    document.documentElement.classList.add('rosa-preview-menu-open');
    setInert(true);
    focusables()[0]?.focus();
  };

  const close = (restore = true) => {
    trigger.setAttribute('aria-expanded', 'false');
    drawer.hidden = true;
    overlay.hidden = true;
    document.documentElement.classList.remove('rosa-preview-menu-open');
    setInert(false);
    if (restore) trigger.focus();
  };

  trigger.addEventListener('click', () => trigger.getAttribute('aria-expanded') === 'true' ? close() : open());
  closeButton?.addEventListener('click', () => close());
  overlay.addEventListener('click', () => close());
  drawer.addEventListener('click', (event) => {
    if (event.target instanceof Element && event.target.closest('a[href]')) close(false);
  });

  document.addEventListener('keydown', (event) => {
    if (trigger.getAttribute('aria-expanded') !== 'true') return;
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    if (event.key !== 'Tab') return;

    const items = focusables();
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
})();
