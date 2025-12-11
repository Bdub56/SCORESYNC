import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Scatter, ScatterChart, ZAxis } from 'recharts';

// Generate normal distribution curve data
function generateNormalCurve() {
    const data = [];
    for (let z = -4; z <= 4; z += 0.1) {
        const y = (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * z * z);
        data.push({ z, y });
    }
    return data;
}

export default function NormalCurveChart({ conversions }) {
    const curveData = generateNormalCurve();
    
    // Convert all scores to z-scores for plotting
    const scatterData = conversions
        .filter(c => c.z_score !== null && c.z_score !== undefined)
        .map((c, idx) => ({
            z: c.z_score,
            y: 0.02, // Small y value to place markers on x-axis
            label: c.scale_name,
            name: c.name,
            fill: getColorForZScore(c.z_score)
        }));

    return (
        <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={curveData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                        dataKey="z" 
                        type="number"
                        domain={[-4, 4]}
                        ticks={[-4, -3, -2, -1, 0, 1, 2, 3, 4]}
                        label={{ value: 'Z-Score', position: 'insideBottom', offset: -10 }}
                        stroke="#64748b"
                    />
                    <YAxis 
                        domain={[0, 0.45]}
                        hide
                    />
                    <Tooltip 
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                const z = payload[0].payload.z;
                                return (
                                    <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
                                        <p className="text-sm font-semibold text-slate-700">
                                            Z-Score: {z.toFixed(2)}
                                        </p>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    
                    {/* Normal curve */}
                    <Line 
                        type="monotone" 
                        dataKey="y" 
                        stroke="#6366f1" 
                        strokeWidth={3}
                        dot={false}
                        isAnimationActive={true}
                    />
                    
                    {/* Reference lines for standard deviations */}
                    <ReferenceLine x={-3} stroke="#94a3b8" strokeDasharray="3 3" />
                    <ReferenceLine x={-2} stroke="#94a3b8" strokeDasharray="3 3" />
                    <ReferenceLine x={-1} stroke="#94a3b8" strokeDasharray="3 3" />
                    <ReferenceLine x={0} stroke="#475569" strokeWidth={2} />
                    <ReferenceLine x={1} stroke="#94a3b8" strokeDasharray="3 3" />
                    <ReferenceLine x={2} stroke="#94a3b8" strokeDasharray="3 3" />
                    <ReferenceLine x={3} stroke="#94a3b8" strokeDasharray="3 3" />
                    
                    {/* Plot individual scores */}
                    {scatterData.map((point, idx) => (
                        <ReferenceLine
                            key={idx}
                            x={point.z}
                            stroke={point.fill}
                            strokeWidth={3}
                            label={{
                                value: point.name || point.label,
                                position: 'top',
                                fill: point.fill,
                                fontSize: 11,
                                fontWeight: 600
                            }}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

function getColorForZScore(z) {
    if (z >= 2.0) return '#10b981'; // emerald
    if (z >= 1.33) return '#3b82f6'; // blue
    if (z >= 0.67) return '#6366f1'; // indigo
    if (z >= -0.67) return '#64748b'; // slate
    if (z >= -1.33) return '#f59e0b'; // amber
    if (z >= -2.0) return '#f97316'; // orange
    return '#ef4444'; // red
}