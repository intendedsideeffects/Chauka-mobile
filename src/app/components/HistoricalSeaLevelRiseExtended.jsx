'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const HistoricalSeaLevelRiseExtended = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to calculate moving average
  const calculateMovingAverage = (data, windowSize) => {
    const result = [];
    for (let i = 0; i < data.length; i++) {
      const start = Math.max(0, i - Math.floor(windowSize / 2));
      const end = Math.min(data.length, i + Math.floor(windowSize / 2) + 1);
      const window = data.slice(start, end);
      const average = window.reduce((sum, item) => sum + item.value, 0) / window.length;
      result.push({
        ...data[i],
        movingAverage: average
      });
    }
    return result;
  };

  // Function to generate projected data
  const generateProjection = (lastDataPoint, endYear = 2050) => {
    const projection = [];
    const lastYear = lastDataPoint.year;
    const lastValue = lastDataPoint.value;
    const targetValue = lastValue + 25; // Exactly 25cm higher by 2050
    
    // Calculate the rate needed to reach 25cm by 2050
    const yearsDiff = endYear - lastYear;
    const rateOfChange = 25 / yearsDiff; // cm per year
    
    console.log('Projection details:', {
      lastYear,
      lastValue,
      endYear,
      targetValue,
      yearsDiff,
      rateOfChange
    });
    
    // Generate projection points every 1 year for smooth line
    for (let year = lastYear + 1; year <= endYear; year++) {
      const yearsFromStart = year - lastYear;
      const projectedValue = lastValue + (rateOfChange * yearsFromStart);
      projection.push({
        year: year,
        value: projectedValue,
        isProjection: true
      });
    }
    
    console.log('Projection points:', projection.length, 'Final value:', projection[projection.length - 1]?.value);
    
    return projection;
  };

  // Function to calculate projection positioning
  const calculateProjectionPosition = () => {
    if (!data.combined || data.combined.length === 0) return null;
    
    // Use the last point from satellite data (blue line) instead of combined data
    const satelliteData = data.combined.filter(d => d.year >= 1993);
    const lastPoint = satelliteData[satelliteData.length - 1];
    const lastValue = lastPoint.value;
    const targetValue = lastValue + 25; // 25cm higher
    
    // Chart coordinate system (from Recharts)
    const chartWidth = 800; // Approximate chart width in pixels
    const chartHeight = 360; // Chart height in pixels
    const yRange = 10 - (-20); // 30 units (cm)
    
    // Calculate the actual pixel positions based on chart coordinates
    // Start 19cm to the right of chart edge
    const startX = chartWidth + 190; // Start 190px (19cm) to the right of chart edge
    const startY = chartHeight - ((lastValue - (-20)) / yRange) * chartHeight;
    
    // End point: 25cm higher than start, almost vertical
    const endX = startX + 30; // Just 30px (3cm) to the right of start point
    const endY = chartHeight - ((targetValue - (-20)) / yRange) * chartHeight;
    
    console.log('Projection calculation:', {
      lastValue,
      targetValue,
      startY,
      endY,
      chartHeight,
      yRange
    });
    
    return { startX, startY, endX, endY };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch historical data (1000-1993)
        const historicalResponse = await fetch('/sea1000.csv');
        if (!historicalResponse.ok) {
          throw new Error(`HTTP error! status: ${historicalResponse.status}`);
        }
        
        const historicalCsvText = await historicalResponse.text();
        const historicalLines = historicalCsvText.trim().split('\n');
        
        // Parse historical CSV with semicolon separator, skip the first 3 lines (headers)
        const historicalData = historicalLines.slice(4).map(line => {
          const values = line.split(';');
          return {
            year: parseFloat(values[0].replace(',', '.')), // Year
            value: parseFloat(values[1].replace(',', '.')) / 10  // mm converted to cm
          };
        }).filter(item => 
          !isNaN(item.year) && 
          !isNaN(item.value) && 
          item.year >= 1000 && 
          item.year < 1993
        ).sort((a, b) => a.year - b.year);

        // Fetch satellite data (1993-2024)
        const satelliteResponse = await fetch('/global_mean_sea_level_1993-2024.csv');
        if (!satelliteResponse.ok) {
          throw new Error(`HTTP error! status: ${satelliteResponse.status}`);
        }
        
        const satelliteCsvText = await satelliteResponse.text();
        const satelliteLines = satelliteCsvText.trim().split('\n');
        
        // Parse satellite CSV with comma separator, skip the first line (header)
        const satelliteData = satelliteLines.slice(1).map(line => {
          const values = line.split(',');
          return {
            year: parseFloat(values[2]), // YearPlusFraction
            value: parseFloat(values[8]) / 10  // GMSLWithGIA converted from mm to cm
          };
        }).filter(item => 
          !isNaN(item.year) && 
          !isNaN(item.value) && 
          item.year >= 1993
        ).sort((a, b) => a.year - b.year);

        // Combine both datasets
        const combinedData = [...historicalData, ...satelliteData];
        
        // Generate projection data
        const lastDataPoint = combinedData[combinedData.length - 1];
        const projectionData = generateProjection(lastDataPoint, 2100);
        
        // Create separate datasets for different colors
        const historicalLineData = historicalData;
        const satelliteLineData = satelliteData;
        
        // Log the data range for debugging
        const values = combinedData.map(d => d.value);
        const minValue = Math.min(...values);
        const maxValue = Math.max(...values);
        console.log('Data range:', { minValue, maxValue, dataPoints: combinedData.length });
        console.log('Historical data points:', historicalData.length);
        console.log('Satellite data points:', satelliteData.length);
        console.log('Projection data points:', projectionData.length);
        
        setData({ 
          combined: combinedData, 
          historical: historicalLineData, 
          satellite: satelliteLineData,
          projection: projectionData,
          allData: [...combinedData, ...projectionData]
        });
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ width: '100%', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="text-lg">Loading historical sea level data...</div>
      </div>
    );
  }

  const projectionPos = calculateProjectionPosition();

  return (
    <div style={{ width: '100%', height: '400px', boxSizing: 'border-box', pointerEvents: 'auto', position: 'relative', overflow: 'visible' }}>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.combined} margin={{ left: 20, right: 20, top: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
            <XAxis 
              dataKey="year"
              type="number"
              domain={[1000, 2024]}
              ticks={[1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2024]}
              style={{ fontFamily: 'Helvetica World, Arial, sans-serif' }}
            />
            <YAxis 
              dx={-10} 
              width={60} 
              tickLine={false}
              style={{ fontFamily: 'Helvetica World, Arial, sans-serif' }}
              domain={[-20, 10]}
              ticks={[-20, -10, 0, 10]}
              tickFormatter={(value) => Math.round(value)}
            />
            <Tooltip 
              formatter={(value, name, props) => {
                const isProjection = props.payload?.isProjection;
                const label = isProjection ? 'Projected Sea Level' : 'Global Sea Level';
                return [`${value.toFixed(2)}cm`, label];
              }}
              labelFormatter={(label) => `Year: ${Math.floor(label)}`}
              contentStyle={{ fontFamily: 'Helvetica World, Arial, sans-serif' }}
              cursor={{ strokeDasharray: '3 3' }}
            />
            {/* Historical data line */}
            <Line 
              type="monotone" 
              dataKey="value" 
              data={data.combined}
              stroke="#000000" 
              strokeWidth={2}
              dot={false}
              connectNulls={true}
              name="seaLevel"
            />
            {/* Black overlay for 1993 onwards */}
            <Line 
              type="monotone" 
              dataKey="value" 
              data={data.combined.filter(d => d.year >= 1993)}
              stroke="#000000" 
              strokeWidth={2}
              dot={false}
              connectNulls={true}
              name="satellite"
            />
            {/* Zero reference line */}
            <ReferenceLine y={0} stroke="#666666" strokeDasharray="3 3" />
          </LineChart>
        </ResponsiveContainer>

        {/* Projection line overlay */}
        {data.combined && data.combined.length > 0 && (
          <svg 
            style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '100%', 
              overflow: 'visible',
              pointerEvents: 'none'
            }}
          >
            <defs>
              <linearGradient id="projectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#0066cc', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#0066cc', stopOpacity: 0.8 }} />
              </linearGradient>
            </defs>
            
            {/* Projection line */}
            <path
              d={(() => {
                const chartWidth = 800;
                const chartHeight = 360;
                const yRange = 10 - (-20);
                const satelliteData = data.combined.filter(d => d.year >= 1993);
                const lastPoint = satelliteData[satelliteData.length - 1];
                const startX = chartWidth + 209;
                const startY = chartHeight - ((lastPoint.value - (-20)) / yRange) * chartHeight;
                const endX = startX + 30;
                const endY = startY - ((22 / yRange) * chartHeight);
                return `M ${startX} ${startY} L ${endX} ${endY}`;
              })()}
              stroke="url(#projectionGradient)"
              strokeWidth="3"
              fill="none"
              strokeDasharray="none"
              strokeLinecap="round"
            />
            
            {/* Annotation text */}
            <text
              x={(() => {
                const chartWidth = 800;
                const startX = chartWidth + 209;
                return startX + 40;
              })()}
              y={(() => {
                const chartHeight = 360;
                const yRange = 10 - (-20);
                const satelliteData = data.combined.filter(d => d.year >= 1993);
                const lastPoint = satelliteData[satelliteData.length - 1];
                const startY = chartHeight - ((lastPoint.value - (-20)) / yRange) * chartHeight;
                return startY - ((22 / yRange) * chartHeight) - 15;
              })()}
              textAnchor="start"
              fontSize="14"
              fontFamily="Helvetica World, Arial, sans-serif"
              fill="#0066cc"
            >
              Sea level is projected to rise ~25cm by 2050
            </text>
          </svg>
        )}
      </div>
    </div>
  );
};

export default HistoricalSeaLevelRiseExtended;