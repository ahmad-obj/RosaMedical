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
        pending: 'جارٍ تجهيز طلب عرض السعر والتحقق من الأدوات المحددة…',
        emailSent: 'تم إرسال البريد الإلكتروني. تم إفراغ قائمة طلب عرض السعر ويمكنك بدء طلب جديد.',
        emailUnconfirmed: 'تم تجهيز الطلب، لكن تعذر تأكيد إرسال البريد الإلكتروني. افتح رسالة واتساب المجهزة لإكمال التسليم.',
        whatsappOpened: 'تم فتح رسالة واتساب المجهزة. تم إفراغ قائمة الطلب، ولم يتم تأكيد التسليم أو الاستلام عبر واتساب.',
        confirmationEmail: 'تم إرسال طلب عرض السعر عبر البريد الإلكتروني. تم إفراغ قائمة الطلب ويمكنك بدء طلب جديد.',
        confirmationWhatsapp: 'تم فتح رسالة واتساب المجهزة لطلب عرض السعر. تم إفراغ القائمة، وهذا لا يؤكد تسليم رسالة واتساب أو استلامها.',
        failed: 'تعذر تجهيز طلب عرض السعر. تحقق من البيانات وحاول مرة أخرى.',
        empty: 'أضف أداة واحدة على الأقل قبل تجهيز طلب عرض السعر.',
      }
    : {
        sku: 'SKU',
        configuration: 'Configuration',
        quantity: 'Quantity',
        remove: 'Remove',
        pending: 'Preparing your quote request and validating selected instruments…',
        emailSent: 'Email sent. Your quote basket has been cleared and is ready for a new request.',
        emailUnconfirmed: 'Request prepared, but email delivery could not be confirmed. Open the prepared WhatsApp message to complete the handoff.',
        whatsappOpened: 'Prepared WhatsApp message opened. Your quote basket was cleared; WhatsApp delivery or receipt has not been confirmed.',
        confirmationEmail: 'Your quote request was sent by email. The quotation basket is cleared and ready for a new request.',
        confirmationWhatsapp: 'Your prepared WhatsApp quote message was opened. The basket is cleared; this does not confirm WhatsApp delivery or receipt.',
        failed: 'The quote request could not be prepared. Check your details and try again.',
        empty: 'Add at least one instrument before preparing your quote request.',
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
  const status = surface.querySelector('[data-rosa-quote-submit-status]');
  const whatsappLink = surface.querySelector('[data-rosa-quote-whatsapp-link]');
  const confirmation = surface.querySelector('[data-rosa-quote-confirmation]');
  const submitButton = surface.querySelector('[data-rosa-quote-request-submit]');
  let whatsappAwaitingActivation = false;

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

  const setStatus = (message) => {
    if (status instanceof HTMLElement) status.textContent = message;
  };

  const hideConfirmation = () => {
    if (!(confirmation instanceof HTMLElement)) return;
    confirmation.hidden = true;
    confirmation.removeAttribute('data-rosa-quote-confirmation-channel');
  };

  const showConfirmation = (channel) => {
    if (!(confirmation instanceof HTMLElement)) return;
    confirmation.textContent = channel === 'email' ? copy.confirmationEmail : copy.confirmationWhatsapp;
    confirmation.setAttribute('data-rosa-quote-confirmation-channel', channel);
    confirmation.hidden = false;
  };

  const clearCompletedHandoff = (channel) => {
    if (typeof basket.clear !== 'function') return;
    basket.clear();
    showConfirmation(channel);
  };

  const hideWhatsapp = () => {
    whatsappAwaitingActivation = false;
    if (!(whatsappLink instanceof HTMLAnchorElement)) return;
    whatsappLink.hidden = true;
    whatsappLink.removeAttribute('href');
  };

  if (whatsappLink instanceof HTMLAnchorElement) {
    whatsappLink.addEventListener('click', () => {
      if (!whatsappAwaitingActivation) return;
      whatsappAwaitingActivation = false;
      clearCompletedHandoff('whatsapp');
      setStatus(copy.whatsappOpened);
    });
  }

  if (form instanceof HTMLFormElement) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const endpoint = (form.dataset.rosaQuoteSubmitEndpoint || '').trim();
      const nonce = (form.querySelector('input[name="rosa_quote_nonce"]')?.value || '').trim();
      const state = basket.getState();
      hideWhatsapp();
      hideConfirmation();

      if (endpoint === '' || nonce === '' || state.items.length === 0) {
        setStatus(state.items.length === 0 ? copy.empty : copy.failed);
        return;
      }

      const fieldValue = (name) => {
        const control = form.elements.namedItem(name);
        return control instanceof HTMLInputElement || control instanceof HTMLTextAreaElement
          ? control.value
          : '';
      };

      const payload = {
        locale: isArabic ? 'ar' : 'en',
        nonce,
        customer: {
          name: fieldValue('name'),
          email: fieldValue('email'),
          phone: fieldValue('phone'),
          institution: fieldValue('institution'),
          location: fieldValue('location'),
          notes: fieldValue('notes'),
        },
        items: state.items.map((item) => ({
          productId: item.productId,
          variationId: item.variationId,
          sku: item.sku,
          quantity: item.quantity,
        })),
        website: fieldValue('website'),
      };

      if (submitButton instanceof HTMLButtonElement) submitButton.disabled = true;
      setStatus(copy.pending);

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
        const result = await response.json().catch(() => null);

        if (!response.ok || !result || result.accepted !== true) {
          setStatus(copy.failed);
          return;
        }

        const prepared = result.whatsapp?.prepared === true && typeof result.whatsapp?.url === 'string';
        if (prepared && whatsappLink instanceof HTMLAnchorElement) {
          whatsappLink.href = result.whatsapp.url;
          whatsappLink.hidden = false;
        }

        if (result.email?.sent === true) {
          whatsappAwaitingActivation = false;
          clearCompletedHandoff('email');
          setStatus(copy.emailSent);
          return;
        }

        whatsappAwaitingActivation = prepared;
        setStatus(copy.emailUnconfirmed);
      } catch {
        setStatus(copy.failed);
      } finally {
        if (submitButton instanceof HTMLButtonElement) submitButton.disabled = false;
      }
    });
  }

  window.addEventListener('rosa:quote-basket-change', render);
  render();
})();