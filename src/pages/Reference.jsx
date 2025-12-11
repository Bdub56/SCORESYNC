import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';
import ClassificationTable from '../components/converter/ClassificationTable';
import InfoSection from '../components/converter/InfoSection';

export default function Reference() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl" />
                <div className="absolute top-1/3 -left-20 w-60 h-60 bg-violet-200/20 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Link to={createPageUrl('Home')}>
                        <Button variant="ghost" className="mb-6">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Converter
                        </Button>
                    </Link>

                    <header className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-slate-800 mb-4">
                            Score Reference Guide
                        </h1>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Comprehensive reference for understanding psychometric score types and classifications
                        </p>
                    </header>
                </motion.div>

                <ClassificationTable />
                <InfoSection />
            </div>
        </div>
    );
}