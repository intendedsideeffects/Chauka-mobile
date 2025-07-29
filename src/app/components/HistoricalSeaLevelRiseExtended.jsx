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
        
        // Log the data range for debugging
        const values = combinedData.map(d => d.value);
        const minValue = Math.min(...values);
        const maxValue = Math.max(...values);
        console.log('Data range:', { minValue, maxValue, dataPoints: combinedData.length });
        console.log('Historical data points:', historicalData.length);
        console.log('Satellite data points:', satelliteData.length);
        
        setData(combinedData);
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

  return (
    <div style={{ width: '100%', height: '400px', boxSizing: 'border-box', pointerEvents: 'auto', zIndex: 1000 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ left: 20, right: 20, top: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
          <XAxis 
            dataKey="year" 
            type="number"
            domain={[1000, 2024]}
            ticks={[1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000]}
            style={{ fontFamily: 'Helvetica World, Arial, sans-serif' }}
          />
          <YAxis 
            dx={-10} 
            width={60} 
            tickLine={false}
            style={{ fontFamily: 'Helvetica World, Arial, sans-serif' }}
            label={{ value: 'Sea Level (cm)', angle: -90, position: 'insideLeft', style: { fontFamily: 'Helvetica World, Arial, sans-serif' } }}
            domain={['dataMin - 5', 'dataMax + 5']}
            tickFormatter={(value) => Math.round(value)}
          />
          <Tooltip 
            formatter={(value, name) => [
              `${value.toFixed(2)}cm`, 
              'Global Sea Level'
            ]}
            labelFormatter={(label) => `Year: ${Math.floor(label)}`}
            contentStyle={{ fontFamily: 'Helvetica World, Arial, sans-serif' }}
          />
          {/* Raw data line */}
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#000000" 
            strokeWidth={2}
            dot={false}
            connectNulls={true}
          />
          {/* Zero reference line */}
          <ReferenceLine y={0} stroke="#666666" strokeDasharray="3 3" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HistoricalSeaLevelRiseExtended;