'use client';

import React, { useState, useRef } from 'react';
import AnimatedExtinctionChartCopy from "./charts/AnimatedExtinctionChartCopy";
import BirdExtinctionBubbleChart from "./charts/BirdExtinctionBubbleChart";
// import ExtinctSpeciesViz from './components/ExtinctSpeciesViz'; // Import the new component

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
  const poemWrapperRef = useRef();

  // Slider state for chart
  const [barEndIndex, setBarEndIndex] = useState(0);
  const [maxBarIndex, setMaxBarIndex] = useState(0);

  // Pause/play logic for video
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handler for slider change
  const handleSliderChange = (event) => {
    setBarEndIndex(parseInt(event.target.value));
  };

  return (
    <div style={{ width: '100%', minHeight: '300vh', background: '#f8f8f8', position: 'relative' }}>
      {/* Video Section */}
      <section style={{ position: 'relative', height: '100vh', width: '100%', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <video
          ref={videoRef}
          src="/ocean.mp4"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', background: '#222' }}
          autoPlay
          loop
          playsInline
        />
        {/* White overlay to cover any black line at the bottom edge */}
        <div style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          height: '14px',
          background: 'white',
          zIndex: 10,
          pointerEvents: 'none',
        }} />
        {/* Centered LOSS title and pause/play button */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 11,
          pointerEvents: 'none',
        }}>
          <h1 style={{
            fontSize: '6rem',
            fontWeight: 700,
            letterSpacing: '-.05em',
            marginBottom: '1.5rem',
            fontFamily: 'inherit',
            textAlign: 'center',
            lineHeight: 1,
            pointerEvents: 'auto',
            color: '#c28f3e',
          }}>Chauka</h1>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: 400,
            color: '#c28f3e',
            textAlign: 'center',
            maxWidth: '700px',
            margin: '0 auto 2.5rem auto',
            lineHeight: 1.3,
            pointerEvents: 'auto',
          }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </div>
          <button
            onClick={togglePlay}
            style={{
              background: 'transparent',
              border: 'none',
              borderRadius: '50%',
              width: '2.2rem',
              height: '2.2rem',
              fontSize: '1.2rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0',
              pointerEvents: 'auto',
            }}
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
          >
            {isPlaying ? (
              <svg width="1.2rem" height="1.2rem" viewBox="0 0 28 28" style={{ display: 'block' }}>
                <rect x="7" y="5" width="4" height="18" fill="black" />
                <rect x="17" y="5" width="4" height="18" fill="black" />
              </svg>
            ) : (
              <svg width="1.2rem" height="1.2rem" viewBox="0 0 28 28" style={{ display: 'block' }}>
                <polygon points="8,5 22,14 8,23" fill="black" />
              </svg>
            )}
          </button>
        </div>
      </section>

      {/* Placeholder text section directly under video */}
      <section
        style={{
          width: '100%',
          minHeight: '180vh', // Make this section much longer to fit the placeholder text
          background: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
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
            margin: '6rem auto',
          }}
        >
          {poemLines.map((line, idx) => (
            <p key={idx} style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>{line}</p>
          ))}
        </div>
      </section>

      {/* Grey segment with intro text inside */}
      {/* Remove the two chart sections below */}
      {/* <div style={{ width: '100%', maxWidth: 1400, margin: '0 auto', marginTop: 'calc(1.5rem - 2cm)', marginBottom: '3rem' }}>
          <AnimatedExtinctionChartCopy
            barEndIndex={barEndIndex}
            setMaxBarIndex={setMaxBarIndex}
          />
        </div>
        <div style={{ width: '100%', maxWidth: 1400, margin: '3rem auto', padding: '0 1rem' }}>
          <BirdExtinctionBubbleChart />
        </div> */}
        {/* Add PlotsScatterChart below with title and description */}
        <div style={{ width: '100%', margin: '3rem 0', padding: '0 1rem' }}>
          <div style={{
            maxWidth: '700px',
            margin: '0 auto 2rem auto',
            padding: '0 1rem',
            textAlign: 'left',
            color: '#111',
          }}>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: 700,
              marginBottom: '1.5rem',
              letterSpacing: '-.01em',
              textAlign: 'left',
            }}>
              The Story of Loss
            </h2>
            <p style={{
              fontSize: '1.15rem',
              color: '#222',
              marginBottom: '0',
              lineHeight: 1.6,
              textAlign: 'left',
            }}>
              This scatterplot is an exploratory space to discover the lost birds and birds soon to be lost. Each dot is a species: <b>small dot</b> = just name, <b>medium dot</b> = story, <b>large dot</b> = sound. Explore to see which birds are gone, and which are at risk.
            </p>
          </div>
          {/* <ExtinctSpeciesViz /> */}
        </div>
    </div>
  );
}
