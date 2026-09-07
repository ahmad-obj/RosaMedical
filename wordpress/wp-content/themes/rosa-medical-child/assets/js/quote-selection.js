(() => {
  'use strict';

  const basket = window.RosaQuoteBasket;
  if (!basket || typeof basket.add !== 'function' || typeof basket.getState !== 'function') return;

  const isArabic = (document.documentElement.lang || '').toLowerCase().startsWith('ar')
    || document.documentElement.dir === 'rtl';
  const copy = isArabic
    ? {
        quantity: 'الكمية',
        add: 'أضف إلى طلب عرض السعر',
        added: 'تمت إضافة العنصر إلى طلب عرض السعر.',
        review: 'مراجعة طلب عرض السعر',
        drawerTitle: 'مراجعة العناصر المحددة',
        close: 'إغلاق مراجعة طلب عرض السعر',
        remove: 'إزالة',
        empty: 'طلب عرض السعر فارغ. أضف أدوات من الكتالوج للبدء.',
        sku: 'SKU',
        configuration: 'التكوين',
      }
    : {
        quantity: 'Quantity',
        add: 'Add to Quote',
        added: 'Added to your quote request.',
        review: 'Review quote request',
        drawerTitle: 'Review selected quote items',
        close: 'Close quote review',
        remove: 'Remove',
        empty: 'Your quote request is empty. Add catalogue items to begin.',
        sku: 'SKU',
        configuration: 'Configuration',
      };

  const identityKey = (item) => `${Number(item.productId) || 0}:${Number(item.variationId) || 0}:${String(item.sku || '').trim()}`;
  const metadata = new Map();

  const totalQuantity = () => basket.getState().items.reduce(
    (total, item) => total + (Number.isInteger(item.quantity) ? item.quantity : 0),
    0,
  );

  const productIdFromBody = () => {
    for (const className of document.body.classList) {
      const match = /^postid-(\d+)$/.exec(className);
      if (match) return Number(match[1]);
    }
    return 0;
  };

  const rememberMetadata = (item, title, configuration) => {
    if (!item || !item.sku) return;
    metadata.set(identityKey(item), {
      title: String(title || '').trim(),
      configuration: String(configuration || '').trim(),
    });
  };

  const collectPageMetadata = () => {
    document.querySelectorAll('.rosa-preview-product:not(.rosa-preview-product--family)').forEach((card) => {
      if (!(card instanceof HTMLElement)) return;
      const button = card.querySelector('[data-rosa-add-to-quote]');
      if (!(button instanceof HTMLButtonElement)) return;
      const productId = Number(button.dataset.productId || '0');
      const title = (card.querySelector('h3')?.textContent || '').trim();
      const selector = card.querySelector('[data-rosa-quote-configuration]');

      if (selector instanceof HTMLSelectElement) {
        Array.from(selector.options).forEach((option) => {
          const variationId = Number(option.dataset.variationId || '0');
          const sku = (option.dataset.sku || '').trim();
          if (productId > 0 && variationId > 0 && sku !== '') {
            rememberMetadata({ productId, variationId, sku }, title, option.textContent || sku);
          }
        });
        return;
      }

      const variationId = Number(button.dataset.variationId || '0');
      const sku = (button.dataset.sku || '').trim();
      if (productId > 0 && sku !== '') {
        rememberMetadata({ productId, variationId, sku }, title, sku);
      }
    });

    const productId = productIdFromBody();
    const productTitle = (document.querySelector('.rosa-product-detail__summary h1')?.textContent || '').trim();
    if (productId <= 0 || productTitle === '') return;

    document.querySelectorAll('.rosa-product-detail__configuration[data-variation-id]').forEach((row) => {
      if (!(row instanceof HTMLElement)) return;
      const variationId = Number(row.dataset.variationId || '0');
      const sku = (row.querySelector('[data-rosa-add-to-quote]')?.getAttribute('data-sku')
        || row.querySelector('dl dd')?.textContent
        || '').trim();
      if (variationId <= 0 || sku === '') return;

      const heading = (row.querySelector('h3')?.textContent || '').trim();
      const details = Array.from(row.querySelectorAll('dl > div')).map((entry) => {
        const term = (entry.querySelector('dt')?.textContent || '').trim();
        const value = (entry.querySelector('dd')?.textContent || '').trim();
        return term && value ? `${term}: ${value}` : value;
      }).filter(Boolean);
      const configuration = [heading, ...details].filter(Boolean).join(' · ') || sku;
      rememberMetadata({ productId, variationId, sku }, productTitle, configuration);
    });
  };

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

  const ensureReviewShell = () => {
    let trigger = document.querySelector('[data-rosa-quote-review-trigger]');
    let drawer = document.querySelector('[data-rosa-quote-drawer]');
    let backdrop = document.querySelector('[data-rosa-quote-drawer-backdrop]');

    if (!(trigger instanceof HTMLButtonElement)) {
      trigger = document.createElement('button');
      trigger.type = 'button';
      trigger.className = 'rosa-preview-quote-review-trigger';
      trigger.setAttribute('data-rosa-quote-review-trigger', '');
      trigger.setAttribute('aria-controls', 'rosa-quote-review-drawer');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.setAttribute('aria-label', copy.review);
      trigger.innerHTML = `<span class="rosa-preview-quote-review-trigger__label">${copy.review}</span><span class="rosa-preview-quote-review-trigger__count" data-rosa-quote-review-count aria-hidden="true">0</span>`;
      document.body.append(trigger);
    }

    if (!(backdrop instanceof HTMLElement)) {
      backdrop = document.createElement('div');
      backdrop.className = 'rosa-preview-quote-drawer-backdrop';
      backdrop.setAttribute('data-rosa-quote-drawer-backdrop', '');
      backdrop.hidden = true;
      document.body.append(backdrop);
    }

    if (!(drawer instanceof HTMLElement)) {
      drawer = document.createElement('section');
      drawer.id = 'rosa-quote-review-drawer';
      drawer.className = 'rosa-preview-quote-drawer';
      drawer.setAttribute('data-rosa-quote-drawer', '');
      drawer.setAttribute('role', 'dialog');
      drawer.setAttribute('aria-modal', 'true');
      drawer.setAttribute('aria-labelledby', 'rosa-quote-review-title');
      drawer.hidden = true;
      drawer.innerHTML = `
        <div class="rosa-preview-quote-drawer__header">
          <div>
            <p class="rosa-preview-quote-drawer__eyebrow">ROSA</p>
            <h2 id="rosa-quote-review-title" data-rosa-quote-drawer-title>${copy.drawerTitle}</h2>
          </div>
          <button type="button" class="rosa-preview-quote-drawer__close" data-rosa-quote-drawer-close aria-label="${copy.close}"><span aria-hidden="true">×</span></button>
        </div>
        <div class="rosa-preview-quote-drawer__body">
          <div class="rosa-preview-quote-drawer__items" data-rosa-quote-drawer-items></div>
          <p class="rosa-preview-quote-drawer__empty" data-rosa-quote-drawer-empty>${copy.empty}</p>
        </div>`;
      document.body.append(drawer);
    }

    return { trigger, drawer, backdrop };
  };

  const countIndicator = ensureCountIndicator();
  const feedback = ensureFeedback();
  const reviewShell = ensureReviewShell();
  const { trigger: reviewTrigger, drawer, backdrop } = reviewShell;
  const reviewCount = reviewTrigger.querySelector('[data-rosa-quote-review-count]');
  const drawerItems = drawer.querySelector('[data-rosa-quote-drawer-items]');
  const drawerEmpty = drawer.querySelector('[data-rosa-quote-drawer-empty]');
  let feedbackTimer = null;

  const renderDrawer = () => {
    if (!(drawerItems instanceof HTMLElement) || !(drawerEmpty instanceof HTMLElement)) return;
    collectPageMetadata();
    const state = basket.getState();
    drawerItems.replaceChildren();
    drawerEmpty.hidden = state.items.length > 0;

    state.items.forEach((item) => {
      const details = metadata.get(identityKey(item)) || {};
      const title = details.title || item.sku;
      const configuration = details.configuration || `${copy.configuration}: ${item.sku}`;

      const article = document.createElement('article');
      article.className = 'rosa-preview-quote-drawer__item';
      article.setAttribute('data-rosa-quote-drawer-item', '');
      article.setAttribute('data-sku', item.sku);
      article.dataset.productId = String(item.productId);
      article.dataset.variationId = String(item.variationId);
      article.innerHTML = `
        <div class="rosa-preview-quote-drawer__item-copy">
          <h3 data-rosa-quote-item-title></h3>
          <p data-rosa-quote-item-sku></p>
          <p data-rosa-quote-item-configuration></p>
        </div>
        <div class="rosa-preview-quote-drawer__item-actions">
          <label class="screen-reader-text"></label>
          <input type="number" min="1" step="1" inputmode="numeric" data-rosa-quote-drawer-quantity>
          <button type="button" data-rosa-quote-remove>${copy.remove}</button>
        </div>`;

      const titleNode = article.querySelector('[data-rosa-quote-item-title]');
      const skuNode = article.querySelector('[data-rosa-quote-item-sku]');
      const configurationNode = article.querySelector('[data-rosa-quote-item-configuration]');
      const quantity = article.querySelector('[data-rosa-quote-drawer-quantity]');
      const quantityLabel = article.querySelector('label');
      const remove = article.querySelector('[data-rosa-quote-remove]');

      if (titleNode) titleNode.textContent = title;
      if (skuNode) skuNode.textContent = `${copy.sku}: ${item.sku}`;
      if (configurationNode) configurationNode.textContent = configuration;
      if (quantity instanceof HTMLInputElement) {
        const inputId = `rosa-quote-drawer-quantity-${item.productId}-${item.variationId}`;
        quantity.id = inputId;
        quantity.value = String(item.quantity);
        quantity.setAttribute('aria-label', `${copy.quantity}: ${title}`);
        if (quantityLabel instanceof HTMLLabelElement) {
          quantityLabel.htmlFor = inputId;
          quantityLabel.textContent = `${copy.quantity}: ${title}`;
        }
      }
      if (remove instanceof HTMLButtonElement) {
        remove.setAttribute('aria-label', `${copy.remove}: ${title}`);
      }

      drawerItems.append(article);
    });
  };

  const syncCounts = () => {
    const count = totalQuantity();
    countIndicator.textContent = String(count);
    countIndicator.setAttribute('aria-label', isArabic ? `عدد عناصر طلب عرض السعر: ${count}` : `Quote request item count: ${count}`);
    if (reviewCount instanceof HTMLElement) reviewCount.textContent = String(count);
    reviewTrigger.setAttribute('aria-label', `${copy.review}: ${count}`);
  };

  const syncReviewUi = () => {
    syncCounts();
    renderDrawer();
  };

  const showFeedback = () => {
    feedback.textContent = copy.added;
    feedback.hidden = false;
    if (feedbackTimer !== null) window.clearTimeout(feedbackTimer);
    feedbackTimer = window.setTimeout(() => {
      feedback.hidden = true;
    }, 4000);
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
    let configuration = sku;

    const selector = container.querySelector('[data-rosa-quote-configuration]');
    if (selector instanceof HTMLSelectElement) {
      const option = selector.selectedOptions[0];
      variationId = Number(option?.dataset.variationId || '0');
      sku = (option?.dataset.sku || '').trim();
      configuration = (option?.textContent || sku).trim();
    }

    if (!Number.isInteger(productId) || productId <= 0) return null;
    if (!Number.isInteger(variationId) || variationId < 0) return null;
    if (sku === '') return null;
    if (!Number.isInteger(quantity) || quantity <= 0) return null;

    const cardTitle = (container.closest('.rosa-preview-product')?.querySelector('h3')?.textContent || '').trim();
    const productTitle = (document.querySelector('.rosa-product-detail__summary h1')?.textContent || '').trim();
    const title = cardTitle || productTitle || sku;
    return { item: { productId, variationId, sku, quantity }, title, configuration };
  };

  const closeDrawer = () => {
    if (drawer.hidden) return;
    drawer.hidden = true;
    backdrop.hidden = true;
    reviewTrigger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('rosa-quote-drawer-open');
    reviewTrigger.focus();
  };

  const openDrawer = () => {
    renderDrawer();
    drawer.hidden = false;
    backdrop.hidden = false;
    reviewTrigger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('rosa-quote-drawer-open');
    const close = drawer.querySelector('[data-rosa-quote-drawer-close]');
    if (close instanceof HTMLElement) close.focus();
  };

  const focusableInDrawer = () => Array.from(drawer.querySelectorAll(
    'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
  )).filter((node) => node instanceof HTMLElement && !node.hidden && node.getClientRects().length > 0);

  enhanceProductDetailConfigurations();
  collectPageMetadata();
  syncReviewUi();

  window.addEventListener('rosa:quote-basket-change', syncReviewUi);

  reviewTrigger.addEventListener('click', openDrawer);
  backdrop.addEventListener('click', closeDrawer);

  drawer.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    if (event.target.closest('[data-rosa-quote-drawer-close]')) {
      closeDrawer();
      return;
    }

    const remove = event.target.closest('[data-rosa-quote-remove]');
    if (!(remove instanceof HTMLButtonElement)) return;
    const line = remove.closest('[data-rosa-quote-drawer-item]');
    if (!(line instanceof HTMLElement)) return;
    basket.remove({
      productId: Number(line.dataset.productId || '0'),
      variationId: Number(line.dataset.variationId || '0'),
      sku: line.dataset.sku || '',
    });
  });

  drawer.addEventListener('change', (event) => {
    if (!(event.target instanceof HTMLInputElement) || !event.target.matches('[data-rosa-quote-drawer-quantity]')) return;
    const line = event.target.closest('[data-rosa-quote-drawer-item]');
    if (!(line instanceof HTMLElement)) return;
    const nextQuantity = Number(event.target.value);
    if (!Number.isInteger(nextQuantity) || nextQuantity <= 0) {
      renderDrawer();
      return;
    }
    basket.setQuantity({
      productId: Number(line.dataset.productId || '0'),
      variationId: Number(line.dataset.variationId || '0'),
      sku: line.dataset.sku || '',
    }, nextQuantity);
  });

  document.addEventListener('keydown', (event) => {
    if (drawer.hidden) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      closeDrawer();
      return;
    }
    if (event.key !== 'Tab') return;

    const focusable = focusableInDrawer();
    if (focusable.length === 0) {
      event.preventDefault();
      drawer.focus();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest('[data-rosa-add-to-quote]');
    if (!(button instanceof HTMLButtonElement)) return;

    const selection = selectedIdentity(button);
    if (!selection) return;

    rememberMetadata(selection.item, selection.title, selection.configuration);
    basket.add(selection.item);
    syncReviewUi();
    showFeedback();
  });
})();
