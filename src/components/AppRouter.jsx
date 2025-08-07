'use client';

import React from 'react';
import DesktopVersion from './DesktopVersion';
import MobileVersion from './MobileVersion';
import { responsive } from '../app/utils/responsive';

// This is the main router that decides which version to show
// It keeps desktop and mobile completely separate
const AppRouter = () => {
  const isMobile = responsive.isMobile();

  return (
    <div className="app-router">
      {/* Desktop Version - PROTECTED */}
      <DesktopVersion />
      
      {/* Mobile Version - SEPARATE */}
      <MobileVersion />
    </div>
  );
};

export default AppRouter; 