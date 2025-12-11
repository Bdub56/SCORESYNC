import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Save, Trash2, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

export default function SavedConversions({ currentConversion, onSave }) {
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

    const canSave = currentConversion.scaleName && 
                    currentConversion.inputValue && 
                    currentConversion.scores.z !== null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 mt-8"
        >
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-indigo-100">
                        <History className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-800">Saved Conversions</h3>
                        <p className="text-sm text-slate-500">Your conversion history</p>
                    </div>
                </div>
                <Button
                    onClick={onSave}
                    disabled={!canSave}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                >
                    <Save className="w-4 h-4 mr-2" />
                    Save Current
                </Button>
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
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {savedConversions.map((conversion) => (
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
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </motion.div>
    );
}