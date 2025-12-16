import React, { useState, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Printer, Edit2, Save, X, Trash2, BarChart3, Download, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import NormalCurveChart from '../converter/NormalCurveChart';
import moment from 'moment';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

export default function SubjectDetail({ subject: initialSubject, onBack }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(initialSubject.name);
    const [editedAge, setEditedAge] = useState({ years: initialSubject.age_years || '', months: initialSubject.age_months || '' });
    const [showChart, setShowChart] = useState(false);
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
    const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
    
    const reportRef = useRef(null);
    const chartRef = useRef(null);
    const queryClient = useQueryClient();

    // Fetch live data for this subject
    const { data: conversions = [], isLoading } = useQuery({
        queryKey: ['savedConversions'],
        queryFn: () => base44.entities.SavedConversion.list('-created_date', 500),
        select: (data) => data.filter(c => c.name === editedName),
    });

    const [subjectSummary, setSubjectSummary] = useState(conversions[0]?.summary || '');

    // Build subject object from live data
    const subject = {
        name: editedName,
        age_years: editedAge.years ? parseFloat(editedAge.years) : initialSubject.age_years,
        age_months: editedAge.months ? parseFloat(editedAge.months) : initialSubject.age_months,
        image_url: initialSubject.image_url,
        conversions: conversions,
    };

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
            // Go back if no conversions left
            if (conversions.length <= 1) {
                onBack();
            }
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

    const generatePDF = async () => {
        setIsGeneratingPDF(true);
        toast.loading('Generating PDF report...');

        try {
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const margin = 15;
            let yPosition = margin;

            // Header
            pdf.setFontSize(20);
            pdf.setFont('helvetica', 'bold');
            pdf.text('Psychometric Assessment Report', margin, yPosition);
            yPosition += 10;

            // Subject Info
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'normal');
            pdf.text(`Subject: ${subject.name}`, margin, yPosition);
            yPosition += 7;
            if (subject.age_years || subject.age_months) {
                pdf.text(`Age: ${subject.age_years || 0} years ${subject.age_months || 0} months`, margin, yPosition);
                yPosition += 7;
            }
            pdf.text(`Report Date: ${moment().format('MMMM D, YYYY')}`, margin, yPosition);
            yPosition += 7;
            pdf.text(`Number of Tests: ${subject.conversions.length}`, margin, yPosition);
            yPosition += 12;

            // Narrative Summary Section
            if (subjectSummary) {
                pdf.setFontSize(14);
                pdf.setFont('helvetica', 'bold');
                pdf.text('Narrative Summary', margin, yPosition);
                yPosition += 8;
                pdf.setFontSize(10);
                pdf.setFont('helvetica', 'normal');
                const splitSummary = pdf.splitTextToSize(subjectSummary, pageWidth - (margin * 2));
                pdf.text(splitSummary, margin, yPosition);
                yPosition += (splitSummary.length * 5) + 10;
                
                if (yPosition > pageHeight - 50) {
                    pdf.addPage();
                    yPosition = margin;
                }
            }

            // Score Summary Section
            pdf.setFontSize(14);
            pdf.setFont('helvetica', 'bold');
            pdf.text('Test Results', margin, yPosition);
            yPosition += 8;

            // Table headers
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'bold');
            const colWidths = [35, 20, 15, 15, 15, 15, 15, 15, 30];
            const headers = ['Test/Scale', 'Type', 'Input', 'Z', 'T', '%ile', 'Std', 'Scl', 'Classification'];
            let xPosition = margin;
            
            headers.forEach((header, i) => {
                pdf.text(header, xPosition, yPosition);
                xPosition += colWidths[i];
            });
            yPosition += 5;

            // Table data
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(8);
            
            subject.conversions.forEach((conversion, index) => {
                if (yPosition > pageHeight - 30) {
                    pdf.addPage();
                    yPosition = margin;
                }

                const classification = getClassificationLabel(
                    conversion.standard_score,
                    conversion.z_score,
                    conversion.t_score,
                    conversion.percentile
                );

                xPosition = margin;
                const rowData = [
                    conversion.scale_name.substring(0, 25),
                    conversion.score_type.substring(0, 8),
                    conversion.input_value.toString(),
                    conversion.z_score?.toFixed(2) || '—',
                    conversion.t_score?.toFixed(2) || '—',
                    conversion.percentile?.toFixed(1) || '—',
                    conversion.standard_score?.toFixed(0) || '—',
                    conversion.scaled_score?.toFixed(1) || '—',
                    classification.label
                ];

                rowData.forEach((data, i) => {
                    pdf.text(data, xPosition, yPosition);
                    xPosition += colWidths[i];
                });
                yPosition += 5;
            });

            yPosition += 10;

            // Summary Statistics
            if (yPosition > pageHeight - 50) {
                pdf.addPage();
                yPosition = margin;
            }

            pdf.setFontSize(14);
            pdf.setFont('helvetica', 'bold');
            pdf.text('Statistical Overview', margin, yPosition);
            yPosition += 8;

            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');
            
            const avgStandard = subject.conversions.reduce((sum, c) => sum + (c.standard_score || 0), 0) / subject.conversions.length;
            const avgPercentile = subject.conversions.reduce((sum, c) => sum + (c.percentile || 0), 0) / subject.conversions.length;
            
            pdf.text(`Average Standard Score: ${avgStandard.toFixed(1)}`, margin, yPosition);
            yPosition += 6;
            pdf.text(`Average Percentile: ${avgPercentile.toFixed(1)}`, margin, yPosition);
            yPosition += 6;

            const classifications = subject.conversions.map(c => 
                getClassificationLabel(c.standard_score, c.z_score, c.t_score, c.percentile).label
            );
            const uniqueClassifications = [...new Set(classifications)];
            pdf.text(`Performance Range: ${uniqueClassifications.join(', ')}`, margin, yPosition);
            yPosition += 12;

            // Add normal curve chart
            if (chartRef.current) {
                pdf.setFontSize(14);
                pdf.setFont('helvetica', 'bold');
                pdf.text('Score Distribution', margin, yPosition);
                yPosition += 8;

                const canvas = await html2canvas(chartRef.current, {
                    scale: 2,
                    backgroundColor: '#ffffff',
                    logging: false
                });
                
                const imgData = canvas.toDataURL('image/png');
                const imgWidth = pageWidth - (margin * 2);
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                
                if (yPosition + imgHeight > pageHeight - margin) {
                    pdf.addPage();
                    yPosition = margin;
                }
                
                pdf.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight);
                yPosition += imgHeight + 10;
            }

            // Footer on last page
            pdf.setFontSize(8);
            pdf.setFont('helvetica', 'italic');
            const footerY = pageHeight - 10;
            pdf.text('Generated by Score Sync - Psychometric Assessment Tool', margin, footerY);

            // Save PDF
            pdf.save(`${subject.name.replace(/\s+/g, '_')}_Assessment_Report_${moment().format('YYYY-MM-DD')}.pdf`);
            
            toast.dismiss();
            toast.success('PDF report generated successfully!');
        } catch (error) {
            toast.dismiss();
            toast.error('Failed to generate PDF report');
            console.error(error);
        } finally {
            setIsGeneratingPDF(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 flex items-center justify-center">
                <div className="text-slate-500">Loading...</div>
            </div>
        );
    }

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
                                        <Button onClick={generatePDF} variant="default" size="sm" disabled={isGeneratingPDF}>
                                            <Download className="w-4 h-4 mr-2" />
                                            {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
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

                        <div className="mb-6 p-6 bg-slate-50 rounded-2xl border border-slate-200">
                            <div className="flex items-center justify-between mb-4">
                                <Label htmlFor="subject-summary" className="text-sm font-semibold text-slate-700">
                                    Subject Summary
                                </Label>
                                <div className="flex gap-2">
                                    <Button
                                        onClick={async () => {
                                            setIsGeneratingSummary(true);
                                            try {
                                                const conversionsData = subject.conversions.map(c => ({
                                                    scale: c.scale_name,
                                                    type: c.score_type,
                                                    input: c.input_value,
                                                    z_score: c.z_score?.toFixed(2),
                                                    t_score: c.t_score?.toFixed(2),
                                                    percentile: c.percentile?.toFixed(2),
                                                    standard: c.standard_score?.toFixed(2),
                                                    classification: getClassificationLabel(c.standard_score, c.z_score, c.t_score, c.percentile).label
                                                }));

                                                const result = await base44.integrations.Core.InvokeLLM({
                                                    prompt: `You are a psychometric assessment expert. Create a professional narrative summary of the following psychometric test scores for ${subject.name}. The summary should:

1. Provide an overview of the assessment results
2. Describe the pattern of strengths and weaknesses
3. Interpret what the scores mean in practical terms
4. Be written in a clear, professional tone suitable for a psychological report
5. Be 2-3 paragraphs long

Here are the scores:
${JSON.stringify(conversionsData, null, 2)}

Write the narrative summary now:`,
                                                });
                                                setSubjectSummary(result);
                                                toast.success('Summary generated!');
                                            } catch (error) {
                                                toast.error('Failed to generate summary');
                                                console.error(error);
                                            } finally {
                                                setIsGeneratingSummary(false);
                                            }
                                        }}
                                        disabled={isGeneratingSummary}
                                        variant="outline"
                                        size="sm"
                                    >
                                        <Sparkles className="w-4 h-4 mr-2" />
                                        {isGeneratingSummary ? 'Generating...' : 'Generate Summary'}
                                    </Button>
                                    <Button
                                        onClick={async () => {
                                            if (!subjectSummary.trim()) {
                                                toast.error('Please enter or generate a summary first');
                                                return;
                                            }
                                            try {
                                                const updates = subject.conversions.map(conversion =>
                                                    base44.entities.SavedConversion.update(conversion.id, { summary: subjectSummary })
                                                );
                                                await Promise.all(updates);
                                                queryClient.invalidateQueries({ queryKey: ['savedConversions'] });
                                                toast.success('Summary saved!');
                                            } catch (error) {
                                                toast.error('Failed to save summary');
                                            }
                                        }}
                                        disabled={!subjectSummary.trim()}
                                        size="sm"
                                        className="bg-indigo-600 hover:bg-indigo-700"
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Summary
                                    </Button>
                                </div>
                            </div>
                            <Textarea
                                id="subject-summary"
                                value={subjectSummary}
                                onChange={(e) => setSubjectSummary(e.target.value)}
                                placeholder="Generate a summary or type one here..."
                                className="min-h-[150px] resize-y"
                            />
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
                                ref={chartRef}
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