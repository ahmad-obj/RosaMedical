"use client";

import { useState, type ReactElement } from "react";

interface InquiryLineMediaProps {
  mediaPath?: string;
  mediaFallbackPath?: string;
  alt: string;
}

export function InquiryLineMedia({
  mediaPath,
  mediaFallbackPath,
  alt
}: InquiryLineMediaProps): ReactElement {
  const [src, setSrc] = useState(mediaPath || mediaFallbackPath || "");
  const [usedFallback, setUsedFallback] = useState(!mediaPath && Boolean(mediaFallbackPath));

  if (!src) {
    return <span className="inquiry-line-media__placeholder" aria-hidden="true" />;
  }

  return (
    <img
      className="inquiry-line-media__image"
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => {
        if (!usedFallback && mediaFallbackPath && src !== mediaFallbackPath) {
          setUsedFallback(true);
          setSrc(mediaFallbackPath);
          return;
        }
        setSrc("");
      }}
    />
  );
}
