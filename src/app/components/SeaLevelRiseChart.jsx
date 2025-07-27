'use client';

import React, { useState, useEffect } from 'react';

const SeaLevelRiseChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDegree, setSelectedDegree] = useState('2');
  const [selectedYear, setSelectedYear] = useState('2050');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/Coastal_Elevation_Exposure__Comma_Format_.csv');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const csvText = await response.text();
        
        // Parse CSV with semicolon separator
        const lines = csvText.trim().split('\n');
        const headers = lines[0].split(';');
        
        const parsedData = lines.slice(1).map(line => {
          const values = line.split(';');
          return {
            country: values[0],
            threshold: parseFloat(values[1].replace(',', '.')),
            seaLevelRise2Degree2050: parseFloat(values[2].replace(',', '.')),
            seaLevelRise2Degree2100: parseFloat(values[3].replace(',', '.')),
            seaLevelRise4Degree2050: parseFloat(values[4].replace(',', '.')),
            seaLevelRise4Degree2100: parseFloat(values[5].replace(',', '.'))
          };
        }).filter(item => !isNaN(item.seaLevelRise2Degree2050));
        
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

  // Get the selected data based on user choices
  const getSelectedData = () => {
    const columnName = `seaLevelRise${selectedDegree}Degree${selectedYear}`;
    return data.map(item => ({
      ...item,
      selectedValue: item[columnName]
    }));
  };

  const selectedData = getSelectedData();
  const maxValue = Math.max(...selectedData.map(d => d.selectedValue));

    return (
    <div className="w-full p-8 bg-white">
      <div style={{ marginLeft: '12cm', marginRight: '12cm' }}>
        {/* Controls */}
        <div className="flex justify-center gap-4 mb-6">
                     <div className="flex gap-2">
             <button 
               onClick={() => setSelectedDegree('2')}
               className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                 selectedDegree === '2' 
                   ? 'bg-black text-white' 
                   : 'bg-gray-100 text-black hover:bg-gray-200'
               }`}
             >
               2°C
             </button>
             <button 
               onClick={() => setSelectedDegree('4')}
               className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                 selectedDegree === '4' 
                   ? 'bg-black text-white' 
                   : 'bg-gray-100 text-black hover:bg-gray-200'
               }`}
             >
               4°C
             </button>
           </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setSelectedYear('2050')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                selectedYear === '2050' 
                  ? 'bg-black text-white' 
                  : 'bg-gray-100 text-black hover:bg-gray-200'
              }`}
            >
              2050
            </button>
            <button 
              onClick={() => setSelectedYear('2100')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                selectedYear === '2100' 
                  ? 'bg-black text-white' 
                  : 'bg-gray-100 text-black hover:bg-gray-200'
              }`}
            >
              2100
            </button>
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Sea Level Rise Projections
          </h2>
          <p className="text-lg text-gray-600">
            {selectedDegree}°C Scenario - {selectedYear} Projections for Pacific Island Nations
          </p>
        </div>

             <div className="px-4">
                   {/* Chart area with bars */}
          <div className="flex items-end justify-between h-[500px] relative">
            {/* Zero line positioned directly under bars */}
            <div className="absolute bottom-0 left-0 right-0 border-t border-black"></div>
            
                                                                                                                                 {/* Video Area Chart with waves */}
                            <div className="absolute inset-0 overflow-hidden">
                <video 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{
                    objectPosition: 'center 25%',
                    clipPath: `polygon(${(() => {
                      const chartWidth = 100;
                      const chartHeight = 100;
                      const barWidth = chartWidth / selectedData.length;
                      
                      let polygonPoints = `0% ${chartHeight - (selectedData[0].selectedValue / 1.0) * 100 * 0.7}%`;
                      
                      selectedData.forEach((item, index) => {
                        const x = ((index + 0.5) * barWidth / chartWidth) * 100;
                        const y = chartHeight - (item.selectedValue / 1.0) * 100 * 0.7; // 20% lower, using full height scale
                        polygonPoints += `, ${x}% ${y}%`;
                      });
                      
                      polygonPoints += `, ${chartWidth}% ${chartHeight - (selectedData[selectedData.length - 1].selectedValue / 1.0) * 100 * 0.7}%`;
                      polygonPoints += `, ${chartWidth}% ${chartHeight}%, 0% ${chartHeight}%`;
                      return polygonPoints;
                    })()})`
                  }}
                >
                  <source src="/waves.mp4" type="video/mp4" />
                </video>
              </div>
            
            {selectedData.map((item, index) => (
            <div key={index} className="flex flex-col items-center flex-1 mx-1">
                                                          {/* Bar */}
                               <div className="relative w-full max-w-16">
                                                    <div 
                                             className="bg-black rounded-t-sm hover:bg-[#1d203b] relative z-10"
                      style={{ 
                        height: `${(item.selectedValue / 1.0) * 400}px`,
                        minHeight: '30px'
                      }}
                    />
                   
                    {/* Value label */}
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-base text-gray-700 z-20">
                      {item.selectedValue.toFixed(2)}M
                    </div>
               </div>
             </div>
           ))}
        </div>
        
        {/* Country labels below the chart */}
        <div className="flex justify-between mt-4">
          {selectedData.map((item, index) => (
            <div key={index} className="flex-1 mx-1">
              <div className="text-sm font-medium text-gray-600 text-center leading-tight h-10 flex items-start justify-center">
                {item.country}
              </div>
            </div>
          ))}
        </div>
             </div>
      </div>
    </div>
  );
};

export default SeaLevelRiseChart; 