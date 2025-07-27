"use client"
import React from 'react';
import PlotsScatterChartCopy from '../components/PlotsScatterChartCopy';
import historicalEvents from "../data/historicalPoints";

export default function ScatterplotTestPage() {
  // Sample data for testing
  const sampleVisibleData = [
    {
      x: 0,
      y: 0,
      disaster_type: "Test Disaster",
      country: "Test Country",
      start_year: 1950,
      summary: "Test summary",
      total_affected: 1000,
      total_injured: 100,
      total_homeless: 50,
      total_deaths: 10,
    },
    {
      x: 100,
      y: 100,
      disaster_type: "Another Disaster",
      country: "Another Country",
      start_year: 1980,
      summary: "Another test summary",
      total_affected: 2000,
      total_injured: 200,
      total_homeless: 100,
      total_deaths: 20,
    }
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f5f5f5',
      padding: '20px'
    }}>
      <h1 style={{ 
        textAlign: 'center', 
        color: '#333',
        marginBottom: '30px',
        fontSize: '2.5rem'
      }}>
        Swapped Axes Scatterplot Test
      </h1>
      
      <div style={{
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '20px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <p style={{
          textAlign: 'center',
          color: '#666',
          marginBottom: '20px',
          fontSize: '1.1rem'
        }}>
          This is a test of the scatterplot with swapped X and Y axes. 
          Years are now on the X-axis (horizontal) instead of the Y-axis.
        </p>
        
        <PlotsScatterChartCopy 
          timelineData={historicalEvents} 
          visibleData={sampleVisibleData} 
        />
      </div>
    </div>
  );
} 