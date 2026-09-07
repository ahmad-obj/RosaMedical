(() => {
  'use strict';

  const surface = document.querySelector('[data-rosa-quote-request-page]');
  const basket = window.RosaQuoteBasket;
  if (!(surface instanceof HTMLElement) || !basket || typeof basket.getState !== 'function') return;

  const isArabic = surface.dataset.rosaQuoteRequestLocale === 'ar'
    || document.documentElement.dir === 'rtl';
  const copy = isArabic
    ? {
        sku: 'رمز SKU',
        configuration: 'التكوين',
        quantity: 'الكمية',
        remove: 'إزالة',
      }
    : {
        sku: 'SKU',
        configuration: 'Configuration',
        quantity: 'Quantity',
        remove: 'Remove',
      };

  const identityKey = (item) => `${Number(item.productId) || 0}:${Number(item.variationId) || 0}:${String(item.sku || '').trim()}`;
  const catalog = new Map();
  const catalogNode = surface.querySelector('[data-rosa-quote-request-catalog]');

  if (catalogNode) {
    try {
      const parsed = JSON.parse(catalogNode.textContent || '[]');
      if (Array.isArray(parsed)) {
        parsed.forEach((entry) => {
          if (!entry || typeof entry !== 'object') return;
          const productId = Number(entry.productId);
          const variationId = Number(entry.variationId || 0);
          const sku = String(entry.sku || '').trim();
          if (!Number.isInteger(productId) || productId <= 0 || !Number.isInteger(variationId) || variationId < 0 || sku === '') return;
          catalog.set(identityKey({ productId, variationId, sku }), {
            title: String(entry.title || sku).trim() || sku,
            configuration: String(entry.configuration || sku).trim() || sku,
          });
        });
      }
    } catch {
      // Keep the request page usable with identity-only fallbacks.
    }
  }

  const itemsRoot = surface.querySelector('[data-rosa-quote-request-items]');
  const emptyState = surface.querySelector('[data-rosa-quote-request-empty]');
  const form = surface.querySelector('[data-rosa-quote-request-form]');

  const render = () => {
    if (!(itemsRoot instanceof HTMLElement) || !(emptyState instanceof HTMLElement)) return;

    const state = basket.getState();
    itemsRoot.replaceChildren();
    emptyState.hidden = state.items.length > 0;

    state.items.forEach((item) => {
      const details = catalog.get(identityKey(item)) || {
        title: item.sku,
        configuration: item.sku,
      };

      const article = document.createElement('article');
      article.className = 'rosa-quote-request-item';
      article.setAttribute('data-rosa-quote-request-item', '');
      article.dataset.productId = String(item.productId);
      article.dataset.variationId = String(item.variationId);
      article.dataset.sku = item.sku;
      article.innerHTML = `
        <div class="rosa-quote-request-item__copy">
          <h3 data-rosa-quote-request-item-title></h3>
          <p data-rosa-quote-request-item-sku></p>
          <p data-rosa-quote-request-item-configuration></p>
        </div>
        <div class="rosa-quote-request-item__actions">
          <label class="screen-reader-text"></label>
          <input type="number" min="1" step="1" inputmode="numeric" data-rosa-quote-request-quantity>
          <button type="button" data-rosa-quote-request-remove></button>
        </div>`;

      const title = article.querySelector('[data-rosa-quote-request-item-title]');
      const sku = article.querySelector('[data-rosa-quote-request-item-sku]');
      const configuration = article.querySelector('[data-rosa-quote-request-item-configuration]');
      const quantity = article.querySelector('[data-rosa-quote-request-quantity]');
      const quantityLabel = article.querySelector('label');
      const remove = article.querySelector('[data-rosa-quote-request-remove]');

      if (title) title.textContent = details.title;
      if (sku) sku.textContent = `${copy.sku}: ${item.sku}`;
      if (configuration) configuration.textContent = `${copy.configuration}: ${details.configuration}`;

      if (quantity instanceof HTMLInputElement) {
        const id = `rosa-quote-request-quantity-${item.productId}-${item.variationId}`;
        quantity.id = id;
        quantity.value = String(item.quantity);
        quantity.setAttribute('aria-label', `${copy.quantity}: ${details.title}`);
        if (quantityLabel instanceof HTMLLabelElement) {
          quantityLabel.htmlFor = id;
          quantityLabel.textContent = `${copy.quantity}: ${details.title}`;
        }
      }

      if (remove instanceof HTMLButtonElement) {
        remove.textContent = copy.remove;
        remove.setAttribute('aria-label', `${copy.remove}: ${details.title}`);
      }

      itemsRoot.append(article);
    });
  };

  const identityFromLine = (line) => ({
    productId: Number(line.dataset.productId || '0'),
    variationId: Number(line.dataset.variationId || '0'),
    sku: String(line.dataset.sku || '').trim(),
  });

  surface.addEventListener('change', (event) => {
    if (!(event.target instanceof HTMLInputElement) || !event.target.matches('[data-rosa-quote-request-quantity]')) return;
    const line = event.target.closest('[data-rosa-quote-request-item]');
    if (!(line instanceof HTMLElement)) return;

    const quantity = Number(event.target.value);
    if (!Number.isInteger(quantity) || quantity <= 0) {
      render();
      return;
    }

    basket.setQuantity(identityFromLine(line), quantity);
  });

  surface.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    const remove = event.target.closest('[data-rosa-quote-request-remove]');
    if (!(remove instanceof HTMLButtonElement)) return;

    const line = remove.closest('[data-rosa-quote-request-item]');
    if (!(line instanceof HTMLElement)) return;
    basket.remove(identityFromLine(line));
  });

  if (form instanceof HTMLFormElement) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
    });
  }

  window.addEventListener('rosa:quote-basket-change', render);
  render();
})();
