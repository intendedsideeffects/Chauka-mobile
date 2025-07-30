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
          playsInline
          onLoadStart={() => console.log('Ocean video loading started')}
          onCanPlay={() => console.log('Ocean video can play')}
          onError={(e) => console.error('Ocean video error:', e)}
          onPlay={() => console.log('Ocean video started playing')}
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
        {/* Temporarily commented out for debugging */}
        {/* <div
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
        /> */}
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
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none'
          }}
        />
        {/* Round Button with Text - Top of Video Section */}
        <div style={{
          position: 'absolute',
          top: '33vh',
          left: '33vw',
          zIndex: 1000,
          pointerEvents: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px'
        }}
        onMouseEnter={(e) => {
          const popup = e.currentTarget.querySelector('.hover-popup');
          if (popup) popup.style.display = 'block';
        }}
        onMouseLeave={(e) => {
          const popup = e.currentTarget.querySelector('.hover-popup');
          if (popup) popup.style.display = 'none';
        }}
        >
          {/* Circular Button with Directional Triangles */}
          <div style={{
            position: 'relative',
            width: '45px',
            height: '45px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
                        {/* Triangles removed */}
            
            {/* Main Circular Button */}
                              <div
                    style={{
                      width: '45px',
                      height: '45px',
                      borderRadius: '50%',
                      background: '#eba728',
                      border: 'none',
                      cursor: 'grab',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      color: '#f4d47c',
                      fontFamily: 'Helvetica World, Arial, sans-serif',
                      boxShadow: '0 4px 12px rgba(235, 167, 40, 0.3)',
                      transition: 'all 0.3s ease',
                      zIndex: 10,
                      lineHeight: '1',
                      padding: '0',
                      pointerEvents: 'auto',
                      userSelect: 'none',
                      WebkitUserSelect: 'none',
                      MozUserSelect: 'none',
                      msUserSelect: 'none',
                      textAlign: 'center',
                      opacity: 0.9
                    }}
              onMouseEnter={(e) => {
                e.target.style.background = '#d49522';
                e.target.style.transform = 'scale(1.1)';
                e.target.style.cursor = 'grabbing';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#eba728';
                e.target.style.transform = 'scale(1)';
                e.target.style.cursor = 'grab';
              }}
            >
              explore<br/>sky
            </div>
          </div>
          
          {/* Hover Popup */}
          <div 
            className="hover-popup"
            style={{
              position: 'absolute',
              top: '-80px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 'normal',
              fontFamily: 'Helvetica World, Arial, sans-serif',
              textAlign: 'center',
              whiteSpace: 'nowrap',
              zIndex: 1001,
              display: 'none',
              pointerEvents: 'none',
              maxWidth: '200px',
              lineHeight: '1.4'
            }}
          >
            Can you find the Southern Cross?<br/>
            Explore the night sky by dragging.
          </div>
        </div>

        {/* Music Button on Canoe Area - Hidden for now */}
        {/* <div style={{
          position: 'absolute',
          top: '60vh',
          left: '70vw',
          zIndex: 1000,
          pointerEvents: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px'
        }}>
          <MusicAudioPlayer />
        </div> */}

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
          header="Sea levels held steady for a millennium,"
          headerSecondLine="until now."
          text="For most of the past millennium, sea levels remained relatively stable. But since the late 19th century, they have <strong>risen sharply</strong> due to climate-driven ocean warming and ice melt. Flooding worsens, drinking water is affected, and <strong>coastal communities are under threat</strong>."
          chartComponent={<HistoricalSeaLevelRiseExtended />}
          caption="<strong>Fig 1:</strong> Global mean sea level from the year 1000 to present, shown relative to the approximate year 2000 baseline (0 cm). The projection to 2050 assumes 1.5°C to 2.0°C of global warming. Data: Kopp <a href='https://www.pnas.org/doi/10.1073/pnas.1517056113' target='_blank' style='color: #9ca3af; text-decoration: underline;'>(link)</a> and NASA <a href='http://podaac.jpl.nasa.gov/dataset/MERGED_TP_J1_OSTM_OST_ALL_V52' target='_blank' style='color: #9ca3af; text-decoration: underline;'>(link)</a>"
          styles={{
            header: {
              fontSize: '2.6rem',
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
        
        {/* Projection label */}
        <div style={{
          position: 'absolute',
          top: 'calc(40vh - 250px)',
          left: 'calc(80vw - 30px)',
          zIndex: 9999,
          pointerEvents: 'none',
          fontSize: '14px',
          fontFamily: 'Helvetica World, Arial, sans-serif',
          color: '#000000',
          fontWeight: 'bold',
          lineHeight: '1.4',
          maxWidth: '300px'
        }}>
          <strong>Projection</strong>
        </div>
        
        {/* Annotation for section 3 - positioned outside chart container */}
        <div style={{
          position: 'absolute',
          top: 'calc(40vh - 230px)',
          left: 'calc(80vw - 30px)',
          zIndex: 9999,
          pointerEvents: 'none',
          fontSize: '14px',
          fontFamily: 'Helvetica World, Arial, sans-serif',
          color: '#000000',
          fontWeight: 'normal',
          lineHeight: '1.4',
          maxWidth: '300px'
        }}>
          Under 1.5°C to 2.0°C of global warming,<br/>
          sea level rise is expected to increase by<br/>
          <strong>~25 cm in 2050.</strong>
        </div>
        

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



             {/* New Segment */}
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
          header="Placeholder Header"
          text="Placeholder text for the new segment that will be added here. This section will contain new content and potentially a new visualization."
          styles={{
            header: {
              fontSize: '2.5rem',
              fontWeight: 'normal',
              fontFamily: 'Helvetica World, Arial, sans-serif'
            }
          }}
        />
      </div>



      {/* Placeholder Segment 10 */}
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
        <SegmentTemplate
          header="Placeholder Segment 10"
          text="This is a placeholder segment that will be filled with content later. It follows the same structure as other segments in the project."
          styles={{
            header: {
              fontSize: '2.5rem',
              fontWeight: 'normal',
              fontFamily: 'Helvetica World, Arial, sans-serif'
            }
          }}
        />
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
            background: '#3d557a',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            scrollSnapAlign: 'start',
            borderBottom: '3px solid #9ca3af',
          }}>
           {/* Sunrise effect */}
           <div style={{
             position: 'absolute',
             bottom: 0,
             left: 0,
             width: '100%',
             height: '80%',
             background: 'radial-gradient(ellipse 80% 120% at 30% 135%, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 0, 0.8) 10%, rgba(255, 165, 0, 0.7) 25%, rgba(255, 140, 0, 0.5) 40%, rgba(255, 69, 0, 0.3) 60%, rgba(61, 85, 122, 0.8) 80%, rgba(61, 85, 122, 1) 100%)',
             zIndex: 15,
             pointerEvents: 'none'
           }} />

           {/* Star Globe in front of sunrise */}
             <div style={{
             position: 'absolute', 
             top: 0, 
             left: 0, 
               width: '100%',
             height: '100%', 
             zIndex: 20, 
             pointerEvents: 'auto'
           }}>
             <InteractiveStarGlobe />
             </div>
             
             {/* Collaborators wanted image */}
             <div style={{
               position: 'absolute',
               top: 0,
               left: '-50px',
               width: 'calc(100% + 100px)',
               height: '100%',
               zIndex: 25,
               margin: 0,
               padding: 0,
               pointerEvents: 'none',
               backgroundColor: 'rgba(255,0,0,0.1)'
             }}>
               <img 
                 src="/Collaborators wanted.svg" 
                 alt="Collaborators wanted" 
                 style={{
                   width: '100%',
                   height: '100%',
                   objectFit: 'cover',
                   margin: 0,
                   padding: 0,
                   display: 'block'
                 }}
                 onLoad={() => console.log('Collaborators image loaded successfully')}
                 onError={(e) => console.error('Error loading image:', e)}
               />
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
        {/* Play/pause symbols hidden */}
              </svg>
      {/* Reset button removed */}
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
    const audio = new Audio('/oceansound.m4a');
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

// Music Audio Player Component
function MusicAudioPlayer() {
  const [playing, setPlaying] = React.useState(false);
  const [audioElement, setAudioElement] = React.useState(null);
  const [audioLoaded, setAudioLoaded] = React.useState(false);

  React.useEffect(() => {
    const audio = new Audio();
    audio.src = '/chaukasound.mp3'; // Using same audio for now, can be changed later
    audio.volume = 0.4;
    audio.loop = true;
    audio.preload = 'metadata';
    
    audio.addEventListener('canplaythrough', () => {
      setAudioLoaded(true);
    });
    
    audio.addEventListener('error', (e) => {
      console.error('Music audio error:', e);
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
      console.error('Error playing music audio:', error);
    }
  };

  return (
    <div
      style={{
        width: '80px',
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#3d557a',
        borderRadius: '50%',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(61, 85, 122, 0.3)',
        transition: 'all 0.3s ease',
        position: 'relative',
      }}
      onClick={handleToggle}
      onMouseEnter={(e) => {
        e.target.style.background = '#2a3f5f';
        e.target.style.transform = 'scale(1.1)';
      }}
      onMouseLeave={(e) => {
        e.target.style.background = '#3d557a';
        e.target.style.transform = 'scale(1)';
      }}
      aria-label="Play or pause music"
    >
      {/* Text */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '12px',
        fontWeight: 'bold',
        color: 'white',
        fontFamily: 'Helvetica World, Arial, sans-serif',
        textAlign: 'center',
        lineHeight: '1.2',
        zIndex: 1,
        pointerEvents: 'none'
      }}>
        Click for<br/>music!
      </div>
      
      {/* Play/Pause Icon */}
      <svg width="80" height="80" style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none', zIndex: 2 }}>
        {!playing && (
          <polygon points="35,30 50,40 35,50" fill="white" style={{ opacity: 0.8 }} />
        )}
        {playing && (
          <g>
            <rect x="32.5" y="31.5" width="4" height="16" rx="1" fill="white" style={{ opacity: 0.8 }} />
            <rect x="40.5" y="31.5" width="4" height="16" rx="1" fill="white" style={{ opacity: 0.8 }} />
          </g>
        )}
      </svg>
    </div>
  );
}

