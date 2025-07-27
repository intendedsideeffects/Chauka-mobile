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
     <div className="w-full p-8 bg-white relative">
                                                                                                                       {/* Controls - Scattered in top-right corner of page */}
                 <div className="absolute top-8 right-8 z-50" style={{ height: '200px' }}>
                   
                                     {/* Select Parameter Image */}
                   <div 
                     className="absolute"
                     style={{
                       right: '110px',
                       top: '-20px',
                       width: '400px',
                       height: '200px',
                       display: 'flex',
                       alignItems: 'center',
                       justifyContent: 'center',
                     }}
                   >
                                         <img 
                       src="/selectparameter.png" 
                       alt="Select Parameter"
                       style={{
                         width: '100%',
                         height: '100%',
                         objectFit: 'contain',
                         transform: 'rotate(-20deg)'
                       }}
                     />
                  </div>                                     
                                                                                                                                                                                                                                                                                                     {/* 2°C Button - positioned randomly in top-right */}
                      <div 
                        className="absolute"
                                                style={{
                                                      right: '240px',
                            top: '220px',
                          width: '80px',
                          height: '80px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                        onClick={() => setSelectedDegree('2')}
                      >
                  <svg width="80" height="80" style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
                    <defs>
                      <path id="circlePath2C" d="M40,10 A30,30 0 1,1 39.99,10" />
                    </defs>
                    <circle cx="40" cy="40" r="25" fill={selectedDegree === '2' ? "#000" : "#d3d3d3"} />
                    <text fill={selectedDegree === '2' ? "#000" : "#666"} fontSize="12" fontWeight="bold" letterSpacing="0.08em">
                      <textPath xlinkHref="#circlePath2C" startOffset="0%" textAnchor="start" dominantBaseline="middle">
                        2°C
                      </textPath>
                    </text>
                  </svg>
                </div>

                                                                                                                                                                                                                                                                                                     {/* 4°C Button - positioned randomly in top-right */}
                      <div 
                        className="absolute"
                                                style={{
                                                      right: '200px',
                            top: '260px',
                          width: '80px',
                          height: '80px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                        onClick={() => setSelectedDegree('4')}
                      >
                  <svg width="80" height="80" style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
                    <defs>
                      <path id="circlePath4C" d="M40,10 A30,30 0 1,1 39.99,10" />
                    </defs>
                    <circle cx="40" cy="40" r="25" fill={selectedDegree === '4' ? "#000" : "#d3d3d3"} />
                    <text fill={selectedDegree === '4' ? "#000" : "#666"} fontSize="12" fontWeight="bold" letterSpacing="0.08em">
                      <textPath xlinkHref="#circlePath4C" startOffset="0%" textAnchor="start" dominantBaseline="middle">
                        4°C
                      </textPath>
                    </text>
                  </svg>
                </div>

                                                                                                                                                                                                                                                                               {/* 2050 Button - positioned randomly in top-right */}
                    <div 
                      className="absolute"
                                             style={{
                                                   right: '260px',
                          top: '80px',
                        width: '120px',
                        height: '120px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                      onClick={() => setSelectedYear('2050')}
                    >
                  <svg width="120" height="120" style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
                    <defs>
                      <path id="circlePath2050" d="M60,15 A45,45 0 1,1 59.99,15" />
                    </defs>
                    <circle cx="60" cy="60" r="40" fill={selectedYear === '2050' ? "#000" : "#d3d3d3"} />
                    <text fill={selectedYear === '2050' ? "#000" : "#666"} fontSize="14" fontWeight="bold" letterSpacing="0.08em">
                      <textPath xlinkHref="#circlePath2050" startOffset="0%" textAnchor="start" dominantBaseline="middle">
                        2050
                      </textPath>
                    </text>
                  </svg>
                </div>

                                                                   {/* 2100 Button - positioned randomly in top-right */}
                  <div 
                    className="absolute"
                                         style={{
                                               right: '120px',
                        top: '100px',
                      width: '120px',
                      height: '120px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                    onClick={() => setSelectedYear('2100')}
                  >
                  <svg width="120" height="120" style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
                    <defs>
                      <path id="circlePath2100" d="M60,15 A45,45 0 1,1 59.99,15" />
                    </defs>
                    <circle cx="60" cy="60" r="40" fill={selectedYear === '2100' ? "#000" : "#d3d3d3"} />
                    <text fill={selectedYear === '2100' ? "#000" : "#666"} fontSize="14" fontWeight="bold" letterSpacing="0.08em">
                      <textPath xlinkHref="#circlePath2100" startOffset="0%" textAnchor="start" dominantBaseline="middle">
                        2100
                      </textPath>
                    </text>
                  </svg>
                </div>
              </div>

                             <div style={{ marginLeft: '12cm', marginRight: '12cm' }}>

                   

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