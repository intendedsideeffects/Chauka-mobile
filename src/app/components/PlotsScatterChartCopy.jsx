import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Label, ReferenceArea } from 'recharts';
import getRegionColor from '../data/colorPointsData';
import CustomTooltip from './CustomTooltip';
import { FloatingDot } from './FloatingDot';
import { supabase } from '../utils/supabaseClient';

// Helper: avoid overlaps for dots
function avoidOverlaps(dots, minDistance = 30, maxTries = 20) {
  const placed = [];
  for (let dot of dots) {
    let tries = 0;
    let newDot = { ...dot };
    while (
      placed.some(
        d => Math.hypot(d.x - newDot.x, d.y - newDot.y) < minDistance
      ) &&
      tries < maxTries
    ) {
      newDot.x += (Math.random() - 0.5) * minDistance;
      tries++;
    }
    placed.push(newDot);
  }
  return placed;
}

const STATUS_WIDTH = 1600;
const YEAR_MIN = 1922;
const YEAR_MAX = 2025;

// Dynamic height based on viewport
const getDynamicHeight = () => {
  if (typeof window !== 'undefined') {
    return window.innerHeight - 200; // Subtract some space for margins/padding
  }
  return 800; // Fallback height
};

const getYearPosition = (year, height) => {
  return ((YEAR_MAX - year) / (YEAR_MAX - YEAR_MIN)) * height;
};

function PlotsScatterChart({ timelineData, visibleData }) {
    const PRESENT_YEAR = new Date().getFullYear();
    // For demo/fixed: const PRESENT_YEAR = 2025;
    const audioRef = useRef(null);
    const purpleDotAudioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [hoveredDot, setHoveredDot] = useState(null);
    const [isHoveringPurpleDot, setIsHoveringPurpleDot] = useState(false);
    const [isPurpleAudioPlaying, setIsPurpleAudioPlaying] = useState(false);
    const purpleDotAudio = useRef(null);
    const [memories, setMemories] = useState([]);
    const [chartHeight, setChartHeight] = useState(800);

    useEffect(() => {
        const enableAudio = () => {
            console.log('Enabling audio...');
            if (!audioRef.current) {
                audioRef.current = new Audio();
                console.log('audioRef initialized');
            }
        };

        // Enable audio immediately
        enableAudio();
    }, []);

    // Set dynamic height based on viewport
    useEffect(() => {
        const updateHeight = () => {
            setChartHeight(getDynamicHeight());
        };
        
        updateHeight();
        window.addEventListener('resize', updateHeight);
        
        return () => window.removeEventListener('resize', updateHeight);
    }, []);

    useEffect(() => {
      async function fetchMemories() {
        const { data, error } = await supabase.from('memories').select('*');
        if (!error) setMemories(data);
      }
      fetchMemories();
    }, []);

    const handleMouseEnter = (dot) => {
        if (dot.highlighted && !isPlaying) {
            setIsPlaying(true);
            setHoveredDot(dot);

            if (!audioRef.current) {
                audioRef.current = new Audio(dot.sound);
            } else {
                audioRef.current.src = dot.sound;
            }

            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => console.log("🎵 Playing audio"))
                    .catch((error) => console.warn("⚠️ Autoplay prevented:", error));
            }
        }
    };

    const handleMouseLeave = (dot) => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        setIsPlaying(false);
        setHoveredDot(null);
    };

    const getStableColor = useCallback((status) => {
        return getRegionColor(status);
    }, []);

    const stabilizedData = useMemo(() => {
        return timelineData
            .filter(d => {
                const year = d.year || d.event_year || d.ext_date || d.xYear;
                return year >= YEAR_MIN && year <= YEAR_MAX;
            })
            .map(d => {
            // SWAPPED: Calculate x-coordinate for extinct birds without dates
            let xCoord = d.y; // Original Y becomes X
            if (d.status === "Extinct" && !d.ext_date) {
                const scale = chartHeight / (YEAR_MAX - YEAR_MIN);
                xCoord = (YEAR_MAX - 2024) * scale;
            }
            // Determine year for this dot
            const year = d.year || d.event_year || d.ext_date || d.xYear;
            const isFuture = year && year > PRESENT_YEAR;
            return {
                ...d,
                fill: isFuture ? '#e0b800' : (d.fill || getStableColor(d.status)),
                future: !!isFuture,
                size: d.size || 5,
                x: xCoord,
                y: Math.round(d.x) // Original X becomes Y
            };
        });
    }, [timelineData, getStableColor, chartHeight]);

    const MIN_DOT_SIZE = 8; // always visible
    const MAX_DOT_SIZE = 60; // allow larger dots

    const affectedValues = visibleData
      .map(d => typeof d.total_affected === 'number' && !isNaN(d.total_affected) ? d.total_affected : 0)
      .filter(v => v > 0);
    const minAffected = Math.min(...affectedValues, 1); // avoid 0
    const maxAffected = Math.max(...affectedValues, 1);

    const PIXELS_PER_CM = 37.8; // 1cm ≈ 37.8px at 96dpi, so 0.5cm ≈ 19px
    const MAX_Y_OFFSET = PIXELS_PER_CM * 0.5;

    const stabilizedVisibleData = useMemo(() => {
        return visibleData
            .filter(d => {
                const year = d.start_year;
                return year >= YEAR_MIN && year <= YEAR_MAX;
            })
            .map((d, i) => {
            const year = d.start_year;
            const isFuture = year && year > PRESENT_YEAR;
            let size = MIN_DOT_SIZE;
            if (typeof d.total_affected === 'number' && !isNaN(d.total_affected)) {
                if (maxAffected > minAffected) {
                    size = MIN_DOT_SIZE + ((d.total_affected - minAffected) / (maxAffected - minAffected)) * (MAX_DOT_SIZE - MIN_DOT_SIZE);
                }
            }
            // SWAPPED: Use year position for X axis, original X for Y axis
            const xBase = year ? getYearPosition(year, chartHeight) : 0;
            const xOffset = (Math.random() - 0.5) * 2 * MAX_Y_OFFSET;
            const x = xBase + xOffset;
            const y = Math.round(d.x); // Original X becomes Y
            // Debug log
            // console.log('Dot size for', d.disaster_type, d.country, 'affected:', d.total_affected, 'size:', size, 'x:', x);
            return {
                ...d,
                fill: '#0a2342', // dark blue
                opacity: 0.9,
                future: !!isFuture,
                size,
                x,
                y,
            };
        });
    }, [visibleData, minAffected, maxAffected, chartHeight]);

    // Debug: log status values for visible dots
    useEffect(() => {
        if (stabilizedVisibleData.length > 0) {
            console.log('Dot statuses:', stabilizedVisibleData.map(d => d.status));
            console.log('First 5 dots:', stabilizedVisibleData.slice(0, 5));
        }
    }, [stabilizedVisibleData]);

    // Calculate the x position for the NOW line and future background
    const yearMin = 1922;
    const yearMax = 2025;
    const nowX = ((yearMax - PRESENT_YEAR) / (yearMax - yearMin)) * chartHeight;
    const futureHeight = ((yearMax - PRESENT_YEAR) / (yearMax - yearMin)) * chartHeight;
    const futureX = nowX;

    // Generate x-axis ticks for 1925, 1930, ..., 2025
    const xAxisTicks = [];
    const xAxisTickLabels = [];
    for (let year = 1925; year <= YEAR_MAX; year += 5) {
      xAxisTicks.push(((YEAR_MAX - year) / (YEAR_MAX - YEAR_MIN)) * chartHeight);
      xAxisTickLabels.push(year);
    }

    // Memory dots: SWAPPED - fixed y, x from year, purple color
    const MEMORY_Y = 600;
    const MEMORY_SIZE = 24;
    const memoryDots = memories
      .filter(m => m.year && m.year >= YEAR_MIN && m.year <= YEAR_MAX)
      .map((m, i) => ({
        x: ((YEAR_MAX - m.year) / (YEAR_MAX - YEAR_MIN)) * chartHeight,
        y: MEMORY_Y + i * 40,
        title: m.type === 'image' ? 'Image Memory' : m.type === 'sound' ? 'Sound Memory' : 'Memory',
        size: MEMORY_SIZE,
        type: m.type,
        content: m.content,
        author: m.author,
        year: m.year,
        id: m.id,
      }));

    // Add delete handler for memories
    const handleDeleteMemory = async (id) => {
      await supabase.from('memories').delete().eq('id', id);
      setMemories(memories => memories.filter(m => m.id !== id));
      setHoveredDot(null);
    };

    return (
        <div
            id="plot-container"
            style={{
                width: '100%',
                height: chartHeight + 'px',
                position: 'relative',
                backgroundColor: 'white',
                color: 'black',
                overflow: 'visible'
            }}>
            
            {/* Hidden audio element for purple dots */}
            <audio 
                ref={purpleDotAudio}
                src="/chaukasound.mp3"
                preload="auto"
                style={{ display: 'none' }}
                onEnded={() => {
                    console.log('Audio ended, resetting flag');
                    setIsPurpleAudioPlaying(false);
                }}
            />
            
            {/* Custom tooltip for colored dots and memory dots */}
            {hoveredDot && hoveredDot.type === 'memory' && (
              console.log('Rendering tooltip for:', hoveredDot),
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '20px',
                  transform: 'translateX(-50%)',
                  background: 'white',
                  color: '#222',
                  border: '1px solid #5a3f6e',
                  borderRadius: 8,
                  padding: '1rem',
                  minWidth: 220,
                  fontSize: '1rem',
                  boxShadow: '0 2px 12px #0002',
                  zIndex: 1000,
                }}
              >
                <strong>
                  {hoveredDot.type === 'image' ? 'Image Memory' : 'Memory'}
                </strong>
                <div style={{ marginTop: 8 }}>
                  {hoveredDot.type === 'image' ? (
                    <img src={hoveredDot.content} alt="memory" style={{ maxWidth: 180 }} />
                  ) : (
                    <div>{hoveredDot.content}</div>
                  )}
                </div>
                <div>
                  <small>
                    {hoveredDot.author} ({hoveredDot.year})
                  </small>
                </div>
                {/* Show delete button for all non-sound memories */}
                {hoveredDot.type !== 'sound' && (
                  <button
                    style={{
                      marginTop: 12,
                      background: '#e74c3c',
                      color: 'white',
                      border: 'none',
                      borderRadius: 4,
                      padding: '6px 12px',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleDeleteMemory(hoveredDot.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            )}
            
            <ResponsiveContainer width="100%" height={chartHeight}>
                <ScatterChart
                    key="main-scatter-chart"
                    style={{ background: '#050d1a', overflow: 'visible' }} // darkest blue almost black
                    margin={{ top: 0, right: 341, bottom: 0, left: 189 }}
                    width={STATUS_WIDTH}
                    height={chartHeight}
                >
                    <XAxis
                        type="number"
                        dataKey="x"
                        domain={[0, chartHeight]}
                        orientation="bottom"
                        ticks={xAxisTicks}
                        tick={({ x, y, payload }) => {
                            // payload.value is the x position, find its index
                            const idx = xAxisTicks.findIndex(tick => Math.abs(tick - payload.value) < 2);
                            const year = xAxisTickLabels[idx];
                            return (
                                <text
                                    x={x}
                                    y={y + 20}
                                    fontSize={16}
                                    fill={'#000'}
                                    textAnchor="middle"
                                >
                                    {year || ''}
                                </text>
                            );
                        }}
                        axisLine={(props) => {
                            // Calculate the x-pixel for PRESENT_YEAR (2025) using the same formula as the NOW line
                            const yearMin = 1922;
                            const yearMax = 2025;
                            const nowX = ((yearMax - PRESENT_YEAR) / (yearMax - yearMin)) * chartHeight;
                            return (
                                <g>
                                    {/* Black line from left to NOW */}
                                    <line
                                        x1={0}
                                        y1={props.y}
                                        x2={nowX}
                                        y2={props.y}
                                        stroke="#000"
                                        strokeWidth={2}
                                    />
                                    {/* Yellow line from NOW to right */}
                                    <line
                                        x1={nowX}
                                        y1={props.y}
                                        x2={chartHeight}
                                        y2={props.y}
                                        stroke="#e0b800"
                                        strokeWidth={2}
                                    />
                                </g>
                            );
                        }}
                    />
                    <YAxis
                        type="number"
                        dataKey="y"
                        domain={[-STATUS_WIDTH / 2, STATUS_WIDTH / 2]}
                        tickFormatter={(value) => Math.round(value)}
                        hide
                    />


                    <Scatter
                        data={stabilizedData}
                        shape={(props) => {
                            const text = String(props.payload.event);
                            const words = text.split(' ');
                            let lines = [];
                            let currentLine = '';
                            const maxWidth = 30;

                            words.forEach((word) => {
                                if ((currentLine + ' ' + word).length <= maxWidth) {
                                    currentLine += (currentLine ? ' ' : '') + word;
                                } else {
                                    lines.push(currentLine);
                                    currentLine = word;
                                }
                            });
                            if (currentLine) {
                                lines.push(currentLine);
                            }

                            // Only make the specific event yellow
                            const isSpecialEvent =
                                props.payload.event ===
                                    'Conservative predictions expect 12.5% of all global bird species to go extinct by 2100. Many scientists expect the real number to be significantly higher.';
                            const textColor = isSpecialEvent ? '#e0b800' : '#222';

                            return (
                                <g style={{ pointerEvents: 'none' }}>
                                    {lines.map((line, i) => (
                                        <text
                                            key={i}
                                            x={props.cx + 100}
                                            y={props.cy + i * 18}
                                            textAnchor="start"
                                            fill={textColor}
                                            fontSize="16"
                                            style={{ pointerEvents: 'none' }}>
                                            {line}
                                        </text>
                                    ))}
                                </g>
                            );
                        }}
                    />

                    <Scatter
                        data={stabilizedVisibleData}
                        shape={(props) => (
                            <FloatingDot
                                cx={props.cx}
                                cy={props.cy}
                                r={props.payload.size}
                                payload={props.payload}
                                fill={props.payload.fill}
                                opacity={props.payload.opacity}
                                onMouseEnter={() => handleMouseEnter(props.payload)}
                                onMouseLeave={() => handleMouseLeave(props.payload)}
                            />
                        )}
                    />

                    {/* Memory dots: fixed x, y from year, purple color */}
                    <Scatter
                      data={memoryDots}
                      shape={(props) => (
                        <circle
                          cx={props.cx}
                          cy={props.cy}
                          r={32} // TEMP: make memory dots large for easier hover
                          fill="#5a3f6e"
                          opacity={0.7}
                          style={{ cursor: 'pointer' }}
                          onMouseEnter={e => {
                            if (props.payload.type === 'sound') {
                              if (audioRef.current) {
                                audioRef.current.src = props.payload.content;
                                audioRef.current.play().catch(() => {});
                              }
                              setHoveredDot(null);
                            } else {
                              console.log('Memory dot hovered:', props.payload);
                              setHoveredDot({ ...props.payload, type: 'memory' });
                            }
                          }}
                          onMouseLeave={e => {
                            if (props.payload.type === 'sound' && audioRef.current) {
                              audioRef.current.pause();
                              audioRef.current.currentTime = 0;
                            }
                            setHoveredDot(null);
                          }}
                        />
                      )}
                    />

                    <Tooltip 
                        content={<CustomTooltip />}
                        cursor={{ stroke: '#666' }}
                        isAnimationActive={false}
                    />

                    {/* Purple large dots - Warning - SWAPPED */}
                    <Scatter
                        data={[
                            { x: 2000, y: -600, title: "Warning", size: 60 },  // ~1950
                            { x: 6000, y: 0, title: "Warning", size: 60 },    // ~1985
                            { x: 10000, y: 400, title: "Warning", size: 60 }  // ~2020
                        ]}
                        shape={(props) => (
                            <circle
                                cx={props.cx}
                                cy={props.cy}
                                r={props.payload.size}
                                fill="#5a3f6e"
                                opacity={0.7}
                                style={{ cursor: 'pointer' }}
                                onMouseEnter={(e) => {
                                    console.log('MOUSE ENTER - Purple dot');
                                    e.target.style.opacity = '0.7';
                                    setHoveredDot({ ...props.payload, type: 'warning' });
                                    setIsHoveringPurpleDot(true);
                                    
                                    // Play chaukasound.mp3 only if not already playing and audio is enabled
                                    console.log('Hover check:', { 
                                        hasAudio: !!purpleDotAudio.current, 
                                        isPlaying: isPurpleAudioPlaying
                                    });
                                    
                                    console.log('Audio element:', purpleDotAudio.current);
                                    
                                    if (purpleDotAudio.current && !isPurpleAudioPlaying) {
                                        console.log('Playing chaukasound.mp3');
                                        purpleDotAudio.current.volume = 0.3;
                                        
                                        // Only reset to beginning if audio has ended
                                        if (purpleDotAudio.current.ended || purpleDotAudio.current.currentTime >= purpleDotAudio.current.duration) {
                                            purpleDotAudio.current.currentTime = 0;
                                        }
                                        
                                        purpleDotAudio.current.play().then(() => {
                                            setIsPurpleAudioPlaying(true);
                                        }).catch((error) => {
                                            console.error('Error playing chaukasound:', error);
                                        });
                                    } else {
                                        console.log('Audio not playing because:', {
                                            noAudio: !purpleDotAudio.current,
                                            alreadyPlaying: isPurpleAudioPlaying
                                        });
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    console.log('MOUSE LEAVE - Purple dot');
                                    e.target.style.opacity = '0.7';
                                    setHoveredDot(null);
                                    setIsHoveringPurpleDot(false);
                                    
                                    // Stop chaukasound.mp3 with a small delay to avoid interruption
                                    setTimeout(() => {
                                        if (purpleDotAudio.current) {
                                            console.log('Stopping chaukasound.mp3');
                                            purpleDotAudio.current.pause();
                                            purpleDotAudio.current.currentTime = 0;
                                            setIsPurpleAudioPlaying(false);
                                        }
                                    }, 50);
                                }}
                            />
                        )}
                    />

                    {/* Blue medium dots - Memory - SWAPPED */}
                    <Scatter
                        data={[
                            { x: 4000, y: -600, title: "Memory", size: 24 },
                            { x: 6000, y: 400, title: "Memory", size: 24 },
                            { x: 8000, y: -200, title: "Memory", size: 24 }
                        ]}
                        shape={(props) => (
                            <circle
                                cx={props.cx}
                                cy={props.cy}
                                r={props.payload.size}
                                fill="#3d557a"
                                opacity={0.8}
                                style={{ cursor: 'pointer' }}
                                onMouseEnter={(e) => {
                                    e.target.style.opacity = '0.7';
                                    setHoveredDot({ ...props.payload, type: 'memory' });
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.opacity = '0.5';
                                    setHoveredDot(null);
                                }}
                            />
                        )}
                    />


                </ScatterChart>
            </ResponsiveContainer>
        </div>
    );
}

export default PlotsScatterChart; 