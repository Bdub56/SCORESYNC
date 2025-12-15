import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { motion } from 'framer-motion';
import { Info, Save, RotateCcw, Check, ChevronsUpDown, FileText } from 'lucide-react';
import { cn } from "@/lib/utils";
import ScoreTypeInfoModal from './ScoreTypeInfoModal';

const scoreTypes = [
    { value: 'raw', label: 'Raw Score', hint: 'Enter score, mean, and SD', category: 'standard' },
    { value: 'z', label: 'Z-Score', hint: 'Mean=0, SD=1', category: 'standard' },
    { value: 't', label: 'T-Score', hint: 'Mean=50, SD=10', category: 'standard' },
    { value: 'percentile', label: 'Percentile Rank', hint: '1-99', category: 'standard' },
    { value: 'standard', label: 'Standard Score', hint: 'Mean=100, SD=15', category: 'standard' },
    { value: 'scaled', label: 'Scaled Score', hint: 'Mean=10, SD=3', category: 'standard' },
    
    // IQ Test Presets
    { value: 'wais', label: 'WAIS-IV/V (IQ)', hint: 'Mean=100, SD=15', category: 'preset', mean: 100, sd: 15 },
    { value: 'wisc', label: 'WISC-V (IQ)', hint: 'Mean=100, SD=15', category: 'preset', mean: 100, sd: 15 },
    { value: 'stanford-binet', label: 'Stanford-Binet 5 (IQ)', hint: 'Mean=100, SD=15', category: 'preset', mean: 100, sd: 15 },
    { value: 'woodcock-johnson', label: 'Woodcock-Johnson IV', hint: 'Mean=100, SD=15', category: 'preset', mean: 100, sd: 15 },
    
    // Educational Assessment Presets
    { value: 'sat', label: 'SAT (per section)', hint: 'Mean=500, SD=100', category: 'preset', mean: 500, sd: 100 },
    { value: 'act', label: 'ACT Composite', hint: 'Mean=20.8, SD=5.8', category: 'preset', mean: 20.8, sd: 5.8 },
    { value: 'gre', label: 'GRE (per section)', hint: 'Mean=150, SD=8.5', category: 'preset', mean: 150, sd: 8.5 },
    { value: 'gmat', label: 'GMAT Total', hint: 'Mean=550, SD=100', category: 'preset', mean: 550, sd: 100 },
    
    // Subtest Presets
    { value: 'wais-subtest', label: 'WAIS Subtest', hint: 'Mean=10, SD=3', category: 'preset', mean: 10, sd: 3 },
    { value: 'wisc-subtest', label: 'WISC Subtest', hint: 'Mean=10, SD=3', category: 'preset', mean: 10, sd: 3 },
];

const getScoreRange = (type) => {
    switch (type) {
        case 'raw': return { min: 0, max: 200, step: 1 };
        case 'z': return { min: -4, max: 4, step: 0.1 };
        case 't': return { min: 20, max: 80, step: 1 };
        case 'percentile': return { min: 1, max: 99, step: 1 };
        case 'standard': return { min: 40, max: 160, step: 1 };
        case 'scaled': return { min: 1, max: 19, step: 1 };
        
        // IQ Tests
        case 'wais':
        case 'wisc':
        case 'stanford-binet':
        case 'woodcock-johnson':
            return { min: 40, max: 160, step: 1 };
        
        // Educational Tests
        case 'sat': return { min: 200, max: 800, step: 10 };
        case 'act': return { min: 1, max: 36, step: 1 };
        case 'gre': return { min: 130, max: 170, step: 1 };
        case 'gmat': return { min: 200, max: 800, step: 10 };
        
        // Subtests
        case 'wais-subtest':
        case 'wisc-subtest':
            return { min: 1, max: 19, step: 1 };
        
        default: return { min: 0, max: 200, step: 1 };
    }
};

export { scoreTypes };

export default function ScoreInput({ 
    value, 
    onChange, 
    scoreType, 
    onScoreTypeChange,
    meanValue,
    onMeanChange,
    sdValue,
    onSdChange,
    scaleName,
    onScaleNameChange,
    name,
    onNameChange,
    ageYears,
    onAgeYearsChange,
    ageMonths,
    onAgeMonthsChange,
    onSave,
    onReset,
    canSave,
    onSaveReport,
    scores
}) {
    const range = getScoreRange(scoreType);
    const numValue = parseFloat(value) || range.min;
    const [showInfo, setShowInfo] = useState(false);
    const [open, setOpen] = useState(false);

    const { data: conversions = [] } = useQuery({
        queryKey: ['savedConversions'],
        queryFn: () => base44.entities.SavedConversion.list('-created_date', 500),
    });

    // Get unique subjects
    const subjects = conversions.reduce((acc, conversion) => {
        const name = conversion.name;
        if (name && !acc.find(s => s.name === name)) {
            acc.push({
                name,
                age_years: conversion.age_years,
                age_months: conversion.age_months,
                image_url: conversion.image_url
            });
        }
        return acc;
    }, []);

    const handleSelectSubject = (subjectName) => {
        const subject = subjects.find(s => s.name === subjectName);
        if (subject) {
            onNameChange(subject.name);
            onAgeYearsChange(subject.age_years?.toString() || '');
            onAgeMonthsChange(subject.age_months?.toString() || '');
        }
        setOpen(false);
    };

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

                <div className="grid gap-6 md:grid-cols-2 mb-6">
                    <div className="space-y-2">
                        <Label 
                            htmlFor="name" 
                            className="text-xs font-semibold uppercase tracking-wider text-slate-500"
                        >
                            Name
                        </Label>
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    className="w-full h-12 rounded-xl border-2 border-slate-200 bg-slate-50/50 text-base focus:border-indigo-400 focus:ring-indigo-400/20 justify-between font-normal"
                                >
                                    {name || "Select or type name..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[300px] p-0" align="start">
                                <Command>
                                    <CommandInput 
                                        placeholder="Search subjects..." 
                                        value={name}
                                        onValueChange={onNameChange}
                                    />
                                    <CommandList>
                                        <CommandEmpty>
                                            <div className="py-6 text-center text-sm">
                                                <p className="text-slate-600">No existing subject found</p>
                                                <p className="text-xs text-slate-400 mt-1">Type to create new</p>
                                            </div>
                                        </CommandEmpty>
                                        {subjects.length > 0 && (
                                            <CommandGroup heading="Existing Subjects">
                                                {subjects.map((subject) => (
                                                    <CommandItem
                                                        key={subject.name}
                                                        value={subject.name}
                                                        onSelect={() => handleSelectSubject(subject.name)}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                name === subject.name ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                        <div>
                                                            <div>{subject.name}</div>
                                                            {(subject.age_years || subject.age_months) && (
                                                                <div className="text-xs text-slate-400">
                                                                    {subject.age_years}y {subject.age_months || 0}m
                                                                </div>
                                                            )}
                                                        </div>
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        )}
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Age
                        </Label>
                        <div className="flex gap-3">
                            <div className="flex-1">
                                <Input
                                    type="number"
                                    placeholder="Years"
                                    value={ageYears}
                                    onChange={(e) => onAgeYearsChange(e.target.value)}
                                    min="0"
                                    max="120"
                                    className="h-12 rounded-xl border-2 border-slate-200 bg-slate-50/50 text-base focus:border-indigo-400 focus:ring-indigo-400/20"
                                />
                            </div>
                            <div className="flex-1">
                                <Input
                                    type="number"
                                    placeholder="Months"
                                    value={ageMonths}
                                    onChange={(e) => onAgeMonthsChange(e.target.value)}
                                    min="0"
                                    max="11"
                                    className="h-12 rounded-xl border-2 border-slate-200 bg-slate-50/50 text-base focus:border-indigo-400 focus:ring-indigo-400/20"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-2 mb-6">
                    <Label 
                        htmlFor="scaleName" 
                        className="text-xs font-semibold uppercase tracking-wider text-slate-500"
                    >
                        Scale/Test Name
                    </Label>
                    <Input
                        id="scaleName"
                        placeholder="e.g., WAIS-IV Vocabulary, SAT Math"
                        value={scaleName}
                        onChange={(e) => onScaleNameChange(e.target.value)}
                        className="h-12 rounded-xl border-2 border-slate-200 bg-slate-50/50 text-base focus:border-indigo-400 focus:ring-indigo-400/20"
                    />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label 
                                htmlFor="scoreType" 
                                className="text-xs font-semibold uppercase tracking-wider text-slate-500"
                            >
                                Score Type
                            </Label>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowInfo(true)}
                                className="h-6 px-2 text-xs text-slate-500 hover:text-indigo-600"
                            >
                                <Info className="w-3 h-3 mr-1" />
                                Info
                            </Button>
                        </div>
                        <Select value={scoreType} onValueChange={onScoreTypeChange}>
                            <SelectTrigger 
                                id="scoreType"
                                className="h-14 rounded-xl border-2 border-slate-200 bg-slate-50/50 text-base font-medium focus:border-indigo-400 focus:ring-indigo-400/20"
                            >
                                <SelectValue placeholder="Select score type" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl max-h-[400px]">
                                <div className="px-2 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Standard Types
                                </div>
                                {scoreTypes.filter(t => t.category === 'standard').map((type) => (
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
                                
                                <div className="px-2 py-1.5 mt-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider border-t">
                                    Test Presets
                                </div>
                                {scoreTypes.filter(t => t.category === 'preset').map((type) => (
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

                {(scoreType === 'raw' || scoreTypes.find(t => t.value === scoreType)?.category === 'preset') && (
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

                <div className="flex gap-3 mt-6 pt-6 border-t border-slate-100">
                    <Button
                        onClick={onReset}
                        variant="outline"
                        className="h-12 rounded-xl"
                    >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset
                    </Button>
                    <Button
                        onClick={onSaveReport}
                        disabled={!canSave}
                        variant="outline"
                        className="flex-1 h-12 rounded-xl"
                    >
                        <FileText className="w-4 h-4 mr-2" />
                        Save Report
                    </Button>
                    <Button
                        onClick={onSave}
                        disabled={!canSave}
                        className="flex-1 h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        Save Conversion
                    </Button>
                </div>
            </div>

            <ScoreTypeInfoModal 
                scoreType={scoreType}
                open={showInfo}
                onOpenChange={setShowInfo}
            />
        </motion.div>
    );
}