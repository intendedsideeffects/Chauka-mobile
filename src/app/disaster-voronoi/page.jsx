'use client';

import React from 'react';
import DisasterVoronoiChart from '../components/DisasterVoronoiChart';

export default function DisasterVoronoiPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <DisasterVoronoiChart />
    </div>
  );
} 