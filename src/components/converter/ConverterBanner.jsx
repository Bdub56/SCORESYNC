import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp } from 'lucide-react';

export default function ConverterBanner() {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 rounded-3xl shadow-2xl mb-8"
        >
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [0, -90, 0],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"
                />
            </div>

            {/* Content */}
            <div className="relative z-10 px-8 py-12 sm:px-12 sm:py-16">
                <div className="flex flex-col items-center text-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="mb-6"
                    >
                        <img 
                            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6939d2373c3b5efcd612d121/b6b38e6b9_Gemini_Generated_Image_3d4uqh3d4uqh3d4u1-fotor-20251210154843.png"
                            alt="Score Sync Logo"
                            className="h-32 sm:h-40 w-auto object-contain drop-shadow-2xl"
                        />
                    </motion.div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-4"
                    >
                        <Sparkles className="w-4 h-4 text-white" />
                       
                    </motion.div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="flex items-center gap-2 text-white/90 text-sm"
                    >
                        <TrendingUp className="w-4 h-4" />
                        <span>Convert between Z-scores, T-scores, Percentiles & More</span>
                    </motion.div>
                </div>
            </div>

            {/* Decorative wave bottom */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                    <path d="M0 48H1440V24C1440 24 1200 0 720 0C240 0 0 24 0 24V48Z" fill="currentColor" className="text-slate-50"/>
                </svg>
            </div>
        </motion.div>
    );
}