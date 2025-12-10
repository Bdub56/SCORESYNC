import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Award, Target, Activity, TrendingDown, AlertCircle, XCircle } from 'lucide-react';

// Classification ranges based on the chart
function getClassification(standardScore, zScore, tScore, percentile) {
    // Use standard score as primary determinant
    if (standardScore >= 130 || zScore >= 2.0 || tScore >= 70 || percentile >= 98) {
        return {
            label: 'Very Superior',
            description: 'Exceptionally high performance',
            population: '~2.3%',
            color: 'from-emerald-500 to-teal-500',
            bgColor: 'bg-emerald-50',
            borderColor: 'border-emerald-200',
            textColor: 'text-emerald-700',
            icon: Award
        };
    } else if (standardScore >= 120 || zScore >= 1.33 || tScore >= 63 || percentile >= 91) {
        return {
            label: 'Superior',
            description: 'Well above average performance',
            population: '~6.8%',
            color: 'from-blue-500 to-cyan-500',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
            textColor: 'text-blue-700',
            icon: TrendingUp
        };
    } else if (standardScore >= 110 || zScore >= 0.67 || tScore >= 57 || percentile >= 75) {
        return {
            label: 'High Average',
            description: 'Above average performance',
            population: '~16.1%',
            color: 'from-indigo-500 to-blue-500',
            bgColor: 'bg-indigo-50',
            borderColor: 'border-indigo-200',
            textColor: 'text-indigo-700',
            icon: Target
        };
    } else if (standardScore >= 90 || zScore >= -0.67 || tScore >= 43 || percentile >= 25) {
        return {
            label: 'Average',
            description: 'Typical performance range',
            population: '~50.0%',
            color: 'from-slate-500 to-slate-600',
            bgColor: 'bg-slate-50',
            borderColor: 'border-slate-200',
            textColor: 'text-slate-700',
            icon: Activity
        };
    } else if (standardScore >= 80 || zScore >= -1.33 || tScore >= 37 || percentile >= 9) {
        return {
            label: 'Low Average',
            description: 'Below average performance',
            population: '~16.1%',
            color: 'from-amber-500 to-orange-500',
            bgColor: 'bg-amber-50',
            borderColor: 'border-amber-200',
            textColor: 'text-amber-700',
            icon: TrendingDown
        };
    } else if (standardScore >= 70 || zScore >= -2.0 || tScore >= 30 || percentile >= 3) {
        return {
            label: 'Borderline',
            description: 'Significantly below average',
            population: '~6.8%',
            color: 'from-orange-500 to-red-500',
            bgColor: 'bg-orange-50',
            borderColor: 'border-orange-200',
            textColor: 'text-orange-700',
            icon: AlertCircle
        };
    } else {
        return {
            label: 'Extremely Low / Impaired',
            description: 'Well below average performance',
            population: '~2.3%',
            color: 'from-red-500 to-rose-500',
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200',
            textColor: 'text-red-700',
            icon: XCircle
        };
    }
}

export default function ClassificationBanner({ scores }) {
    if (!scores.z || !scores.standard || !scores.t || !scores.percentile) {
        return null;
    }

    const classification = getClassification(
        scores.standard,
        scores.z,
        scores.t,
        scores.percentile
    );

    const Icon = classification.icon;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
                type: "spring",
                stiffness: 200,
                damping: 20,
                delay: 0.2 
            }}
            className={`relative overflow-hidden rounded-3xl border-2 ${classification.borderColor} ${classification.bgColor} p-6 shadow-lg`}
        >
            {/* Gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${classification.color} opacity-5`} />
            
            <div className="relative z-10">
                <div className="flex items-start gap-4">
                    <motion.div 
                        initial={{ rotate: -180, scale: 0 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{ 
                            type: "spring",
                            stiffness: 200,
                            damping: 15,
                            delay: 0.3 
                        }}
                        className={`p-3 rounded-2xl bg-gradient-to-br ${classification.color} shadow-md`}
                    >
                        <Icon className="w-7 h-7 text-white" />
                    </motion.div>
                    
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                            <motion.h3 
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.35 }}
                                className={`text-2xl font-bold ${classification.textColor}`}
                            >
                                {classification.label}
                            </motion.h3>
                            <motion.span 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ 
                                    type: "spring",
                                    stiffness: 200,
                                    damping: 15,
                                    delay: 0.4 
                                }}
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${classification.bgColor} ${classification.textColor} border ${classification.borderColor}`}
                            >
                                {classification.population} of population
                            </motion.span>
                        </div>
                        <motion.p 
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className={`${classification.textColor} opacity-80 text-sm`}
                        >
                            {classification.description}
                        </motion.p>
                    </div>
                </div>
            </div>

            {/* Decorative circles */}
            <div className={`absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br ${classification.color} rounded-full opacity-10 blur-2xl`} />
            <div className={`absolute -top-8 -right-16 w-24 h-24 bg-gradient-to-br ${classification.color} rounded-full opacity-10 blur-2xl`} />
        </motion.div>
    );
}