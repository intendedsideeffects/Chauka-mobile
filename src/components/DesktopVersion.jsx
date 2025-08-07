'use client';

import React from 'react';
import LandingPage from './LandingPage';
import { responsive } from '../app/utils/responsive';

// This component contains the PROTECTED desktop version
// It should NEVER be modified for mobile considerations
const DesktopVersion = () => {
  // Only render if NOT mobile
  if (responsive.isMobile()) {
    return null;
  }

  return (
    <div className="desktop-version">
      {/* Full Landing Page with videos - PROTECTED */}
      <LandingPage />
    </div>
  );
};

export default DesktopVersion; 