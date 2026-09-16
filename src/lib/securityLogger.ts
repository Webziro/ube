import { connectToDatabase } from '@/lib/mongodb';
import { SecurityLogModel } from '@/models/SecurityLog';

export async function logSecurityEvent(params: {
    userId: string;
    eventType:
    | 'LOGIN_SUCCESS'
    | 'LOGIN_FAILED'
    | 'PASSWORD_CHANGED'
    | 'REAUTHENTICATE_SUCCESS'
    | 'REAUTHENTICATE_FAILED'
    | 'DEVICE_REVOKED'
    | 'LOCKOUT_TRIGGERED';
    ipAddress: string;
    userAgent: string;
    details?: string;
}) {
    try {
        const conn = await connectToDatabase();
        if (!conn) return;

        await SecurityLogModel.create({
            id: `sec_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            ...params,
        });
    } catch (err) {
        console.error('Failed to write security audit log:', err);
    }
}
