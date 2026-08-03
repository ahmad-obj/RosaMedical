import type { ReactElement } from "react";

export interface ProductMediaPlaceholderProps {
  label: string;
  decorative?: boolean;
  aspect?: "landscape" | "portrait" | "square";
  className?: string;
  src?: string;
  fallbackSrc?: string;
  spriteIndex?: number;
}

export function ProductMediaPlaceholder({
  label,
  decorative = false,
  aspect = "landscape",
  className = "",
  src,
  fallbackSrc,
  spriteIndex
}: ProductMediaPlaceholderProps): ReactElement {
  const hasSprite = Boolean(src) && typeof spriteIndex === "number";
  const column = hasSprite ? spriteIndex % 3 : 0;
  const row = hasSprite ? Math.floor(spriteIndex / 3) : 0;

  return (
    <div
      className={`product-media-placeholder product-media-placeholder--${aspect} ${src ? "product-media-placeholder--image" : ""} ${className}`.trim()}
      aria-hidden={decorative ? "true" : undefined}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : label}
    >
      {hasSprite ? (
        <span
          aria-hidden="true"
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            backgroundImage: `url(${src})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "300% 500%",
            backgroundPosition: `${column * 50}% ${row * 25}%`
          }}
        />
      ) : src ? (
        <picture>
          {fallbackSrc ? <source srcSet={src} type="image/avif" /> : null}
          <img
            src={fallbackSrc ?? src}
            alt={decorative ? "" : label}
            loading="lazy"
            decoding="async"
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </picture>
      ) : (
        <>
          <span className="product-media-placeholder__axis" aria-hidden="true" />
          <span className="product-media-placeholder__instrument" aria-hidden="true" />
          {!decorative ? <span className="product-media-placeholder__label">{label}</span> : null}
        </>
      )}
    </div>
  );
}
