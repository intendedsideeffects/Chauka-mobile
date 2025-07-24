import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Label, ReferenceArea } from 'recharts';
import getRegionColor from '../data/colorPointsData';
import CustomTooltip from './CustomTooltip';
import { FloatingDot } from './FloatingDot';

const STATUS_HEIGHT = 12500;
const STATUS_WIDTH = 1600;
const YEAR_MIN = 1900;
const YEAR_MAX = 2200;
const getYearPosition = (year) => {
  return ((YEAR_MAX - year) / (YEAR_MAX - YEAR_MIN)) * STATUS_HEIGHT;
};

function PlotsScatterChart({ timelineData, visibleData }) {
    const PRESENT_YEAR = new Date().getFullYear();
    // For demo/fixed: const PRESENT_YEAR = 2025;
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [hoveredDot, setHoveredDot] = useState(null);

    useEffect(() => {
        const enableAudio = () => {
            if (!audioRef.current) {
                audioRef.current = new Audio();
            }
        };

        document.addEventListener("click", enableAudio, { once: true });
        return () => document.removeEventListener("click", enableAudio);
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
        return timelineData.map(d => {
            // Calculate y-coordinate for extinct birds without dates
            let yCoord = d.y;
            if (d.status === "Extinct" && !d.ext_date) {
                const scale = STATUS_HEIGHT / (2200 - 1500);
                yCoord = (2200 - 2024) * scale;
            }
            // Determine year for this dot
            const year = d.year || d.event_year || d.ext_date || d.xYear;
            const isFuture = year && year > PRESENT_YEAR;
            return {
                ...d,
                fill: isFuture ? '#e0b800' : (d.fill || getStableColor(d.status)),
                future: !!isFuture,
                size: d.size || 5,
                x: Math.round(d.x),
                y: yCoord
            };
        });
    }, [timelineData, getStableColor]);

    const stabilizedVisibleData = useMemo(() => {
        return visibleData.map(d => {
            const year = d.start_year;
            const isFuture = year && year > PRESENT_YEAR;
            return {
                ...d,
                fill: '#3d557a', // Set dot color
                future: !!isFuture,
                size: 16, // Make dots larger
                x: Math.round(d.x),
                y: year ? getYearPosition(year) : 0
            };
        });
    }, [visibleData]);

    // Debug: log status values for visible dots
    useEffect(() => {
        if (stabilizedVisibleData.length > 0) {
            console.log('Dot statuses:', stabilizedVisibleData.map(d => d.status));
            console.log('First 5 dots:', stabilizedVisibleData.slice(0, 5));
        }
    }, [stabilizedVisibleData]);

    // Calculate the y position for the NOW line and future background
    const yearMin = 1400;
    const yearMax = 2200;
    const nowY = ((yearMax - PRESENT_YEAR) / (yearMax - yearMin)) * STATUS_HEIGHT;
    const futureHeight = ((yearMax - PRESENT_YEAR) / (yearMax - yearMin)) * STATUS_HEIGHT;
    const futureY = nowY;

    // Generate y-axis ticks for 1400, 1500, ..., 2200
    const yAxisTicks = [];
    const yAxisTickLabels = [];
    for (let year = YEAR_MIN; year <= YEAR_MAX; year += 20) {
      yAxisTicks.push(((YEAR_MAX - year) / (YEAR_MAX - YEAR_MIN)) * STATUS_HEIGHT);
      yAxisTickLabels.push(year);
    }

    return (
        <div
            id="plot-container"
            style={{
                width: '100%',
                height: STATUS_HEIGHT + 'px',
                position: 'relative',
                backgroundColor: 'white',
                color: 'black',
                overflow: 'visible'
            }}>
            
            {/* Custom tooltip for colored dots */}
            {hoveredDot && hoveredDot.type && (
                <div
                    style={{
                        position: 'absolute',
                        left: '50%',
                        top: '20px',
                        transform: 'translateX(-50%)',
                        background: 'white',
                        color: '#222',
                        border: hoveredDot.type === 'warning' ? '1px solid #c28f3e' : 
                                hoveredDot.type === 'memory' ? '1px solid #5a3f6e' : 
                                hoveredDot.type === 'resistance' ? '1px solid #267180' :
                                hoveredDot.type === 'story' ? '1px solid #c0392b' : '1px solid #222',
                        borderRadius: 8,
                        padding: '1rem',
                        minWidth: 220,
                        fontSize: '1rem',
                        boxShadow: '0 2px 12px #0002',
                        zIndex: 1000,
                    }}
                >
                    <strong>{hoveredDot.title}</strong>
                    <div style={{ marginTop: 8 }}>
                        {hoveredDot.type === 'story' ? 'Story' : 'Placeholder'}
                    </div>
                </div>
            )}
            
            <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                    key="main-scatter-chart"
                    style={{ 
                        overflow: 'visible'
                    }}
                    margin={{ top: 20, right: 310, bottom: 80, left: 30 }}>
                    {/* Vertical dashed line for NOW (PRESENT_YEAR) */}
                    <ReferenceLine
                        y={nowY}
                        stroke="#e0b800"
                        strokeDasharray="8 8"
                        strokeWidth={3}
                    >
                        <Label value="NOW" position="right" offset={10} fill="#e0b800" fontSize={22} fontWeight="bold" />
                    </ReferenceLine>
                    <XAxis
                        type="number"
                        dataKey="x"
                        domain={[-STATUS_WIDTH / 2, STATUS_WIDTH / 2]}
                        tickFormatter={(value) => Math.round(value)}
                        hide
                    />
                    <YAxis
                        type="number"
                        dataKey="y"
                        domain={[0, STATUS_HEIGHT]}
                        orientation="right"
                        ticks={yAxisTicks}
                        tick={({ x, y, payload }) => {
                            // payload.value is the y position, find its index
                            const idx = yAxisTicks.findIndex(tick => Math.abs(tick - payload.value) < 2);
                            const year = yAxisTickLabels[idx];
                            return (
                                <text
                                    x={x + 8}
                                    y={y + 4}
                                    fontSize={16}
                                    fill={'#000'}
                                    textAnchor="start"
                                >
                                    {year || ''}
                                </text>
                            );
                        }}
                        axisLine={(props) => {
                            // Calculate the y-pixel for PRESENT_YEAR (2025) using the same formula as the NOW line
                            const yearMin = 1400;
                            const yearMax = 2200;
                            const nowY = ((yearMax - PRESENT_YEAR) / (yearMax - yearMin)) * STATUS_HEIGHT;
                            return (
                                <g>
                                    {/* Black line from top to NOW */}
                                    <line
                                        x1={props.x}
                                        y1={0}
                                        x2={props.x}
                                        y2={nowY}
                                        stroke="#000"
                                        strokeWidth={2}
                                    />
                                    {/* Yellow line from NOW to bottom */}
                                    <line
                                        x1={props.x}
                                        y1={nowY}
                                        x2={props.x}
                                        y2={STATUS_HEIGHT}
                                        stroke="#e0b800"
                                        strokeWidth={2}
                                    />
                                </g>
                            );
                        }}
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
                                onMouseEnter={() => handleMouseEnter(props.payload)}
                                onMouseLeave={() => handleMouseLeave(props.payload)}
                            />
                        )}
                    />

                    <Tooltip 
                        content={<CustomTooltip />}
                        cursor={{ stroke: '#666' }}
                        isAnimationActive={false}
                    />

                    {/* Yellow large dots - Warning */}
                    <Scatter
                        data={[
                            { x: -800, y: 3000, title: "Warning", size: 60 },
                            { x: 200, y: 5000, title: "Warning", size: 60 },
                            { x: -400, y: 7000, title: "Warning", size: 60 }
                        ]}
                        shape={(props) => (
                            <circle
                                cx={props.cx}
                                cy={props.cy}
                                r={props.payload.size}
                                fill="#c28f3e"
                                opacity={0.25}
                                style={{ cursor: 'pointer' }}
                                onMouseEnter={(e) => {
                                    e.target.style.opacity = '0.5';
                                    setHoveredDot({ ...props.payload, type: 'warning' });
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.opacity = '0.25';
                                    setHoveredDot(null);
                                }}
                            />
                        )}
                    />

                    {/* Purple medium dots - Memory */}
                    <Scatter
                        data={[
                            { x: -600, y: 4000, title: "Memory", size: 24 },
                            { x: 400, y: 6000, title: "Memory", size: 24 },
                            { x: -200, y: 8000, title: "Memory", size: 24 }
                        ]}
                        shape={(props) => (
                            <circle
                                cx={props.cx}
                                cy={props.cy}
                                r={props.payload.size}
                                fill="#5a3f6e"
                                opacity={0.5}
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

                    {/* Teal small dots - Resistance */}
                    <Scatter
                        data={[
                            { x: -1000, y: 4500, title: "Resistance", size: 30 },
                            { x: 600, y: 6500, title: "Resistance", size: 30 },
                            { x: -300, y: 8500, title: "Resistance", size: 30 }
                        ]}
                        shape={(props) => (
                            <circle
                                cx={props.cx}
                                cy={props.cy}
                                r={props.payload.size}
                                fill="#267180"
                                opacity={0.5}
                                style={{ cursor: 'pointer' }}
                                onMouseEnter={(e) => {
                                    e.target.style.opacity = '0.7';
                                    setHoveredDot({ ...props.payload, type: 'resistance' });
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

