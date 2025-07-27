'use client';

import React, { useState, useRef, useEffect } from 'react';
import './PulseDot.css';
import ExtinctSpeciesViz from './components/ExtinctSpeciesViz'; // Import the new component
import InteractiveStarMap from './components/InteractiveStarMap'; // Import the star map component
import AddMemoryForm from './components/AddMemoryForm';
import MemoryList from './components/MemoryList';
import InteractiveStarGlobe from './components/InteractiveStarGlobe';
import SeaLevelRiseChart from './components/SeaLevelRiseChart';

const poemLines = [
  "This is a global warning.",
  "",
  "MAP",
  "",
  "",
  "The ocean is <strong>one connected body</strong> of water. It covers over <strong>70 percent</strong> of the Earth's surface, drives weather, absorbs heat, and links distant regions through powerful currents. For many communities, especially in the Pacific, it is more than geography. It is identity, movement, memory, and home.",
  "",
  "But the ocean is changing. As the planet warms, seawater expands and ice melts, pushing <strong>sea levels</strong> higher. Homes flood, freshwater becomes saline, and once-stable coastlines begin to vanish.",
  "",
  "These changes are <strong>not felt equally</strong>. Pacific Island nations, though among the least responsible for global warming, face some of its harshest impacts. With little elevation or room to retreat, rising seas already bring saltwater, erosion, and flooding.",
  "",
  "The chart below shows <strong>projected sea level rise</strong> for some of the most at-risk islands. Use the buttons to explore different scenarios.",
  "",
  ""
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
        {/* Scene overlay image */}
        <img
          src="/scene.png"
          alt="Scene overlay"
          style={{
            position: 'absolute',
            left: 0,
            top: '15vh',
            width: '100vw',
            height: '85vh',
            objectFit: 'cover',
            zIndex: 3, // Above video and black bar
            pointerEvents: 'none',
          }}
        />
        {/* Audio buttons positioned relative to video section */}
        <div style={{ position: 'absolute', top: '120px', right: '120px', zIndex: 1000, pointerEvents: 'auto' }}>
          <YellowStarAudioPlayer />
        </div>
        <div style={{ position: 'absolute', left: '40px', bottom: '40px', zIndex: 1000, pointerEvents: 'auto' }}>
          <BlueCircleAudioPlayer />
        </div>
        {/* Bird audio button positioned over the bird in the scene */}
        <div style={{ position: 'absolute', top: 'calc(80px + 6cm)', left: 'calc(80px + 7cm)', zIndex: 1000, pointerEvents: 'auto' }}>
          <BirdAudioPlayer />
        </div>
        {/* Project attribution on video */}
        <div style={{ 
          position: 'absolute', 
          bottom: '20px', 
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
          {poemLines.map((line, idx) => {
            if (line === '') return <div key={idx} style={{ height: '1rem' }} />;
            
            let style = { marginBottom: '2rem', fontSize: '1.4rem', color: '#000' };
            
            if (idx === 5) {
              // Main text - move it up closer to map
              style = { 
                marginBottom: '2rem', 
                fontSize: '1.4rem', 
                color: '#000',
                marginTop: '-4rem'
              };
            }
            
            if (idx === 3) {
              // Main text - move it up
              style = { 
                marginBottom: '2rem', 
                fontSize: '1.4rem', 
                color: '#000',
                marginTop: '-300px'
              };
            }
            
            if (idx === 0) {
              // Title - much bigger and bold
              style = { 
                marginBottom: '2rem', 
                fontSize: '4rem', 
                fontWeight: 'bold',
                color: '#000'
              };
            } else if (idx === 1) {
              // Subtitle
              style = { 
                marginBottom: '2rem', 
                fontSize: '1.5rem', 
                color: '#000'
              };
            } else if (idx === 2) {
              // Map trigger - transparent
              style = { 
                marginBottom: '-11rem', 
                fontSize: '1rem', 
                color: 'transparent'
              };
            }
            
            return (
              <React.Fragment key={idx}>
                <p style={style} dangerouslySetInnerHTML={{ __html: line }}></p>
                {idx === 2 && (
                  <div style={{
                    width: '100vw',
                    position: 'relative',
                    left: '50%',
                    right: '50%',
                    marginLeft: '-50vw',
                    marginRight: '-50vw',
                    marginTop: '82px',
                    marginBottom: '0rem',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <div style={{
                      width: '100%',
                      maxWidth: '1600px',
                      height: 'calc(600px * 0.99)',
                      overflow: 'hidden',
                      display: 'block',
                      margin: '0 auto'
                    }}>
                      <img 
                        src="/spilhaus_black.png" 
                        alt="Spilhaus Projection" 
                                              style={{
                        width: '100%',
                        maxWidth: '1000px',
                        height: 'auto',
                        maxHeight: '500px',
                        objectFit: 'contain',
                        display: 'block',
                        margin: '0 auto'
                      }}
                      />
                    </div>

                  </div>
                )}
                {idx === 11 && (
                  <div style={{
                    width: '100vw',
                    position: 'relative',
                    left: '50%',
                    right: '50%',
                    marginLeft: '-50vw',
                    marginRight: '-50vw',
                    marginTop: '2rem',
                    marginBottom: '2rem',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    justifyContent: 'center',
                  }}>
                    <SeaLevelRiseChart />
                  </div>
                )}
              </React.Fragment>
            );
          })}
          

        </div>
        <div style={{ width: '100vw', minWidth: 0, zIndex: 1 }}>
          <ExtinctSpeciesViz />
        </div>
      </section>
      <div className="py-8 bg-gray-50 min-h-screen">
        <AddMemoryForm onAdd={() => MemoryList.refresh && MemoryList.refresh()} />
      </div>
      
      {/* Attribution */}
      <section style={{
        width: '100%',
        padding: '18rem 0',
        background: '#3d557a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          textAlign: 'center',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <div style={{
            color: '#cad6fa',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            marginBottom: '16px'
          }}>
            Material and Method
          </div>
          <div style={{
            color: '#cad6fa',
            fontSize: '1.2rem',
            lineHeight: '1.6',
            marginBottom: '24px',
            textAlign: 'left'
          }}>
            This project is built with <strong>Next.js</strong>, <strong>React</strong>, and <strong>Three.js</strong>, combining interactive 3D mapping and data visualization. Charts are rendered using <strong>Recharts</strong> and <strong>D3.js</strong>, while styling is handled with <strong>Tailwind CSS</strong>, <strong>PostCSS</strong>, and <strong>ShadcnUI</strong> components. The source code is available on 
            <a href="https://github.com/intendedsideeffects/Chauka" target="_blank" rel="noopener noreferrer" style={{ color: '#cad6fa', textDecoration: 'underline' }}> <strong>GitHub</strong></a>.
          </div>
          <div style={{
            color: '#cad6fa',
            fontSize: '1.2rem',
            lineHeight: '1.6',
            marginBottom: '24px',
            textAlign: 'left'
          }}>
            The 3D star globe is based on data from the 
            <a href="https://cdsarc.cds.unistra.fr/viz-bin/cat/I/239" target="_blank" rel="noopener noreferrer" style={{ color: '#cad6fa', textDecoration: 'underline' }}> <strong>Hipparcos and Tycho Catalogues</strong></a>. 
            Additional charts use data from the 
            <a href="https://pacificdata.org/" target="_blank" rel="noopener noreferrer" style={{ color: '#cad6fa', textDecoration: 'underline' }}> <strong>Pacific Data Hub</strong></a> and the 
            <a href="https://public.emdat.be/" target="_blank" rel="noopener noreferrer" style={{ color: '#cad6fa', textDecoration: 'underline' }}> <strong>EM-DAT public disaster database</strong></a>. 
            Exact datasets are linked in the captions of each visualization.
          </div>
          <div style={{
            color: '#cad6fa',
            fontSize: '1.2rem',
            lineHeight: '1.6',
            marginBottom: '24px',
            textAlign: 'left'
          }}>
            The narrative is rooted in a story from <strong>Manus Island</strong>, passed down through generations and shared with permission. It is woven into the experience alongside <strong>sound</strong> to create a layered, sensory way of engaging with the data.
          </div>
          <div style={{
            color: '#cad6fa',
            fontSize: '1.2rem',
            lineHeight: '1.6',
            marginBottom: '24px',
            textAlign: 'left'
          }}>
            This project is a collaboration between <strong>Bertha Ngahan</strong> (Storytelling) and <strong>Janina Grauel</strong> (Visualization) for the <strong>Pacific Data Challenge</strong>.
          </div>

        </div>
      </section>
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
        width: '300px',
        height: '300px',
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
      <svg width="300" height="300" style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}>
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
        {!playing && (
          <polygon points="145,140 165,150 145,160" fill="#a6b2d6" style={{ opacity: 1 }} />
        )}
        {playing && (
          <g>
            <rect x="142.5" y="141.5" width="6" height="15" rx="1.5" fill="#a6b2d6" style={{ opacity: 1 }} />
            <rect x="151.5" y="141.5" width="6" height="15" rx="1.5" fill="#a6b2d6" style={{ opacity: 1 }} />
          </g>
        )}
              </svg>
      <button onClick={() => {
        if (audioElement) {
          audioElement.currentTime = 0;
          audioElement.pause();
          setPlaying(false);
        }
      }} style={{ position: 'absolute', right: 18, bottom: 18, width: 44, height: 44, borderRadius: '50%', background: 'none', border: 'none', color: '#cad6fa', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 11, padding: 0 }}>
        <svg width="44" height="44" style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
          <circle cx="22" cy="22" r="17" fill="#cad6fa" />
          <text x="22" y="25" textAnchor="middle" fill="#828eb0" fontSize="11" fontWeight="normal">reset</text>
        </svg>
      </button>
      {audioError && (
        <div style={{ position: 'absolute', top: 10, left: 10, color: 'red', background: 'rgba(0,0,0,0.7)', padding: '8px 16px', borderRadius: 8, zIndex: 20 }}>
          Audio failed to load.
        </div>
      )}
      <style>{`
        @keyframes pulse {
          0% { 
            opacity: 0.8;
          }
          50% { 
            opacity: 0.4;
          }
          100% { 
            opacity: 0.8;
          }
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

// Bird Audio Player Component
function BirdAudioPlayer() {
  const [playing, setPlaying] = React.useState(false);
  const [audioLoaded, setAudioLoaded] = React.useState(false);
  const [audioError, setAudioError] = React.useState(false);
  const [audioElement, setAudioElement] = React.useState(null);

  const handleToggle = () => {
    console.log('Bird button clicked!', { audioLoaded, audioError, audioElement, playing });
    if (!audioElement) {
      console.log('No bird audio element found');
      return;
    }
    
    // Try to play/pause regardless of loading state
    if (audioElement) {
      if (playing) {
        console.log('Pausing bird audio');
        audioElement.pause();
      } else {
        console.log('Playing bird audio');
        audioElement.play().catch(error => {
          console.error('Error playing bird audio:', error);
        });
      }
    }
  };

  const handleStateChange = ({ playing: newPlaying, audioLoaded: newAudioLoaded, audioError: newAudioError }) => {
    console.log('Bird state change:', { newPlaying, newAudioLoaded, newAudioError });
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
        width: '80px',
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'none',
        cursor: 'pointer',
      }}
      onClick={handleToggle}
      aria-label="Play or pause Chauka call"
    >
      <AudioPlayer
        id="bird-audio"
        src="/chaukasound.mp3"
        volume={0.3}
        loop={false}
        onEnded={() => setPlaying(false)}
        onStateChange={handleStateChange}
        onRef={handleAudioRef}
      />
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
      {audioError && (
        <div style={{ position: 'absolute', top: 10, left: 10, color: 'red', background: 'rgba(0,0,0,0.7)', padding: '4px 8px', borderRadius: 4, zIndex: 20, fontSize: '10px' }}>
          Audio failed to load.
        </div>
      )}
    </div>
  );
}

