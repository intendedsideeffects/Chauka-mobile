'use client';

import React, { useState, useRef, useEffect } from 'react';
import './PulseDot.css';
import ExtinctSpeciesViz from './components/ExtinctSpeciesViz'; // Import the new component
import InteractiveStarMap from './components/InteractiveStarMap'; // Import the star map component
import AddMemoryForm from './components/AddMemoryForm';
import MemoryList from './components/MemoryList';
import InteractiveStarGlobe from './components/InteractiveStarGlobe';

const poemLines = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.",
  "Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi.",
  "Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat.",
  "Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim.",
  "Pellentesque congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue.",
  "Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit sodales.",
  "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam nibh.",
  "Mauris ac mauris sed pede pellentesque fermentum. Maecenas adipiscing ante non diam sodales hendrerit.",
  "Ut velit mauris, egestas sed, gravida nec, ornare ut, mi. Aenean ut orci vel massa suscipit pulvinar.",
  "Nulla sollicitudin. Fusce varius, ligula non tempus aliquam, nunc turpis ullamcorper nibh, in tempus sapien eros vitae ligula.",
  "Pellentesque rhoncus nunc et augue. Integer id felis. Curabitur aliquet pellentesque diam.",
  "Integer quis metus vitae elit lobortis egestas. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  "Morbi vel erat non mauris convallis vehicula. Nulla et sapien. Integer tortor tellus, aliquam faucibus, convallis id, congue eu, quam.",
  "Mauris ullamcorper felis vitae erat. Proin feugiat, augue non elementum posuere, metus purus iaculis lectus, et tristique ligula justo vitae magna.",
  "Aliquam convallis sollicitudin purus. Praesent aliquam, enim at fermentum mollis, ligula massa adipiscing nisl, ac euismod nibh nisl eu lectus.",
  "Fusce vulputate sem at sapien. Vivamus leo. Aliquam euismod libero eu enim.",
  "Nullam nec magna. Duis varius, enim accumsan aliquam tincidunt, tortor urna vulputate quam, eget finibus urna est nec augue.",
  "Morbi facilisis, justo non dictum facilisis, sapien sem mattis sem, nec dictum urna elit nec urna.",
  "Sed euismod, urna eu tincidunt consectetur, nisi nisl aliquam urna, eget aliquam massa nisi nec erat."
];

export default function TestScroll() {
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef();
  const oceanVideoRef = useRef();
  const poemWrapperRef = useRef();

  // Ensure video plays properly
  useEffect(() => {
    if (videoRef.current) {
      // Start muted to ensure autoplay works
      videoRef.current.muted = true;
      videoRef.current.volume = 1.0;
      
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log('Autoplay failed:', error);
        });
      }
    }
  }, []);

  // Ensure ocean video is always muted
  useEffect(() => {
    if (oceanVideoRef.current) {
      oceanVideoRef.current.muted = true;
      oceanVideoRef.current.volume = 0;
    }
  }, []);

  // Enable sound on first user interaction
  useEffect(() => {
    const enableSound = () => {
      if (videoRef.current) {
        videoRef.current.muted = false;
        videoRef.current.volume = 1.0;
      }
      // Remove event listeners after first interaction
      document.removeEventListener('click', enableSound);
      document.removeEventListener('keydown', enableSound);
      document.removeEventListener('touchstart', enableSound);
    };

    document.addEventListener('click', enableSound);
    document.addEventListener('keydown', enableSound);
    document.addEventListener('touchstart', enableSound);

    return () => {
      document.removeEventListener('click', enableSound);
      document.removeEventListener('keydown', enableSound);
      document.removeEventListener('touchstart', enableSound);
    };
  }, []);

  // Enable sound on hover
  const handleVideoHover = () => {
    if (videoRef.current) {
      videoRef.current.muted = false;
    }
  };

  // Disable sound when not hovering
  const handleVideoLeave = () => {
    if (videoRef.current) {
      videoRef.current.muted = true;
    }
  };

  // Slider state for chart
  const [barEndIndex, setBarEndIndex] = useState(0);
  const [maxBarIndex, setMaxBarIndex] = useState(0);

  // Pause/play logic for video
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        // Enable sound and play when user clicks
        videoRef.current.muted = false;
        videoRef.current.volume = 1.0;
        videoRef.current.play().catch((error) => {
          console.log('Manual play failed:', error);
          // If unmuted play fails, try muted
          videoRef.current.muted = true;
          videoRef.current.play();
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handler for slider change
  const handleSliderChange = (event) => {
    setBarEndIndex(parseInt(event.target.value));
  };

  return (
    <div>
      {/* Video Section */}
      <section style={{ position: 'relative', height: '100vh', width: '100%', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {/* Star Globe as background */}
        <InteractiveStarGlobe />
        {/* Ocean video overlay, only lower 30% visible, pointer-events: none */}
        <video
          ref={oceanVideoRef}
          src="/ocean.mp4"
          autoPlay
          loop
          muted
          volume={0}
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
      </section>

      {/* Placeholder text and scatterplot side by side */}
      <section
        style={{
          width: '100%',
          minHeight: '80vh',
          background: 'white',
          display: 'flex',
          flexDirection: 'column', // stack vertically
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: '3rem',
          padding: '4rem 0',
          position: 'relative',
        }}
      >
        <div
          style={{
            color: '#0e224f',
            fontSize: '1.5rem',
            maxWidth: '700px',
            textAlign: 'left',
            fontFamily: 'Arial, Helvetica, sans-serif',
            fontWeight: 400,
            lineHeight: 1.5,
            zIndex: 2,
            position: 'relative',
            margin: '0 auto',
            flexShrink: 0,
          }}
        >
          {poemLines.map((line, idx) => (
            <p key={idx} style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>{line}</p>
          ))}
        </div>
        {/* Pulsing blue dot with SVG-wrapped text */}
        <div
          style={{
            position: 'absolute',
            left: 'calc(50% + 420px + 5cm)',
            top: 'calc(12cm + 10cm - 10cm)', // move blue dot further up
            width: 120,
            height: 120,
            zIndex: 10,
            pointerEvents: 'auto', // fix for tooltip
          }}
        >
          <svg width={120} height={120} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
            <defs>
              {/* Right half arc for text from 12 o'clock to 6 o'clock, readable top to bottom */}
              <path id="circlePathRight" d="M60,12 A48,48 0 0,1 108,60 A48,48 0 0,1 60,108" />
            </defs>
            <text fill="#3d557a" fontSize="1.1rem" fontWeight="bold" letterSpacing="0.08em">
              <textPath xlinkHref="#circlePathRight" startOffset="0%" textAnchor="start" dominantBaseline="middle">
                hover me
              </textPath>
            </text>
          </svg>
          {/* Interactive dot with tooltip */}
          <PulseDotWithTooltipForLegend />
        </div>
        {/* Large pulsing dot to the left of the poem, further down (yellow, now interactive) */}
        <div
          style={{
            position: 'absolute',
            left: 'calc(50% - 700px)', // left of centered poem
            top: 'calc(12cm + 2cm)', // even higher
            width: 200,
            height: 200,
            zIndex: 9,
            pointerEvents: 'auto', // make interactive
          }}
        >
          <svg width={200} height={200} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
            <defs>
              {/* Left half arc for text from 6 o'clock to 12 o'clock, bottom to top */}
              <path id="circlePathLeft" d="M100,180 A80,80 0 0,1 100,20" />
            </defs>
            <text fill="#c28f3e" fontSize="1.5rem" fontWeight="bold" letterSpacing="0.08em">
              <textPath xlinkHref="#circlePathLeft" startOffset="0%" textAnchor="start" dominantBaseline="middle">
                hover me
              </textPath>
            </text>
          </svg>
          <YellowDotWithTooltip />
        </div>
        {/* New pulsing purple dot with tooltip and hover text */}
        <div
          style={{
            position: 'absolute',
            left: 'calc(50% + 200px + 5cm)', // further right by 5cm
            top: 'calc(12cm + 25cm)', // lower than blue dot
            width: 120,
            height: 120,
            zIndex: 10,
            pointerEvents: 'auto',
          }}
        >
          <svg width={120} height={120} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
            <defs>
              {/* Right half arc for text from 12 o'clock to 6 o'clock, readable top to bottom */}
              <path id="circlePathPurple" d="M60,12 A48,48 0 0,1 108,60 A48,48 0 0,1 60,108" />
            </defs>
            <text fill="#5a3f6e" fontSize="1.1rem" fontWeight="bold" letterSpacing="0.08em">
              <textPath xlinkHref="#circlePathPurple" startOffset="0%" textAnchor="start" dominantBaseline="middle">
                hover me
              </textPath>
            </text>
          </svg>
          <PurpleDotWithTooltip />
        </div>
        {/* New pulsing teal dot with tooltip and hover text */}
        <div
          style={{
            position: 'absolute',
            left: 'calc(50% - 700px)', // same left position as yellow dot
            top: 'calc(12cm + 35cm)', // underneath the yellow dot
            width: 120,
            height: 120,
            zIndex: 9,
            pointerEvents: 'auto',
          }}
        >
          <svg width={120} height={120} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
            <defs>
              {/* Right half arc for text from 12 o'clock to 6 o'clock, readable top to bottom */}
              <path id="circlePathTeal" d="M60,12 A48,48 0 0,1 108,60 A48,48 0 0,1 60,108" />
            </defs>
            <text fill="#267180" fontSize="1.1rem" fontWeight="bold" letterSpacing="0.08em">
              <textPath xlinkHref="#circlePathTeal" startOffset="0%" textAnchor="start" dominantBaseline="middle">
                hover me
              </textPath>
            </text>
          </svg>
          <div style={{ position: 'absolute', left: 30, top: 30 }}>
            <TealDotWithTooltip />
          </div>
        </div>
        {/* New pulsing red dot with tooltip and hover text */}
        <div
          style={{
            position: 'absolute',
            left: 'calc(50% + 700px)', // right of centered poem, mirrors yellow dot
            top: 'calc(12cm + 8cm)', // move red dot further down
            width: 200,
            height: 200,
            zIndex: 10,
            pointerEvents: 'auto',
          }}
        >
          <svg width={200} height={200} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
            <defs>
              {/* Left half arc for text from 6 o'clock to 12 o'clock, bottom to top (mirrors yellow dot) */}
              <path id="circlePathRed" d="M100,180 A80,80 0 0,1 100,20" />
            </defs>
            <text fill="#7b2233" fontSize="1.5rem" fontWeight="bold" letterSpacing="0.08em">
              <textPath xlinkHref="#circlePathRed" startOffset="0%" textAnchor="start" dominantBaseline="middle">
                hover me
              </textPath>
            </text>
          </svg>
          <RedDotWithTooltip />
        </div>
        <div style={{ width: '100vw', minWidth: 0, zIndex: 1 }}>
          <ExtinctSpeciesViz />
        </div>
      </section>
      {/* Fixed pulsing yellow star with audio player at top right */}
      <div style={{ position: 'fixed', top: '120px', right: '120px', zIndex: 1000, pointerEvents: 'auto' }}>
        <YellowStarAudioPlayer />
      </div>
      <div style={{ position: 'fixed', left: '40px', bottom: '40px', zIndex: 1000, pointerEvents: 'auto' }}>
        <BlueCircleAudioPlayer />
      </div>
      <div className="py-8 bg-gray-50 min-h-screen">
        <AddMemoryForm onAdd={() => MemoryList.refresh && MemoryList.refresh()} />
      </div>
    </div>
  );
}

// Pulsing blue dot with tooltip component
function PulseDotWithTooltip({ style }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div style={{ position: 'absolute', ...style }}>
      <div
        className="pulse-dot"
        style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: '#3d557a',
          opacity: 0.5,
          cursor: 'pointer',
          boxShadow: hovered ? '0 0 0 16px #3d557a33' : 'none',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      />
      {hovered && (
        <div style={{
          position: 'absolute',
          left: '120%',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'white',
          color: '#222',
          border: '1px solid #3d557a',
          borderRadius: 8,
          padding: '1rem',
          minWidth: 220,
          fontSize: '1rem',
          boxShadow: '0 2px 12px #0002',
          zIndex: 100,
        }}>
          <strong>Event dot</strong>
          <div style={{ marginTop: 8 }}>
            "A cyclone devastated the island in 1731."
          </div>
        </div>
      )}
    </div>
  );
}

// Pulsing blue dot with tooltip for legend (interactive)
function PulseDotWithTooltipForLegend() {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div style={{ position: 'absolute', left: 36, top: 36, pointerEvents: 'auto', zIndex: 11 }}>
      <div
        className="pulse-dot"
        style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: '#3d557a',
          opacity: 0.5,
          cursor: 'pointer',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      />
      {hovered && (
        <div style={{
          position: 'absolute',
          left: 60,
          top: 0,
          background: 'white',
          color: '#222',
          border: '1px solid #3d557a',
          borderRadius: 8,
          padding: '1rem',
          minWidth: 220,
          fontSize: '1rem',
          boxShadow: '0 2px 12px #0002',
          zIndex: 100,
        }}>
          <strong>Event</strong>
          <div style={{ marginTop: 8 }}>
            "A cyclone devastated the island in 1731."
          </div>
        </div>
      )}
    </div>
  );
}

// Add new interactive yellow dot with tooltip
function YellowDotWithTooltip() {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div style={{ position: 'absolute', left: 40, top: 40, pointerEvents: 'auto' }}>
      <div
        className="pulse-dot"
        style={{
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: '#c28f3e',
          opacity: 0.25,
          cursor: 'pointer',
          animation: 'pulse 1.5s infinite',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      />
      {hovered && (
        <div style={{
          position: 'absolute',
          left: 130,
          top: 0,
          background: 'white',
          color: '#222',
          border: '1px solid #c28f3e',
          borderRadius: 8,
          padding: '1rem',
          minWidth: 220,
          fontSize: '1rem',
          boxShadow: '0 2px 12px #0002',
          zIndex: 100,
        }}>
          <strong>Warning</strong>
          <div style={{ marginTop: 8 }}>
            Severe storm approaching the island.
          </div>
        </div>
      )}
    </div>
  );
}

// Add new interactive teal dot with tooltip
function TealDotWithTooltip() {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div style={{ position: 'relative', pointerEvents: 'auto' }}>
      <div
        className="pulse-dot"
        style={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: '#267180',
          opacity: 0.5,
          cursor: 'pointer',
          animation: 'pulse 1.2s infinite',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      />
      {hovered && (
        <div style={{
          position: 'absolute',
          left: 70,
          top: 0,
          background: 'white',
          color: '#222',
          border: '1px solid #267180',
          borderRadius: 8,
          padding: '1rem',
          minWidth: 220,
          fontSize: '1rem',
          boxShadow: '0 2px 12px #0002',
          zIndex: 100,
        }}>
          <strong>Resistance</strong>
          <div style={{ marginTop: 8 }}>
            "Community resilience against environmental challenges."
          </div>
        </div>
      )}
    </div>
  );
}

// Add new interactive purple dot with tooltip
function PurpleDotWithTooltip() {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div style={{ position: 'absolute', left: 36, top: 36, pointerEvents: 'auto' }}>
      <div
        className="pulse-dot"
        style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: '#5a3f6e',
          opacity: 0.5,
          cursor: 'pointer',
          animation: 'pulse 1.2s infinite',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      />
      {hovered && (
        <div style={{
          position: 'absolute',
          left: 60,
          top: 0,
          background: 'white',
          color: '#222',
          border: '1px solid #5a3f6e',
          borderRadius: 8,
          padding: '1rem',
          minWidth: 220,
          fontSize: '1rem',
          boxShadow: '0 2px 12px #0002',
          zIndex: 100,
        }}>
          <strong>Memory</strong>
          <div style={{ marginTop: 8 }}>
            "A memory of a vanished world."
          </div>
        </div>
      )}
    </div>
  );
}

// Add new interactive red dot with tooltip
function RedDotWithTooltip() {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div style={{ position: 'absolute', left: 40, top: 40, pointerEvents: 'auto' }}>
      <div
        className="pulse-dot"
        style={{
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: '#7b2233',
          opacity: 0.5,
          cursor: 'pointer',
          animation: 'pulse 1.2s infinite',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      />
      {hovered && (
        <div style={{
          position: 'absolute',
          left: 130,
          top: 0,
          background: 'white',
          color: '#222',
          border: '1px solid #7b2233',
          borderRadius: 8,
          padding: '1rem',
          minWidth: 220,
          fontSize: '1rem',
          boxShadow: '0 2px 12px #0002',
          zIndex: 100,
        }}>
          <strong>Story</strong>
          <div style={{ marginTop: 8 }}>
            "Placeholder"
          </div>
        </div>
      )}
    </div>
  );
}

// Add a robust, reusable AudioPlayer component
function AudioPlayer({ src, volume = 1, loop = false, onEnded, onStateChange, onRef, ...rest }) {
  const audioRef = React.useRef();
  const [playing, setPlaying] = React.useState(false);
  const [audioLoaded, setAudioLoaded] = React.useState(false);
  const [audioError, setAudioError] = React.useState(false);

  React.useEffect(() => {
    // Temporarily removed muting to debug audio issues
    console.log('AudioPlayer mounted for:', src);
  }, []);

  // Expose audio ref to parent
  React.useEffect(() => {
    if (onRef && audioRef.current) {
      onRef(audioRef.current);
    }
  }, [onRef]);

  // Debug logging
  React.useEffect(() => {
    console.log('AudioPlayer: Loading audio file:', src);
  }, [src]);

  // Notify parent of state changes
  React.useEffect(() => {
    if (onStateChange) {
      onStateChange({ playing, audioLoaded, audioError });
    }
  }, [playing, audioLoaded, audioError, onStateChange]);

  return (
    <audio
      ref={audioRef}
      src={src}
      onEnded={() => { setPlaying(false); if (onEnded) onEnded(); }}
      onCanPlayThrough={() => { 
        console.log('AudioPlayer: Audio loaded successfully:', src);
        setAudioLoaded(true); 
        setAudioError(false); 
      }}
      onPlay={() => {
        console.log('AudioPlayer: Playing audio:', src, 'with volume:', volume);
        setPlaying(true);
        if (audioRef.current) {
          audioRef.current.volume = volume;
          audioRef.current.muted = false;
        }
        // Force state update to parent
        if (onStateChange) {
          onStateChange({ playing: true, audioLoaded, audioError });
        }
      }}
      onPause={() => {
        setPlaying(false);
        // Force state update to parent
        if (onStateChange) {
          onStateChange({ playing: false, audioLoaded, audioError });
        }
      }}
      onError={e => { 
        console.error('AudioPlayer: Error loading audio:', src, e);
        setAudioError(true); 
      }}
      preload="auto"
      loop={loop}
      {...rest}
    />
  );
}

// Refactor YellowStarAudioPlayer to use AudioPlayer
function YellowStarAudioPlayer() {
  const [playing, setPlaying] = React.useState(false);
  const [audioLoaded, setAudioLoaded] = React.useState(false);
  const [audioError, setAudioError] = React.useState(false);
  const [showButtons, setShowButtons] = React.useState(true);
  const [audioElement, setAudioElement] = React.useState(null);

  React.useEffect(() => {
    const handleScroll = () => {
      setShowButtons(window.scrollY === 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggle = () => {
    console.log('Yellow button clicked!', { audioLoaded, audioError, audioElement, playing });
    console.log('Yellow audio element:', audioElement);
    console.log('Yellow audio readyState:', audioElement?.readyState);
    console.log('Yellow audio paused:', audioElement?.paused);
    if (!audioElement) {
      console.log('No audio element found');
      return;
    }
    
    // Try to play/pause regardless of loading state
    if (audioElement) {
      if (playing) {
        console.log('Pausing yellow audio');
        audioElement.pause();
      } else {
        console.log('Playing yellow audio');
        audioElement.play().catch(error => {
          console.error('Error playing yellow audio:', error);
        });
      }
    }
  };

  const handleStateChange = ({ playing: newPlaying, audioLoaded: newAudioLoaded, audioError: newAudioError }) => {
    console.log('Yellow state change:', { newPlaying, newAudioLoaded, newAudioError });
    setPlaying(newPlaying);
    setAudioLoaded(newAudioLoaded);
    setAudioError(newAudioError);
  };

  const handleAudioRef = (audio) => {
    setAudioElement(audio);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '120px',
        right: '120px',
        width: '240px',
        height: '240px',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: showButtons ? 'auto' : 'none',
        background: 'none',
        cursor: 'pointer',
        opacity: showButtons ? 1 : 0,
        transition: 'opacity 0.4s',
      }}
      onClick={handleToggle}
      aria-label="Play or pause story"
    >
      <AudioPlayer
        id="yellow-audio"
        src="/teststory.mp3"
        volume={1}
        loop={false}
        onEnded={() => setPlaying(false)}
        onStateChange={handleStateChange}
        onRef={handleAudioRef}
      />
      <svg width="240" height="240" style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}>
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
          <path id="circlePath" d="M120,60 A60,60 0 1,1 119.99,60" />
        </defs>
        <circle cx="120" cy="120" r="48" fill="url(#pulse)" style={{ animation: 'pulse 1.5s infinite', filter: 'url(#glow)' }} />
        <circle cx="120" cy="120" r="30" fill="#a8972a" style={{ filter: 'url(#glow)' }} />
        <text fill="#a8972a" fontSize="15" fontWeight="normal" letterSpacing="0.08em">
          <textPath xlinkHref="#circlePath" startOffset="0%" textAnchor="start" dominantBaseline="middle">
            Click for story!
          </textPath>
        </text>
        {!playing && (
          <polygon points="115,112 131,120 115,128" fill="#e6d87a" style={{ opacity: 1 }} />
        )}
        {playing && (
          <g>
            <rect x="112.5" y="113.5" width="5" height="12" rx="1.5" fill="#e6d87a" style={{ opacity: 1 }} />
            <rect x="120.5" y="113.5" width="5" height="12" rx="1.5" fill="#e6d87a" style={{ opacity: 1 }} />
          </g>
        )}
      </svg>
      <button onClick={() => {
        if (audioElement) {
          audioElement.currentTime = 0;
          audioElement.pause();
          setPlaying(false);
        }
      }} style={{ position: 'absolute', right: 18, bottom: 18, width: 44, height: 44, borderRadius: '50%', background: 'none', border: 'none', color: '#a8972a', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 11, padding: 0 }}>
        <svg width="44" height="44" style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
          <circle cx="22" cy="22" r="17" fill="#a8972a" />
          <text x="22" y="25" textAnchor="middle" fill="#e6d87a" fontSize="11" fontWeight="normal">reset</text>
        </svg>
      </button>
      {audioError && (
        <div style={{ position: 'absolute', top: 10, left: 10, color: 'red', background: 'rgba(0,0,0,0.7)', padding: '8px 16px', borderRadius: 8, zIndex: 20 }}>
          Audio failed to load.
        </div>
      )}
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

// Refactor BlueCircleAudioPlayer to use AudioPlayer
function BlueCircleAudioPlayer() {
  const [playing, setPlaying] = React.useState(false);
  const [audioLoaded, setAudioLoaded] = React.useState(false);
  const [audioError, setAudioError] = React.useState(false);
  const [showButtons, setShowButtons] = React.useState(true);
  const [audioElement, setAudioElement] = React.useState(null);

  React.useEffect(() => {
    const handleScroll = () => {
      setShowButtons(true); // Always show at bottom
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggle = () => {
    console.log('Blue button clicked!', { audioLoaded, audioError, audioElement, playing });
    console.log('Blue audio element:', audioElement);
    console.log('Blue audio readyState:', audioElement?.readyState);
    console.log('Blue audio paused:', audioElement?.paused);
    if (!audioElement) {
      console.log('No blue audio element found');
      return;
    }
    
    // Try to play/pause regardless of loading state
    if (audioElement) {
      if (playing) {
        console.log('Pausing blue audio');
        audioElement.pause();
      } else {
        console.log('Playing blue audio');
        audioElement.play().catch(error => {
          console.error('Error playing blue audio:', error);
        });
      }
    }
  };

  const handleStateChange = ({ playing: newPlaying, audioLoaded: newAudioLoaded, audioError: newAudioError }) => {
    console.log('Blue state change:', { newPlaying, newAudioLoaded, newAudioError });
    setPlaying(newPlaying);
    setAudioLoaded(newAudioLoaded);
    setAudioError(newAudioError);
  };

  const handleAudioRef = (audio) => {
    setAudioElement(audio);
  };

  return (
    <div
      style={{
        position: 'fixed',
        left: '40px',
        bottom: '40px',
        width: '240px',
        height: '240px',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: showButtons ? 'auto' : 'none',
        background: 'none',
        cursor: 'pointer',
        opacity: showButtons ? 1 : 0,
        transition: 'opacity 0.4s',
      }}
      onClick={handleToggle}
      aria-label="Play or pause ocean sound"
    >
      <AudioPlayer
        id="blue-audio"
        src="/oceansound.m4a?v=1"
        volume={0.03}
        loop={true}
        onEnded={() => setPlaying(false)}
        onStateChange={handleStateChange}
        onRef={handleAudioRef}
      />
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
          <textPath xlinkHref="#circlePathBlueText" startOffset="0%" textAnchor="start" dominantBaseline="middle">
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
      {audioError && (
        <div style={{ position: 'absolute', top: 10, left: 10, color: 'red', background: 'rgba(0,0,0,0.7)', padding: '8px 16px', borderRadius: 8, zIndex: 20 }}>
          Audio failed to load.
        </div>
      )}
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
