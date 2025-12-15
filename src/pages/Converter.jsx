import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';
import ScoreConverter from '../components/converter/ScoreConverter';
import Navigation from '../components/Navigation';

export default function Converter() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
            <Navigation />
            
            {/* Decorative Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl" />
                <div className="absolute top-1/3 -left-20 w-60 h-60 bg-violet-200/20 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-1/4 w-40 h-40 bg-teal-200/20 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-bold text-slate-900 text-center">
                        Test Score Converter
                    </h1>
                </motion.div>

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