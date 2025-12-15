import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, BarChart3, FileText, Users, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { createPageUrl } from '@/utils';

export default function Home() {
    const features = [
        {
            icon: Zap,
            title: 'Instant Conversions',
            description: 'Convert between Z-scores, T-scores, percentiles, and more in real-time with bidirectional support.'
        },
        {
            icon: BarChart3,
            title: 'Visual Analytics',
            description: 'Visualize scores on normal distribution curves to understand performance at a glance.'
        },
        {
            icon: FileText,
            title: 'Comprehensive Reports',
            description: 'Generate professional PDF reports with score summaries and statistical analysis.'
        },
        {
            icon: Users,
            title: 'Subject Management',
            description: 'Track and manage test results for multiple individuals with complete history.'
        }
    ];

    const scoreTypes = [
        'Z-Scores',
        'T-Scores',
        'Percentile Ranks',
        'Standard Scores (IQ)',
        'Scaled Scores',
        'WAIS/WISC',
        'SAT/ACT',
        'GRE/GMAT'
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
            {/* Decorative Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl" />
                <div className="absolute top-1/2 -left-20 w-60 h-60 bg-violet-200/20 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-teal-200/20 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
                {/* Hero Section */}
                <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-32 sm:pb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        <div className="flex justify-center mb-8">
                            <img 
                                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6939d2373c3b5efcd612d121/b6b38e6b9_Gemini_Generated_Image_3d4uqh3d4uqh3d4u1-fotor-20251210154843.png"
                                alt="Score Sync Logo"
                                className="h-40 sm:h-48 w-auto object-contain"
                            />
                        </div>

                        <h1 className="text-4xl sm:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                            Transform Psychometric Scores
                            <span className="block text-blue-600">Instantly & Accurately</span>
                        </h1>

                        <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                            The professional tool for psychologists, educators, and researchers to convert 
                            and analyze test scores with precision and ease.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link to={createPageUrl('Converter')}>
                                <Button size="lg" className="text-lg px-8 py-6 rounded-full bg-blue-600 hover:bg-blue-700">
                                    Get Started Free
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                            <Link to={createPageUrl('Reference')}>
                                <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-full">
                                    View Reference Guide
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </section>

                {/* Features Section */}
                <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <h2 className="text-3xl sm:text-4xl font-bold text-center text-slate-900 mb-4">
                            Everything You Need
                        </h2>
                        <p className="text-center text-slate-600 mb-12 text-lg">
                            Powerful features for comprehensive psychometric assessment
                        </p>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                                >
                                    <Card className="p-6 h-full hover:shadow-xl transition-all border-2 hover:border-blue-200">
                                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                                            <feature.icon className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-slate-800 mb-2">
                                            {feature.title}
                                        </h3>
                                        <p className="text-slate-600 leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </section>

                {/* Supported Scores Section */}
                <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 sm:p-12"
                    >
                        <h2 className="text-3xl sm:text-4xl font-bold text-center text-slate-900 mb-4">
                            Comprehensive Score Support
                        </h2>
                        <p className="text-center text-slate-600 mb-8 text-lg">
                            Convert between all major psychometric score types
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {scoreTypes.map((type, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                                    className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 border border-slate-200"
                                >
                                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                    <span className="text-slate-700 font-medium">{type}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </section>

                {/* CTA Section */}
                <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="bg-gradient-to-r from-blue-600 to-violet-600 rounded-3xl shadow-2xl p-8 sm:p-12 text-center text-white"
                    >
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                            Ready to Streamline Your Assessment Workflow?
                        </h2>
                        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                            Join professionals who trust Score Sync for accurate, efficient psychometric conversions.
                        </p>
                        <Link to={createPageUrl('Converter')}>
                            <Button size="lg" variant="secondary" className="text-lg px-8 py-6 rounded-full">
                                Start Converting Now
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                    </motion.div>
                </section>

                {/* Footer */}
                <footer className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-slate-500 text-sm">
                    <p>
                        All conversions assume normally distributed data • Based on standard statistical principles
                    </p>
                </footer>
            </div>
        </div>
    );
}