import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart3, BookOpen, Users, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';
import { cn } from '@/lib/utils';
import { base44 } from '@/api/base44Client';

export default function Navigation() {
    const location = useLocation();
    const [user, setUser] = React.useState(null);

    React.useEffect(() => {
        base44.auth.me().then(u => setUser(u)).catch(() => {});
    }, []);
    
    const navItems = [
        { name: 'Home', path: 'Home', icon: Home },
        { name: 'Converter', path: 'Converter', icon: BarChart3 },
        { name: 'Reference', path: 'Reference', icon: BookOpen },
        { name: 'Test Subjects', path: 'TestSubjects', icon: Users },
    ];

    const isActive = (path) => {
        return location.pathname === createPageUrl(path);
    };

    return (
        <nav className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-2">
                        <img 
                            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6939d2373c3b5efcd612d121/b6b38e6b9_Gemini_Generated_Image_3d4uqh3d4uqh3d4u1-fotor-20251210154843.png"
                            alt="Score Sync"
                            className="h-10 w-auto object-contain"
                        />
                        <span className="text-xl font-bold text-slate-800">Score Sync</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.path);
                            
                            return (
                                <Link key={item.path} to={createPageUrl(item.path)}>
                                    <Button
                                        variant={active ? "default" : "ghost"}
                                        className={cn(
                                            "gap-2",
                                            active && "bg-indigo-600 hover:bg-indigo-700"
                                        )}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span className="hidden sm:inline">{item.name}</span>
                                    </Button>
                                </Link>
                            );
                        })}
                        {user?.role === 'admin' && (
                            <Link to={createPageUrl('ActivityLog')}>
                                <Button
                                    variant={isActive('ActivityLog') ? "default" : "ghost"}
                                    className={cn(
                                        "gap-2",
                                        isActive('ActivityLog') && "bg-indigo-600 hover:bg-indigo-700"
                                    )}
                                >
                                    <Activity className="w-4 h-4" />
                                    <span className="hidden sm:inline">Activity Log</span>
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}