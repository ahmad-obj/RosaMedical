"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type ReactElement
} from "react";
import { AnimatePresence, motion, useReducedMotion, type MotionStyle } from "motion/react";
import type { PublicLocale } from "@/features/localization";
import { MOTION_DURATION, MOTION_EASING } from "@/features/motion/motion.config";
import {
  HERO_AUTOPLAY_MS,
  nextHeroSlideIndex,
  previousHeroSlideIndex,
  shouldHeroAutoplay
} from "@/features/homepage/hero-carousel-state";
import { getLocalizedPublicHeroSlides } from "./public-hero.data";
import type { PublicHeroPageKey } from "./public-hero.types";

const DRAG_THRESHOLD_PX = 48;
const CLIENT_MOBILE_HERO_FOCALS = ["50% 46%", "50% 48%", "54% 48%", "50% 48%"] as const;

function mobileHeroFocal(index: number, fallback: string): string {
  return CLIENT_MOBILE_HERO_FOCALS[index] ?? fallback;
}

function preferredHeroSource(
  slide: ReturnType<typeof getLocalizedPublicHeroSlides>[number]
): string {
  return window.matchMedia("(max-width: 40rem)").matches
    ? slide.media.mobileSrc
    : slide.media.desktopAvifSrc;
}

export function PublicHeroCarousel({
  page,
  locale = "en",
  headingId
}: {
  page: PublicHeroPageKey;
  locale?: PublicLocale;
  headingId: string;
}): ReactElement {
  const slides = useMemo(
    () => getLocalizedPublicHeroSlides(page, locale),
    [locale, page]
  );
  const reducedMotion = Boolean(useReducedMotion());
  const [activeIndex, setActiveIndex] = useState(0);
  const [focused, setFocused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [manualEpoch, setManualEpoch] = useState(0);
  const pointerStartX = useRef<number | null>(null);
  const pointerStartY = useRef<number | null>(null);
  const pointerFocusing = useRef(false);
  const preloadedImage = useRef<HTMLImageElement | null>(null);
  const dotRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const activateSlide = useCallback((index: number, manual = false) => {
    setActiveIndex(index);
    if (manual) setManualEpoch((epoch) => epoch + 1);
  }, []);

  useEffect(() => {
    const handleVisibility = () => setHidden(document.hidden);
    handleVisibility();
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  useEffect(() => {
    const nextIndex = nextHeroSlideIndex(activeIndex, slides.length);
    const nextSlide = slides[nextIndex] ?? slides[0]!;
    const image = new window.Image();
    image.decoding = "async";
    image.src = preferredHeroSource(nextSlide);
    void image.decode?.().catch(() => undefined);
    preloadedImage.current = image;
  }, [activeIndex, slides]);

  useEffect(() => {
    if (!shouldHeroAutoplay({ reducedMotion, focused, dragging, hidden })) return;

    const timeout = window.setTimeout(() => {
      activateSlide(nextHeroSlideIndex(activeIndex, slides.length));
    }, HERO_AUTOPLAY_MS);

    return () => window.clearTimeout(timeout);
  }, [activeIndex, activateSlide, dragging, focused, hidden, manualEpoch, reducedMotion, slides.length]);

  const handleDotKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const index = event.key === "ArrowRight"
      ? nextHeroSlideIndex(activeIndex, slides.length)
      : previousHeroSlideIndex(activeIndex, slides.length);
    activateSlide(index, true);
    dotRefs.current[index]?.focus();
  };

  const handlePointerDown = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if ((event.target as Element).closest("button, a")) return;
    pointerStartX.current = event.clientX;
    pointerStartY.current = event.clientY;
    setDragging(true);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const finishPointer = (event: PointerEvent<HTMLElement>) => {
    const startX = pointerStartX.current;
    const startY = pointerStartY.current;
    pointerStartX.current = null;
    pointerStartY.current = null;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    if (startX === null || startY === null) return;
    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;
    if (Math.abs(deltaY) > Math.abs(deltaX)) return;
    if (Math.abs(deltaX) < DRAG_THRESHOLD_PX) return;
    activateSlide(
      deltaX < 0
        ? nextHeroSlideIndex(activeIndex, slides.length)
        : previousHeroSlideIndex(activeIndex, slides.length),
      true
    );
  };

  const slide = slides[activeIndex] ?? slides[0]!;
  const slideStyle = {
    "--hero-desktop-focal": slide.media.desktopFocalPoint,
    "--hero-mobile-focal": mobileHeroFocal(activeIndex, slide.media.mobileFocalPoint)
  } as MotionStyle;

  return (
    <section
      className="public-hero public-hero-carousel"
      data-section={`${page}-hero`}
      data-public-hero-page={page}
      data-active-slide={slide.id}
      aria-roledescription="carousel"
      aria-labelledby={headingId}
      onFocusCapture={() => setFocused(!pointerFocusing.current)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
      onPointerDown={handlePointerDown}
      onPointerDownCapture={() => {
        pointerFocusing.current = true;
        setFocused(false);
      }}
      onPointerUp={finishPointer}
      onPointerUpCapture={() => {
        pointerFocusing.current = false;
      }}
      onPointerCancel={() => {
        pointerStartX.current = null;
        pointerStartY.current = null;
        pointerFocusing.current = false;
        setDragging(false);
      }}
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={`${page}-${slide.id}`}
          className="public-hero-carousel__slide"
          data-copy-side={slide.copySide}
          data-tone={slide.tone}
          aria-roledescription="slide"
          aria-label={`${activeIndex + 1} of ${slides.length}`}
          style={slideStyle}
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, pointerEvents: "none" }}
          transition={{ duration: reducedMotion ? 0 : MOTION_DURATION.hero, ease: "linear" }}
        >
          <motion.div
            className="public-hero-carousel__media"
            data-media-slot="public-hero-active"
            data-entry-motion="slide-settle"
            initial={reducedMotion ? false : {
              scale: 1.035,
              x: slide.copySide === "right" ? -12 : 12
            }}
            animate={{ scale: 1, x: 0 }}
            exit={reducedMotion ? { scale: 1, x: 0 } : {
              scale: 1.012,
              x: slide.copySide === "right" ? 8 : -8
            }}
            transition={{ duration: reducedMotion ? 0 : 1.12, ease: MOTION_EASING.standard }}
          >
            <picture className="public-hero-carousel__picture">
              <source media="(max-width: 40rem)" srcSet={slide.media.mobileSrc} type="image/webp" />
              <source srcSet={slide.media.desktopAvifSrc} type="image/avif" />
              <img
                src={slide.media.desktopSrc}
                alt={slide.media.alt}
                decoding="async"
                fetchPriority={activeIndex === 0 ? "high" : "auto"}
              />
            </picture>
          </motion.div>

          <span className="public-hero-carousel__overlay" aria-hidden="true" />

          <div className="public-hero-carousel__content">
            <motion.div
              className="public-hero-carousel__copy"
              data-entry-motion="rise"
              initial={reducedMotion ? false : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
              transition={{
                duration: reducedMotion ? 0 : MOTION_DURATION.section,
                delay: reducedMotion ? 0 : 0.12,
                ease: MOTION_EASING.emphasized
              }}
            >
              <p className="public-eyebrow">{slide.eyebrow}</p>
              <h1 className="public-hero-carousel__title" id={headingId}>{slide.title}</h1>
              <p className="public-hero-carousel__copy-text">{slide.copy}</p>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div
        className="public-hero-carousel__dots"
        role="group"
        aria-label={locale === "ar" ? "شرائح الصفحة" : "Page hero slides"}
        onKeyDown={handleDotKeyDown}
      >
        {slides.map((item, index) => (
          <button
            key={item.id}
            ref={(node) => { dotRefs.current[index] = node; }}
            type="button"
            className="public-hero-carousel__dot"
            aria-label={locale === "ar" ? `الشريحة ${index + 1}` : `Go to slide ${index + 1}`}
            aria-current={index === activeIndex ? "true" : undefined}
            tabIndex={index === activeIndex ? 0 : -1}
            onClick={() => activateSlide(index, true)}
          >
            <span className="sr-only">{item.title}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
