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
                    {/* Speech bubble centered and down */}
               <div
          style={{
            position: 'fixed',
            top: '40%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            pointerEvents: 'none',
          }}
        >
                                       <img 
                      src="/speechbubble.svg" 
                      alt="Speech bubble" 
                      style={{ 
                        width: '400px', 
                        height: 'auto',
                        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                      }} 
                    />
       </div>
    </div>
  );
} 