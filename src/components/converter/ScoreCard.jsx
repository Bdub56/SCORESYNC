import React from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

export default function ScoreCard({ 
    title, 
    value, 
    description, 
    icon: Icon, 
    color,
    isActive,
    delay = 0 
}) {
    const colorClasses = {
        indigo: "bg-indigo-50 border-indigo-200 text-indigo-700",
        violet: "bg-violet-50 border-violet-200 text-violet-700",
        teal: "bg-teal-50 border-teal-200 text-teal-700",
        amber: "bg-amber-50 border-amber-200 text-amber-700",
        rose: "bg-rose-50 border-rose-200 text-rose-700",
    };

    const iconColorClasses = {
        indigo: "bg-indigo-100 text-indigo-600",
        violet: "bg-violet-100 text-violet-600",
        teal: "bg-teal-100 text-teal-600",
        amber: "bg-amber-100 text-amber-600",
        rose: "bg-rose-100 text-rose-600",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
            className={cn(
                "relative overflow-hidden rounded-2xl border-2 p-5 transition-all duration-300",
                isActive 
                    ? "ring-2 ring-offset-2 ring-slate-400 shadow-lg scale-[1.02]" 
                    : "hover:shadow-md",
                colorClasses[color]
            )}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wider opacity-70 mb-1">
                        {title}
                    </p>
                    <motion.p 
                        key={value}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="text-3xl font-bold tracking-tight"
                    >
                        {value !== null && value !== undefined && !isNaN(value) 
                            ? (typeof value === 'number' ? value.toFixed(2) : value)
                            : '—'
                        }
                    </motion.p>
                    <p className="text-xs mt-2 opacity-60 leading-relaxed">
                        {description}
                    </p>
                </div>
                <div className={cn(
                    "p-2.5 rounded-xl",
                    iconColorClasses[color]
                )}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
        </motion.div>
    );
}