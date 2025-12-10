import React from 'react';
import { motion } from 'framer-motion';
import { Info, TrendingUp, Activity, Percent, BarChart3, Gauge } from 'lucide-react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const scoreInfo = [
    {
        key: 'z',
        title: 'Z-Score',
        icon: TrendingUp,
        color: 'text-indigo-600 bg-indigo-50',
        content: `Z-scores express how many standard deviations a value is from the mean. A z-score of 0 is exactly average, +1 is one standard deviation above average, and -1 is one standard deviation below. Most scores fall between -3 and +3.`
    },
    {
        key: 't',
        title: 'T-Score',
        icon: Activity,
        color: 'text-violet-600 bg-violet-50',
        content: `T-scores transform z-scores to a scale with a mean of 50 and standard deviation of 10. This eliminates negative numbers and decimals, making scores easier to interpret. A T-score of 60 is one standard deviation above the mean.`
    },
    {
        key: 'percentile',
        title: 'Percentile Rank',
        icon: Percent,
        color: 'text-teal-600 bg-teal-50',
        content: `Percentile ranks indicate the percentage of scores in the reference group that fall at or below a given score. A percentile of 75 means the score is higher than 75% of the comparison group. Note: percentiles are not equally spaced—differences near the median represent smaller raw score differences than differences in the extremes.`
    },
    {
        key: 'standard',
        title: 'Standard Score (IQ Scale)',
        icon: BarChart3,
        color: 'text-amber-600 bg-amber-50',
        content: `Standard scores on the IQ scale have a mean of 100 and standard deviation of 15. This scale is commonly used for overall cognitive ability scores. A score of 115 is one standard deviation above average, representing approximately the 84th percentile.`
    },
    {
        key: 'scaled',
        title: 'Scaled Score',
        icon: Gauge,
        color: 'text-rose-600 bg-rose-50',
        content: `Scaled scores have a mean of 10 and standard deviation of 3. They are commonly used for subtest scores in cognitive assessments. Scores typically range from 1-19, with 10 being exactly average and 13 being one standard deviation above.`
    },
];

export default function InfoSection() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 mt-8"
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-slate-100">
                    <Info className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                    <h3 className="font-semibold text-slate-800">Understanding Score Types</h3>
                    <p className="text-sm text-slate-500">Learn about each score type and how they relate</p>
                </div>
            </div>

            <Accordion type="single" collapsible className="space-y-2">
                {scoreInfo.map((info) => (
                    <AccordionItem 
                        key={info.key} 
                        value={info.key}
                        className="border border-slate-200 rounded-xl px-4 data-[state=open]:bg-slate-50/50"
                    >
                        <AccordionTrigger className="hover:no-underline py-4">
                            <div className="flex items-center gap-3">
                                <div className={`p-1.5 rounded-lg ${info.color}`}>
                                    <info.icon className="w-4 h-4" />
                                </div>
                                <span className="font-medium text-slate-700">{info.title}</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-slate-600 text-sm leading-relaxed pb-4">
                            {info.content}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>

            <div className="mt-6 p-4 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl border border-indigo-100">
                <p className="text-sm text-indigo-800">
                    <strong>Note:</strong> All conversions assume a normal (Gaussian) distribution. 
                    These conversions are most accurate when the underlying data is normally distributed.
                </p>
            </div>
        </motion.div>
    );
}