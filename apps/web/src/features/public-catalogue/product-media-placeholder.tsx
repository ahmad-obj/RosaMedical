import type { ReactElement } from "react";

export interface ProductMediaPlaceholderProps {
  label: string;
  decorative?: boolean;
  aspect?: "landscape" | "portrait" | "square";
  className?: string;
  src?: string;
}

export function ProductMediaPlaceholder({
  label,
  decorative = false,
  aspect = "landscape",
  className = "",
  src
}: ProductMediaPlaceholderProps): ReactElement {
  return (
    <div
      className={`product-media-placeholder product-media-placeholder--${aspect} ${src ? "product-media-placeholder--image" : ""} ${className}`.trim()}
      aria-hidden={decorative ? "true" : undefined}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : label}
    >
      {src ? (
        <img
          src={src}
          alt={decorative ? "" : label}
          loading="lazy"
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
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
