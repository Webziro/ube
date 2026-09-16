import { LocationPoint, VehicleOption } from '@/types/ride';

export const PRESET_LOCATIONS: LocationPoint[] = [
    // Lagos Hub Locations
    {
        name: 'Victoria Island (Eko Atlantic)',
        address: 'Ahmadu Bello Way, Victoria Island, Lagos',
        lat: 6.4281,
        lng: 3.4219,
    },
    {
        name: 'Lekki Phase 1',
        address: 'Admiralty Way, Lekki Phase 1, Lagos',
        lat: 6.4474,
        lng: 3.4723,
    },
    {
        name: 'Ikeja GRA',
        address: 'Isaac John Street, Ikeja GRA, Lagos',
        lat: 6.5898,
        lng: 3.3582,
    },
    {
        name: 'Murtala Muhammed Airport (MM2)',
        address: 'Local Airport Rd, Ikeja, Lagos',
        lat: 6.5774,
        lng: 3.3332,
    },
    // Abuja Hub Locations
    {
        name: 'Wuse II Central',
        address: 'Aminu Kano Crescent, Wuse II, Abuja FCT',
        lat: 9.0765,
        lng: 7.4764,
    },
    {
        name: 'Maitama District',
        address: 'Aguiyi Ironsi St, Maitama, Abuja FCT',
        lat: 9.0882,
        lng: 7.4983,
    },
    {
        name: 'Nnamdi Azikiwe Airport (ABV)',
        address: 'Airport Road, Abuja FCT',
        lat: 9.0068,
        lng: 7.2631,
    },
    {
        name: 'Jabi Lake Mall',
        address: 'Bala Sokoto Way, Jabi, Abuja FCT',
        lat: 9.0784,
        lng: 7.4251,
    },
];

export const VEHICLE_OPTIONS: VehicleOption[] = [
    {
        id: 'Ube Go',
        name: 'Ube Go',
        tag: 'Popular & Fast',
        baseFare: 350,
        perKmRate: 150,
        etaMinutes: 3,
        capacity: 4,
        description: 'Affordable everyday rides in compact hatchbacks & sedans.',
    },
    {
        id: 'Ube Comfort',
        name: 'Ube Comfort',
        tag: 'Top Rated Drivers',
        baseFare: 650,
        perKmRate: 180,
        etaMinutes: 5,
        capacity: 4,
        description: 'Spacious sedans with extra legroom & high-rated drivers.',
    },
    {
        id: 'Ube Exec',
        name: 'Ube Exec',
        tag: 'Premium Luxury',
        baseFare: 1100,
        perKmRate: 200,
        etaMinutes: 7,
        capacity: 4,
        description: 'Luxury executive sedans (Mercedes, BMW, Lexus) with VIP service.',
    },
    {
        id: 'Ube XL',
        name: 'Ube XL',
        tag: 'Groups & Luggage',
        baseFare: 1500,
        perKmRate: 250,
        etaMinutes: 6,
        capacity: 6,
        description: 'Full-size SUVs & vans for up to 6 passengers or extra luggage.',
    },
];

export const MOCK_DRIVER: import('@/types/ride').RiderProfile = {
    id: 'dr_8492',
    name: 'Tunde Bakare',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    rating: 4.96,
    totalTrips: 1420,
    phone: '+234 803 492 8102',
    vehicle: {
        make: 'Toyota',
        model: 'Camry Sport',
        color: 'Midnight Black',
        plate: 'LSR-482-AA',
    },
};
