'use client';

import React from 'react';
import DisasterVoronoiChartMobile from '../components/DisasterVoronoiChartMobile';

export default function DisasterVoronoiPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <DisasterVoronoiChartMobile />
    </div>
  );
} 



