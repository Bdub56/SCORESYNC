import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Users, ArrowLeft, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createPageUrl } from '@/utils';
import SubjectCard from '../components/subjects/SubjectCard';
import SubjectDetail from '../components/subjects/SubjectDetail';

export default function TestSubjects() {
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

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
                    <Link to={createPageUrl('Home')}>
                        <Button variant="ghost" size="sm" className="mb-4">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Converter
                        </Button>
                    </Link>

                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 rounded-xl bg-indigo-100">
                            <Users className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-800">Test Subjects</h1>
                            <p className="text-slate-600">Manage and view testing results by individual</p>
                        </div>
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
            </div>
        </div>
    );
}