(() => {
  'use strict';

  const basket = window.RosaQuoteBasket;
  if (!basket || typeof basket.add !== 'function' || typeof basket.getState !== 'function') return;

  const isArabic = (document.documentElement.lang || '').toLowerCase().startsWith('ar')
    || document.documentElement.dir === 'rtl';
  const copy = isArabic
    ? {
        count: 'طلب السعر',
        quantity: 'الكمية',
        add: 'أضف إلى طلب عرض السعر',
        added: 'تمت إضافة العنصر إلى طلب عرض السعر.',
      }
    : {
        count: 'Quote',
        quantity: 'Quantity',
        add: 'Add to Quote',
        added: 'Added to your quote request.',
      };

  const totalQuantity = () => basket.getState().items.reduce(
    (total, item) => total + (Number.isInteger(item.quantity) ? item.quantity : 0),
    0,
  );

  const ensureCountIndicator = () => {
    const existing = document.querySelector('[data-rosa-quote-count]');
    if (existing instanceof HTMLElement) return existing;

    const indicator = document.createElement('span');
    indicator.className = 'rosa-preview-quote-count';
    indicator.setAttribute('data-rosa-quote-count', '');
    indicator.setAttribute('aria-label', isArabic ? 'عدد عناصر طلب عرض السعر' : 'Quote request item count');

    const actions = document.querySelector('.rosa-preview-header__actions');
    if (actions instanceof HTMLElement) {
      actions.prepend(indicator);
    } else {
      document.body.prepend(indicator);
    }

    return indicator;
  };

  const ensureFeedback = () => {
    const existing = document.querySelector('[data-rosa-quote-feedback]');
    if (existing instanceof HTMLElement) return existing;

    const feedback = document.createElement('div');
    feedback.className = 'rosa-preview-quote-feedback';
    feedback.setAttribute('data-rosa-quote-feedback', '');
    feedback.setAttribute('role', 'status');
    feedback.setAttribute('aria-live', 'polite');
    feedback.setAttribute('aria-atomic', 'true');
    feedback.hidden = true;
    document.body.append(feedback);
    return feedback;
  };

  const countIndicator = ensureCountIndicator();
  const feedback = ensureFeedback();
  let feedbackTimer = null;

  const syncCount = () => {
    countIndicator.textContent = `${copy.count} ${totalQuantity()}`;
  };

  const showFeedback = () => {
    feedback.textContent = copy.added;
    feedback.hidden = false;
    if (feedbackTimer !== null) window.clearTimeout(feedbackTimer);
    feedbackTimer = window.setTimeout(() => {
      feedback.hidden = true;
    }, 4000);
  };

  const productIdFromBody = () => {
    for (const className of document.body.classList) {
      const match = /^postid-(\d+)$/.exec(className);
      if (match) return Number(match[1]);
    }
    return 0;
  };

  const enhanceProductDetailConfigurations = () => {
    const productId = productIdFromBody();
    if (!Number.isInteger(productId) || productId <= 0) return;

    document.querySelectorAll('.rosa-product-detail__configuration[data-variation-id]').forEach((configuration) => {
      if (!(configuration instanceof HTMLElement)) return;
      if (configuration.querySelector('[data-rosa-add-to-quote]')) return;

      const variationId = Number(configuration.dataset.variationId || '0');
      const sku = (configuration.querySelector('dl dd')?.textContent || '').trim();
      if (!Number.isInteger(variationId) || variationId <= 0 || sku === '') return;

      const controls = document.createElement('div');
      controls.className = 'rosa-product-detail__quote-controls';
      controls.setAttribute('data-rosa-quote-item', '');

      const label = document.createElement('label');
      label.className = 'screen-reader-text';
      const inputId = `rosa-product-quote-quantity-${variationId}`;
      label.htmlFor = inputId;
      label.textContent = copy.quantity;

      const quantity = document.createElement('input');
      quantity.id = inputId;
      quantity.type = 'number';
      quantity.min = '1';
      quantity.step = '1';
      quantity.value = '1';
      quantity.inputMode = 'numeric';
      quantity.setAttribute('data-rosa-quote-quantity', '');
      quantity.setAttribute('aria-label', copy.quantity);

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'rosa-preview-button rosa-preview-button--accent';
      button.setAttribute('data-rosa-add-to-quote', '');
      button.dataset.productId = String(productId);
      button.dataset.variationId = String(variationId);
      button.dataset.sku = sku;
      button.textContent = copy.add;

      controls.append(label, quantity, button);
      configuration.append(controls);
    });
  };

  const selectedIdentity = (button) => {
    const container = button.closest('[data-rosa-quote-item]');
    if (!(container instanceof HTMLElement)) return null;

    const productId = Number(button.dataset.productId || '0');
    const quantityInput = container.querySelector('input[data-rosa-quote-quantity]');
    const quantity = Number(quantityInput?.value || '1');
    let variationId = Number(button.dataset.variationId || '0');
    let sku = (button.dataset.sku || '').trim();

    const selector = container.querySelector('[data-rosa-quote-configuration]');
    if (selector instanceof HTMLSelectElement) {
      const option = selector.selectedOptions[0];
      variationId = Number(option?.dataset.variationId || '0');
      sku = (option?.dataset.sku || '').trim();
    }

    if (!Number.isInteger(productId) || productId <= 0) return null;
    if (!Number.isInteger(variationId) || variationId < 0) return null;
    if (sku === '') return null;
    if (!Number.isInteger(quantity) || quantity <= 0) return null;

    return { productId, variationId, sku, quantity };
  };

  enhanceProductDetailConfigurations();
  syncCount();

  window.addEventListener('rosa:quote-basket-change', syncCount);

  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest('[data-rosa-add-to-quote]');
    if (!(button instanceof HTMLButtonElement)) return;

    const item = selectedIdentity(button);
    if (!item) return;

    basket.add(item);
    syncCount();
    showFeedback();
  });
})();
