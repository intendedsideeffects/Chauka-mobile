import { useState, useEffect } from 'react';

// Responsive utility functions for mobile compatibility
export const responsive = {
  // Screen breakpoints
  breakpoints: {
    mobile: 768,
    tablet: 1024,
    desktop: 1280,
  },

  // Check if current screen is mobile
  isMobile: () => typeof window !== 'undefined' && window.innerWidth < 768,
  isTablet: () => typeof window !== 'undefined' && window.innerWidth >= 768 && window.innerWidth < 1024,
  isDesktop: () => typeof window !== 'undefined' && window.innerWidth >= 1024,

  // Responsive sizing functions
  size: {
    // Width utilities
    width: {
      small: () => responsive.isMobile() ? '80px' : '200px',
      medium: () => responsive.isMobile() ? '120px' : '300px',
      large: () => responsive.isMobile() ? '200px' : '400px',
      full: () => '100%',
      container: () => responsive.isMobile() ? '90vw' : '600px',
      chart: () => responsive.isMobile() ? '280px' : '300px',
    },

    // Height utilities
    height: {
      small: () => responsive.isMobile() ? '80px' : '200px',
      medium: () => responsive.isMobile() ? '120px' : '300px',
      large: () => responsive.isMobile() ? '200px' : '400px',
      full: () => '100%',
      chart: () => responsive.isMobile() ? '280px' : '300px',
    },

    // Icon sizes
    icon: {
      tiny: () => responsive.isMobile() ? '16px' : '19px',
      small: () => responsive.isMobile() ? '20px' : '25px',
      medium: () => responsive.isMobile() ? '24px' : '30px',
      large: () => responsive.isMobile() ? '32px' : '40px',
    },

    // Spacing utilities
    spacing: {
      xs: () => responsive.isMobile() ? '8px' : '10px',
      sm: () => responsive.isMobile() ? '12px' : '15px',
      md: () => responsive.isMobile() ? '16px' : '20px',
      lg: () => responsive.isMobile() ? '24px' : '30px',
      xl: () => responsive.isMobile() ? '32px' : '40px',
      xxl: () => responsive.isMobile() ? '48px' : '60px',
    },

    // Font sizes
    fontSize: {
      xs: () => responsive.isMobile() ? '10px' : '12px',
      sm: () => responsive.isMobile() ? '12px' : '14px',
      md: () => responsive.isMobile() ? '14px' : '16px',
      lg: () => responsive.isMobile() ? '16px' : '18px',
      xl: () => responsive.isMobile() ? '18px' : '24px',
    },
  },

  // Positioning utilities
  position: {
    // Absolute positioning with responsive values
    absolute: {
      topRight: () => ({
        position: 'absolute',
        top: responsive.isMobile() ? '20px' : '120px',
        right: responsive.isMobile() ? '20px' : '120px',
      }),
      topLeft: () => ({
        position: 'absolute',
        top: responsive.isMobile() ? '20px' : '120px',
        left: responsive.isMobile() ? '20px' : '120px',
      }),
      bottomRight: () => ({
        position: 'absolute',
        bottom: responsive.isMobile() ? '20px' : '50px',
        right: responsive.isMobile() ? '20px' : '50px',
      }),
      bottomLeft: () => ({
        position: 'absolute',
        bottom: responsive.isMobile() ? '20px' : '50px',
        left: responsive.isMobile() ? '20px' : '50px',
      }),
      center: () => ({
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }),
    },

    // Chart positioning
    chart: {
      topRight: () => ({
        position: 'absolute',
        top: responsive.isMobile() ? 'calc(25vh - 100px)' : 'calc(35vh - 125px)',
        right: responsive.isMobile() ? '10px' : 'calc(80vw - 30px)',
      }),
      bottomLeft: () => ({
        position: 'absolute',
        bottom: responsive.isMobile() ? '20px' : '50px',
        left: responsive.isMobile() ? '20px' : '50px',
      }),
    },
  },

  // Container styles
  container: {
    modal: () => ({
      padding: responsive.isMobile() ? '20px' : '40px',
      borderRadius: '12px',
      maxWidth: responsive.isMobile() ? '90vw' : '600px',
      width: responsive.isMobile() ? '90vw' : '600px',
    }),
    chart: () => ({
      width: responsive.isMobile() ? '280px' : '300px',
      height: responsive.isMobile() ? '280px' : '300px',
    }),
  },

  // Get responsive value based on screen size
  getValue: (mobile, tablet, desktop) => {
    if (responsive.isMobile()) return mobile;
    if (responsive.isTablet()) return tablet || mobile;
    return desktop || tablet || mobile;
  },
};

// Hook for responsive values
export const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const updateResponsive = () => {
      setIsMobile(window.innerWidth < responsive.breakpoints.mobile);
      setIsTablet(window.innerWidth >= responsive.breakpoints.mobile && window.innerWidth < responsive.breakpoints.tablet);
      setIsDesktop(window.innerWidth >= responsive.breakpoints.tablet);
    };

    updateResponsive();
    window.addEventListener('resize', updateResponsive);
    return () => window.removeEventListener('resize', updateResponsive);
  }, []);

  return { isMobile, isTablet, isDesktop, responsive };
};

export default responsive; 