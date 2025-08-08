'use client';

import React from 'react';
import { responsive } from './utils/responsive';

// Import both versions
import MobileVersion from './mobile-page';
import BrowserVersion from './browser-page';

// Main router that decides which version to show
export default function AppRouter() {
  const isMobile = responsive.isMobile();

  return (
    <div className="app-router">
      {isMobile ? <MobileVersion /> : <BrowserVersion />}
    </div>
  );
}
