'use client';

import React from 'react';
import { responsive } from './utils/responsive';

// 🔒 PHYSICALLY PROTECTED BROWSER VERSION - NEVER TOUCH THIS FILE
import BrowserVersion from './browser-version-protected';

// 🔒 MOBILE VERSION - ONLY TOUCH THIS FILE
import MobileVersion from './mobile-page';

// 🔒 MAIN ROUTER - PHYSICALLY SEPARATES MOBILE AND BROWSER
export default function AppRouter() {
  // 🔒 PHYSICAL SEPARATION - NO SHARED CODE
  if (responsive.isMobile()) {
    return <MobileVersion />;
      } else {
    return <BrowserVersion />;
  }
}

