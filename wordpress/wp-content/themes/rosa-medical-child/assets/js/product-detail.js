(() => {
  const root = document.querySelector('[data-rosa-product-detail]');
  if (!(root instanceof HTMLElement)) return;

  const inquiryCapable = root.dataset.inquiryEnabled === '1';
  const inquiryActions = Array.from(root.querySelectorAll('[data-rosa-inquiry-action]'));
  const sticky = root.querySelector('[data-rosa-sticky-inquiry]');

  const setValidConfiguration = (valid) => {
    root.dataset.stickyAction = inquiryCapable && valid ? 'true' : 'false';
    inquiryActions.forEach((button) => {
      if (button instanceof HTMLButtonElement) button.disabled = !(inquiryCapable && valid);
    });
    if (sticky instanceof HTMLElement) sticky.hidden = !(inquiryCapable && valid);
  };

  root.addEventListener('change', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const input = target.closest('[data-rosa-configuration]');
    if (!(input instanceof HTMLInputElement)) return;

    const sku = root.querySelector('[data-rosa-selected-sku]');
    if (sku) sku.textContent = input.dataset.sku || '';

    let attributes = {};
    try {
      attributes = JSON.parse(input.dataset.rosaAttributes || '{}');
    } catch {
      attributes = {};
    }

    root.querySelectorAll('[data-rosa-selected-attribute]').forEach((node) => {
      if (!(node instanceof HTMLElement)) return;
      const key = node.dataset.rosaSelectedAttribute;
      node.textContent = key && typeof attributes[key] === 'string' ? attributes[key] : '';
    });

    setValidConfiguration(true);
  });
})();
