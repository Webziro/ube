import mongoose, { Schema, Model } from 'mongoose';

export interface IUser {
    id: string;
    fullName: string;
    phoneOrEmail: string;
    role: 'passenger' | 'driver' | 'admin';
    rating: number;
    totalTrips: number;
    avatarUrl?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
    {
        id: { type: String, required: true, unique: true },
        fullName: { type: String, required: true },
        phoneOrEmail: { type: String, required: true, unique: true },
        role: { type: String, enum: ['passenger', 'driver', 'admin'], default: 'passenger' },
        rating: { type: Number, default: 5.0 },
        totalTrips: { type: Number, default: 0 },
        avatarUrl: { type: String },
    },
    {
        timestamps: true,
    }
);

export const UserModel: Model<IUser> =
    (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>('User', UserSchema);
