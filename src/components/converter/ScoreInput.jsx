import React from 'react';
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { motion } from 'framer-motion';

const scoreTypes = [
    { value: 'raw', label: 'Raw Score', hint: 'Enter score, mean, and SD' },
    { value: 'z', label: 'Z-Score', hint: 'Mean=0, SD=1' },
    { value: 't', label: 'T-Score', hint: 'Mean=50, SD=10' },
    { value: 'percentile', label: 'Percentile Rank', hint: '1-99' },
    { value: 'standard', label: 'Standard Score', hint: 'Mean=100, SD=15' },
    { value: 'scaled', label: 'Scaled Score', hint: 'Mean=10, SD=3' },
];

const getScoreRange = (type) => {
    switch (type) {
        case 'raw': return { min: 0, max: 200, step: 1 };
        case 'z': return { min: -4, max: 4, step: 0.1 };
        case 't': return { min: 20, max: 80, step: 1 };
        case 'percentile': return { min: 1, max: 99, step: 1 };
        case 'standard': return { min: 40, max: 160, step: 1 };
        case 'scaled': return { min: 1, max: 19, step: 1 };
        default: return { min: 0, max: 100, step: 1 };
    }
};

export default function ScoreInput({ 
    value, 
    onChange, 
    scoreType, 
    onScoreTypeChange,
    meanValue,
    onMeanChange,
    sdValue,
    onSdChange
}) {
    const range = getScoreRange(scoreType);
    const numValue = parseFloat(value) || range.min;
    return (
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8"
        >
            <div className="space-y-6">
                <div className="text-center mb-8">
                    <h2 className="text-lg font-semibold text-slate-800 mb-1">
                        Enter Your Score
                    </h2>
                    <p className="text-sm text-slate-500">
                        Select the score type and enter the value to convert
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label 
                            htmlFor="scoreType" 
                            className="text-xs font-semibold uppercase tracking-wider text-slate-500"
                        >
                            Score Type
                        </Label>
                        <Select value={scoreType} onValueChange={onScoreTypeChange}>
                            <SelectTrigger 
                                id="scoreType"
                                className="h-14 rounded-xl border-2 border-slate-200 bg-slate-50/50 text-base font-medium focus:border-indigo-400 focus:ring-indigo-400/20"
                            >
                                <SelectValue placeholder="Select score type" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                {scoreTypes.map((type) => (
                                    <SelectItem 
                                        key={type.value} 
                                        value={type.value}
                                        className="py-3 cursor-pointer"
                                    >
                                        <div className="flex flex-col items-start">
                                            <span className="font-medium">{type.label}</span>
                                            <span className="text-xs text-slate-400">{type.hint}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label 
                                htmlFor="scoreValue" 
                                className="text-xs font-semibold uppercase tracking-wider text-slate-500"
                            >
                                Score Value
                            </Label>
                            <span className="text-2xl font-bold text-indigo-600">
                                {value || range.min}
                            </span>
                        </div>
                        <Slider
                            id="scoreValue"
                            min={range.min}
                            max={range.max}
                            step={range.step}
                            value={[numValue]}
                            onValueChange={(vals) => onChange(vals[0].toString())}
                            className="py-4"
                        />
                        <div className="flex justify-between text-xs text-slate-400">
                            <span>{range.min}</span>
                            <span>{range.max}</span>
                        </div>
                    </div>
                </div>

                {scoreType === 'raw' && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3 }}
                        className="grid gap-6 md:grid-cols-2 mt-6 border-t pt-6 border-slate-100"
                    >
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label 
                                    htmlFor="meanValue" 
                                    className="text-xs font-semibold uppercase tracking-wider text-slate-500"
                                >
                                    Population Mean
                                </Label>
                                <span className="text-lg font-bold text-slate-700">
                                    {meanValue || 100}
                                </span>
                            </div>
                            <Slider
                                id="meanValue"
                                min={0}
                                max={200}
                                step={1}
                                value={[parseFloat(meanValue) || 100]}
                                onValueChange={(vals) => onMeanChange(vals[0].toString())}
                                className="py-4"
                            />
                            <div className="flex justify-between text-xs text-slate-400">
                                <span>0</span>
                                <span>200</span>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label 
                                    htmlFor="sdValue" 
                                    className="text-xs font-semibold uppercase tracking-wider text-slate-500"
                                >
                                    Population Standard Deviation
                                </Label>
                                <span className="text-lg font-bold text-slate-700">
                                    {sdValue || 15}
                                </span>
                            </div>
                            <Slider
                                id="sdValue"
                                min={1}
                                max={50}
                                step={0.5}
                                value={[parseFloat(sdValue) || 15]}
                                onValueChange={(vals) => onSdChange(vals[0].toString())}
                                className="py-4"
                            />
                            <div className="flex justify-between text-xs text-slate-400">
                                <span>1</span>
                                <span>50</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}