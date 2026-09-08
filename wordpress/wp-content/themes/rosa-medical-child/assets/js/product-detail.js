(() => {
  'use strict';

  const mainImage = document.querySelector('[data-rosa-product-main-image]');
  const thumbnails = Array.from(document.querySelectorAll('[data-rosa-product-thumb]'));

  thumbnails.forEach((button) => {
    if (!(button instanceof HTMLButtonElement)) return;
    button.addEventListener('click', () => {
      if (mainImage instanceof HTMLImageElement) {
        const src = button.dataset.fullSrc || '';
        const srcset = button.dataset.fullSrcset || '';
        const alt = button.dataset.alt || '';
        if (src) mainImage.src = src;
        if (srcset) mainImage.srcset = srcset;
        else mainImage.removeAttribute('srcset');
        mainImage.alt = alt;
      }

      thumbnails.forEach((candidate) => {
        const active = candidate === button;
        candidate.classList.toggle('is-active', active);
        candidate.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
    });
  });

  document.querySelectorAll('.rosa-product-detail__tabs a[href^="#"]').forEach((link) => {
    if (!(link instanceof HTMLAnchorElement)) return;
    link.addEventListener('click', (event) => {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!(target instanceof HTMLElement)) return;
      event.preventDefault();
      document.querySelectorAll('.rosa-product-detail__tabs a').forEach((candidate) => {
        candidate.classList.toggle('is-active', candidate === link);
      });
      target.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start',
      });
      if (history.replaceState) history.replaceState(null, '', id);
    });
  });

  document.querySelectorAll('[data-rosa-quote-configuration]').forEach((select) => {
    if (!(select instanceof HTMLSelectElement)) return;
    const sync = () => {
      const container = select.closest('[data-rosa-quote-item]');
      const button = container?.querySelector('[data-rosa-add-to-quote]');
      const option = select.selectedOptions[0];
      if (!(button instanceof HTMLButtonElement) || !(option instanceof HTMLOptionElement)) return;
      button.dataset.variationId = option.dataset.variationId || '0';
      button.dataset.sku = option.dataset.sku || '';
    };
    sync();
    select.addEventListener('change', sync);
  });
})();
