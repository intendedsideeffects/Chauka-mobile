'use client';

import React from 'react';

const TitleSection = ({ 
  title = "This is a global warning.",
  subtitle = "",
  mapTrigger = "MAP",
  content = "The ocean is <strong>one connected body</strong>, and like any body it sends <strong>signals</strong>. On Manus, the Chauka bird once warned villagers when something was wrong. Its call meant it was time to pay attention.<br/><br/>Now, it's the ocean that is calling. Through rising tides, floods, and salt creeping into gardens, it tells us that something is <strong>changing</strong>. Pacific island nations are the first to feel these shifts. They did not cause this crisis, but they are living with its consequences.<br/><br/>Others, far away, may not pay attention yet. But the warning is already here. This is a <strong>global warning</strong>.",
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
      maxWidth: '45%',
      textAlign: 'left',
      fontFamily: 'Helvetica World, Arial, sans-serif',
      fontWeight: 400,
      lineHeight: 1.6,
      zIndex: 2,
      position: 'relative',
      flexShrink: 0,
    },
    title: {
      fontSize: '4rem',
      fontWeight: 'normal', // Changed from 'bold' to 'normal'
      color: '#000',
      marginBottom: '0',
      textAlign: 'left', // Changed from 'center' to 'left'
      marginTop: '0',
      fontFamily: 'Helvetica World, Arial, sans-serif',
      lineHeight: '1'
    },
    titleSecondLine: {
      fontSize: '4rem',
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
      fontSize: '1.4rem',
      color: '#000',
      marginTop: '0',
      fontFamily: 'Helvetica World, Arial, sans-serif'
    },
    emptySpace: {
      height: '1rem'
    },
    spilhausContainer: {
      width: '55%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    },
    spilhausWrapper: {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    spilhausImage: {
      width: '100%',
      height: 'auto',
      maxHeight: '95vh',
      objectFit: 'contain',
      display: 'block'
    },
    pulsingDot: {
      position: 'absolute',
      width: '300px',
      height: '300px',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(67, 97, 238, 0.95) 0%, rgba(67, 97, 238, 0.7) 50%, rgba(67, 97, 238, 0.2) 100%)',
      filter: 'blur(8px)',
      animation: 'pulse 3s ease-in-out infinite',
      zIndex: 1,
      top: '45%',
      left: '65%',
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none'
    },
    smallPulsingDot: {
      position: 'absolute',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(67, 97, 238, 0.8) 0%, rgba(67, 97, 238, 0.4) 50%, rgba(67, 97, 238, 0.1) 100%)',
      filter: 'blur(2px)',
      animation: 'smallPulse 2s ease-in-out infinite',
      zIndex: 1,
      pointerEvents: 'none'
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
          <h1 style={mergedStyles.title}>This is a</h1>
          <h1 style={mergedStyles.titleSecondLine}>global warning.</h1>
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
          
          {/* 9 Small Pulsing Dots in Pacific Islands */}
          <div style={{
            ...mergedStyles.smallPulsingDot,
            width: '60px',
            height: '60px',
            top: '40%',
            left: '60%',
            animationDelay: '0s'
          }} />
          <div style={{
            ...mergedStyles.smallPulsingDot,
            width: '40px',
            height: '40px',
            top: '45%',
            left: '65%',
            animationDelay: '0.3s'
          }} />
          <div style={{
            ...mergedStyles.smallPulsingDot,
            width: '50px',
            height: '50px',
            top: '50%',
            left: '70%',
            animationDelay: '0.6s'
          }} />
          <div style={{
            ...mergedStyles.smallPulsingDot,
            width: '35px',
            height: '35px',
            top: '35%',
            left: '68%',
            animationDelay: '0.9s'
          }} />
          <div style={{
            ...mergedStyles.smallPulsingDot,
            width: '45px',
            height: '45px',
            top: '55%',
            left: '62%',
            animationDelay: '1.2s'
          }} />
          <div style={{
            ...mergedStyles.smallPulsingDot,
            width: '30px',
            height: '30px',
            top: '42%',
            left: '72%',
            animationDelay: '1.5s'
          }} />
          <div style={{
            ...mergedStyles.smallPulsingDot,
            width: '55px',
            height: '55px',
            top: '48%',
            left: '58%',
            animationDelay: '1.8s'
          }} />
          <div style={{
            ...mergedStyles.smallPulsingDot,
            width: '38px',
            height: '38px',
            top: '38%',
            left: '63%',
            animationDelay: '2.1s'
          }} />
          <div style={{
            ...mergedStyles.smallPulsingDot,
            width: '42px',
            height: '42px',
            top: '52%',
            left: '67%',
            animationDelay: '2.4s'
          }} />
        </div>
      </div>
    </section>
  );
};

export default TitleSection; 