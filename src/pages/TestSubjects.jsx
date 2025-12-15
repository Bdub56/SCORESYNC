import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ArrowLeft, Search, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createPageUrl } from '@/utils';
import SubjectCard from '../components/subjects/SubjectCard';
import SubjectDetail from '../components/subjects/SubjectDetail';
import SubjectCreateForm from '../components/subjects/SubjectCreateForm';
import { toast } from 'sonner';

export default function TestSubjects() {
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const queryClient = useQueryClient();

    const { data: conversions = [], isLoading } = useQuery({
        queryKey: ['savedConversions'],
        queryFn: () => base44.entities.SavedConversion.list('-created_date', 500),
    });

    // Group conversions by name
    const subjects = conversions.reduce((acc, conversion) => {
        const name = conversion.name || 'Unnamed';
        if (!acc[name]) {
            acc[name] = {
                name,
                conversions: [],
                latestDate: conversion.created_date,
                age_years: conversion.age_years,
                age_months: conversion.age_months,
                image_url: conversion.image_url
            };
        }
        acc[name].conversions.push(conversion);
        return acc;
    }, {});

    const subjectsList = Object.values(subjects).filter(subject => 
        subject.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCreateSubject = async (data) => {
        setIsCreating(true);
        try {
            let imageUrl = null;
            if (data.imageFile) {
                const result = await base44.integrations.Core.UploadFile({ file: data.imageFile });
                imageUrl = result.file_url;
            }

            await base44.entities.SavedConversion.create({
                name: data.name,
                age_years: data.ageYears,
                age_months: data.ageMonths,
                image_url: imageUrl,
                scale_name: 'Initial Profile',
                score_type: 'raw',
                input_value: 0,
                mean: 100,
                standard_deviation: 15,
                z_score: -6.67,
                t_score: -16.7,
                percentile: 0.01,
                standard_score: 0,
                scaled_score: -10
            });

            queryClient.invalidateQueries({ queryKey: ['savedConversions'] });
            toast.success('Subject created successfully!');
            setShowCreateForm(false);
        } catch (error) {
            toast.error('Failed to create subject');
            console.error(error);
        } finally {
            setIsCreating(false);
        }
    };

    if (selectedSubject) {
        return (
            <SubjectDetail 
                subject={selectedSubject}
                onBack={() => setSelectedSubject(null)}
            />
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl" />
                <div className="absolute top-1/3 -left-20 w-60 h-60 bg-violet-200/20 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <Link to={createPageUrl('Converter')}>
                        <Button variant="ghost" size="sm" className="mb-4">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Converter
                        </Button>
                    </Link>

                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-xl bg-indigo-100">
                                <Users className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-slate-800">Test Subjects</h1>
                                <p className="text-slate-600">Manage and view testing results by individual</p>
                            </div>
                        </div>
                        <Button
                            onClick={() => setShowCreateForm(true)}
                            className="bg-indigo-600 hover:bg-indigo-700"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            New Subject
                        </Button>
                    </div>

                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Search subjects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-12 rounded-xl border-2"
                        />
                    </div>
                </motion.div>

                {isLoading ? (
                    <div className="text-center py-12 text-slate-500">Loading subjects...</div>
                ) : subjectsList.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-slate-500 mb-4">
                            {searchQuery ? 'No subjects found matching your search.' : 'No test subjects yet. Add names when saving conversions.'}
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {subjectsList.map((subject) => (
                            <SubjectCard
                                key={subject.name}
                                subject={subject}
                                onClick={() => setSelectedSubject(subject)}
                            />
                        ))}
                    </div>
                )}

                <AnimatePresence>
                    {showCreateForm && (
                        <SubjectCreateForm
                            onClose={() => setShowCreateForm(false)}
                            onSubmit={handleCreateSubject}
                            isSubmitting={isCreating}
                        />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}