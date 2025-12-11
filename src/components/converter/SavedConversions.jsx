import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Trash2, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

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

export default function SavedConversions() {
    const queryClient = useQueryClient();

    const { data: savedConversions = [], isLoading } = useQuery({
        queryKey: ['savedConversions'],
        queryFn: () => base44.entities.SavedConversion.list('-created_date', 50),
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => base44.entities.SavedConversion.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['savedConversions'] });
            toast.success('Conversion deleted');
        },
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 mt-8"
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-indigo-100">
                    <History className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                    <h3 className="font-semibold text-slate-800">Saved Conversions</h3>
                    <p className="text-sm text-slate-500">Your conversion history</p>
                </div>
            </div>

            {isLoading ? (
                <div className="text-center py-8 text-slate-500">Loading...</div>
            ) : savedConversions.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                    No saved conversions yet. Enter a scale name and save your first conversion!
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Scale/Test</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Input</TableHead>
                                <TableHead>Z-Score</TableHead>
                                <TableHead>T-Score</TableHead>
                                <TableHead>Percentile</TableHead>
                                <TableHead>Standard</TableHead>
                                <TableHead>Scaled</TableHead>
                                <TableHead>Classification</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {savedConversions.map((conversion) => {
                                const classification = getClassificationLabel(
                                    conversion.standard_score,
                                    conversion.z_score,
                                    conversion.t_score,
                                    conversion.percentile
                                );
                                return (
                                    <TableRow key={conversion.id}>
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
                                        <TableCell>
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
            )}
        </motion.div>
    );
}