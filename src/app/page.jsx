'use client';

import React, { useState, useRef, useEffect } from 'react';
import './PulseDot.css';
import InteractiveStarGlobe from './components/InteractiveStarGlobe';
import TitleSection from '../components/sections/TitleSection';
import SegmentTemplate from '../components/sections/SegmentTemplate';
import SeaLevelRiseChart from './components/SeaLevelRiseChart';
import HistoricalSeaLevelRiseExtended from './components/HistoricalSeaLevelRiseExtended';
import NewChartComponent from './components/NewChartComponent';
import HighestElevationChart from './components/HighestElevationChart';
import LowElevationChart from './components/LowElevationChart';
import DisasterVoronoiChart from './components/DisasterVoronoiChart';
import ExtinctSpeciesViz from './components/ExtinctSpeciesViz';

export default function TestScroll() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isOceanPlaying, setIsOceanPlaying] = useState(true);
  const videoRef = useRef();
  const oceanVideoRef = useRef();

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

  return (
    <div style={{ scrollSnapType: 'y mandatory', height: '100vh', overflowY: 'auto', overflowX: 'hidden', position: 'relative', minHeight: '100vh' }}>
      {/* Video Section */}
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
        {/* Segment Number */}
        <div style={{
          position: 'absolute',
          top: 20,
          left: 20,
          fontSize: '5rem',
          color: 'rgba(255,255,255,0.15)',
          fontWeight: 900,
          zIndex: 2000,
          pointerEvents: 'none',
        }}>1</div>
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

      {/* Title Section */}
      <div style={{position: 'relative'}}>
        <div style={{
          position: 'absolute',
          top: 20,
          left: 20,
          fontSize: '5rem',
          color: 'rgba(0,0,0,0.10)',
          fontWeight: 900,
          zIndex: 2000,
          pointerEvents: 'none',
        }}>2</div>
        <TitleSection />
      </div>

      {/* ExtinctSpeciesViz Scatter Plot Overlay - spans segments 3-9 */}
      <div style={{
        position: 'absolute',
        top: '200vh', // Start after segment 3 (which is 200vh tall)
        left: '20px',
        width: 'calc(100vw - 40px)',
        height: '700vh', // 7 segments * 100vh each
        zIndex: 9999, // High z-index to show above charts
        pointerEvents: 'none', // Don't capture click events
        borderRadius: '8px',
        opacity: 1 // Fully opaque
      }}>
        <ExtinctSpeciesViz />
      </div>

      {/* Test Segment Template */}
      <div style={{position: 'relative'}}>
        <div style={{
          position: 'absolute',
          top: 20,
          left: 20,
          fontSize: '5rem',
          color: 'rgba(0,0,0,0.10)',
          fontWeight: 900,
          zIndex: 2000,
          pointerEvents: 'none',
        }}>3</div>
        <SegmentTemplate 
          header="Sea levels were steady for centuries,"
          headerSecondLine="until now."
          text="For most of the past millennium, sea levels remained relatively stable. But since the late 19th century, they have <strong>risen sharply</strong> due to climate-driven ocean warming and ice melt. Flooding worsens, drinking water is affected, and coastal communities are under threat."
          chartComponent={<HistoricalSeaLevelRiseExtended />}
          caption="<strong>Fig 1:</strong> Global mean sea level from the year 1000 to present. Data: Kopp <a href='https://www.pnas.org/doi/10.1073/pnas.1517056113' target='_blank' style='color: #9ca3af; text-decoration: underline;'>(link)</a> and NASA <a href='http://podaac.jpl.nasa.gov/dataset/MERGED_TP_J1_OSTM_OST_ALL_V52' target='_blank' style='color: #9ca3af; text-decoration: underline;'>(link)</a>"
          styles={{
            header: {
              fontSize: '2.5rem',
              fontWeight: 'normal',
              fontFamily: 'Helvetica World, Arial, sans-serif'
            },
            headerSecondLine: {
              fontSize: '3rem',
              fontWeight: 'bold',
              fontFamily: 'Times New Roman, serif',
              fontStyle: 'italic'
            }
          }}
        />
      </div>

      {/* Another test segment */}
      <div style={{position: 'relative'}}>
        <div style={{
          position: 'absolute',
          top: 20,
          left: 20,
          fontSize: '5rem',
          color: 'rgba(0,0,0,0.10)',
          fontWeight: 900,
          zIndex: 2000,
          pointerEvents: 'none',
        }}>4</div>
        <SegmentTemplate 
          header="The Pacific is rising,"
          headerSecondLine="but unevenly."
          text="These changes are <strong>not felt equally</strong>. Pacific Island nations, though among the least responsible for global warming, face some of its harshest impacts. With little elevation or room to retreat, rising seas already bring saltwater, erosion, and flooding."
          chartComponent={<SeaLevelRiseChart />}
          caption="<strong>Fig 2:</strong> Projected sea level rise scenarios, across selected Pacific Island nations. Data: Pacific Flooding Analysis Tool <a href='https://sealevel.nasa.gov/flooding-analysis-tool-pacific-islands/sea-level-rise?station-id=018&units=meters' target='_blank' style='color: #9ca3af; text-decoration: underline;'>(link)</a>"
          styles={{
            header: {
              fontSize: '2.5rem',
              fontWeight: 'normal',
              fontFamily: 'Helvetica World, Arial, sans-serif'
            },
            headerSecondLine: {
              fontSize: '3rem',
              fontWeight: 'bold',
              fontFamily: 'Times New Roman, serif',
              fontStyle: 'italic'
            }
          }}
        />
      </div>

      {/* Test segment with two-line title */}
      <div style={{position: 'relative'}}>
        <div style={{
          position: 'absolute',
          top: 20,
          left: 20,
          fontSize: '5rem',
          color: 'rgba(0,0,0,0.10)',
          fontWeight: 900,
          zIndex: 2000,
          pointerEvents: 'none',
        }}>5</div>
                         <SegmentTemplate 
          header="Impact varies across Pacific islands"
          headerSecondLine="low-laying islands are exposed more."
          text="The <strong>risk of flooding</strong> depends on more than rising seas alone. Elevation, coastal shape, and land movement all influence how soon and how often flooding occurs. On low-lying islands, even small increases in sea level can breach <strong>thresholds</strong> that once kept high tides at bay, making flooding more frequent and more severe."
          chartComponent={<HighestElevationChart />}
          caption="<strong>Fig 3:</strong> Maximum elevation of selected Pacific Island nations and territories. Data: Wikipedia <a href='https://en.wikipedia.org/wiki/List_of_elevation_extremes_by_country?utm_source=chatgpt.com' target='_blank' style='color: #9ca3af; text-decoration: underline;'>(link)</a>"
          styles={{
            header: {
              fontSize: '2.5rem',
              fontWeight: 'normal',
              fontFamily: 'Helvetica World, Arial, sans-serif'
            },
            headerSecondLine: {
              fontSize: '3rem',
              fontWeight: 'bold',
              fontFamily: 'Times New Roman, serif',
              fontStyle: 'italic'
            }
          }}
        />
      </div>

      {/* New Segment 6 */}
      <div style={{position: 'relative'}}>
        <div style={{
          position: 'absolute',
          top: 20,
          left: 20,
          fontSize: '5rem',
          color: 'rgba(0,0,0,0.10)',
          fontWeight: 900,
          zIndex: 2000,
          pointerEvents: 'none',
        }}>6</div>
        <SegmentTemplate 
          header="Many islanders live just above sea level,"
          headerSecondLine="where sea rise is already felt."
          text="Many Pacific Island nations have significant populations living in low-lying coastal areas. These communities are particularly vulnerable to sea level rise and coastal flooding, as even small increases in sea level can have dramatic impacts on their daily lives and infrastructure."
          chartComponent={<LowElevationChart />}
          caption="<strong>Fig 4:</strong> Percentage of national populations living between 0–5 meters above sea level in selected Pacific Island nations. Data: Pacific Data Hub <a href='https://pacificdata.org/data/dataset/population-living-in-low-elevation-coastal-zones-0-10m-and-0-20m-above-sea-level-df-pop-lecz' target='_blank' style='color: #9ca3af; text-decoration: underline;'>(link)</a>"
          styles={{
            header: {
              fontSize: '2.5rem',
              fontWeight: 'normal',
              fontFamily: 'Helvetica World, Arial, sans-serif'
            },
            headerSecondLine: {
              fontSize: '3rem',
              fontWeight: 'bold',
              fontFamily: 'Times New Roman, serif',
              fontStyle: 'italic'
            }
          }}
        />
      </div>

            {/* Segment 7 */}
      <div style={{position: 'relative'}}>
        <div style={{
          position: 'absolute',
          top: 20,
          left: 20,
          fontSize: '5rem',
          color: 'rgba(0,0,0,0.10)',
          fontWeight: 900,
          zIndex: 2000,
          pointerEvents: 'none',
        }}>7</div>
                 <SegmentTemplate 
           header="Climate risks are rising in the Pacific."
           headerSecondLine="So is human impact."
                     text="Flooding is not the only threat. Cyclones, droughts, and heat extremes are also affecting more people across the Pacific. While impacts vary by island and year, some nations have seen sharp spikes in those affected. The trend points to growing vulnerability as the climate continues to change."
          chartComponent={<NewChartComponent />}
          caption="<strong>Fig 5:</strong> Number of people affected by climate-related hazards in the Pacific, 2005–2023. Data: Pacific Data Hub <a href='https://blue-pacific-2050.pacificdata.org/climate-change-and-disasters/indicators?outcome=1.0' target='_blank' style='color: #9ca3af; text-decoration: underline;'>(link)</a> and EM-DAT <a href='https://public.emdat.be/data' target='_blank' style='color: #9ca3af; text-decoration: underline;'>(link)</a>"
           styles={{
             header: {
               fontSize: '2.5rem',
               fontWeight: 'normal',
               fontFamily: 'Helvetica World, Arial, sans-serif'
             },
             headerSecondLine: {
               fontSize: '3rem',
               fontWeight: 'bold',
               fontFamily: 'Times New Roman, serif',
               fontStyle: 'italic'
             }
           }}
         />
      </div>



             {/* Segment 9 */}
       <div style={{position: 'relative'}}>
         <div style={{
           position: 'absolute',
           top: 20,
           left: 20,
           fontSize: '5rem',
           color: 'rgba(0,0,0,0.10)',
           fontWeight: 900,
           zIndex: 2000,
           pointerEvents: 'none',
         }}>9</div>
                         <SegmentTemplate
          header="A Century of Disruptions, Warnings and Resistance"
          text="Natural disasters in the Pacific have become far more frequent over the past century. Since 1925, recorded events such as floods, storms, droughts, and other extremes have increased sharply. These disruptions serve as both a warning of accelerating climate risks and a backdrop to growing resistance through activism, legal action, and calls for climate justice."
          styles={{
            header: {
              fontSize: '2.5rem',
              fontWeight: 'normal',
              fontFamily: 'Helvetica World, Arial, sans-serif'
            }
          }}
        />
      </div>

       {/* New Segment 10 */}
      <div style={{position: 'relative'}}>
        <div style={{
          position: 'absolute',
          top: 20,
          left: 20,
          fontSize: '5rem',
          color: 'rgba(0,0,0,0.10)',
          fontWeight: 900,
          zIndex: 2000,
          pointerEvents: 'none',
         }}>10</div>
         <section style={{ 
           position: 'relative', 
           height: '100vh', 
           width: '100%', 
           background: '#d6f525', 
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
               background: '#d6f525',
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
       </div>

       {/* Final Section - Custom styled without chart */}
       <div style={{position: 'relative'}}>
         <div style={{
           position: 'absolute',
           top: 20,
           left: 20,
           fontSize: '5rem',
           color: 'rgba(0,0,0,0.10)',
           fontWeight: 900,
           zIndex: 2000,
           pointerEvents: 'none',
         }}>11</div>
                   <section style={{
            width: '100%',
            height: '100vh',
            background: '#d6f525',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            scrollSnapAlign: 'start',
            borderBottom: '3px solid #9ca3af',
          }}>
           <div style={{
             display: 'flex',
             flexDirection: 'column',
             alignItems: 'center',
             justifyContent: 'center',
             width: '100%',
             maxWidth: '1050px',
             margin: '0 auto',
             marginTop: '-50px',
             gap: '2rem'
           }}>
             {/* Header */}
             <div style={{
               width: '100%',
               maxWidth: '800px',
               textAlign: 'left'
             }}>
               <h1 style={{
                 fontSize: '2.5rem',
                 fontWeight: 'bold',
                 color: '#000',
                 marginBottom: '0',
                 textAlign: 'left',
                 marginTop: '5rem'
               }}>Final Section Title</h1>
             </div>
             
             {/* Text content */}
             <div style={{
               width: '100%',
               maxWidth: '800px',
               textAlign: 'left'
             }}>
               <p style={{
                 fontSize: '1.4rem',
                 color: '#000',
                 marginBottom: '2rem',
                 lineHeight: 1.5
               }}
               dangerouslySetInnerHTML={{ __html: "This is the final section content. It uses the same styling and formatting as the SegmentTemplate but without a chart placeholder. You can add your final text content here." }}
               />
             </div>
           </div>
         </section>
      </div>

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
      {/* AudioPlayer removed to eliminate missing file error */}
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
      {/* AudioPlayer removed to eliminate missing file error */}
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
      {/* AudioPlayer removed to eliminate missing file error */}
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

