import mongoose, { Schema, Model } from 'mongoose';

export interface ISession {
    sessionId: string;
    userId: string;
    deviceName: string;
    ipAddress: string;
    userAgent: string;
    isActive: boolean;
    expiresAt: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

const SessionSchema = new Schema<ISession>(
    {
        sessionId: { type: String, required: true, unique: true },
        userId: { type: String, required: true, index: true },
        deviceName: { type: String, required: true },
        ipAddress: { type: String, required: true },
        userAgent: { type: String, required: true },
        isActive: { type: Boolean, default: true },
        expiresAt: { type: Date, required: true },
    },
    {
        timestamps: true,
    }
);

SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const SessionModel: Model<ISession> =
    (mongoose.models.Session as Model<ISession>) ||
    mongoose.model<ISession>('Session', SessionSchema);
