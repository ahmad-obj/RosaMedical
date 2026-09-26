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

  // ==========================================================================
  // Live Search Autocomplete Dropdown
  // ==========================================================================
  const searchInput = document.querySelector('input#rosa-live-shop-search');
  if (searchInput instanceof HTMLInputElement) {
    const isArabic = (document.documentElement.lang || '').toLowerCase().startsWith('ar') || document.documentElement.dir === 'rtl';
    const form = searchInput.closest('form');
    
    // Ensure container is relative for absolute positioning of dropdown
    if (form instanceof HTMLElement) {
      form.style.position = 'relative';
    }

    let dropdown = document.querySelector('.rosa-search-autocomplete');
    if (!dropdown) {
      dropdown = document.createElement('div');
      dropdown.className = 'rosa-search-autocomplete';
      dropdown.hidden = true;
      dropdown.setAttribute('role', 'listbox');
      dropdown.setAttribute('aria-label', isArabic ? 'اقتراحات البحث' : 'Search suggestions');
      searchInput.parentElement?.appendChild(dropdown);
    }

    let debounceTimer = null;
    let activeIndex = -1;
    let currentResults = [];

    const closeDropdown = () => {
      if (dropdown) dropdown.hidden = true;
      activeIndex = -1;
      currentResults = [];
    };

    const renderResults = (items, query) => {
      currentResults = items;
      activeIndex = -1;
      if (!dropdown) return;

      if (!items || items.length === 0) {
        dropdown.innerHTML = `
          <div class="rosa-search-autocomplete__empty">
            ${isArabic ? `لم يتم العثور على أدوات تطابق "${query}"` : `No instruments found matching "${query}"`}
          </div>`;
        dropdown.hidden = false;
        return;
      }

      const itemsHtml = items.map((item, idx) => `
        <a href="${item.url}" class="rosa-search-autocomplete__item" role="option" data-index="${idx}">
          <div class="rosa-search-autocomplete__thumb">
            ${item.thumbnail ? `<img src="${item.thumbnail}" alt="" loading="lazy">` : `<span class="rosa-search-autocomplete__no-thumb">🩺</span>`}
          </div>
          <div class="rosa-search-autocomplete__info">
            <span class="rosa-search-autocomplete__title">${item.name}</span>
            <div class="rosa-search-autocomplete__meta">
              ${item.family ? `<span class="rosa-search-autocomplete__family">${item.family}</span>` : ''}
              ${item.sku ? `<span class="rosa-search-autocomplete__sku">REF: ${item.sku}</span>` : ''}
            </div>
          </div>
          <span class="rosa-search-autocomplete__arrow" aria-hidden="true">${isArabic ? '←' : '→'}</span>
        </a>
      `).join('');

      dropdown.innerHTML = `
        <div class="rosa-search-autocomplete__header">
          ${isArabic ? 'الأدوات المقترحة' : 'Suggested Instruments'}
        </div>
        <div class="rosa-search-autocomplete__list">
          ${itemsHtml}
        </div>
        <div class="rosa-search-autocomplete__footer">
          <a href="${form?.getAttribute('action') || '/shop/'}?s=${encodeURIComponent(query)}" class="rosa-search-autocomplete__all">
            ${isArabic ? `عرض جميع النتائج لـ "${query}"` : `View all results for "${query}"`} ${isArabic ? '←' : '→'}
          </a>
        </div>
      `;
      dropdown.hidden = false;
    };

    const updateHighlight = () => {
      if (!dropdown) return;
      const elements = dropdown.querySelectorAll('.rosa-search-autocomplete__item');
      elements.forEach((el, idx) => {
        el.classList.toggle('is-highlighted', idx === activeIndex);
        if (idx === activeIndex) {
          el.scrollIntoView({ block: 'nearest' });
        }
      });
    };

    searchInput.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      const query = searchInput.value.trim();
      if (query.length < 2) {
        closeDropdown();
        return;
      }

      debounceTimer = setTimeout(async () => {
        try {
          const langParam = isArabic ? '&lang=ar' : '&lang=en';
          const res = await fetch(`/wp-json/rosa/v1/search?q=${encodeURIComponent(query)}${langParam}`);
          if (!res.ok) throw new Error('Search failed');
          const data = await res.json();
          renderResults(data, query);
        } catch (err) {
          console.warn('Search autocomplete error:', err);
        }
      }, 250);
    });

    searchInput.addEventListener('keydown', (event) => {
      if (dropdown.hidden || currentResults.length === 0) return;

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        activeIndex = (activeIndex + 1) % currentResults.length;
        updateHighlight();
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        activeIndex = (activeIndex - 1 + currentResults.length) % currentResults.length;
        updateHighlight();
      } else if (event.key === 'Enter') {
        if (activeIndex >= 0 && activeIndex < currentResults.length) {
          event.preventDefault();
          window.location.href = currentResults[activeIndex].url;
        }
      } else if (event.key === 'Escape') {
        closeDropdown();
      }
    });

    document.addEventListener('click', (event) => {
      if (!form?.contains(event.target)) {
        closeDropdown();
      }
    });
  }
})();
