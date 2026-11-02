import React from 'react';
import './BrandLoader.css';

export const BRAND_LOGO = `${process.env.PUBLIC_URL || ''}/motion-franzy-logo.png`;
export const BRAND_FAVICON = `${process.env.PUBLIC_URL || ''}/favicon.png`;
export const BRAND_MARK = `${process.env.PUBLIC_URL || ''}/brand-mark.png`;

function BrandLoader({ label = 'Loading' }) {
  return (
    <div className="brand-loader" role="status" aria-live="polite" aria-label={label}>
      <div className="brand-loader-glow" aria-hidden="true" />
      <img className="brand-loader-logo" src={BRAND_LOGO} alt="Motion Franzy" />
      <span className="brand-loader-bar" aria-hidden="true" />
    </div>
  );
}

export default BrandLoader;
