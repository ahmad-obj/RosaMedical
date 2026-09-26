/**
 * Rosa Medical - Shop Filters, Autocomplete & Steppers
 */
(() => {
  'use strict';

  // ==========================================================================
  // Quantity Stepper Click Handlers
  // ==========================================================================
  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const plusBtn = target.closest('[data-rosa-qty-plus]');
    if (plusBtn) {
      const stepper = plusBtn.closest('.rosa-qty-stepper');
      const input = stepper?.querySelector('input[data-rosa-quote-quantity]');
      if (input instanceof HTMLInputElement) {
        const current = parseInt(input.value, 10) || 1;
        input.value = String(current + 1);
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
      return;
    }

    const minusBtn = target.closest('[data-rosa-qty-minus]');
    if (minusBtn) {
      const stepper = minusBtn.closest('.rosa-qty-stepper');
      const input = stepper?.querySelector('input[data-rosa-quote-quantity]');
      if (input instanceof HTMLInputElement) {
        const current = parseInt(input.value, 10) || 1;
        if (current > 1) {
          input.value = String(current - 1);
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
      return;
    }
  });

  document.addEventListener('change', (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement && target.matches('input[data-rosa-quote-quantity]')) {
      let val = parseInt(target.value, 10);
      if (isNaN(val) || val < 1) {
        target.value = '1';
      } else {
        target.value = String(val);
      }
    }
  });
})();
