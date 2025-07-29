'use client';

import React from 'react';
import HistoricalSeaLevelRiseExtended from '../components/HistoricalSeaLevelRiseExtended';

const ExtendedChartPage = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      padding: '2rem',
      backgroundColor: '#ffffff',
      fontFamily: 'Helvetica World, Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ 
          backgroundColor: '#ffffff', 
          padding: '2rem', 
          borderRadius: '8px'
        }}>
          <HistoricalSeaLevelRiseExtended />
        </div>
      </div>
    </div>
  );
};

export default ExtendedChartPage;