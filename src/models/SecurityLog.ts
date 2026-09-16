import mongoose, { Schema, Model } from 'mongoose';

export interface ISecurityLog {
    id: string;
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
    createdAt?: Date;
}

const SecurityLogSchema = new Schema<ISecurityLog>(
    {
        id: { type: String, required: true, unique: true },
        userId: { type: String, required: true, index: true },
        eventType: {
            type: String,
            required: true,
            enum: [
                'LOGIN_SUCCESS',
                'LOGIN_FAILED',
                'PASSWORD_CHANGED',
                'REAUTHENTICATE_SUCCESS',
                'REAUTHENTICATE_FAILED',
                'DEVICE_REVOKED',
                'LOCKOUT_TRIGGERED',
            ],
        },
        ipAddress: { type: String, required: true },
        userAgent: { type: String, required: true },
        details: { type: String },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    }
);

SecurityLogSchema.index({ userId: 1, createdAt: -1 });
SecurityLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

export const SecurityLogModel: Model<ISecurityLog> =
    (mongoose.models.SecurityLog as Model<ISecurityLog>) ||
    mongoose.model<ISecurityLog>('SecurityLog', SecurityLogSchema);
