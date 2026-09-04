(() => {
  'use strict';

  const AUTOPLAY_MS = 4750;
  const DRAG_THRESHOLD_PX = 48;

  function initHero(hero) {
    const slides = Array.from(hero.querySelectorAll('[data-rosa-hero-slide]'));
    const dots = Array.from(hero.querySelectorAll('[data-rosa-hero-dot]'));
    if (slides.length < 1 || dots.length !== slides.length) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let activeIndex = 0;
    let focused = false;
    let dragging = false;
    let hidden = document.hidden;
    let timer = 0;
    let startX = null;
    let startY = null;

    const canAutoplay = () => !reducedMotion.matches && !focused && !dragging && !hidden;

    const clearTimer = () => {
      if (timer) window.clearTimeout(timer);
      timer = 0;
    };

    const schedule = () => {
      clearTimer();
      if (!canAutoplay()) return;
      timer = window.setTimeout(() => activate((activeIndex + 1) % slides.length, false), AUTOPLAY_MS);
    };

    const activate = (index, manual = true) => {
      activeIndex = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        const active = i === activeIndex;
        slide.classList.toggle('is-active', active);
        slide.setAttribute('aria-hidden', active ? 'false' : 'true');
      });
      dots.forEach((dot, i) => {
        const active = i === activeIndex;
        if (active) dot.setAttribute('aria-current', 'true');
        else dot.removeAttribute('aria-current');
        dot.tabIndex = active ? 0 : -1;
      });
      const id = slides[activeIndex]?.getAttribute('data-slide-id');
      if (id) hero.setAttribute('data-active-slide', id);
      if (manual) clearTimer();
      schedule();
    };

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => activate(index, true));
    });

    const dotsGroup = hero.querySelector('.public-hero-carousel__dots');
    dotsGroup?.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      const next = event.key === 'ArrowRight'
        ? (activeIndex + 1) % slides.length
        : (activeIndex - 1 + slides.length) % slides.length;
      activate(next, true);
      dots[next]?.focus();
    });

    hero.addEventListener('focusin', () => {
      focused = true;
      clearTimer();
    });
    hero.addEventListener('focusout', (event) => {
      if (!hero.contains(event.relatedTarget)) {
        focused = false;
        schedule();
      }
    });

    hero.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      if (event.target.closest('button, a')) return;
      startX = event.clientX;
      startY = event.clientY;
      dragging = true;
      clearTimer();
      try { hero.setPointerCapture(event.pointerId); } catch (_) {}
    });

    const finishPointer = (event) => {
      const x = startX;
      const y = startY;
      startX = null;
      startY = null;
      dragging = false;
      try {
        if (hero.hasPointerCapture(event.pointerId)) hero.releasePointerCapture(event.pointerId);
      } catch (_) {}
      if (x === null || y === null) {
        schedule();
        return;
      }
      const dx = event.clientX - x;
      const dy = event.clientY - y;
      if (Math.abs(dx) >= DRAG_THRESHOLD_PX && Math.abs(dx) >= Math.abs(dy)) {
        activate(dx < 0 ? activeIndex + 1 : activeIndex - 1, true);
      } else {
        schedule();
      }
    };

    hero.addEventListener('pointerup', finishPointer);
    hero.addEventListener('pointercancel', () => {
      startX = null;
      startY = null;
      dragging = false;
      schedule();
    });

    document.addEventListener('visibilitychange', () => {
      hidden = document.hidden;
      if (hidden) clearTimer();
      else schedule();
    });

    const reducedMotionChanged = () => {
      if (reducedMotion.matches) clearTimer();
      else schedule();
    };
    if (typeof reducedMotion.addEventListener === 'function') {
      reducedMotion.addEventListener('change', reducedMotionChanged);
    } else if (typeof reducedMotion.addListener === 'function') {
      reducedMotion.addListener(reducedMotionChanged);
    }

    activate(0, false);
  }

  function initFamilyGallery(shell) {
    const gallery = shell.querySelector('[data-home-family-gallery]');
    const prev = shell.querySelector('[data-family-gallery-prev]');
    const next = shell.querySelector('[data-family-gallery-next]');
    if (!gallery || !prev || !next) return;

    const move = (direction) => {
      const amount = Math.max(gallery.clientWidth * 0.72, 220);
      const rtl = document.documentElement.dir === 'rtl' ? -1 : 1;
      gallery.scrollBy({ left: direction * amount * rtl, behavior: 'smooth' });
    };
    prev.addEventListener('click', () => move(-1));
    next.addEventListener('click', () => move(1));
  }

  const boot = () => {
    document.querySelectorAll('[data-latest-rosa-home-hero]').forEach(initHero);
    document.querySelectorAll('.home-family-gallery-shell').forEach(initFamilyGallery);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
