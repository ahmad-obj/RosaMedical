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
    let requestSequence = 0;

    const escapeHtml = (value) => String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');

    const safeProductUrl = (value) => {
      try {
        const url = new URL(String(value || ''), window.location.origin);
        return url.origin === window.location.origin ? url.href : '#';
      } catch (_) {
        return '#';
      }
    };

    const closeDropdown = () => {
      requestSequence += 1;
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
        <a href="${escapeHtml(safeProductUrl(item.url))}" class="rosa-search-autocomplete__item" role="option" data-index="${idx}">
          <div class="rosa-search-autocomplete__thumb">
            ${item.thumbnail ? `<img src="${escapeHtml(item.thumbnail)}" alt="" loading="lazy">` : `<span class="rosa-search-autocomplete__no-thumb" aria-hidden="true">ROSA</span>`}
          </div>
          <div class="rosa-search-autocomplete__info">
            <span class="rosa-search-autocomplete__title">${escapeHtml(item.name)}</span>
            <div class="rosa-search-autocomplete__meta">
              ${item.family ? `<span class="rosa-search-autocomplete__family">${escapeHtml(item.family)}</span>` : ''}
              ${item.sku ? `<span class="rosa-search-autocomplete__sku">REF: ${escapeHtml(item.sku)}</span>` : ''}
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

      const requestId = ++requestSequence;
      debounceTimer = setTimeout(async () => {
        try {
          const langParam = isArabic ? '&lang=ar' : '&lang=en';
          const res = await fetch(`/wp-json/rosa/v1/search?q=${encodeURIComponent(query)}${langParam}`);
          if (!res.ok) throw new Error('Search failed');
          const data = await res.json();
          if (requestId !== requestSequence || searchInput.value.trim() !== query) return;
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

  // ==========================================================================
  // Amazon-Style Faceted Sidebar Filters & Shop Grid Engine
  // ==========================================================================
  const shopContainer = document.querySelector('.rosa-shop-container');
  if (shopContainer instanceof HTMLElement) {
    const isArabic = (document.documentElement.lang || '').toLowerCase().startsWith('ar') || document.documentElement.dir === 'rtl';
    const sidebar = shopContainer.querySelector('[data-rosa-shop-sidebar]');
    const grid = shopContainer.querySelector('[data-rosa-products-grid]');
    const rawItems = Array.from(shopContainer.querySelectorAll('[data-product-card-wrap]'));
    const items = rawItems.map((el, index) => ({
      el,
      originalIndex: index,
      family: el.getAttribute('data-family') || '',
      profile: el.getAttribute('data-profile') || '',
      grade: el.getAttribute('data-grade') || '',
      length: el.getAttribute('data-length') || '',
      name: (el.getAttribute('data-name') || '').toLowerCase(),
      sku: (el.getAttribute('data-sku') || '').toLowerCase(),
    }));

    const filterInputs = Array.from(shopContainer.querySelectorAll('input[data-filter]'));
    const activeFiltersWrap = shopContainer.querySelector('[data-rosa-active-filters]');
    const chipsContainer = shopContainer.querySelector('[data-rosa-filter-chips]');
    const clearButtons = Array.from(shopContainer.querySelectorAll('[data-rosa-clear-filters]'));
    const sortSelect = shopContainer.querySelector('[data-rosa-sort]');
    const countLabel = shopContainer.querySelector('[data-rosa-results-count]');
    const emptyState = shopContainer.querySelector('[data-rosa-empty-state]');
    const toggleBtn = shopContainer.querySelector('[data-rosa-filter-toggle]');
    const closeBtn = shopContainer.querySelector('[data-rosa-filter-close]');
    const activeCountBadge = shopContainer.querySelector('[data-rosa-active-count]');
    let previouslyFocused = null;
    let lockedBodyOverflow = null;

    // Mobile drawer backdrop
    let backdrop = document.querySelector('.rosa-shop-sidebar-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'rosa-shop-sidebar-backdrop';
      document.body.appendChild(backdrop);
    }

    const drawerFocusables = () => {
      if (!sidebar) return [];
      return Array.from(sidebar.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'))
        .filter((element) => element instanceof HTMLElement && element.checkVisibility());
    };

    const drawerIsOpen = () => Boolean(sidebar?.classList.contains('is-open'));

    const openDrawer = () => {
      previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : toggleBtn;
      sidebar?.classList.add('is-open');
      sidebar?.setAttribute('role', 'dialog');
      sidebar?.setAttribute('aria-modal', 'true');
      backdrop?.classList.add('is-active');
      backdrop?.setAttribute('aria-hidden', 'true');
      toggleBtn?.setAttribute('aria-expanded', 'true');
      lockedBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => {
        const focusTarget = closeBtn instanceof HTMLElement ? closeBtn : drawerFocusables()[0];
        focusTarget?.focus();
      });
    };

    const closeDrawer = ({ restoreFocus = true } = {}) => {
      sidebar?.classList.remove('is-open');
      sidebar?.removeAttribute('role');
      sidebar?.removeAttribute('aria-modal');
      backdrop?.classList.remove('is-active');
      toggleBtn?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = lockedBodyOverflow ?? '';
      lockedBodyOverflow = null;
      if (restoreFocus) {
        const target = previouslyFocused instanceof HTMLElement && previouslyFocused.isConnected ? previouslyFocused : toggleBtn;
        requestAnimationFrame(() => target?.focus());
      }
    };

    toggleBtn?.addEventListener('click', openDrawer);
    closeBtn?.addEventListener('click', closeDrawer);
    backdrop.addEventListener('click', closeDrawer);
    document.addEventListener('keydown', (e) => {
      if (!drawerIsOpen()) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        closeDrawer();
        return;
      }
      if (e.key !== 'Tab') return;
      const focusables = drawerFocusables();
      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
    document.addEventListener('focusin', (event) => {
      if (!drawerIsOpen() || sidebar?.contains(event.target)) return;
      drawerFocusables()[0]?.focus();
    });
    window.addEventListener('resize', () => {
      if (drawerIsOpen() && window.matchMedia('(min-width: 1025px)').matches) closeDrawer();
    });

    const getActiveFilters = () => {
      let family = 'all';
      const familyChecked = filterInputs.find(i => i.getAttribute('data-filter') === 'family' && i.checked);
      if (familyChecked && familyChecked.value) {
        family = familyChecked.value;
      }

      const profiles = filterInputs
        .filter(i => i.getAttribute('data-filter') === 'profile' && i.checked)
        .map(i => i.value);

      const grades = filterInputs
        .filter(i => i.getAttribute('data-filter') === 'grade' && i.checked)
        .map(i => i.value);

      const lengths = filterInputs
        .filter(i => i.getAttribute('data-filter') === 'length' && i.checked)
        .map(i => i.value);

      return { family, profiles, grades, lengths };
    };

    const itemMatches = (item, filters) => {
      if (filters.family !== 'all' && item.family !== filters.family) {
        return false;
      }
      if (filters.profiles.length > 0 && !filters.profiles.includes(item.profile)) {
        return false;
      }
      if (filters.grades.length > 0 && !filters.grades.includes(item.grade)) {
        return false;
      }
      if (filters.lengths.length > 0 && !filters.lengths.includes(item.length)) {
        return false;
      }
      return true;
    };

    const updateFilterCounts = (currentFilters) => {
      const filterGroups = shopContainer.querySelectorAll('[data-filter-group]');
      filterGroups.forEach((group) => {
        const groupType = group.getAttribute('data-filter-group');
        const inputs = Array.from(group.querySelectorAll('input[data-filter]'));

        inputs.forEach((input) => {
          const val = input.value;
          // Calculate potential matches if this option is chosen along with all other groups' selections
          let potentialMatches = 0;

          if (groupType === 'family') {
            const testFilters = { ...currentFilters, family: val };
            potentialMatches = items.filter(it => itemMatches(it, testFilters)).length;
          } else if (groupType === 'profile') {
            const testProfiles = input.checked ? currentFilters.profiles : [...currentFilters.profiles, val];
            const testFilters = { ...currentFilters, profiles: testProfiles };
            potentialMatches = items.filter(it => itemMatches(it, testFilters)).length;
          } else if (groupType === 'grade') {
            const testGrades = input.checked ? currentFilters.grades : [...currentFilters.grades, val];
            const testFilters = { ...currentFilters, grades: testGrades };
            potentialMatches = items.filter(it => itemMatches(it, testFilters)).length;
          } else if (groupType === 'length') {
            const testLengths = input.checked ? currentFilters.lengths : [...currentFilters.lengths, val];
            const testFilters = { ...currentFilters, lengths: testLengths };
            potentialMatches = items.filter(it => itemMatches(it, testFilters)).length;
          }

          // Update count badge
          const countSpan = group.querySelector(`[data-count-${groupType}="${val}"]`);
          if (countSpan) {
            countSpan.textContent = `(${potentialMatches})`;
          }

          const optionLabel = input.closest('.rosa-filter-option');
          if (optionLabel) {
            if (potentialMatches === 0 && !input.checked && val !== 'all') {
              optionLabel.classList.add('is-disabled');
              input.disabled = true;
            } else {
              optionLabel.classList.remove('is-disabled');
              input.disabled = false;
            }
          }
        });
      });
    };

    const renderActiveChips = (filters) => {
      if (!chipsContainer || !activeFiltersWrap) return;
      chipsContainer.innerHTML = '';

      let totalActive = 0;
      const chips = [];

      if (filters.family !== 'all') {
        totalActive++;
        const input = filterInputs.find(i => i.getAttribute('data-filter') === 'family' && i.value === filters.family);
        const nameEl = input?.closest('.rosa-filter-option')?.querySelector('.rosa-filter-option__name');
        chips.push({
          label: nameEl?.textContent?.trim() || filters.family,
          filterType: 'family',
          value: filters.family,
        });
      }

      ['profile', 'grade', 'length'].forEach((groupType) => {
        const prop = groupType === 'profile' ? 'profiles' : groupType === 'grade' ? 'grades' : 'lengths';
        filters[prop].forEach((val) => {
          totalActive++;
          const input = filterInputs.find(i => i.getAttribute('data-filter') === groupType && i.value === val);
          const nameEl = input?.closest('.rosa-filter-option')?.querySelector('.rosa-filter-option__name');
          chips.push({
            label: nameEl?.textContent?.trim() || val,
            filterType: groupType,
            value: val,
          });
        });
      });

      if (totalActive === 0) {
        activeFiltersWrap.hidden = true;
        if (activeCountBadge) {
          activeCountBadge.hidden = true;
          activeCountBadge.textContent = '0';
        }
        return;
      }

      activeFiltersWrap.hidden = false;
      if (activeCountBadge) {
        activeCountBadge.hidden = false;
        activeCountBadge.textContent = String(totalActive);
      }

      chips.forEach((chip) => {
        const chipEl = document.createElement('span');
        chipEl.className = 'rosa-filter-chip';
        chipEl.innerHTML = `
          <span>${chip.label}</span>
          <button type="button" class="rosa-filter-chip__remove" aria-label="${isArabic ? 'إزالة الفلتر' : 'Remove filter'}">×</button>
        `;
        const removeBtn = chipEl.querySelector('.rosa-filter-chip__remove');
        removeBtn?.addEventListener('click', () => {
          if (chip.filterType === 'family') {
            const allRadio = filterInputs.find(i => i.getAttribute('data-filter') === 'family' && i.value === 'all');
            if (allRadio) allRadio.checked = true;
          } else {
            const targetInput = filterInputs.find(i => i.getAttribute('data-filter') === chip.filterType && i.value === chip.value);
            if (targetInput) targetInput.checked = false;
          }
          filterProducts();
        });
        chipsContainer.appendChild(chipEl);
      });
    };

    const sortGrid = () => {
      if (!grid || !sortSelect) return;
      const val = sortSelect.value;
      const sorted = [...items];

      if (val === 'alpha-asc') {
        sorted.sort((a, b) => a.name.localeCompare(b.name));
      } else if (val === 'alpha-desc') {
        sorted.sort((a, b) => b.name.localeCompare(a.name));
      } else if (val === 'sku') {
        sorted.sort((a, b) => a.sku.localeCompare(b.sku));
      } else {
        // Featured / original
        sorted.sort((a, b) => a.originalIndex - b.originalIndex);
      }

      sorted.forEach(item => grid.appendChild(item.el));
    };

    const updateUrlParams = (filters, historyMode = 'push') => {
      if (historyMode === 'none') return;
      const url = new URL(window.location.href);
      if (filters.family !== 'all') {
        url.searchParams.set('family', filters.family);
      } else {
        url.searchParams.delete('family');
      }

      if (filters.profiles.length > 0) {
        url.searchParams.set('profile', filters.profiles.join(','));
      } else {
        url.searchParams.delete('profile');
      }

      if (filters.grades.length > 0) {
        url.searchParams.set('grade', filters.grades.join(','));
      } else {
        url.searchParams.delete('grade');
      }

      if (filters.lengths.length > 0) {
        url.searchParams.set('length', filters.lengths.join(','));
      } else {
        url.searchParams.delete('length');
      }

      if (url.toString() === window.location.href) return;
      window.history[historyMode === 'replace' ? 'replaceState' : 'pushState']({}, '', url.toString());
    };

    const filterProducts = (historyMode = 'push') => {
      const filters = getActiveFilters();
      let visibleCount = 0;

      items.forEach((item) => {
        const visible = itemMatches(item, filters);
        if (visible) {
          item.el.classList.remove('is-hidden');
          visibleCount++;
        } else {
          item.el.classList.add('is-hidden');
        }
      });

      if (countLabel) {
        if (isArabic) {
          countLabel.textContent = `عرض ${visibleCount} منتج`;
        } else {
          countLabel.textContent = `Showing ${visibleCount} instrument${visibleCount === 1 ? '' : 's'}`;
        }
      }

      if (emptyState && grid) {
        if (visibleCount === 0) {
          emptyState.hidden = false;
          grid.style.display = 'none';
        } else {
          emptyState.hidden = true;
          grid.style.display = '';
        }
      }

      updateFilterCounts(filters);
      renderActiveChips(filters);
      updateUrlParams(filters, historyMode);
    };

    // Event listeners for filter changes
    filterInputs.forEach((input) => {
      input.addEventListener('change', () => {
        filterProducts();
      });
    });

    // Clear all filters
    clearButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterInputs.forEach((input) => {
          if (input.getAttribute('data-filter') === 'family') {
            input.checked = input.value === 'all';
          } else {
            input.checked = false;
          }
        });
        filterProducts();
      });
    });

    // Sorting
    sortSelect?.addEventListener('change', () => {
      sortGrid();
    });

    const restoreFiltersFromUrl = (historyMode) => {
      const params = new URLSearchParams(window.location.search);
      const requested = {
        family: params.get('family') || 'all',
        profile: params.get('profile')?.split(',').filter(Boolean) || [],
        grade: params.get('grade')?.split(',').filter(Boolean) || [],
        length: params.get('length')?.split(',').filter(Boolean) || [],
      };

      // Reset first, then apply only known controls. Invalid query values fail
      // safely to the neutral catalogue state rather than leaving a stale UI.
      filterInputs.forEach((input) => {
        if (input.getAttribute('data-filter') === 'family') {
          input.checked = input.value === 'all';
        } else {
          input.checked = false;
        }
      });

      const family = filterInputs.find((input) => input.getAttribute('data-filter') === 'family' && input.value === requested.family);
      if (family) family.checked = true;

      [['profile', requested.profile], ['grade', requested.grade], ['length', requested.length]].forEach(([type, values]) => {
        values.forEach((value) => {
          const input = filterInputs.find((candidate) => candidate.getAttribute('data-filter') === type && candidate.value === value);
          if (input) input.checked = true;
        });
      });

      filterProducts(historyMode);
    };

    // Normalise a direct/shared URL once at load. Back/Forward restores state
    // without writing a competing history entry.
    restoreFiltersFromUrl('replace');
    window.addEventListener('popstate', () => restoreFiltersFromUrl('none'));
  }
})();
