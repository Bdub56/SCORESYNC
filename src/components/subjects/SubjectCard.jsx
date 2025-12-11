import React from 'react';
import { motion } from 'framer-motion';
import { User, Calendar, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import moment from 'moment';

export default function SubjectCard({ subject, onClick }) {
    const ageDisplay = subject.age_years 
        ? `${subject.age_years}y ${subject.age_months || 0}m`
        : 'Age not specified';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
        >
            <Card 
                onClick={onClick}
                className="p-6 cursor-pointer hover:shadow-xl transition-all border-2 hover:border-indigo-200 bg-white"
            >
                <div className="flex items-start gap-4">
                    {subject.image_url ? (
                        <img 
                            src={subject.image_url} 
                            alt={subject.name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-indigo-100"
                        />
                    ) : (
                        <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
                            <User className="w-8 h-8 text-indigo-600" />
                        </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg text-slate-800 mb-2 truncate">
                            {subject.name}
                        </h3>
                        
                        <div className="space-y-1.5 text-sm text-slate-600">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                <span>{ageDisplay}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FileText className="w-3.5 h-3.5 text-slate-400" />
                                <span>{subject.conversions.length} test{subject.conversions.length !== 1 ? 's' : ''}</span>
                            </div>
                        </div>

                        <div className="mt-3">
                            <Badge variant="outline" className="text-xs">
                                Last: {moment(subject.latestDate).format('MMM D, YYYY')}
                            </Badge>
                        </div>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}