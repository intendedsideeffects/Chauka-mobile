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
          top: '15vh',
          width: '100vw',
          height: '85vh',
          objectFit: 'cover',
          zIndex: 2,
          pointerEvents: 'none',
          // Fade out the top and bottom for a soft edge
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 59.7%, black 60.7%, black 100%)',
          maskImage: 'linear-gradient(to bottom, transparent 59.7%, black 60.7%, black 100%)',
        }}
      />
      {/* Black bar between video and star globe */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: '15vh',
          width: '100vw',
          height: '85vh', // Match the video height
          zIndex: 2.5, // Between star globe and video
          pointerEvents: 'none',
          background: '#000',
        }}
      />
      {/* Fixed pulsing yellow star with circular text at top right */}
      <div
        style={{
          position: 'fixed',
          top: '160px',
          right: '160px',
          width: '180px',
          height: '180px',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'auto',
          background: 'none',
        }}
      >
        <svg width="180" height="180" style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          <defs>
            <radialGradient id="pulse" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#a8972a" stopOpacity="1" />
              <stop offset="100%" stopColor="#a8972a" stopOpacity="0" />
            </radialGradient>
            <filter id="glow" x="-200%" y="-200%" width="500%" height="500%">
              <feGaussianBlur stdDeviation="40" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <path id="circlePath" d="M90,25 A65,65 0 0,1 90,155" />
          </defs>
          {/* Pulsing glowing dot */}
          <circle
            cx="90"
            cy="90"
            r="36"
            fill="url(#pulse)"
            style={{
              animation: 'pulse 1.5s infinite',
              filter: 'url(#glow)',
            }}
          />
          <circle
            cx="90"
            cy="90"
            r="22"
            fill="#a8972a"
            style={{ filter: 'url(#glow)' }}
          />
          {/* Circular text */}
          <text fill="#a8972a" fontSize="18" fontWeight="bold" letterSpacing="0.08em">
            <textPath xlinkHref="#circlePath" startOffset="0%" textAnchor="start" dominantBaseline="middle">
              Click for story!
            </textPath>
          </text>
        </svg>
        <style>{`
          @keyframes pulse {
            0% { r: 36; opacity: 0.7; }
            50% { r: 48; opacity: 0.2; }
            100% { r: 36; opacity: 0.7; }
          }
        `}</style>
      </div>
    </div>
  );
} 