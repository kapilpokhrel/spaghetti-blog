'use client';

import { useEffect, useState } from 'react';
import ExportedImage from 'next-image-export-optimizer';

// Vector sources are served untouched. Routing them through the raster
// optimizer would downscale them to the largest deviceSize and smear any
// fine text, which is the whole reason the flowgraphs are SVG.
function Picture({ src, alt, width, height, sizes, ...props }) {
  if (src.toLowerCase().endsWith('.svg')) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} width={width} height={height} {...props} />;
  }
  return (
    <ExportedImage
      sizes={sizes}
      src={src}
      alt={alt}
      width={width}
      height={height}
      {...props}
    />
  );
}

export default function Image_viewer({ src, alt, width, height, sizes }) {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!expanded) return;

    const on_key = (event) => {
      if (event.key === 'Escape') setExpanded(false);
    };
    document.addEventListener('keydown', on_key);

    // Keep the page behind the overlay from scrolling while it is open
    const previous_overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', on_key);
      document.body.style.overflow = previous_overflow;
    };
  }, [expanded]);

  return (
    <>
      <Picture
        // Here the px are the css pixel but browser will calculate the appropirate image size based on the ratio of screen pixel to css pixel
        sizes={sizes}
        src={src}
        alt={alt}
        width={width}
        height={height}
        onClick={() => setExpanded(true)}
        className='cursor-zoom-in w-auto h-auto max-w-full'
      />
      {expanded && (
        <span
          onClick={() => setExpanded(false)}
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 cursor-zoom-out'
        >
          <Picture
            sizes='100vw'
            src={src}
            alt={alt}
            width={width}
            height={height}
            className='max-w-full max-h-full w-auto h-auto object-contain'
          />
        </span>
      )}
    </>
  );
}
