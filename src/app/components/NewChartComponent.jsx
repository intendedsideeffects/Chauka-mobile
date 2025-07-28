'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const NewChartComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <div style={{ width: '100%', height: '400px', boxSizing: 'border-box' }}>
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
          <Bar dataKey="affectedPeople" fill="#000000" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default NewChartComponent; 