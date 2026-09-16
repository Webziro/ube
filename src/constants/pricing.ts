import { LocationPoint, VehicleTier } from '@/types/ride';

export type CityCode = 'Lagos' | 'Abuja' | 'Default';

export interface TierPricingConfig {
    baseFare: number;
    perKmRate: number;
    perMinRate: number;
    minFare: number;
}

export type CityPricingMatrix = Record<VehicleTier, TierPricingConfig>;

export const CITY_PRICING_CONFIGS: Record<CityCode, CityPricingMatrix> = {
    Abuja: {
        'Ube Go': {
            baseFare: 884,
            perKmRate: 150,
            perMinRate: 25,
            minFare: 1495,
        },
        'Ube Comfort': {
            baseFare: 1050,
            perKmRate: 180,
            perMinRate: 30,
            minFare: 1800,
        },
        'Ube Exec': {
            baseFare: 1400,
            perKmRate: 200,
            perMinRate: 40,
            minFare: 2500,
        },
        'Ube XL': {
            baseFare: 1800,
            perKmRate: 250,
            perMinRate: 50,
            minFare: 3000,
        },
    },
    Lagos: {
        'Ube Go': {
            baseFare: 350,
            perKmRate: 150,
            perMinRate: 15,
            minFare: 500,
        },
        'Ube Comfort': {
            baseFare: 650,
            perKmRate: 180,
            perMinRate: 25,
            minFare: 1000,
        },
        'Ube Exec': {
            baseFare: 1100,
            perKmRate: 200,
            perMinRate: 40,
            minFare: 1500,
        },
        'Ube XL': {
            baseFare: 1500,
            perKmRate: 250,
            perMinRate: 50,
            minFare: 2000,
        },
    },
    Default: {
        'Ube Go': {
            baseFare: 500,
            perKmRate: 150,
            perMinRate: 20,
            minFare: 800,
        },
        'Ube Comfort': {
            baseFare: 800,
            perKmRate: 180,
            perMinRate: 30,
            minFare: 1200,
        },
        'Ube Exec': {
            baseFare: 1200,
            perKmRate: 200,
            perMinRate: 40,
            minFare: 1800,
        },
        'Ube XL': {
            baseFare: 1600,
            perKmRate: 250,
            perMinRate: 50,
            minFare: 2200,
        },
    },
};

/**
 * Detect city based on location point metadata or latitude/longitude bounding boxes
 */
export function detectCityFromLocation(location?: LocationPoint | null): CityCode {
    if (!location) return 'Lagos';

    const text = `${location.name || ''} ${location.address || ''}`.toLowerCase();
    if (text.includes('abuja') || text.includes('fct') || text.includes('gwarinpa') || text.includes('wuse') || text.includes('maitama')) {
        return 'Abuja';
    }
    if (text.includes('lagos') || text.includes('lekki') || text.includes('ikeja') || text.includes('yaba') || text.includes('ikoyi') || text.includes('victoria island')) {
        return 'Lagos';
    }

    // Bounding Box Check for Abuja (Lat ~8.8 - 9.3, Lng ~7.1 - 7.6)
    if (location.lat >= 8.7 && location.lat <= 9.35 && location.lng >= 7.0 && location.lng <= 7.7) {
        return 'Abuja';
    }

    // Bounding Box Check for Lagos (Lat ~6.3 - 6.7, Lng ~3.1 - 3.7)
    if (location.lat >= 6.3 && location.lat <= 6.75 && location.lng >= 3.0 && location.lng <= 3.8) {
        return 'Lagos';
    }

    return 'Lagos'; // Default city fallback in Nigeria
}

/**
 * Calculates dynamic location-based fare for a ride
 */
export function calculateDynamicFare(
    tier: VehicleTier,
    distanceKm: number,
    durationMins: number,
    location?: LocationPoint | null
): number {
    const city = detectCityFromLocation(location);
    const cityMatrix = CITY_PRICING_CONFIGS[city] || CITY_PRICING_CONFIGS.Lagos;
    const tierConfig = cityMatrix[tier] || cityMatrix['Ube Go'];

    const safeDistance = Math.max(0.5, distanceKm);
    const safeDuration = Math.max(1, durationMins);

    const rawFare =
        tierConfig.baseFare +
        safeDistance * tierConfig.perKmRate +
        safeDuration * tierConfig.perMinRate;

    const clampedFare = Math.max(tierConfig.minFare, rawFare);

    // Round to nearest 50 NGN for clean currency display
    return Math.round(clampedFare / 50) * 50;
}
