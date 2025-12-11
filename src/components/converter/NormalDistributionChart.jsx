import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Area, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';

// Normal distribution PDF
function normalPDF(x, mean = 0, std = 1) {
    return (1 / (std * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / std, 2));
}

export default function NormalDistributionChart({ scores }) {
    const chartData = useMemo(() => {
        if (scores.z === null || scores.z === undefined || !isFinite(scores.z)) {
            return null;
        }

        // Generate normal distribution curve data
        const data = [];
        for (let z = -4; z <= 4; z += 0.1) {
            data.push({
                z: z,
                probability: normalPDF(z),
                // Highlight area under curve up to the score
                highlighted: z <= scores.z ? normalPDF(z) : 0
            });
        }
        return data;
    }, [scores.z]);

    if (!chartData) {
        return null;
    }

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const zValue = payload[0].payload.z;
            return (
                <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3">
                    <p className="text-sm font-semibold text-slate-700">
                        Z-Score: {zValue.toFixed(2)}
                    </p>
                    <p className="text-xs text-slate-500">
                        Probability Density: {payload[0].value.toFixed(4)}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8"
        >
            <div className="text-center mb-6">
                <h2 className="text-lg font-semibold text-slate-800 mb-1">
                    Normal Distribution Visualization
                </h2>
                <p className="text-sm text-slate-500">
                    Your score's position on the bell curve
                </p>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorHighlighted" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.05}/>
                        </linearGradient>
                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.05}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                        dataKey="z" 
                        stroke="#64748b"
                        label={{ value: 'Z-Score', position: 'insideBottom', offset: -5, fill: '#64748b' }}
                        tickFormatter={(value) => value.toFixed(1)}
                    />
                    <YAxis 
                        stroke="#64748b"
                        label={{ value: 'Density', angle: -90, position: 'insideLeft', fill: '#64748b' }}
                        tickFormatter={(value) => value.toFixed(2)}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    
                    {/* Full curve */}
                    <Area 
                        type="monotone" 
                        dataKey="probability" 
                        stroke="#94a3b8" 
                        strokeWidth={2}
                        fill="url(#colorTotal)" 
                    />
                    
                    {/* Highlighted area up to the score */}
                    <Area 
                        type="monotone" 
                        dataKey="highlighted" 
                        stroke="#4f46e5" 
                        strokeWidth={2}
                        fill="url(#colorHighlighted)" 
                    />
                    
                    {/* Vertical line at the score */}
                    <ReferenceLine 
                        x={scores.z} 
                        stroke="#4f46e5" 
                        strokeWidth={3}
                        label={{ 
                            value: `Your Score (Z=${scores.z.toFixed(2)})`, 
                            position: 'top',
                            fill: '#4f46e5',
                            fontSize: 12,
                            fontWeight: 600
                        }}
                    />
                </AreaChart>
            </ResponsiveContainer>

            <div className="mt-6 grid grid-cols-2 gap-4 text-center">
                <div className="bg-indigo-50 rounded-lg p-3">
                    <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wider mb-1">
                        Your Percentile
                    </p>
                    <p className="text-2xl font-bold text-indigo-700">
                        {scores.percentile?.toFixed(1)}%
                    </p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-600 font-semibold uppercase tracking-wider mb-1">
                        Population Mean
                    </p>
                    <p className="text-2xl font-bold text-slate-700">
                        50%
                    </p>
                </div>
            </div>
        </motion.div>
    );
}