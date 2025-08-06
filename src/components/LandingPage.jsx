'use client';

import React, { useState, useRef, useEffect } from 'react';
import InteractiveStarGlobe from '../app/components/InteractiveStarGlobe';
import { responsive } from '../app/utils/responsive';

// Blue Circle Audio Player Component
function BlueCircleAudioPlayer() {
  const [playing, setPlaying] = React.useState(false);
  const [showButtons, setShowButtons] = React.useState(true);
  const [audioElement, setAudioElement] = React.useState(null);

  React.useEffect(() => {
    const handleScroll = () => {
      setShowButtons(true); // Always show at bottom
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  React.useEffect(() => {
    const audio = new Audio('/oceansound_compressed.m4a');
    audio.volume = 0.20;
    audio.loop = true;
    audio.preload = 'auto';
    setAudioElement(audio);
  }, []);

  const handleToggle = () => {
    if (!audioElement) return;
    if (playing) {
      audioElement.pause();
      setPlaying(false);
    } else {
      audioElement.play().catch(error => {
        console.error('Error playing ocean audio:', error);
      });
      setPlaying(true);
    }
  };

  return (
    <div style={{ 
      width: '240px', 
      height: '240px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      pointerEvents: showButtons ? 'auto' : 'none', 
      background: 'none', 
      cursor: 'pointer', 
      opacity: showButtons ? 1 : 0, 
      transition: 'opacity 0.4s',
    }} onClick={handleToggle} aria-label="Play or pause ocean sound">
      <svg width="240" height="240" style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}>
        <defs>
          <radialGradient id="pulseBlue" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3d557a" stopOpacity="1" />
            <stop offset="100%" stopColor="#3d557a" stopOpacity="0" />
          </radialGradient>
          <filter id="glowBlue" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="40" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Arc path for text wrapping around the top half of the dot */}
          <path id="circlePathBlueText" d="M60,120 A60,60 0 1,1 180,120" />
        </defs>
        {/* Wrapped text above the dot */}
        <text fill="#3d557a" fontSize="15" fontWeight="normal" letterSpacing="0.08em">
          <textPath xlinkHref="#circlePathBlueText" startOffset="0%" dominantBaseline="middle">
            Click for ocean sound!
          </textPath>
        </text>
        <circle cx="120" cy="120" r="48" fill="url(#pulseBlue)" style={{ animation: 'pulse 1.5s infinite', filter: 'url(#glowBlue)' }} />
        <circle cx="120" cy="120" r="30" fill="#3d557a" style={{ filter: 'url(#glowBlue)' }} />
        {!playing && (
          <polygon points="115,112 131,120 115,128" fill="#b8c6e6" style={{ opacity: 1 }} />
        )}
        {playing && (
          <g>
            <rect x="112.5" y="113.5" width="5" height="12" rx="1.5" fill="#b8c6e6" style={{ opacity: 1 }} />
            <rect x="120.5" y="113.5" width="5" height="12" rx="1.5" fill="#b8c6e6" style={{ opacity: 1 }} />
          </g>
        )}
      </svg>
      <style>{`
        @keyframes pulse {
          0% { r: 36; opacity: 0.7; }
          50% { r: 48; opacity: 0.2; }
          100% { r: 36; opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}

// Bird Audio Player Component
function BirdAudioPlayer() {
  const [playing, setPlaying] = React.useState(false);
  const [audioElement, setAudioElement] = React.useState(null);
  const [audioLoaded, setAudioLoaded] = React.useState(false);

  React.useEffect(() => {
    const audio = new Audio();
    audio.src = '/chaukasound.mp3';
    audio.volume = 0.3;
    audio.preload = 'metadata';
    audio.addEventListener('canplaythrough', () => {
      setAudioLoaded(true);
    });
    audio.addEventListener('ended', () => {
      setPlaying(false);
    });
    audio.addEventListener('error', (e) => {
      console.error('Bird audio error:', e);
    });
    setAudioElement(audio);
  }, []);

  const handleToggle = async () => {
    if (!audioElement) return;
    try {
      if (playing) {
        audioElement.pause();
        setPlaying(false);
      } else {
        // Ensure audio is loaded before playing
        if (audioElement.readyState < 2) {
          await audioElement.load();
        }
        await audioElement.play();
        setPlaying(true);
      }
    } catch (error) {
      console.error('Error playing bird audio:', error);
    }
  };

  return (
    <div style={{ 
      width: '80px', 
      height: '80px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'none', 
      cursor: 'pointer',
    }} onClick={handleToggle} aria-label="Play or pause Chauka call">
      <svg width="80" height="80" style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}>
        {!playing && (
          <polygon points="35,30 50,40 35,50" fill="#676b8b" style={{ opacity: 0.8 }} />
        )}
        {playing && (
          <g>
            <rect x="32.5" y="31.5" width="4" height="16" rx="1" fill="#676b8b" style={{ opacity: 0.8 }} />
            <rect x="40.5" y="31.5" width="4" height="16" rx="1" fill="#676b8b" style={{ opacity: 0.8 }} />
          </g>
        )}
      </svg>
    </div>
  );
}

export default function LandingPage({ 
  showChaukaTooltip, 
  setShowChaukaTooltip, 
  oceanVideoRef 
}) {
  return (
    <section style={{ 
      position: 'relative', 
      height: '100vh', 
      width: '100%', 
      background: '#000', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      overflow: 'hidden',
      scrollSnapAlign: 'start'
    }}>
      {/* Star Globe as background */}
      <InteractiveStarGlobe />
      
      {/* Ocean video overlay, only lower 30% visible, pointer-events: none */}
      <video
        ref={oceanVideoRef}
        src="/ocean_compressed.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onLoadStart={() => console.log('Ocean video loading started')}
        onCanPlay={() => console.log('Ocean video can play')}
        onError={(e) => console.error('Ocean video error:', e)}
        onPlay={() => console.log('Ocean video started playing')}
        onLoadedData={() => console.log('Ocean video data loaded')}
        style={{
          position: 'absolute',
          left: 0,
          top: responsive.isMobile() ? '10vh' : '15vh',
          width: '100vw',
          height: responsive.isMobile() ? '90vh' : '85vh',
          objectFit: 'cover',
          zIndex: 2,
          pointerEvents: 'none',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 59.7%, black 60.7%, black 100%)',
          maskImage: 'linear-gradient(to bottom, transparent 59.7%, black 60.7%, black 100%)',
        }}
      />
      
      {/* Scene overlay image */}
      <img
        src="/scene.webp"
        alt="Scene overlay"
        style={{
          position: 'absolute',
          left: 0,
          top: responsive.isMobile() ? '10vh' : '15vh',
          width: '100vw',
          height: responsive.isMobile() ? '90vh' : '85vh',
          objectFit: 'cover',
          zIndex: 3, // Above video and black bar
          pointerEvents: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none'
        }}
      />
      
      {/* Speech bubble centered and down */}
      <div
        style={{
          position: 'absolute',
          top: responsive.isMobile() ? '60%' : '50%',
          left: responsive.isMobile() ? '50%' : '40%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          pointerEvents: 'none',
        }}
      >
        <img 
          src="/speechbubble.svg" 
          alt="Speech bubble" 
          style={{ 
            width: responsive.isMobile() ? '120px' : '200px', 
            height: 'auto',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
            opacity: 0.7
          }} 
        />
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#333',
            fontSize: responsive.isMobile() ? '8px' : '12px',
            fontWeight: '500',
            textAlign: 'center',
            fontFamily: 'Helvetica World, Arial, sans-serif',
            width: '80%',
            lineHeight: '1.2'
          }}
        >
          Can you find<br />
          the Southern Cross?<br />
          Drag sky to explore.
        </div>
      </div>

      {/* Audio buttons positioned relative to video section */}
      <div style={{ ...responsive.position.absolute.topRight(), zIndex: 1000, pointerEvents: 'auto' }}>
        <button
          style={{
            width: responsive.size.width.chart(),
            height: responsive.size.height.chart(),
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setShowChaukaTooltip(true)}
          aria-label="Click for story"
        >
          <svg width={responsive.isMobile() ? "280" : "300"} height={responsive.isMobile() ? "280" : "300"} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}>
            <defs>
              <radialGradient id="pulse" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#cad6fa" stopOpacity="1" />
                <stop offset="100%" stopColor="#cad6fa" stopOpacity="0.8" />
              </radialGradient>
              <filter id="glow" x="-200%" y="-200%" width="500%" height="500%">
                <feGaussianBlur stdDeviation="40" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <path id="circlePath" d="M150,75 A75,75 0 1,1 149.99,75" />
            </defs>
            <circle cx="150" cy="150" r="40" fill="#cad6fa" style={{ filter: 'url(#glow)' }} />
            <circle cx="150" cy="150" r="50" fill="transparent" style={{ filter: 'url(#glow)', animation: 'pulse 2s ease-in-out infinite', opacity: 0.2 }} />
            <text fill="#94a0c4" fontSize="18" fontWeight="normal" letterSpacing="0.08em">
              <textPath xlinkHref="#circlePath" startOffset="0%" textAnchor="start" dominantBaseline="middle">
                Click for story!
              </textPath>
            </text>
          </svg>
        </button>
      </div>
      
      <div style={{ ...responsive.position.absolute.bottomLeft(), zIndex: 1000, pointerEvents: 'auto' }}>
        <BlueCircleAudioPlayer />
      </div>
      
      {/* Bird audio button positioned over the bird in the scene */}
      <div style={{ 
        position: 'absolute', 
        top: responsive.isMobile() ? 'calc(60px + 4cm)' : 'calc(80px + 6cm)', 
        left: responsive.isMobile() ? 'calc(60px + 5cm)' : 'calc(80px + 7cm)', 
        zIndex: 1000, 
        pointerEvents: 'auto' 
      }}>
        <BirdAudioPlayer />
      </div>
      
      {/* Project attribution on video */}
      <div style={{ 
        position: 'absolute', 
        bottom: responsive.size.spacing.md(), 
        left: '50%', 
        transform: 'translateX(-50%)', 
        zIndex: 1000, 
        pointerEvents: 'auto'
      }}>
        <div style={{
          fontSize: '1rem',
          color: '#676b8b',
          fontWeight: 400,
          textAlign: 'center'
        }}>
          Storytelling by Bertha <a href="https://www.linkedin.com/in/bertha-ngahan-a9b405145/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: '#676b8b', fontWeight: 'bold' }}>Ngahan</a> | Visualization by Janina <a href="https://www.linkedin.com/in/j-grauel/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: '#676b8b', fontWeight: 'bold' }}>Grauel</a>
        </div>
      </div>
    </section>
  );
} 