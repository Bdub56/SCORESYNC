import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Printer, Edit2, Save, X, Trash2, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import NormalCurveChart from '../converter/NormalCurveChart';
import moment from 'moment';

function getClassificationLabel(standardScore, zScore, tScore, percentile) {
    if (standardScore >= 130 || zScore >= 2.0 || tScore >= 70 || percentile >= 98) {
        return { label: 'Very Superior', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    } else if (standardScore >= 120 || zScore >= 1.33 || tScore >= 63 || percentile >= 91) {
        return { label: 'Superior', color: 'bg-blue-50 text-blue-700 border-blue-200' };
    } else if (standardScore >= 110 || zScore >= 0.67 || tScore >= 57 || percentile >= 75) {
        return { label: 'High Average', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
    } else if (standardScore >= 90 || zScore >= -0.67 || tScore >= 43 || percentile >= 25) {
        return { label: 'Average', color: 'bg-slate-50 text-slate-700 border-slate-200' };
    } else if (standardScore >= 80 || zScore >= -1.33 || tScore >= 37 || percentile >= 9) {
        return { label: 'Low Average', color: 'bg-amber-50 text-amber-700 border-amber-200' };
    } else if (standardScore >= 70 || zScore >= -2.0 || tScore >= 30 || percentile >= 3) {
        return { label: 'Borderline', color: 'bg-orange-50 text-orange-700 border-orange-200' };
    } else {
        return { label: 'Extremely Low', color: 'bg-red-50 text-red-700 border-red-200' };
    }
}

export default function SubjectDetail({ subject, onBack }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(subject.name);
    const [editedAge, setEditedAge] = useState({ years: subject.age_years || '', months: subject.age_months || '' });
    const [showChart, setShowChart] = useState(false);
    
    const queryClient = useQueryClient();

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }) => base44.entities.SavedConversion.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['savedConversions'] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => base44.entities.SavedConversion.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['savedConversions'] });
            toast.success('Test deleted');
        },
    });

    const handleSaveEdit = async () => {
        const updates = subject.conversions.map(conversion => ({
            id: conversion.id,
            data: {
                ...conversion,
                name: editedName,
                age_years: editedAge.years ? parseFloat(editedAge.years) : null,
                age_months: editedAge.months ? parseFloat(editedAge.months) : null,
            }
        }));

        await Promise.all(updates.map(u => updateMutation.mutateAsync(u)));
        toast.success('Subject information updated');
        setIsEditing(false);
        
        // Update local subject data
        subject.name = editedName;
        subject.age_years = editedAge.years ? parseFloat(editedAge.years) : null;
        subject.age_months = editedAge.months ? parseFloat(editedAge.months) : null;
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <Button variant="ghost" size="sm" onClick={onBack} className="mb-4">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Subjects
                    </Button>

                    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-start gap-4 flex-1">
                                {subject.image_url && (
                                    <img 
                                        src={subject.image_url} 
                                        alt={subject.name}
                                        className="w-20 h-20 rounded-full object-cover border-2 border-indigo-100"
                                    />
                                )}
                                
                                <div className="flex-1">
                                    {isEditing ? (
                                        <div className="space-y-4">
                                            <Input
                                                value={editedName}
                                                onChange={(e) => setEditedName(e.target.value)}
                                                className="text-2xl font-bold h-12"
                                                placeholder="Subject name"
                                            />
                                            <div className="flex gap-3">
                                                <Input
                                                    type="number"
                                                    placeholder="Years"
                                                    value={editedAge.years}
                                                    onChange={(e) => setEditedAge({ ...editedAge, years: e.target.value })}
                                                    className="w-32"
                                                />
                                                <Input
                                                    type="number"
                                                    placeholder="Months"
                                                    value={editedAge.months}
                                                    onChange={(e) => setEditedAge({ ...editedAge, months: e.target.value })}
                                                    className="w-32"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <h1 className="text-3xl font-bold text-slate-800 mb-2">
                                                {subject.name}
                                            </h1>
                                            {(subject.age_years || subject.age_months) && (
                                                <p className="text-slate-600">
                                                    Age: {subject.age_years || 0}y {subject.age_months || 0}m
                                                </p>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-2 print:hidden">
                                {isEditing ? (
                                    <>
                                        <Button onClick={handleSaveEdit} size="sm">
                                            <Save className="w-4 h-4 mr-2" />
                                            Save
                                        </Button>
                                        <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
                                            <X className="w-4 h-4 mr-2" />
                                            Cancel
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                                            <Edit2 className="w-4 h-4 mr-2" />
                                            Edit
                                        </Button>
                                        <Button onClick={handlePrint} variant="outline" size="sm">
                                            <Printer className="w-4 h-4 mr-2" />
                                            Print
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="mb-4">
                            <Badge variant="outline">
                                {subject.conversions.length} test result{subject.conversions.length !== 1 ? 's' : ''}
                            </Badge>
                        </div>

                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Scale/Test</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Input</TableHead>
                                        <TableHead>Z-Score</TableHead>
                                        <TableHead>T-Score</TableHead>
                                        <TableHead>Percentile</TableHead>
                                        <TableHead>Standard</TableHead>
                                        <TableHead>Scaled</TableHead>
                                        <TableHead>Classification</TableHead>
                                        <TableHead className="print:hidden w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {subject.conversions.map((conversion) => {
                                        const classification = getClassificationLabel(
                                            conversion.standard_score,
                                            conversion.z_score,
                                            conversion.t_score,
                                            conversion.percentile
                                        );
                                        return (
                                            <TableRow key={conversion.id}>
                                                <TableCell className="text-sm text-slate-600">
                                                    {moment(conversion.created_date).format('MMM D, YYYY')}
                                                </TableCell>
                                                <TableCell className="font-medium">{conversion.scale_name}</TableCell>
                                                <TableCell className="text-slate-600">{conversion.score_type}</TableCell>
                                                <TableCell>{conversion.input_value}</TableCell>
                                                <TableCell>{conversion.z_score?.toFixed(2) || '—'}</TableCell>
                                                <TableCell>{conversion.t_score?.toFixed(2) || '—'}</TableCell>
                                                <TableCell>{conversion.percentile?.toFixed(2) || '—'}</TableCell>
                                                <TableCell>{conversion.standard_score?.toFixed(2) || '—'}</TableCell>
                                                <TableCell>{conversion.scaled_score?.toFixed(2) || '—'}</TableCell>
                                                <TableCell>
                                                    <Badge className={`border ${classification.color}`}>
                                                        {classification.label}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="print:hidden">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => deleteMutation.mutate(conversion.id)}
                                                        className="h-8 w-8 text-slate-400 hover:text-red-600"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="mt-6 flex justify-center print:hidden">
                            <Button
                                onClick={() => setShowChart(!showChart)}
                                variant="outline"
                                size="lg"
                            >
                                <BarChart3 className="w-4 h-4 mr-2" />
                                {showChart ? 'Hide' : 'Show'} Normal Distribution Plot
                            </Button>
                        </div>

                        {showChart && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                transition={{ duration: 0.3 }}
                                className="mt-6 p-6 bg-slate-50 rounded-2xl border border-slate-200"
                            >
                                <h4 className="text-lg font-semibold text-slate-800 mb-4">
                                    Score Distribution on Normal Curve
                                </h4>
                                <NormalCurveChart conversions={subject.conversions} />
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>

            <style>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .print\\:hidden {
                        display: none !important;
                    }
                    [class*="max-w-7xl"] > div > div {
                        visibility: visible !important;
                    }
                    [class*="max-w-7xl"] > div > div * {
                        visibility: visible !important;
                    }
                    [class*="max-w-7xl"] {
                        position: absolute;
                        left: 0;
                        top: 0;
                    }
                }
            `}</style>
        </div>
    );
}