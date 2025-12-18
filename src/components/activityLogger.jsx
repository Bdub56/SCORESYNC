import { base44 } from '@/api/base44Client';

export async function logActivity(action, description, metadata = {}) {
    try {
        const user = await base44.auth.me().catch(() => null);
        
        await base44.entities.ActivityLog.create({
            user_email: user?.email || null,
            user_name: user?.full_name || null,
            action,
            description,
            metadata,
        });
    } catch (error) {
        console.error('Failed to log activity:', error);
    }
}