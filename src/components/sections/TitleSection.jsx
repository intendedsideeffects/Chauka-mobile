'use client';

import React from 'react';

const TitleSection = ({ 
  title = "This is a global warning.",
  subtitle = "",
  mapTrigger = "MAP",
  content = "The ocean is <strong>one connected body</strong> of water. It covers over <strong>70 percent</strong> of the Earth's surface, drives weather, absorbs heat, and links distant regions through powerful currents. For many communities, especially in the Pacific, it is more than geography. It is identity, movement, memory, and home.",
  styles = {}
}) => {
  const defaultStyles = {
    container: {
      width: '100%',
      height: '100vh',
      background: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '3rem',
      padding: '4rem 0',
      position: 'relative',
      scrollSnapAlign: 'start',
    },
    contentWrapper: {
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
    },
    title: {
      marginBottom: '2rem',
      fontSize: '4rem',
      fontWeight: 'bold',
      color: '#000'
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
      marginTop: '-4rem'
    },
    emptySpace: {
      height: '1rem'
    },
    spilhausContainer: {
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
    },
    spilhausWrapper: {
      width: '100%',
      maxWidth: '1600px',
      height: 'calc(600px * 0.99)',
      overflow: 'hidden',
      display: 'block',
      margin: '0 auto'
    },
    spilhausImage: {
      width: '100%',
      maxWidth: '1000px',
      height: 'auto',
      maxHeight: '500px',
      objectFit: 'contain',
      display: 'block',
      margin: '0 auto'
    }
  };

  // Merge default styles with custom styles
  const mergedStyles = {
    container: { ...defaultStyles.container, ...styles.container },
    contentWrapper: { ...defaultStyles.contentWrapper, ...styles.contentWrapper },
    title: { ...defaultStyles.title, ...styles.title },
    subtitle: { ...defaultStyles.subtitle, ...styles.subtitle },
    mapTrigger: { ...defaultStyles.mapTrigger, ...styles.mapTrigger },
    content: { ...defaultStyles.content, ...styles.content },
    emptySpace: { ...defaultStyles.emptySpace, ...styles.emptySpace },
    spilhausContainer: { ...defaultStyles.spilhausContainer, ...styles.spilhausContainer },
    spilhausWrapper: { ...defaultStyles.spilhausWrapper, ...styles.spilhausWrapper },
    spilhausImage: { ...defaultStyles.spilhausImage, ...styles.spilhausImage }
  };

  return (
    <section style={mergedStyles.container}>
      <div style={mergedStyles.contentWrapper}>
        {/* Title */}
        <h1 style={mergedStyles.title}>{title}</h1>
        
        {/* Subtitle (if provided) */}
        {subtitle && <p style={mergedStyles.subtitle}>{subtitle}</p>}
        
        {/* Empty space */}
        <div style={mergedStyles.emptySpace} />
        
        {/* Map trigger */}
        <p style={mergedStyles.mapTrigger}>{mapTrigger}</p>
        
        {/* Spilhaus Map */}
        <div style={mergedStyles.spilhausContainer}>
          <div style={mergedStyles.spilhausWrapper}>
            <img 
              src="/spilhaus_black.png" 
              alt="Spilhaus Projection" 
              style={mergedStyles.spilhausImage}
            />
          </div>
        </div>
        
        {/* Empty space */}
        <div style={mergedStyles.emptySpace} />
        <div style={mergedStyles.emptySpace} />
        
        {/* Main content */}
        <p 
          style={mergedStyles.content} 
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </section>
  );
};

export default TitleSection; 