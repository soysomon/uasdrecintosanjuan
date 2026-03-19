/**
 * LazyImage — wrapper that applies a blur-up reveal effect.
 *
 * The blur lives on the wrapper <div>, not the <img>, so the <img>'s
 * own CSS classes (Tailwind hover scales, transitions, etc.) are untouched.
 *
 * Usage:
 *   <LazyImage
 *     src={url}
 *     alt="..."
 *     wrapperClassName="overflow-hidden rounded"
 *     wrapperStyle={{ aspectRatio: '3/2' }}
 *     imgClassName="w-full h-full object-cover group-hover:scale-105 transition-transform"
 *     priority   // eager + fetchpriority=high for above-the-fold images
 *   />
 */
import React, { useState } from 'react';

interface LazyImageProps {
  src:              string;
  alt:              string;
  imgClassName?:    string;
  wrapperClassName?: string;
  wrapperStyle?:    React.CSSProperties;
  priority?:        boolean;   // true → eager load + fetchPriority="high"
  onError?:         () => void;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  imgClassName,
  wrapperClassName,
  wrapperStyle,
  priority = false,
  onError,
}) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={wrapperClassName}
      style={{
        ...wrapperStyle,
        /* Blur starts at 12px, clears to 0 on load */
        filter:     loaded ? 'none' : 'blur(12px)',
        transition: 'filter 0.45s ease',
      }}
    >
      <img
        src={src}
        alt={alt}
        className={imgClassName}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding={priority ? 'sync' : 'async'}
        onLoad={() => setLoaded(true)}
        onError={onError}
      />
    </div>
  );
};

export default LazyImage;
