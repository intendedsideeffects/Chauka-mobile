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
          // Handle both comma and dot decimal formats
          const elevationValue = values[5] ? parseFloat(values[5].replace(',', '.')) : 0;
          return {
            country: values[0],
            elevation: values[1],
            elevationDesc: values[2],
            timePeriod: values[3],
            obsValue: parseInt(values[4]) || 0,
            highestElevation: elevationValue
          };
        });

        // Get unique countries with their average elevation
        const averageElevation = data
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
          .slice(0, 9) // Only show the 9 lowest islands
          .map((item, index) => ({
            ...item,
            isLowest: index < 4 // Mark the 4 lowest islands
          }));

        // Swap Tuvalu and Tokelau positions
        const swappedData = [...averageElevation];
        const tuvaluIndex = swappedData.findIndex(item => item.country === 'Tuvalu');
        const tokelauIndex = swappedData.findIndex(item => item.country === 'Tokelau');
        
        if (tuvaluIndex !== -1 && tokelauIndex !== -1) {
          [swappedData[tuvaluIndex], swappedData[tokelauIndex]] = [swappedData[tokelauIndex], swappedData[tuvaluIndex]];
        }

        setHighestElevationData(swappedData);
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
          {dataPoint ? `${dataPoint.elevation.toString().replace('.', ',')}m` : ''}
        </text>
      </g>
    );
  };


  
  return (
    <div style={{ width: '100%', height: '450px', pointerEvents: 'none', position: 'relative', border: '2px solid red' }}>
      {/* Zero line */}
      <div style={{
        position: 'absolute',
        left: '40px',
        right: '30px',
        top: '400px',
        height: '1px',
        background: '#666',
        zIndex: 2
      }} />

      {/* Blue gradient area below 0 (sea level) */}
      <div style={{
        position: 'absolute',
        left: '40px',  // Align with chart left margin
        right: '30px', // Match chart right margin
        top: '400px',  // Position right below the chart area
        height: '50px',
        background: 'linear-gradient(to top, transparent 0%, rgba(59, 130, 246, 0.1) 50%, rgba(59, 130, 246, 0.3) 100%)',
        zIndex: 0
      }} />

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
        Average elevation<br/>
        of Pacific Island<br/>
        (in m)
      </div>
      
      {/* Main chart area */}
      <div style={{ 
        width: '100%', 
        height: '400px', 
        position: 'relative',
        padding: '0'
      }}>
        <ResponsiveContainer width="100%" height="100%" style={{ padding: 0, margin: 0 }}>
          <BarChart 
            data={highestElevationData} 
            margin={{ top: 80, right: 30, left: 0, bottom: 0 }}
            baseValue={0}
            barGap={0}
            barSize={60}
          >
            <XAxis 
              dataKey="country" 
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: '#666666', fontFamily: 'Helvetica World, Arial, sans-serif' }}
              height={0}
            />
            <YAxis 
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: '#666666', fontFamily: 'Helvetica World, Arial, sans-serif' }}
              width={40}
              domain={[0, 'dataMax']}
            />
            <CartesianGrid 
              horizontal={true} 
              vertical={false} 
              stroke="#e5e7eb"
            />
            <Tooltip 
              labelFormatter={(label) => `Country: ${label}`}
              formatter={(value, name) => [value, 'Elevation (M)']}
            />
            <Bar dataKey="elevation" fill="#000000" radius={0}>
              <LabelList content={<CustomBarLabel />} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HighestElevationChart; 