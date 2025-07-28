'use client';
import React, { useState, useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis } from 'recharts';

const LongScatterPlot = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/Disaster_Dataset_with_Summaries_fixed.csv');
        const csvText = await response.text();
        
        // Parse CSV
        const lines = csvText.split('\n');
        const headers = lines[0].split(';');
        const latitudeIndex = headers.indexOf('latitude');
        const longitudeIndex = headers.indexOf('longitude');
        const magnitudeIndex = headers.indexOf('magnitude');
        const disasterTypeIndex = headers.indexOf('disaster_type');
        const startYearIndex = headers.indexOf('start_year');
        const totalDeathsIndex = headers.indexOf('total_deaths');
        
        // Process data for scatter plot
        const scatterData = [];
        lines.slice(1).forEach(line => {
          if (line.trim()) {
            const values = line.split(';');
            const latitude = parseFloat(values[latitudeIndex]);
            const longitude = parseFloat(values[longitudeIndex]);
            const magnitude = parseFloat(values[magnitudeIndex]);
            const disasterType = values[disasterTypeIndex];
            const startYear = parseInt(values[startYearIndex]);
            const totalDeaths = parseInt(values[totalDeathsIndex]) || 0;
            
            // Only include data points with valid coordinates
            if (!isNaN(latitude) && !isNaN(longitude) && latitude !== 0 && longitude !== 0) {
              scatterData.push({
                x: longitude,
                y: latitude,
                z: magnitude || 1, // Use magnitude or default to 1
                disasterType: disasterType || 'Unknown',
                year: startYear || 2000,
                deaths: totalDeaths,
                size: Math.max(1, Math.min(20, (totalDeaths / 100) + 1)) // Size based on deaths
              });
            }
          }
        });

        setData(scatterData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading disaster data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Pacific night scene colors for different disaster types
  const getDisasterColor = (disasterType) => {
    const colorMap = {
      'Storm': '#4361ee',
      'Flood': '#4cc9f0',
      'Earthquake': '#7209b7',
      'Volcanic activity': '#f72585',
      'Mass movement (wet)': '#3a0ca3',
      'Mass movement (dry)': '#533483',
      'Drought': '#4895ef',
      'Epidemic': '#b5179e',
      'Wildfire': '#0f3460'
    };
    return colorMap[disasterType] || '#16213e';
  };

  if (loading) {
    return (
      <div style={{ 
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '8px'
      }}>
        <div style={{ color: '#fff', fontSize: '1.2rem' }}>Loading scatter plot data...</div>
      </div>
    );
  }

  console.log('LongScatterPlot data loaded:', data.length, 'points');

  return (
    <div style={{ 
      width: '100%', 
      height: '100%',
      position: 'relative'
    }}>
      {data.length === 0 ? (
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: '1.2rem'
        }}>
          No data available for scatter plot
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{
              top: 20, right: 20, bottom: 20, left: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              type="number" 
              dataKey="x" 
              name="Longitude" 
              stroke="rgba(255,255,255,0.7)"
              tick={{ fill: 'rgba(255,255,255,0.7)' }}
              domain={[140, 180]} // Pacific region longitude range
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              name="Latitude" 
              stroke="rgba(255,255,255,0.7)"
              tick={{ fill: 'rgba(255,255,255,0.7)' }}
              domain={[-25, 10]} // Pacific region latitude range
            />
            <ZAxis type="number" dataKey="z" range={[20, 400]} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(26, 26, 46, 0.95)', 
                border: '1px solid #4361ee',
                color: '#fff',
                borderRadius: '8px'
              }}
              formatter={(value, name, props) => {
                if (name === 'x') return [`Longitude: ${value}°`, 'Longitude'];
                if (name === 'y') return [`Latitude: ${value}°`, 'Latitude'];
                if (name === 'z') return [`Magnitude: ${value}`, 'Magnitude'];
                return [value, name];
              }}
              labelFormatter={(label) => {
                const point = data.find(d => d.x === label);
                return point ? `${point.disasterType} (${point.year})` : '';
              }}
            />
            {Object.keys(data.reduce((acc, item) => {
              acc[item.disasterType] = true;
              return acc;
            }, {})).map((disasterType, index) => (
              <Scatter
                key={disasterType}
                name={disasterType}
                data={data.filter(d => d.disasterType === disasterType)}
                fill={getDisasterColor(disasterType)}
                stroke={getDisasterColor(disasterType)}
                strokeWidth={1}
              />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default LongScatterPlot; 