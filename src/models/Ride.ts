import mongoose, { Schema, Model } from 'mongoose';
import { RideStatus } from '@/types/ride';

export interface IRide {
    id: string;
    status: RideStatus;
    passengerId: string;
    driverId?: string;
    pickup: {
        name: string;
        address: string;
        lat: number;
        lng: number;
    };
    dropoff: {
        name: string;
        address: string;
        lat: number;
        lng: number;
    };
    selectedTier: string;
    estimatedFare: number;
    distanceKm: number;
    durationMins: number;
    driverLocation: {
        lat: number;
        lng: number;
    };
    driverHeading: number;
    pinCode: string;
    receipt?: {
        baseFare: number;
        distanceKm: number;
        durationMins: number;
        distanceFare: number;
        serviceFee: number;
        totalFare: number;
        timestamp: string;
    };
    createdAt?: Date;
    updatedAt?: Date;
}

const LocationSchema = new Schema(
    {
        name: { type: String, required: true },
        address: { type: String, required: true },
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
    },
    { _id: false }
);

const RideSchema = new Schema<IRide>(
    {
        id: { type: String, required: true, unique: true },
        status: {
            type: String,
            enum: ['SEARCHING', 'ACCEPTED', 'ARRIVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
            default: 'SEARCHING',
        },
        passengerId: { type: String, required: true },
        driverId: { type: String },
        pickup: { type: LocationSchema, required: true },
        dropoff: { type: LocationSchema, required: true },
        selectedTier: { type: String, required: true },
        estimatedFare: { type: Number, required: true },
        distanceKm: { type: Number, required: true },
        durationMins: { type: Number, required: true },
        driverLocation: {
            lat: { type: Number, required: true },
            lng: { type: Number, required: true },
        },
        driverHeading: { type: Number, default: 0 },
        pinCode: { type: String, required: true },
        receipt: {
            baseFare: Number,
            distanceKm: Number,
            durationMins: Number,
            distanceFare: Number,
            serviceFee: Number,
            totalFare: Number,
            timestamp: String,
        },
    },
    {
        timestamps: true,
    }
);

export const RideModel: Model<IRide> =
    (mongoose.models.Ride as Model<IRide>) || mongoose.model<IRide>('Ride', RideSchema);
