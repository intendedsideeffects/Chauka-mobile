'use client';
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts';

const LowElevationChart = () => {
  const [lowElevationData, setLowElevationData] = useState([]);

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

  // Custom label component for bar labels
  const CustomBarLabel = ({ x, y, width, value, payload }) => {
    console.log('CustomBarLabel props:', { x, y, width, value, payload });
    
    if (!x || !y || !width || !payload) {
      console.log('Missing required props');
      return null;
    }

    return (
      <g>
        <text
          x={x + width / 2}
          y={y - 35}
          textAnchor="middle"
          fill="#000"
          fontSize={12}
          style={{ fontFamily: 'Helvetica World, Arial, sans-serif' }}
        >
          {payload["Pacific Island Countries and territories"]}
        </text>
        <text
          x={x + width / 2}
          y={y - 20}
          textAnchor="middle"
          fill="#666"
          fontSize={11}
          style={{ fontFamily: 'Helvetica World, Arial, sans-serif' }}
        >
          {`${payload.OBS_VALUE.toFixed(1)}%`}
        </text>
      </g>
    );
  };

  return (
    <div style={{ width: '100%', height: '450px', position: 'relative' }}>
      {/* Zero line */}
      <div style={{
        position: 'absolute',
        left: '50px',
        right: '30px',
        bottom: '50px',  // Adjusted to match chart bottom margin
        height: '1px',
        background: '#666',
        zIndex: 2
      }} />

      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={lowElevationData} 
          margin={{ top: 100, right: 30, left: 80, bottom: 50 }}  // Increased left margin for label
          baseValue={0}
        >
          <XAxis 
            dataKey="Pacific Island Countries and territories" 
            tickLine={false}
            axisLine={false}
            tick={false}
            height={0}
          />
          <YAxis 
            tickLine={false}
            axisLine={false}
            tick={false}
            width={0}
          />
          <Tooltip 
            labelFormatter={(label) => `Country: ${label}`}
            formatter={(value) => [`${Math.round(value)}%`, 'Population 0-5M']}
          />
          <Bar 
            dataKey="OBS_VALUE" 
            fill="#000000" 
            barSize={60}
          >
            <LabelList
              dataKey="Pacific Island Countries and territories"
              position="top"
              offset={35}
              fill="#000"
              fontSize={12}
              style={{ fontFamily: 'Helvetica World, Arial, sans-serif' }}
            />
            <LabelList
              dataKey="OBS_VALUE"
              position="top"
              offset={20}
              fill="#666"
              fontSize={11}
              style={{ fontFamily: 'Helvetica World, Arial, sans-serif' }}
              formatter={(value) => `${Math.round(value)}%`}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      {/* Y-axis label - positioned outside chart area */}
      <div style={{
        position: 'absolute',
        left: '5px',
        top: '200px',
        fontSize: '16px',
        fontFamily: 'Helvetica World, Arial, sans-serif',
        color: '#000000',
        textAlign: 'right',
        pointerEvents: 'none',
        lineHeight: '1.2',
        zIndex: 9999,
        fontWeight: 'bold',
        backgroundColor: 'white',
        padding: '5px'
      }}>
        Sea level rise<br/>
        in meters
      </div>
    </div>
  );
};

export default LowElevationChart; 