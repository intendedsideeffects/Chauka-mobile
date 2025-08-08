"use client"
import { useState, useEffect, useMemo, useCallback, useLayoutEffect, useRef } from 'react';
import { debounce } from 'lodash';
import historicalEvents from "../../data/historicalPoints"
import birdArr from '../../data/birdArray';
import PlotsScatterChart from '../PlotsScatterChart';
import { supabase } from '../../utils/supabaseClient';

const STATUS_HEIGHT = 7000; // Reduced to match segments 3-9 height
const STATUS_WIDTH = 1600;
const getYearPosition = (year) => {
  return ((2200 - year) / (2200 - 1400)) * STATUS_HEIGHT;
};

const ExtinctSpeciesVizBrowser = () => {
  const [data, setData] = useState([]);
  const [timelineData, setTimelineData] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const scatterSectionRef = useRef(null);

  // Fetch data from ocean_stories
  const loadData = async () => {
    try {
      const { data: stories, error } = await supabase.from('ocean_stories').select('*');
      if (error) throw error;
      // Map stories to scatterplot points and filter for flooding only
      const points = (stories || [])
        .filter(row => row.disaster_type && row.disaster_type.toLowerCase().includes('flood'))
        .map((row) => {
          const year = row.start_year ? parseInt(String(row.start_year).trim(), 10) : null;
          return {
            x: Math.random() * STATUS_WIDTH - STATUS_WIDTH / 2 + (Math.random() - 0.5) * 100,
            y: year !== null ? getYearPosition(year) : null,
            disaster_type: row.disaster_type,
            country: row.country,
            start_year: year,
            summary: row.summary,
            total_affected: row.total_affected ? Number(row.total_affected) : 0,
            total_injured: row.total_injured ? Number(row.total_injured) : 0,
            total_homeless: row.total_homeless ? Number(row.total_homeless) : 0,
            total_deaths: row.total_deaths ? Number(row.total_deaths) : 0,
          };
        });
      console.log('Scatterplot points (flooding only):', points);
      setData(points);
      // Timeline marks (every 100 years)
      const timelineMarks = [];
      for (let year = 1400; year <= 2200; year += 100) {
        timelineMarks.push({
          x: STATUS_WIDTH / 2,
          y: getYearPosition(year),
          label: year.toString(),
          event: '',
        });
      }
      setTimelineData(timelineMarks);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={{ height: '100vh' }} />;
  }

  const visibleData = data;

  return (
    <div ref={scatterSectionRef} style={{ 
      width: '100vw', 
      maxWidth: '100%', 
      overflow: 'visible',
      position: 'relative',
      zIndex: 9999
    }}>
      {isLoading ? (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading chart data...</div>
      ) : (
        <PlotsScatterChart timelineData={timelineData} visibleData={visibleData} />
      )}
    </div>
  );
};

export default ExtinctSpeciesVizBrowser; 


