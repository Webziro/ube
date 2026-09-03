export type UserRoleType = 'passenger' | 'driver';

export interface VehicleInfo {
    make: string;
    model: string;
    color: string;
    plate: string;
    tier: 'Ube Go' | 'Ube Comfort' | 'Ube Exec' | 'Ube XL';
}

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: UserRoleType;
    avatar: string;
    rating: number;
    totalTrips: number;
    isVerified: boolean;
    createdAt: string;
    vehicle?: VehicleInfo; // Present if role === 'driver'
    earnings?: number;     // Present if role === 'driver'
}

export interface AuthSession {
    user: UserProfile;
    token: string;
    expiresAt: string;
}

export interface LoginPayload {
    phoneOrEmail: string;
    pin: string;
}

export interface RegisterPayload {
    name: string;
    email: string;
    phone: string;
    role: UserRoleType;
    vehicle?: VehicleInfo;
}
