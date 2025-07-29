'use client';

import React from 'react';

const SegmentTemplate = ({
  header = "Sample Header",
  headerSecondLine = "", // New prop for second line
  text = "This is sample text content that demonstrates the formatting. It can include <strong>bold text</strong> and other HTML elements.",
  chartComponent = null, // This will be the actual chart component when ready
  styles = {}
}) => {
  const defaultStyles = {
                                       container: {
         width: '100%',
         height: '100vh',
         background: 'transparent',
         display: 'flex',
         flexDirection: 'column',
         alignItems: 'center',
         justifyContent: 'center',
         position: 'relative',
         scrollSnapAlign: 'start',
         borderBottom: '3px solid #9ca3af',
         pointerEvents: 'none', // Allow events to pass through to scatterplot behind
       },
                                       contentWrapper: {
         color: '#0e224f',
         fontSize: '1.5rem',
         maxWidth: '700px',
         textAlign: 'left',
         fontFamily: 'Helvetica World, Arial, sans-serif',
         fontWeight: 400,
         lineHeight: 1.5,
         zIndex: 2,
         position: 'absolute',
         top: '50%',
         left: '50%',
         transform: 'translate(-50%, -50%)',
         margin: '0 auto',
         flexShrink: 0,
         pointerEvents: 'none', // Allow events to pass through to scatterplot behind
       },
                                       header: {
         fontSize: '2.5rem',
         fontWeight: 'bold',
         color: '#000',
         marginBottom: '0',
         textAlign: 'left',
         marginTop: '5rem',
         fontFamily: 'Times New Roman, serif',
         lineHeight: '1.1'
       },
       headerSecondLine: {
         fontSize: '2.5rem',
         fontWeight: 'bold',
         color: '#000',
         marginBottom: '0',
         textAlign: 'left',
         marginTop: '0',
         fontFamily: 'Times New Roman, serif',
         lineHeight: '1.1'
       },
    text: {
      fontSize: '1.4rem',
      color: '#000',
      marginBottom: '2rem',
      lineHeight: 1.5,
      fontFamily: 'Helvetica World, Arial, sans-serif'
    },
                                                                                                                                                                                   chartContainer: {
         width: '100%',
         maxWidth: '1050px',
         marginTop: '0',
         marginBottom: '2rem',
         textAlign: 'center',
         display: 'flex',
         flexDirection: 'column',
         alignItems: 'center',
         justifyContent: 'center',
         position: 'absolute',
         top: 'calc(50% + 200px)',
         left: '0',
         right: '0',
         margin: '0 auto',
         transform: 'translateX(-2cm)',
         pointerEvents: 'none', // Allow events to pass through to scatterplot behind
       },
               placeholderChart: {
             width: '100%',
             maxWidth: '1200px',
             height: '400px',
             backgroundColor: '#e5e7eb', // Grey color
             display: 'flex',
             alignItems: 'center',
             justifyContent: 'center',
             borderRadius: '8px',
             border: '2px dashed #9ca3af',
             color: '#6b7280',
             fontSize: '1.2rem',
             fontWeight: '500',
             margin: '0 auto'
           }
  };

  // Merge default styles with custom styles
  const mergedStyles = {
    container: { ...defaultStyles.container, ...styles.container },
    contentWrapper: { ...defaultStyles.contentWrapper, ...styles.contentWrapper },
    header: { ...defaultStyles.header, ...styles.header },
    headerSecondLine: { ...defaultStyles.headerSecondLine, ...styles.headerSecondLine },
    text: { ...defaultStyles.text, ...styles.text },
    chartContainer: { ...defaultStyles.chartContainer, ...styles.chartContainer },
    placeholderChart: { ...defaultStyles.placeholderChart, ...styles.placeholderChart }
  };

     return (
     <section style={mergedStyles.container}>
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
             <h1 style={mergedStyles.header}>{header}</h1>
             <h2 style={mergedStyles.headerSecondLine}>{headerSecondLine}</h2>
           </div>
          
                     {/* Text content */}
           <div style={{
             width: '100%',
             maxWidth: '800px',
             textAlign: 'left'
           }}>
            <p 
              style={mergedStyles.text}
              dangerouslySetInnerHTML={{ __html: text }}
            />
          </div>
         
                              {/* Chart Container */}
           <div style={{
             width: '100%',
             maxWidth: '1050px',
             display: 'flex',
             flexDirection: 'column',
             alignItems: 'center',
             justifyContent: 'center',
           }}>
            {chartComponent ? (
              chartComponent
            ) : (
              <div style={mergedStyles.placeholderChart}>
                Chart Placeholder - Replace with actual chart component
              </div>
                         )}
             
                           {/* Figure Caption Container */}
              <div style={{
                width: '100%',
                maxWidth: '1050px',
                textAlign: 'left',
                marginTop: '1rem'
              }}>
               <p style={{
                 fontSize: '0.9rem',
                 color: '#9ca3af',
                 fontStyle: 'italic',
                 lineHeight: 1.4,
                 margin: 0
               }}>
                 Fig 1: This is blablabla
               </p>
             </div>
          </div>
       </div>
     </section>
   );
};

export default SegmentTemplate; 