import React from 'react';
import { motion } from 'framer-motion';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { FileText } from 'lucide-react';

const classificationData = [
    {
        standard: '130+',
        z: '+2.00+',
        t: '70+',
        percentile: '98+',
        descriptor: 'Very Superior',
        population: '~2.3%',
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
        standard: '120-129',
        z: '+1.33 to +1.93',
        t: '63-69',
        percentile: '91-97',
        descriptor: 'Superior',
        population: '~6.8%',
        color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
        standard: '110-119',
        z: '+0.67 to +1.27',
        t: '57-62',
        percentile: '75-90',
        descriptor: 'High Average',
        population: '~16.1%',
        color: 'bg-indigo-50 text-indigo-700 border-indigo-200'
    },
    {
        standard: '90-109',
        z: '-0.67 to +0.60',
        t: '43-56',
        percentile: '25-74',
        descriptor: 'Average',
        population: '~50.0%',
        color: 'bg-slate-50 text-slate-700 border-slate-200'
    },
    {
        standard: '80-89',
        z: '-1.33 to -0.73',
        t: '37-42',
        percentile: '9-24',
        descriptor: 'Low Average',
        population: '~16.1%',
        color: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    {
        standard: '70-79',
        z: '-2.00 to -1.40',
        t: '30-36',
        percentile: '3-8',
        descriptor: 'Borderline',
        population: '~6.8%',
        color: 'bg-orange-50 text-orange-700 border-orange-200'
    },
    {
        standard: '69-',
        z: '-2.07-',
        t: '29-',
        percentile: '2-',
        descriptor: 'Extremely Low / Impaired',
        population: '~2.3%',
        color: 'bg-red-50 text-red-700 border-red-200'
    },
];

export default function ClassificationTable() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 mt-8"
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-slate-100">
                    <FileText className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                    <h3 className="font-semibold text-slate-800">Classification Reference Table</h3>
                    <p className="text-sm text-slate-500">Quick reference for all score ranges and descriptors</p>
                </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50">
                            <TableHead className="font-semibold text-slate-700">Standard Score</TableHead>
                            <TableHead className="font-semibold text-slate-700">Z-Score</TableHead>
                            <TableHead className="font-semibold text-slate-700">T-Score</TableHead>
                            <TableHead className="font-semibold text-slate-700">Percentile</TableHead>
                            <TableHead className="font-semibold text-slate-700">Descriptor</TableHead>
                            <TableHead className="font-semibold text-slate-700">Population %</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {classificationData.map((row, index) => (
                            <TableRow 
                                key={index}
                                className="hover:bg-slate-50 transition-colors"
                            >
                                <TableCell className="font-medium">{row.standard}</TableCell>
                                <TableCell className="font-medium">{row.z}</TableCell>
                                <TableCell className="font-medium">{row.t}</TableCell>
                                <TableCell className="font-medium">{row.percentile}</TableCell>
                                <TableCell>
                                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${row.color}`}>
                                        {row.descriptor}
                                    </span>
                                </TableCell>
                                <TableCell className="text-slate-600">{row.population}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="mt-4 p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200">
                <p className="text-sm text-slate-600">
                    <strong>Note:</strong> Classifications are based on standard psychometric conventions. 
                    Population percentages represent the approximate proportion of individuals falling within each range 
                    in a normally distributed population.
                </p>
            </div>
        </motion.div>
    );
}