'use client';
import React, { useState, useEffect } from 'react';

const LowElevationChart = () => {
  const [lowElevationData, setLowElevationData] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/pop_low_el.csv');
        const csvText = await response.text();
        
        // Parse CSV
        console.log('Raw CSV text:', csvText.slice(0, 200)); // Show first 200 chars
        const lines = csvText.split('\n');
        console.log('First few lines:', lines.slice(0, 3));
        
        const data = lines.slice(1).filter(line => line.trim() !== '').map(line => {
          const values = line.split(';');
          console.log('Split values:', values);
          return {
            country: values[0], // Pacific Island Countries and territories
            elevation: values[1], // ELEVATION
            elevationDesc: values[2], // Elevation
            timePeriod: values[3], // TIME_PERIOD
            obsValue: parseFloat(values[4]) || 0, // OBS_VALUE
            highestElevation: parseFloat(values[5]) || 0 // Island highest elevation
          };
        });

        // Filter for 0-5 meters elevation data and get top 9
        // Log raw data to check structure
        console.log('Raw data first item:', data[0]);
        
        // Filter for 5M elevation, remove empty entries, and get top 9
        const lowElevation = data
          .filter(item => item.elevation === '5M' && item.country && item.obsValue)
          .map(item => ({
            "Pacific Island Countries and territories": item.country.replace(" (Federated States of)", ""),
            OBS_VALUE: parseFloat(item.obsValue)  // Make sure it's a number
          }))
          .sort((a, b) => b.OBS_VALUE - a.OBS_VALUE)
          .slice(0, 9);
        
        console.log('Final processed data:', lowElevation);

        console.log('Processed data:', lowElevation);
        setLowElevationData(lowElevation);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    fetchData();
  }, []);



    return (
    <div style={{ width: '100%', height: '450px', position: 'relative' }}>
      {/* Y-axis annotation */}
      <div style={{
        position: 'absolute',
        left: '-100px',
        top: 'calc(50% - 180px)',
        transform: 'translateY(-50%)',
        fontSize: '12px',
        fontFamily: 'Helvetica World, Arial, sans-serif',
        color: '#666666',
        textAlign: 'right',
        pointerEvents: 'none',
        lineHeight: '1.2',
        width: '80px'
      }}>
        Populations living between<br/>
        0–5m above sea level<br/>
        (in %)
      </div>
      
      {/* Chart area with bars */}
      <div className="flex items-end justify-between h-[350px] relative mx-4" style={{ transition: 'height 1.5s ease' }}>
        {/* Horizontal gridlines */}
        {[0, 0.25, 0.5, 0.75, 1.0].map((value, index) => (
          <div 
            key={index}
            className="absolute left-0 right-0 z-10" 
            style={{ 
              top: `${350 - (value * 280)}px`,
              height: '1px',
              background: '#e5e7eb'
            }}
          />
        ))}
        
        {/* Y-axis labels */}
        {[0, 0.25, 0.5, 0.75, 1.0].map((value, index) => {
          const maxValue = lowElevationData.length > 0 ? Math.max(...lowElevationData.map(d => d.OBS_VALUE)) : 1;
          return (
            <div 
              key={index}
              className="absolute z-20" 
              style={{ 
                top: `${350 - (value * 280) - 8}px`,
                left: '-25px',
                fontSize: '12px',
                color: '#666666',
                fontFamily: 'Helvetica World, Arial, sans-serif'
              }}
            >
              {Math.round(value * maxValue)}
            </div>
          );
        })}
        
        {/* Zero line positioned directly under bars */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-black"></div>
       
        {lowElevationData.map((item, index) => {
          // Use max value for scaling
          const maxValue = lowElevationData.length > 0 ? Math.max(...lowElevationData.map(d => d.OBS_VALUE)) : 1;
          
          // Simple linear scale with minimum height for very small values
          const minBarHeight = 10; // Minimum 10px height for visibility
          const maxBarHeight = 280;
          const linearHeight = (item.OBS_VALUE / maxValue) * maxBarHeight;
          const barHeight = Math.max(linearHeight, minBarHeight);
          const isHovered = hoveredIndex === index;
          const shouldReduceOpacity = hoveredIndex !== null && hoveredIndex !== index;
          
          return (
            <div 
              key={index} 
              className="flex flex-col items-center flex-1 mx-1"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                transition: 'opacity 0.2s ease',
                opacity: shouldReduceOpacity ? 0.4 : 1,
                cursor: 'pointer',
                zIndex: isHovered ? 40 : 20
              }}
            >
              {/* Labels above bar */}
              <div style={{ 
                marginBottom: '10px',
                textAlign: 'center',
                fontSize: '12px',
                color: '#000'
              }}>
                <div>{item["Pacific Island Countries and territories"]}</div>
                <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>{Math.round(item.OBS_VALUE)}%</div>
              </div>
              
              {/* Bar */}
              <div className="relative flex justify-center">
                <div 
                  className="rounded-t-sm relative z-10"
                  style={{ 
                    height: `${barHeight}px`,
                    minHeight: '30px',
                    width: '60px',
                    transition: 'height 1.5s ease, background-color 0.2s ease',
                    background: isHovered ? 
                      'linear-gradient(to top, #374151 0%, #374151 70%, rgba(59, 130, 246, 0.8) 100%)' : 
                      'linear-gradient(to top, rgba(59, 130, 246, 0.8) 0%, rgba(59, 130, 246, 0.8) 30%, #000000 100%)'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      

    </div>
  );
};

export default LowElevationChart; 