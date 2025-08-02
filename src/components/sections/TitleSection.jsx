'use client';

import React from 'react';

const TitleSection = ({ 
  title = "This is a global warning.",
  subtitle = "",
  mapTrigger = "MAP",
  content = "On Manus Island, the Chauka bird once warned villagers when something was wrong. Its call meant: stop and pay attention.<br/><br/>Now, the ocean is calling.<br/><br/>It sends signals through rising tides, salt in gardens, and floods that reach farther each year. Pacific Island nations are the first to feel this. They didn't cause the crisis, but they are living with its consequences.<br/><br/>Elsewhere, people may not notice yet. But the warning is already here.<br/><br/><strong>This is a global warning.</strong>",
  styles = {}
}) => {
  const defaultStyles = {
    container: {
      width: '100%',
      height: '100vh',
      background: 'white',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 4rem',
      position: 'relative',
      scrollSnapAlign: 'start',
    },
    contentWrapper: {
      color: '#000',
      fontSize: '1.5rem',
      maxWidth: '30%',
      textAlign: 'left',
      fontFamily: 'Helvetica World, Arial, sans-serif',
      fontWeight: 400,
      lineHeight: 1.6,
      zIndex: 2,
      position: 'relative',
      flexShrink: 0,
    },
    title: {
      fontSize: '8rem',
      fontWeight: 'normal', // Changed from 'bold' to 'normal'
      color: '#000',
      marginBottom: '0',
      textAlign: 'left', // Changed from 'center' to 'left'
      marginTop: '0',
      fontFamily: 'Helvetica World, Arial, sans-serif',
      lineHeight: '1'
    },
    titleSecondLine: {
      fontSize: '3.2rem',
      fontWeight: 'bold', // Changed from 'normal' to 'bold'
      color: '#000',
      marginBottom: '4rem',
      textAlign: 'left', // Changed from 'center' to 'left'
      marginTop: '0.1rem', // Reduced from '0.5rem' to '0.1rem' to bring lines closer
      fontFamily: 'Times New Roman, serif', // Changed from Helvetica World to Times New Roman
      fontStyle: 'italic', // Added italic style
      lineHeight: '1'
    },
    subtitle: {
      marginBottom: '2rem',
      fontSize: '1.5rem',
      color: '#000'
    },
    mapTrigger: {
      marginBottom: '-11rem',
      fontSize: '1rem',
      color: 'transparent'
    },
    content: {
      marginBottom: '2rem',
      fontSize: '1.3rem',
      color: '#000',
      marginTop: '0',
      fontFamily: 'Helvetica World, Arial, sans-serif'
    },
    emptySpace: {
      height: '1rem'
    },
    spilhausContainer: {
      width: '70%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      position: 'relative',
      marginTop: '0vh',
      marginLeft: '0%'
    },
    spilhausWrapper: {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    spilhausImage: {
      width: '200%',
      height: 'auto',
      maxHeight: '100vh',
      objectFit: 'contain',
      display: 'block',
      filter: 'none',
      opacity: 1,
      transform: 'rotate(0deg)',
      marginLeft: '0%',
      marginTop: '50px'
    },
    pulsingDot: {
      position: 'absolute',
      width: '200px',
      height: '200px',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(67, 97, 238, 0.95) 0%, rgba(67, 97, 238, 0.7) 50%, rgba(67, 97, 238, 0.2) 100%)',
      filter: 'blur(8px)',
      animation: 'pulse 3s ease-in-out infinite',
      zIndex: 1,
      top: '35%',
      left: '70%',
      transform: 'translate(-50%, -50%) rotate(-90deg)',
      pointerEvents: 'none'
    },
    smallPulsingDot: {
      position: 'absolute',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(67, 97, 238, 0.8) 0%, rgba(67, 97, 238, 0.4) 50%, rgba(67, 97, 238, 0.1) 100%)',
      filter: 'blur(2px)',
      animation: 'smallPulse 2s ease-in-out infinite',
      zIndex: 1,
      pointerEvents: 'none',
      transform: 'rotate(-90deg)'
    }
  };

  // Add CSS animation
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0% {
          transform: translate(-50%, -50%) scale(1);
          opacity: 0.6;
        }
        50% {
          transform: translate(-50%, -50%) scale(1.2);
          opacity: 0.8;
        }
        100% {
          transform: translate(-50%, -50%) scale(1);
          opacity: 0.6;
        }
      }
      
      @keyframes smallPulse {
        0% {
          transform: scale(1);
          opacity: 0.4;
        }
        50% {
          transform: scale(1.3);
          opacity: 0.7;
        }
        100% {
          transform: scale(1);
          opacity: 0.4;
        }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Merge default styles with custom styles
  const mergedStyles = {
    container: { ...defaultStyles.container, ...styles.container },
    contentWrapper: { ...defaultStyles.contentWrapper, ...styles.contentWrapper },
    title: { ...defaultStyles.title, ...styles.title },
    titleSecondLine: { ...defaultStyles.titleSecondLine, ...styles.titleSecondLine },
    subtitle: { ...defaultStyles.subtitle, ...styles.subtitle },
    mapTrigger: { ...defaultStyles.mapTrigger, ...styles.mapTrigger },
    content: { ...defaultStyles.content, ...styles.content },
    emptySpace: { ...defaultStyles.emptySpace, ...styles.emptySpace },
    spilhausContainer: { ...defaultStyles.spilhausContainer, ...styles.spilhausContainer },
    spilhausWrapper: { ...defaultStyles.spilhausWrapper, ...styles.spilhausWrapper },
    spilhausImage: { ...defaultStyles.spilhausImage, ...styles.spilhausImage },
    pulsingDot: { ...defaultStyles.pulsingDot, ...styles.pulsingDot },
    smallPulsingDot: { ...defaultStyles.smallPulsingDot, ...styles.smallPulsingDot }
  };

  return (
    <section style={mergedStyles.container}>
      {/* Left side - Text content */}
      <div style={mergedStyles.contentWrapper}>
        {/* Blue explore button removed */}

        {/* Title */}
        <div>
          <h1 style={mergedStyles.title}>Chauka</h1>
          <h1 style={mergedStyles.titleSecondLine}>This is a global warning.</h1>
        </div>
        
        {/* Main content */}
        <p 
          style={mergedStyles.content} 
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>

      {/* Right side - Spilhaus Map */}
      <div style={mergedStyles.spilhausContainer}>
        <div style={mergedStyles.spilhausWrapper}>
          <img 
            src="/spilhaus_black.png" 
            alt="Spilhaus Projection" 
            style={mergedStyles.spilhausImage}
          />
          

          
          {/* Footnote */}
          <div style={{
            position: 'absolute',
            top: '134px',
            right: '20px',
            fontSize: '0.9rem',
            color: '#000000',
            fontWeight: 400,
            textAlign: 'left',
            maxWidth: '25%',
            lineHeight: '1.2'
          }}>
            The Spilhaus projection shows the ocean as one connected body, not broken apart like most maps. It helps us see that what happens in one part affects all others. The ocean is the focus, not the background.
          </div>
          
          {/* Annotation line - horizontal under footer */}
          <div style={{
            position: 'absolute',
            top: '224px',
            right: '205px',
            width: '124px',
            height: '1px',
            backgroundColor: '#000',
            zIndex: 1
          }} />
          
          {/* Annotation line - angled down to map */}
          <div style={{
            position: 'absolute',
            top: '224px',
            right: '329px',
            width: '1px',
            height: '300px',
            backgroundColor: '#000',
            transform: 'rotate(15deg)',
            transformOrigin: 'top left',
            zIndex: 1
          }} />
          
          {/* 9 Small Pulsing Dots in Pacific Islands */}
          <div style={{
            ...mergedStyles.smallPulsingDot,
            width: '80px',
            height: '80px',
            top: '40%',
            left: '65%',
            animationDelay: '0s'
          }} />
          <div style={{
            ...mergedStyles.smallPulsingDot,
            width: '30px',
            height: '30px',
            top: '45%',
            left: '70%',
            animationDelay: '0.3s'
          }} />
          <div style={{
            ...mergedStyles.smallPulsingDot,
            width: '35px',
            height: '35px',
            top: '45%',
            left: '75%',
            animationDelay: '0.6s'
          }} />
          <div style={{
            ...mergedStyles.smallPulsingDot,
            width: '28px',
            height: '28px',
            top: '38%',
            left: '68%',
            animationDelay: '0.9s'
          }} />
          <div style={{
            ...mergedStyles.smallPulsingDot,
            width: '32px',
            height: '32px',
            top: '45%',
            left: '62%',
            animationDelay: '1.2s'
          }} />
          <div style={{
            ...mergedStyles.smallPulsingDot,
            width: '25px',
            height: '25px',
            top: '42%',
            left: '72%',
            animationDelay: '1.5s'
          }} />
          <div style={{
            ...mergedStyles.smallPulsingDot,
            width: '38px',
            height: '38px',
            top: '43%',
            left: '58%',
            animationDelay: '1.8s'
          }} />
          <div style={{
            ...mergedStyles.smallPulsingDot,
            width: '29px',
            height: '29px',
            top: '38%',
            left: '63%',
            animationDelay: '2.1s'
          }} />
          <div style={{
            ...mergedStyles.smallPulsingDot,
            width: '31px',
            height: '31px',
            top: '38%',
            left: '67%',
            animationDelay: '2.4s'
          }} />
          <div style={{
            ...mergedStyles.smallPulsingDot,
            width: '35px',
            height: '35px',
            top: '42%',
            left: '55%',
            animationDelay: '2.7s'
          }} />
          <div style={{
            ...mergedStyles.smallPulsingDot,
            width: '48px',
            height: '48px',
            top: '52%',
            left: '60%',
            animationDelay: '3.0s'
          }} />
          <div style={{
            ...mergedStyles.smallPulsingDot,
            width: '19px',
            height: '19px',
            top: '47%',
            left: '70%',
            animationDelay: '3.3s'
          }} />
          
          {/* Large and small blue static dots in bottom right corner - exact FloatingDot style */}
          <svg style={{
            position: 'absolute',
            top: '77%',
            left: '82%',
            width: '150px',
            height: '150px',
            zIndex: 1,
            pointerEvents: 'none'
          }}>
            <defs>
              <filter id="glow-large">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            {/* Blurry outline - exact FloatingDot calculation */}
            <circle
              cx="75"
              cy="75"
              r="34"
              fill="#0066cc"
              style={{
                opacity: 0.3,
                filter: 'url(#glow-large)',
              }}
            />
                         {/* Main dot - exact FloatingDot calculation */}
             <circle
               cx="75"
               cy="75"
               r="30"
               fill="#0066cc"
               style={{
                 opacity: 0.8,
                 filter: 'url(#glow-large)',
               }}
             />
            {/* Annotation */}
            <text
              x="75"
              y="130"
              textAnchor="middle"
              fill="#000000"
              fontSize="12"
              fontFamily="Helvetica World, Arial, sans-serif"
            >
              large flood
            </text>
          </svg>
          
          <svg style={{
            position: 'absolute',
            top: '81%',
            left: '92%',
            width: '100px',
            height: '100px',
            zIndex: 1,
            pointerEvents: 'none'
          }}>
            <defs>
              <filter id="glow-small">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            {/* Blurry outline - exact FloatingDot calculation */}
            <circle
              cx="50"
              cy="50"
              r="19"
              fill="#0066cc"
              style={{
                opacity: 0.3,
                filter: 'url(#glow-small)',
              }}
            />
                         {/* Main dot - exact FloatingDot calculation */}
             <circle
               cx="50"
               cy="50"
               r="15"
               fill="#0066cc"
               style={{
                 opacity: 0.8,
                 filter: 'url(#glow-small)',
               }}
             />
            {/* Annotation */}
            <text
              x="50"
              y="90"
              textAnchor="middle"
              fill="#000000"
              fontSize="12"
              fontFamily="Helvetica World, Arial, sans-serif"
            >
              small flood
            </text>
          </svg>
        </div>
      </div>
    </section>
  );
};

export default TitleSection; 