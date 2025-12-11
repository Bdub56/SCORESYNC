import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, ReferenceDot } from 'recharts';

// Normal distribution PDF
function normalPDF(x, mean = 0, sd = 1) {
    const coefficient = 1 / (sd * Math.sqrt(2 * Math.PI));
    const exponent = -Math.pow(x - mean, 2) / (2 * Math.pow(sd, 2));
    return coefficient * Math.exp(exponent);
}

export default function NormalCurveVisualization({ scores }) {
    const chartData = useMemo(() => {
        if (!scores.z && scores.z !== 0) return [];
        
        // Generate points for the normal curve
        const data = [];
        for (let z = -4; z <= 4; z += 0.1) {
            data.push({
                z: z,
                density: normalPDF(z, 0, 1),
                displayZ: z.toFixed(1)
            });
        }
        return data;
    }, [scores.z]);

    if (!scores.z && scores.z !== 0) {
        return null;
    }

    const zScore = scores.z;
    const percentile = scores.percentile;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8"
        >
            <div className="text-center mb-6">
                <h2 className="text-lg font-semibold text-slate-800 mb-1">
                    Normal Distribution Visualization
                </h2>
                <p className="text-sm text-slate-500">
                    Your score position on the bell curve
                </p>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                    <defs>
                        <linearGradient id="colorDensity" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                        dataKey="displayZ" 
                        label={{ value: 'Z-Score', position: 'insideBottom', offset: -10 }}
                        stroke="#64748b"
                        tick={{ fill: '#64748b' }}
                    />
                    <YAxis 
                        label={{ value: 'Density', angle: -90, position: 'insideLeft' }}
                        stroke="#64748b"
                        tick={{ fill: '#64748b' }}
                    />
                    <Tooltip 
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-slate-200">
                                        <p className="text-sm font-medium text-slate-700">
                                            Z-Score: {payload[0].payload.displayZ}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            Density: {payload[0].value.toFixed(4)}
                                        </p>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    <Area 
                        type="monotone" 
                        dataKey="density" 
                        stroke="#6366f1" 
                        strokeWidth={2}
                        fill="url(#colorDensity)" 
                    />
                    <ReferenceLine 
                        x={zScore.toFixed(1)} 
                        stroke="#f43f5e" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        label={{ 
                            value: 'Your Score', 
                            position: 'top', 
                            fill: '#f43f5e',
                            fontWeight: 'bold'
                        }}
                    />
                    <ReferenceDot
                        x={zScore.toFixed(1)}
                        y={normalPDF(zScore, 0, 1)}
                        r={6}
                        fill="#f43f5e"
                        stroke="#fff"
                        strokeWidth={2}
                    />
                </AreaChart>
            </ResponsiveContainer>

            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100">
                    <p className="text-xs text-indigo-600 font-semibold mb-1">Z-Score</p>
                    <p className="text-lg font-bold text-indigo-700">{zScore.toFixed(2)}</p>
                </div>
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-100">
                    <p className="text-xs text-rose-600 font-semibold mb-1">Percentile</p>
                    <p className="text-lg font-bold text-rose-700">{percentile.toFixed(1)}%</p>
                </div>
                <div className="p-3 rounded-xl bg-violet-50 border border-violet-100">
                    <p className="text-xs text-violet-600 font-semibold mb-1">Position</p>
                    <p className="text-lg font-bold text-violet-700">
                        {zScore >= 0 ? 'Above' : 'Below'} Mean
                    </p>
                </div>
            </div>

            <div className="mt-4 p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200">
                <p className="text-sm text-slate-600">
                    <strong>Interpretation:</strong> Your score falls at {percentile.toFixed(1)}th percentile, 
                    which means you scored {zScore >= 0 ? 'higher' : 'lower'} than approximately {percentile.toFixed(0)}% 
                    of the population. This is {Math.abs(zScore).toFixed(2)} standard deviation{Math.abs(zScore) !== 1 ? 's' : ''} {zScore >= 0 ? 'above' : 'below'} the mean.
                </p>
            </div>
        </motion.div>
    );
}