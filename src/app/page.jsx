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
            
            {/* Animated Hand Button */}
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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ animation: 'pointing 2s ease-in-out infinite' }}>
                <path d="M13.64 21.97C13.14 22.16 12.54 22 12.31 21.55L9.07 14.56C8.82 14.07 8.5 13.73 8.13 13.53C7.76 13.33 7.35 13.28 6.96 13.38L4.75 13.97C4.16 14.13 3.5 13.87 3.21 13.34L2.21 11.34C1.92 10.81 2.08 10.15 2.59 9.88L4.59 8.88C5.12 8.59 5.78 8.75 6.07 9.28L7.07 11.28C7.36 11.81 7.92 12.07 8.51 11.91L10.72 11.32C11.11 11.22 11.52 11.27 11.89 11.47C12.26 11.67 12.58 12.01 12.83 12.5L16.07 19.49C16.3 19.94 16.14 20.54 15.64 20.73L13.64 21.97Z"/>
                <path d="M17.5 8.5C18.5 8.5 19.5 7.5 19.5 6.5C19.5 5.5 18.5 4.5 17.5 4.5C16.5 4.5 15.5 5.5 15.5 6.5C15.5 7.5 16.5 8.5 17.5 8.5Z"/>
              </svg>
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
        
        {/* Annotation for section 3 - positioned outside chart container */}
        <div style={{
          position: 'absolute',
          top: 'calc(40vh - 120px)',
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
          <strong>Projection</strong><br/>
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
          header="Sea level is rising,"
          headerSecondLine="but not at the same rate."
          text="Sea level rise is <strong>uneven</strong>. The Pacific is a <strong>hotspot</strong>. Driven by ocean patterns, melting ice, and land movement, some islands are seeing <strong>faster-than-average</strong> increases. For nations with limited land and elevation, these trends bring real and immediate threats."
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
          text="Low elevation makes many Pacific islands especially vulnerable to sea level rise. When land sits just a few meters above the ocean, even small increases can <strong>overwhelm coastlines</strong>. With nowhere higher to go, communities face growing challenges to stay safe, maintain clean water, and protect their homes."
          chartComponent={<HighestElevationChart />}
          caption="<strong>Fig 3:</strong> Average elevation of selected Pacific Island nations and territories. Data: Wikipedia <a href='https://en.wikipedia.org/wiki/List_of_elevation_extremes_by_country?utm_source=chatgpt.com' target='_blank' style='color: #9ca3af; text-decoration: underline;'>(link)</a>"
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
          text="Many Pacific Island nations have significant <strong>populations living in low-lying coastal areas</strong>. These communities are <strong>particularly vulnerable</strong> to sea level rise and coastal flooding, as even small increases in sea level can have dramatic impacts on their daily lives and infrastructure."
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
          header="Conclusion"
          text="The Pacific is on the <strong>front lines</strong> of the climate crisis. While sea levels are rising globally, their impacts are <strong>not evenly distributed</strong>. Low-lying island nations such as Tuvalu, Kiribati, and the Marshall Islands, with an average elevation of just <strong>2 meters</strong>, face an existential threat from even modest increases in sea level. These islands have little elevation to buffer rising tides and no higher ground for retreat.

<br/><br/>

But elevation alone does not tell the full story. <strong>Ocean currents</strong>, land movement, and storm exposure all contribute to risk, making some regions more vulnerable than others. Climate hazards that were once rare are becoming more <strong>frequent</strong> and <strong>disruptive</strong>.

<br/><br/>

In recent years, hundreds of thousands of people in the Pacific have been affected by <strong>floods</strong>, <strong>cyclones</strong>, and <strong>droughts</strong>, showing a sharp rise in human impact.

<br/><br/>

The data points to a clear trend: as the <strong>climate warms</strong>, the risks for Pacific communities are increasing. What is happening in these islands is not just a warning, but a <strong>preview</strong> of what coastal regions around the world may face if emissions and sea level rise are not brought under control."
          chartComponent={null}
                      styles={{
              header: {
                fontSize: '2.5rem',
                fontWeight: 'normal',
                fontFamily: 'Helvetica World, Arial, sans-serif'
              },
              placeholderChart: {
                display: 'none'
              }
            }}
            caption=""
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
  const [showTooltip, setShowTooltip] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setShowButtons(window.scrollY === 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggle = () => {
    setShowTooltip(!showTooltip);
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
      
      {/* Tooltip */}
      {showTooltip && (
        <div style={{
          position: 'fixed',
          top: '15%',
          left: '70%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(0, 10, 30, 0.8)',
          color: '#e0e0e0',
          padding: '30px',
          borderRadius: '12px',
          maxWidth: '400px',
          zIndex: 10000,
          fontFamily: 'Helvetica World, Arial, sans-serif',
          fontSize: '16px',
          lineHeight: '1.6',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ marginBottom: '20px' }}>
            This video collage is inspired by the <strong>Chauka</strong>, a bird found only on <strong>Manus Island</strong> in Papua New Guinea. It plays a role in daily life and is deeply respected, appearing often in local stories. People say its calls help mark the passage of time, acting as a kind of <strong>timekeeper</strong>. But in many legends, the Chauka also appears as a <strong>warning</strong>.
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            The story behind this visualization is about a man who brings home a new wife. Not long after, the Chauka begins calling again and again. The villagers pay attention. They sense something is wrong. The woman is not who she says she is. She is a spirit in disguise. The villagers listen to the bird and decide to leave the island by boat.
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            Stories like this are still told on Manus. The Chauka is seen as a bird that notices things before people do. It speaks up when something is off, when something is coming.
          </div>
          
          <div style={{ 
            fontStyle: 'italic', 
            fontSize: '14px', 
            opacity: 0.8,
            borderTop: '1px solid rgba(255,255,255,0.2)',
            paddingTop: '15px'
          }}>
            Note: We worked with local knowledge through Bertha, who is from Manus. While we couldn't capture the full version of the story in time for this release, we hope to return to it and share more when the moment is right.
          </div>
          
          <button 
            onClick={() => setShowTooltip(false)}
            style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '5px',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            ×
          </button>
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
        @keyframes pointing {
          0%, 100% { transform: translateX(0px) rotate(0deg); }
          50% { transform: translateX(2px) rotate(5deg); }
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

