import React from 'react';
import ScoreCard from './ScoreCard';
import { TrendingUp, Percent, BarChart3, Activity, Gauge } from 'lucide-react';
import { motion } from 'framer-motion';

const scoreConfigs = [
    {
        key: 'z',
        title: 'Z-Score',
        icon: TrendingUp,
        color: 'indigo',
        description: 'Standard deviations from the mean (M=0, SD=1)'
    },
    {
        key: 't',
        title: 'T-Score',
        icon: Activity,
        color: 'violet',
        description: 'Transformed score (M=50, SD=10)'
    },
    {
        key: 'percentile',
        title: 'Percentile Rank',
        icon: Percent,
        color: 'teal',
        description: 'Percentage of scores at or below this value'
    },
    {
        key: 'standard',
        title: 'Standard Score',
        icon: BarChart3,
        color: 'amber',
        description: 'IQ-type scale (M=100, SD=15)'
    },
    {
        key: 'scaled',
        title: 'Scaled Score',
        icon: Gauge,
        color: 'rose',
        description: 'Subtest scale (M=10, SD=3)'
    },
];

export default function ConversionResults({ scores, activeType }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
        >
            <div className="text-center mb-6">
                <h2 className="text-lg font-semibold text-slate-800 mb-1">
                    Converted Scores
                </h2>
                <p className="text-sm text-slate-500">
                    All equivalent score values based on normal distribution
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {scoreConfigs.map((config, index) => (
                    <ScoreCard
                        key={config.key}
                        title={config.title}
                        value={scores[config.key]}
                        description={config.description}
                        icon={config.icon}
                        color={config.color}
                        isActive={activeType === config.key}
                        delay={index * 0.05}
                    />
                ))}
            </div>
        </motion.div>
    );
}