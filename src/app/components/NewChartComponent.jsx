'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const NewChartComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredBar, setHoveredBar] = useState(null);
  const [showFullscreenImage, setShowFullscreenImage] = useState(false);
  const [currentImageData, setCurrentImageData] = useState(null);

  // Function to format numbers as K
  const formatAsK = (value) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  // Function to hide 0 label on Y-axis and show whole numbers
  const hideZeroLabel = (value) => {
    if (value === 0) return '';
    if (value >= 1000) {
      return `${Math.round(value / 1000)}K`;
    }
    return value.toString();
  };

  // Handle bar hover
  const handleBarMouseEnter = (data, index) => {
    setHoveredBar(index);
    setCurrentImageData({
      year: data.year,
      affectedPeople: data.affectedPeople,
      index: index
    });
  };

  const handleBarMouseLeave = () => {
    setHoveredBar(null);
    setCurrentImageData(null);
  };

  const handleBarClick = () => {
    if (currentImageData) {
      setShowFullscreenImage(true);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/pacific_disaster_impact_cleaned.csv');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const csvText = await response.text();
        const lines = csvText.trim().split('\n');
        
        // Parse CSV data
        const rawData = lines.slice(1).map(line => {
          const values = line.split(';');
          return {
            year: parseInt(values[0]),
            country: values[1],
            affectedPeople: parseInt(values[2])
          };
        }).filter(item => !isNaN(item.year) && !isNaN(item.affectedPeople));
        
        console.log('Raw data sample:', rawData.slice(0, 5));
        
        // Sum affected people per year
        const yearTotals = {};
        rawData.forEach(item => {
          if (yearTotals[item.year]) {
            yearTotals[item.year] += item.affectedPeople;
          } else {
            yearTotals[item.year] = item.affectedPeople;
          }
        });
        
        console.log('Year totals:', yearTotals);
        
        // Convert to array format for chart
        const chartData = Object.keys(yearTotals)
          .map(year => ({
            year: parseInt(year),
            affectedPeople: yearTotals[year]
          }))
          .sort((a, b) => a.year - b.year);
        
        console.log('Chart data:', chartData);
        setData(chartData);
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
      <div style={{ 
        width: '100%', 
        height: '400px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f3f4f6',
        borderRadius: '8px'
      }}>
        <div style={{ fontSize: '1.2rem', color: '#6b7280' }}>Loading disaster data...</div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '400px', boxSizing: 'border-box', position: 'relative' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ left: 5, right: 20, top: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
          <XAxis 
            dataKey="year" 
            tickLine={false}
            axisLine={false}
            type="number"
            domain={['dataMin', 'dataMax']}
          />
          <YAxis 
            width={40}
            tickLine={false}
            axisLine={false}
            tickFormatter={hideZeroLabel}
          />
          <Tooltip 
            formatter={(value, name) => [formatAsK(value), 'People Affected']}
            labelFormatter={(label) => `Year: ${label}`}
          />
          <Bar 
            dataKey="affectedPeople" 
            fill="#000000"
            onMouseEnter={handleBarMouseEnter}
            onMouseLeave={handleBarMouseLeave}
            onClick={handleBarClick}
            style={{ cursor: 'pointer' }}
          />
        </BarChart>
      </ResponsiveContainer>
      
      {/* Fullscreen image overlay */}
      {showFullscreenImage && currentImageData && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            cursor: 'pointer'
          }}
          onClick={() => setShowFullscreenImage(false)}
        >
          <div style={{
            position: 'relative',
            maxWidth: '90vw',
            maxHeight: '90vh',
            textAlign: 'center'
          }}>
            {/* Placeholder for the image - you can replace this with actual image paths */}
            <div style={{
              width: '800px',
              height: '600px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '2px dashed rgba(255, 255, 255, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '18px',
              borderRadius: '8px'
            }}>
              <div>
                <div style={{ fontSize: '24px', marginBottom: '10px' }}>
                  {currentImageData.year}
                </div>
                <div style={{ fontSize: '18px', marginBottom: '20px' }}>
                  {formatAsK(currentImageData.affectedPeople)} People Affected
                </div>
                <div style={{ fontSize: '14px', opacity: 0.7 }}>
                  Image placeholder - Click to close
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewChartComponent; 