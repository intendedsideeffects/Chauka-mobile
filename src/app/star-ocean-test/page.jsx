"use client";

import InteractiveStarGlobe from '../components/InteractiveStarGlobe';

export default function StarOceanTest() {
  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', background: '#000' }}>
      {/* Star Globe as background */}
      <InteractiveStarGlobe />
    </div>
  );
} 