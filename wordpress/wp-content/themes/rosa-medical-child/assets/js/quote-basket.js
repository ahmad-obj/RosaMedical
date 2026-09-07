(() => {
  'use strict';

  const storageKey = 'rosa_quote_basket_v1';
  const version = 1;

  const emptyState = () => ({ version, items: [] });

  const cloneState = (state) => ({
    version,
    items: state.items.map((item) => ({ ...item })),
  });

  const normalizeIdentity = (value) => {
    if (!value || typeof value !== 'object') return null;

    const productId = Number(value.productId);
    const variationId = value.variationId == null ? 0 : Number(value.variationId);
    const sku = typeof value.sku === 'string' ? value.sku.trim() : '';

    if (!Number.isInteger(productId) || productId <= 0) return null;
    if (!Number.isInteger(variationId) || variationId < 0) return null;
    if (sku === '') return null;

    return { productId, variationId, sku };
  };

  const normalizeQuantity = (value, fallback = 1) => {
    const quantity = Number(value);
    return Number.isInteger(quantity) && quantity > 0 ? quantity : fallback;
  };

  const normalizeItem = (value) => {
    const identity = normalizeIdentity(value);
    if (!identity) return null;

    return {
      ...identity,
      quantity: normalizeQuantity(value.quantity, 1),
    };
  };

  const identityKey = (value) => {
    const identity = normalizeIdentity(value);
    return identity ? JSON.stringify([identity.productId, identity.variationId, identity.sku]) : null;
  };

  const persist = (state) => {
    const safeState = cloneState(state);
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(safeState));
    } catch {
      // Keep the in-memory basket usable when storage is unavailable.
    }
    return safeState;
  };

  const hydrate = () => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return emptyState();

      const parsed = JSON.parse(raw);
      if (!parsed || parsed.version !== version || !Array.isArray(parsed.items)) {
        return emptyState();
      }

      const items = [];
      const indexByIdentity = new Map();

      for (const candidate of parsed.items) {
        const item = normalizeItem(candidate);
        if (!item) continue;

        const key = identityKey(item);
        if (indexByIdentity.has(key)) {
          const index = indexByIdentity.get(key);
          items[index].quantity += item.quantity;
          continue;
        }

        indexByIdentity.set(key, items.length);
        items.push(item);
      }

      return { version, items };
    } catch {
      return emptyState();
    }
  };

  let state = hydrate();

  const getState = () => cloneState(state);

  const add = (candidate) => {
    const item = normalizeItem(candidate);
    if (!item) return getState();

    const key = identityKey(item);
    const existing = state.items.find((entry) => identityKey(entry) === key);

    if (existing) {
      existing.quantity += item.quantity;
    } else {
      state.items.push(item);
    }

    state = persist(state);
    return getState();
  };

  const remove = (identity) => {
    const key = identityKey(identity);
    if (!key) return getState();

    state.items = state.items.filter((entry) => identityKey(entry) !== key);
    state = persist(state);
    return getState();
  };

  const setQuantity = (identity, nextQuantity) => {
    const key = identityKey(identity);
    const quantity = normalizeQuantity(nextQuantity, 0);
    if (!key || quantity <= 0) return getState();

    const existing = state.items.find((entry) => identityKey(entry) === key);
    if (!existing) return getState();

    existing.quantity = quantity;
    state = persist(state);
    return getState();
  };

  const clear = () => {
    state = persist(emptyState());
    return getState();
  };

  const revalidate = (canonicalItems) => {
    const allowed = new Set();

    if (Array.isArray(canonicalItems)) {
      for (const candidate of canonicalItems) {
        if (!candidate || candidate.published !== true) continue;
        const key = identityKey(candidate);
        if (key) allowed.add(key);
      }
    }

    state.items = state.items.filter((entry) => allowed.has(identityKey(entry)));
    state = persist(state);
    return getState();
  };

  window.RosaQuoteBasket = Object.freeze({
    storageKey,
    version,
    getState,
    add,
    remove,
    setQuantity,
    clear,
    revalidate,
  });
})();
