import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Activity, Search, Filter, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Navigation from '../components/Navigation';
import moment from 'moment';

const actionColors = {
    score_converted: 'bg-blue-100 text-blue-700 border-blue-200',
    score_saved: 'bg-green-100 text-green-700 border-green-200',
    subject_created: 'bg-purple-100 text-purple-700 border-purple-200',
    subject_updated: 'bg-amber-100 text-amber-700 border-amber-200',
    subject_deleted: 'bg-red-100 text-red-700 border-red-200',
    test_deleted: 'bg-orange-100 text-orange-700 border-orange-200',
    report_generated: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    login: 'bg-teal-100 text-teal-700 border-teal-200',
    logout: 'bg-slate-100 text-slate-700 border-slate-200',
};

export default function ActivityLog() {
    const [searchQuery, setSearchQuery] = useState('');
    const [actionFilter, setActionFilter] = useState('all');
    const [user, setUser] = useState(null);

    // Check if user is admin
    React.useEffect(() => {
        base44.auth.me().then(u => setUser(u)).catch(() => {});
    }, []);

    const { data: logs = [], isLoading, refetch } = useQuery({
        queryKey: ['activityLogs'],
        queryFn: () => base44.entities.ActivityLog.list('-created_date', 500),
        enabled: user?.role === 'admin',
    });

    const filteredLogs = logs.filter(log => {
        const matchesSearch = !searchQuery || 
            log.user_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.description?.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesAction = actionFilter === 'all' || log.action === actionFilter;
        
        return matchesSearch && matchesAction;
    });

    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 flex items-center justify-center">
                <div className="text-slate-500">Loading...</div>
            </div>
        );
    }

    if (user.role !== 'admin') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
                <Navigation />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <Activity className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                        <h2 className="text-2xl font-bold text-slate-700 mb-2">Admin Access Required</h2>
                        <p className="text-slate-500">Only administrators can view the activity log.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
            <Navigation />
            
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl" />
                <div className="absolute top-1/3 -left-20 w-60 h-60 bg-violet-200/20 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-xl bg-indigo-100">
                                <Activity className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-slate-800">Activity Log</h1>
                                <p className="text-slate-600">Monitor all user activities in the system</p>
                            </div>
                        </div>
                        <Button
                            onClick={() => refetch()}
                            variant="outline"
                            size="sm"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Refresh
                        </Button>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="Search by user or description..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-12 rounded-xl border-2"
                            />
                        </div>
                        <Select value={actionFilter} onValueChange={setActionFilter}>
                            <SelectTrigger className="w-full sm:w-[200px] h-12 rounded-xl border-2">
                                <Filter className="w-4 h-4 mr-2" />
                                <SelectValue placeholder="Filter by action" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Actions</SelectItem>
                                <SelectItem value="score_converted">Score Converted</SelectItem>
                                <SelectItem value="score_saved">Score Saved</SelectItem>
                                <SelectItem value="subject_created">Subject Created</SelectItem>
                                <SelectItem value="subject_updated">Subject Updated</SelectItem>
                                <SelectItem value="subject_deleted">Subject Deleted</SelectItem>
                                <SelectItem value="test_deleted">Test Deleted</SelectItem>
                                <SelectItem value="report_generated">Report Generated</SelectItem>
                                <SelectItem value="login">Login</SelectItem>
                                <SelectItem value="logout">Logout</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
                >
                    {isLoading ? (
                        <div className="text-center py-12 text-slate-500">Loading activity log...</div>
                    ) : filteredLogs.length === 0 ? (
                        <div className="text-center py-12">
                            <Activity className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                            <p className="text-slate-500">
                                {searchQuery || actionFilter !== 'all' 
                                    ? 'No activities match your filters.' 
                                    : 'No activities recorded yet.'}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date & Time</TableHead>
                                        <TableHead>User</TableHead>
                                        <TableHead>Action</TableHead>
                                        <TableHead>Description</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredLogs.map((log) => (
                                        <TableRow key={log.id}>
                                            <TableCell className="text-sm text-slate-600 whitespace-nowrap">
                                                {moment(log.created_date).format('MMM D, YYYY h:mm A')}
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium text-slate-800">
                                                        {log.user_name || 'Unknown'}
                                                    </div>
                                                    <div className="text-xs text-slate-500">
                                                        {log.user_email || log.created_by || '—'}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={`border ${actionColors[log.action] || 'bg-slate-100 text-slate-700'}`}>
                                                    {log.action?.replace(/_/g, ' ')}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="max-w-md">
                                                <div className="text-sm text-slate-700">
                                                    {log.description}
                                                </div>
                                                {log.metadata && Object.keys(log.metadata).length > 0 && (
                                                    <div className="text-xs text-slate-400 mt-1">
                                                        {JSON.stringify(log.metadata)}
                                                    </div>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </motion.div>

                <div className="mt-6 text-center text-sm text-slate-500">
                    Showing {filteredLogs.length} of {logs.length} activities
                </div>
            </div>
        </div>
    );
}