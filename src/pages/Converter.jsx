import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRightLeft, Sparkles, BookOpen, Users, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';
import ScoreConverter from '../components/converter/ScoreConverter';

export default function Converter() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
            {/* Decorative Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl" />
                <div className="absolute top-1/3 -left-20 w-60 h-60 bg-violet-200/20 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-1/4 w-40 h-40 bg-teal-200/20 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                {/* Back to Home */}
                <Link to={createPageUrl('Home')}>
                    <Button variant="ghost" className="mb-4">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Button>
                </Link>

                {/* Header */}
                <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12">

                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 mb-6">
                        <Sparkles className="w-4 h-4 text-indigo-500" />
                        <span className="text-sm font-medium text-indigo-700">Psychometric Scoring Tool

            </span>
                    </div>
                    
                    <div className="flex justify-center mb-4">
                        <img 
                            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6939d2373c3b5efcd612d121/b6b38e6b9_Gemini_Generated_Image_3d4uqh3d4uqh3d4u1-fotor-20251210154843.png"
                            alt="Score Sync Logo"
                            className="h-32 sm:h-40 w-auto object-contain"
                        />
                    </div>
                    
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        Instantly convert between Z-scores, T-scores, percentile ranks, 
                        standard scores, and scaled scores.
                    </p>

                    <div className="flex items-center justify-center gap-2 mt-6 text-sm text-slate-500">
                        <ArrowRightLeft className="w-4 h-4" />
                        <span>All conversions are bidirectional and based on normal distribution</span>
                    </div>
                </motion.header>

                {/* Main Converter */}
                <ScoreConverter />

                {/* Navigation Links */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mt-8 flex justify-center gap-4 flex-wrap"
                >
                    <Link to={createPageUrl('Reference')}>
                        <Button variant="outline" size="lg" className="rounded-full">
                            <BookOpen className="w-4 h-4 mr-2" />
                            Score Reference Guide
                        </Button>
                    </Link>
                    <Link to={createPageUrl('TestSubjects')}>
                        <Button variant="outline" size="lg" className="rounded-full">
                            <Users className="w-4 h-4 mr-2" />
                            Manage Test Subjects
                        </Button>
                    </Link>
                </motion.div>

                {/* Footer */}
                <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 text-center text-sm text-slate-400">

                    <p>
                        Conversions assume normally distributed data
                    </p>
                </motion.footer>
            </div>
        </div>);

}