import { useState } from "react";

export default function SafeFlag({
  src,
  alt = "Made in France",
  size = 16,
  className = "",
}: {
  src?: string;
  alt?: string;
  size?: number;
  className?: string;
}) {
  const [ok, setOk] = useState<boolean>(!!src);
  if (!ok || !src) {
    return (
      <span
        role="img"
        aria-label={alt}
        style={{ fontSize: Math.round(size * 0.9) }}
        className={className}
      >
        🇫🇷
      </span>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      onError={() => setOk(false)}
      className={className}
    />
  );
}
