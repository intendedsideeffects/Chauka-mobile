"use client";

import InteractiveStarGlobe from '../components/InteractiveStarGlobe';

export default function StarOceanTest() {
  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', background: '#000' }}>
      {/* Star Globe as background */}
      <InteractiveStarGlobe />

      {/* Ocean video overlay, only lower 30% visible, pointer-events: none */}
      <video
        src="/ocean.mp4"
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          zIndex: 2,
          pointerEvents: 'none',
          // Remove clipPath and add gradient mask for soft fade
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 58.2%, black 59.2%)',
          maskImage: 'linear-gradient(to bottom, transparent 58.2%, black 59.2%)',
        }}
      />
    </div>
  );
} 