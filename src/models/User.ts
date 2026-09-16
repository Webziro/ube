import mongoose, { Schema, Model } from 'mongoose';

export interface IUser {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    passwordHash: string;
    role: 'passenger' | 'driver' | 'admin';
    rating: number;
    totalTrips: number;
    isVerified: boolean;
    avatarUrl?: string;
    failedLoginAttempts?: number;
    lockoutUntil?: Date;
    vehicle?: {
        make: string;
        model: string;
        color: string;
        plate: string;
        tier: string;
    };
    earnings?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
    {
        id: { type: String, required: true, unique: true },
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        phone: { type: String, required: true, unique: true, trim: true },
        passwordHash: { type: String, required: true, select: false },
        role: { type: String, enum: ['passenger', 'driver', 'admin'], default: 'passenger' },
        rating: { type: Number, default: 5.0 },
        totalTrips: { type: Number, default: 0 },
        isVerified: { type: Boolean, default: true },
        avatarUrl: { type: String },
        failedLoginAttempts: { type: Number, default: 0 },
        lockoutUntil: { type: Date, default: null },
        vehicle: {
            make: { type: String },
            model: { type: String },
            color: { type: String },
            plate: { type: String },
            tier: { type: String },
        },
        earnings: { type: Number, default: 0 },
    },
    {
        timestamps: true,
    }
);

export const UserModel: Model<IUser> =
    (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>('User', UserSchema);
