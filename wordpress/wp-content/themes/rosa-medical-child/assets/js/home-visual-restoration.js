(() => {
  const HERO_AUTOPLAY_MS = 4750;
  const DRAG_THRESHOLD_PX = 48;
  const roots = document.querySelectorAll('[data-restored-home-hero], [data-latest-rosa-home-hero]');

  roots.forEach((root) => {
    const slides = Array.from(root.querySelectorAll('[data-rosa-hero-slide]'));
    const dots = Array.from(root.querySelectorAll('[data-rosa-hero-dot]'));
    if (slides.length < 2) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let activeIndex = Math.max(0, slides.findIndex((slide) => slide.classList.contains('is-active')));
    let focused = false;
    let dragging = false;
    let timer = null;
    let startX = null;
    let startY = null;

    const apply = (index) => {
      activeIndex = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        const active = slideIndex === activeIndex;
        slide.classList.toggle('is-active', active);
        slide.setAttribute('aria-hidden', active ? 'false' : 'true');
      });
      dots.forEach((dot, dotIndex) => {
        const active = dotIndex === activeIndex;
        if (active) dot.setAttribute('aria-current', 'true');
        else dot.removeAttribute('aria-current');
        dot.tabIndex = active ? 0 : -1;
      });
      schedule();
    };

    const canAutoplay = () => !reducedMotion.matches && !focused && !dragging && !document.hidden;

    const schedule = () => {
      if (timer !== null) {
        window.clearTimeout(timer);
        timer = null;
      }
      if (!canAutoplay()) return;
      timer = window.setTimeout(() => apply(activeIndex + 1), HERO_AUTOPLAY_MS);
    };

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => apply(index));
      dot.addEventListener('keydown', (event) => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        event.preventDefault();
        const rtl = getComputedStyle(root).direction === 'rtl';
        const forward = event.key === 'ArrowRight' ? !rtl : rtl;
        const next = forward ? activeIndex + 1 : activeIndex - 1;
        apply(next);
        dots[(next + dots.length) % dots.length]?.focus();
      });
    });

    root.addEventListener('focusin', () => {
      focused = true;
      schedule();
    });

    root.addEventListener('focusout', (event) => {
      if (event.relatedTarget instanceof Node && root.contains(event.relatedTarget)) return;
      focused = false;
      schedule();
    });

    root.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      if (event.target instanceof Element && event.target.closest('button, a')) return;
      dragging = true;
      startX = event.clientX;
      startY = event.clientY;
      schedule();
    });

    const finishPointer = (event) => {
      const x = startX;
      const y = startY;
      startX = null;
      startY = null;
      dragging = false;
      if (x === null || y === null) {
        schedule();
        return;
      }
      const deltaX = event.clientX - x;
      const deltaY = event.clientY - y;
      if (Math.abs(deltaX) >= DRAG_THRESHOLD_PX && Math.abs(deltaX) > Math.abs(deltaY)) {
        const rtl = getComputedStyle(root).direction === 'rtl';
        const forward = deltaX < 0 ? !rtl : rtl;
        apply(forward ? activeIndex + 1 : activeIndex - 1);
        return;
      }
      schedule();
    };

    root.addEventListener('pointerup', finishPointer);
    root.addEventListener('pointercancel', () => {
      startX = null;
      startY = null;
      dragging = false;
      schedule();
    });

    document.addEventListener('visibilitychange', schedule);
    reducedMotion.addEventListener?.('change', schedule);

    apply(activeIndex);
  });

  document.querySelectorAll('[data-family-gallery-prev], [data-family-gallery-next]').forEach((button) => {
    button.addEventListener('click', () => {
      const shell = button.closest('.home-family-gallery-shell');
      const gallery = shell?.querySelector('.home-family-gallery');
      const panel = gallery?.querySelector('.home-family-gallery__panel');
      if (!(gallery instanceof HTMLElement) || !(panel instanceof HTMLElement)) return;
      const distance = panel.getBoundingClientRect().width + 14;
      const direction = button.hasAttribute('data-family-gallery-next') ? 1 : -1;
      const rtl = getComputedStyle(gallery).direction === 'rtl' ? -1 : 1;
      gallery.scrollBy({ left: distance * direction * rtl, behavior: reducedMotionSafe() ? 'auto' : 'smooth' });
    });
  });

  function reducedMotionSafe() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
})();
