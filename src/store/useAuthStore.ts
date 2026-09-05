import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserProfile, UserRoleType, AuthSession, LoginPayload, RegisterPayload } from '@/types/auth';

// Mock default users for quick switching/testing
export const MOCK_PASSENGER: UserProfile = {
    id: 'usr_pass_001',
    name: 'Alex Morgan',
    email: 'alex.morgan@ube.ng',
    phone: '+234 801 234 5678',
    role: 'passenger',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    rating: 4.92,
    totalTrips: 42,
    isVerified: true,
    createdAt: '2025-11-10T10:00:00Z',
};

export const MOCK_DRIVER_USER: UserProfile = {
    id: 'usr_drv_002',
    name: 'Babatunde Lawal',
    email: 'babatunde.lawal@ube.ng',
    phone: '+234 809 876 5432',
    role: 'driver',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    rating: 4.96,
    totalTrips: 384,
    isVerified: true,
    createdAt: '2025-08-15T09:30:00Z',
    earnings: 245000,
    vehicle: {
        make: 'Toyota',
        model: 'Camry Hybrid',
        color: 'Onyx Black',
        plate: 'LAG-849-XY',
        tier: 'Ube Comfort',
    },
};

interface AuthStoreState {
    currentUser: UserProfile | null;
    token: string | null;
    isAuthenticated: boolean;
    authModalOpen: boolean;
    authModalTab: 'login' | 'register';
    authModalRole: UserRoleType;

    // Actions
    setAuthModalOpen: (open: boolean, tab?: 'login' | 'register', role?: UserRoleType) => void;
    login: (payload: LoginPayload) => Promise<{ success: boolean; message?: string }>;
    register: (payload: RegisterPayload) => Promise<{ success: boolean; message?: string }>;
    switchMockAccount: (role: UserRoleType) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthStoreState>()(
    persist(
        (set) => ({
            currentUser: null,
            token: null,
            isAuthenticated: false,
            authModalOpen: false,
            authModalTab: 'login',
            authModalRole: 'passenger',

            setAuthModalOpen: (open, tab = 'login', role = 'passenger') => {
                set({ authModalOpen: open, authModalTab: tab, authModalRole: role });
            },

            login: async (payload) => {
                try {
                    const res = await fetch('/api/auth/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload),
                    });
                    const data = await res.json();
                    if (data.success && data.session) {
                        set({
                            currentUser: data.session.user,
                            token: data.session.token,
                            isAuthenticated: true,
                            authModalOpen: false,
                        });
                        return { success: true };
                    }
                    return { success: false, message: data.message || 'Login failed' };
                } catch (e) {
                    const targetMock = payload.phoneOrEmail.includes('driver') ? MOCK_DRIVER_USER : MOCK_PASSENGER;
                    set({
                        currentUser: targetMock,
                        token: `ube_jwt_mock_${targetMock.id}`,
                        isAuthenticated: true,
                        authModalOpen: false,
                    });
                    return { success: true };
                }
            },

            register: async (payload) => {
                try {
                    const res = await fetch('/api/auth/register', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload),
                    });
                    const data = await res.json();
                    if (data.success && data.session) {
                        set({
                            currentUser: data.session.user,
                            token: data.session.token,
                            isAuthenticated: true,
                            authModalOpen: false,
                        });
                        return { success: true };
                    }
                    return { success: false, message: data.message || 'Registration failed' };
                } catch (e) {
                    const newUser: UserProfile = {
                        id: `usr_${Date.now()}`,
                        name: payload.name,
                        email: payload.email,
                        phone: payload.phone,
                        role: payload.role,
                        avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250`,
                        rating: 5.0,
                        totalTrips: 0,
                        isVerified: true,
                        createdAt: new Date().toISOString(),
                        vehicle: payload.vehicle,
                        earnings: payload.role === 'driver' ? 0 : undefined,
                    };
                    set({
                        currentUser: newUser,
                        token: `ube_jwt_mock_${newUser.id}`,
                        isAuthenticated: true,
                        authModalOpen: false,
                    });
                    return { success: true };
                }
            },

            switchMockAccount: (role) => {
                const newUser = role === 'driver' ? MOCK_DRIVER_USER : MOCK_PASSENGER;
                set({
                    currentUser: newUser,
                    token: `ube_jwt_mock_${newUser.id}`,
                    isAuthenticated: true,
                });
            },

            logout: () => {
                set({
                    currentUser: null,
                    token: null,
                    isAuthenticated: false,
                });
            },
        }),
        {
            name: 'ube_auth_storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                currentUser: state.currentUser,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
