'use client';
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';

const HighestElevationChart = () => {
  const [highestElevationData, setHighestElevationData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/pop_low_el.csv');
        const csvText = await response.text();
        
        // Parse CSV
        const lines = csvText.split('\n');
        const data = lines.slice(1).filter(line => line.trim() !== '').map(line => {
          const values = line.split(';');
          return {
            country: values[0],
            elevation: values[1],
            elevationDesc: values[2],
            timePeriod: values[3],
            obsValue: parseInt(values[4]) || 0,
            highestElevation: parseInt(values[5]) || 0
          };
        });

        // Get unique countries with their highest elevation
        const highestElevation = data
          .filter(item => item.highestElevation > 0)
          .reduce((acc, item) => {
            if (!acc.find(c => c.country === item.country)) {
              acc.push({
                country: item.country,
                elevation: item.highestElevation
              });
            }
            return acc;
          }, [])
          .sort((a, b) => a.elevation - b.elevation)
          .slice(0, 9); // Only show the 9 lowest islands

        setHighestElevationData(highestElevation);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    fetchData();
  }, []);

  // Custom label component for bar labels
  const CustomBarLabel = (props) => {
    const { x, y, width, value, index } = props;
    const dataPoint = highestElevationData[index];
    
    return (
      <g>
        {/* Island name above bar */}
        <text 
          x={x + width / 2} 
          y={y - 20} 
          textAnchor="middle" 
          fill="#000000" 
          fontSize={12}
        >
          {dataPoint?.country}
        </text>
        {/* Elevation info below island name */}
        <text 
          x={x + width / 2} 
          y={y - 5} 
          textAnchor="middle" 
          fill="#666666" 
          fontSize={10}
        >
          {dataPoint ? `${dataPoint.elevation}M` : ''}
        </text>
      </g>
    );
  };

  return (
    <div style={{ width: '100%', height: '450px', pointerEvents: 'none', position: 'relative' }}>
      {/* Zero line */}
      <div style={{
        position: 'absolute',
        left: '50px',
        right: '30px',
        top: '385px',
        height: '1px',
        background: '#666',
        zIndex: 2
      }} />

      {/* Blue gradient area below 0 (sea level) */}
      <div style={{
        position: 'absolute',
        left: '50px',  // Match chart margin
        right: '30px', // Match chart margin
        top: '385px',  // Position right below the chart area
        height: '50px',
        background: 'linear-gradient(to top, transparent, rgba(59, 130, 246, 0.3))',
        zIndex: 0
      }} />
      
      {/* Main chart area */}
      <div style={{ 
        width: '100%', 
        height: '400px', 
        position: 'relative'
      }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={highestElevationData} 
            margin={{ top: 80, right: 30, left: 20, bottom: 15 }}
            baseValue={0}
          >
            <XAxis 
              dataKey="country" 
              tickLine={false}
              axisLine={false}
              tick={false}
              height={0}
            />
            <YAxis 
              tickLine={false}
              axisLine={false}
              width={0}
              tick={false}
              domain={['dataMin', 'dataMax']}
            />
            <Tooltip 
              labelFormatter={(label) => `Country: ${label}`}
              formatter={(value, name) => [value, 'Elevation (M)']}
            />
            <Bar dataKey="elevation" fill="#000000" barSize={60}>
              <LabelList content={<CustomBarLabel />} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HighestElevationChart; 