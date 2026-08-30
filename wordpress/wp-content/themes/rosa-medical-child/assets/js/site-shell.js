(() => {
  const trigger = document.querySelector('[data-rosa-menu-trigger]');
  const drawer = document.querySelector('[data-rosa-menu-drawer]');
  const overlay = document.querySelector('[data-rosa-menu-overlay]');
  const closeButton = document.querySelector('[data-rosa-menu-close]');
  const main = document.querySelector('.rosa-site-main');
  const footer = document.querySelector('[data-rosa-site-footer]');

  if (!(trigger instanceof HTMLElement) || !(drawer instanceof HTMLElement) || !(overlay instanceof HTMLElement)) return;

  const focusables = () => Array.from(drawer.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'))
    .filter((node) => node instanceof HTMLElement && !node.hasAttribute('hidden'));

  const setBackgroundInert = (value) => {
    [main, footer].forEach((node) => {
      if (node instanceof HTMLElement) node.inert = value;
    });
  };

  function openMenu() {
    trigger.setAttribute('aria-expanded', 'true');
    drawer.removeAttribute('hidden');
    overlay.removeAttribute('hidden');
    document.documentElement.classList.add('rosa-menu-open');
    setBackgroundInert(true);
    const first = focusables()[0];
    if (first instanceof HTMLElement) first.focus();
  }

  function closeMenu({ restoreFocus = true } = {}) {
    trigger.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('hidden', '');
    overlay.setAttribute('hidden', '');
    document.documentElement.classList.remove('rosa-menu-open');
    setBackgroundInert(false);
    if (restoreFocus) trigger.focus();
  }

  trigger.addEventListener('click', () => {
    if (trigger.getAttribute('aria-expanded') === 'true') closeMenu();
    else openMenu();
  });
  closeButton?.addEventListener('click', () => closeMenu());
  overlay.addEventListener('click', () => closeMenu());

  drawer.addEventListener('click', (event) => {
    const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
    if (link) closeMenu({ restoreFocus: false });
  });

  document.addEventListener('keydown', (event) => {
    if (trigger.getAttribute('aria-expanded') !== 'true') return;
    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu();
      return;
    }
    if (event.key !== 'Tab') return;
    const items = focusables();
    if (items.length === 0) return;
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
