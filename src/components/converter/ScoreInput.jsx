import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

                    <div className="space-y-2">
                        <Label 
                            htmlFor="scoreValue" 
                            className="text-xs font-semibold uppercase tracking-wider text-slate-500"
                        >
                            Score Value
                        </Label>
                        <Input
                            id="scoreValue"
                            type="number"
                            step="any"
                            placeholder="Enter value..."
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            className="h-14 rounded-xl border-2 border-slate-200 bg-slate-50/50 text-2xl font-bold text-center focus:border-indigo-400 focus:ring-indigo-400/20 placeholder:text-slate-300 placeholder:font-normal placeholder:text-base"
                        />
                    </div>
                </div>

                {scoreType === 'raw' && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3 }}
                        className="grid gap-6 md:grid-cols-2 mt-6 border-t pt-6 border-slate-100"
                    >
                        <div className="space-y-2">
                            <Label 
                                htmlFor="meanValue" 
                                className="text-xs font-semibold uppercase tracking-wider text-slate-500"
                            >
                                Population Mean
                            </Label>
                            <Input
                                id="meanValue"
                                type="number"
                                step="any"
                                placeholder="e.g. 100"
                                value={meanValue}
                                onChange={(e) => onMeanChange(e.target.value)}
                                className="h-14 rounded-xl border-2 border-slate-200 bg-slate-50/50 text-base font-medium focus:border-indigo-400 focus:ring-indigo-400/20"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label 
                                htmlFor="sdValue" 
                                className="text-xs font-semibold uppercase tracking-wider text-slate-500"
                            >
                                Population Standard Deviation
                            </Label>
                            <Input
                                id="sdValue"
                                type="number"
                                step="any"
                                placeholder="e.g. 15"
                                value={sdValue}
                                onChange={(e) => onSdChange(e.target.value)}
                                className="h-14 rounded-xl border-2 border-slate-200 bg-slate-50/50 text-base font-medium focus:border-indigo-400 focus:ring-indigo-400/20"
                            />
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}