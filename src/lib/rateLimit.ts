interface RateLimitRecord {
    count: number;
    resetTime: number;
}

const attemptsMap = new Map<string, RateLimitRecord>();

/**
 * In-memory rate limiter with sliding 15-minute window
 * @param key Unique key e.g. `login:${ip}` or `login:${email}`
 * @param maxAttempts Max allowed attempts (default 5)
 * @param windowMs Window duration in milliseconds (default 15 mins)
 */
export function checkRateLimit(
    key: string,
    maxAttempts = 5,
    windowMs = 15 * 60 * 1000
): { allowed: boolean; remaining: number; retryAfterSeconds: number } {
    const now = Date.now();
    const record = attemptsMap.get(key);

    if (!record || now > record.resetTime) {
        attemptsMap.set(key, { count: 1, resetTime: now + windowMs });
        return { allowed: true, remaining: maxAttempts - 1, retryAfterSeconds: 0 };
    }

    if (record.count >= maxAttempts) {
        const retryAfterSeconds = Math.ceil((record.resetTime - now) / 1000);
        return { allowed: false, remaining: 0, retryAfterSeconds };
    }

    record.count += 1;
    attemptsMap.set(key, record);
    return { allowed: true, remaining: maxAttempts - record.count, retryAfterSeconds: 0 };
}

/**
 * Reset rate limit counter upon successful authentication
 */
export function clearRateLimit(key: string): void {
    attemptsMap.delete(key);
}
