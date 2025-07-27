'use client';

import React, { useState, useEffect } from 'react';

const SeaLevelRiseChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/Coastal_Elevation_Exposure__Comma_Format_.csv');
        const csvText = await response.text();
        
        // Parse CSV with semicolon separator
        const lines = csvText.trim().split('\n');
        const headers = lines[0].split(';');
        
        const parsedData = lines.slice(1).map(line => {
          const values = line.split(';');
          return {
            country: values[0],
            threshold: parseFloat(values[1].replace(',', '.')),
            seaLevelRise2050: parseFloat(values[2].replace(',', '.'))
          };
        }).filter(item => !isNaN(item.seaLevelRise2050));
        
        setData(parsedData);
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
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading sea level rise data...</div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.seaLevelRise2050));

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Sea Level Rise Projections
        </h2>
        <p className="text-lg text-gray-600">
          2°C Scenario - 2050 Projections for Pacific Island Nations
        </p>
      </div>

      <div className="px-4">
        {/* Chart area with bars */}
        <div className="flex items-end justify-between h-80 relative">
          {/* Zero line positioned directly under bars */}
          <div className="absolute bottom-0 left-0 right-0 border-t border-black"></div>
          
          {data.map((item, index) => (
            <div key={index} className="flex flex-col items-center flex-1 mx-1">
              {/* Bar */}
              <div className="relative w-full max-w-16">
                <div 
                  className="bg-black rounded-t-sm transition-all duration-1000 ease-out hover:bg-gray-800"
                  style={{ 
                    height: `${(item.seaLevelRise2050 / 1.0) * 280}px`,
                    minHeight: '20px'
                  }}
                />
                
                {/* Value label */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-sm text-gray-700">
                  {item.seaLevelRise2050.toFixed(2)}M
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Country labels below the chart */}
        <div className="flex justify-between mt-4">
          {data.map((item, index) => (
            <div key={index} className="flex-1 mx-1">
              <div className="text-xs font-medium text-gray-600 text-center leading-tight h-8 flex items-start justify-center">
                {item.country}
              </div>
            </div>
          ))}
        </div>
      </div>


    </div>
  );
};

export default SeaLevelRiseChart; 