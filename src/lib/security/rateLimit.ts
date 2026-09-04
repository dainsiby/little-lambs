import { NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

interface RateLimitStore {
  count: number;
  resetAt: number;
}

const memoryStore = new Map<string, RateLimitStore>();

let upstashRatelimit: Ratelimit | null = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
  upstashRatelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '15 m'),
    analytics: true,
  });
}

/**
 * Enforces rate limiting.
 * In production mode, requires Upstash Redis configuration and fails safely if unconfigured.
 */
export async function checkRateLimit(
  key: string,
  maxAttempts = 5,
  windowMs = 15 * 60 * 1000 // 15 minutes
): Promise<{ success: boolean; response?: NextResponse }> {
  const isProduction = process.env.NODE_ENV === 'production';

  // Production check: Fail safely if Upstash Redis configuration is missing in production
  if (isProduction && !upstashRatelimit) {
    console.error('[RateLimit Config Error] Missing UPSTASH_REDIS_REST_URL in production');
    return {
      success: false,
      response: NextResponse.json(
        { error: 'Server security configuration error. Distributed rate limiting is unconfigured.' },
        { status: 500 }
      ),
    };
  }

  // Use Upstash Redis if configured
  if (upstashRatelimit) {
    try {
      const { success, reset } = await upstashRatelimit.limit(key);
      if (!success) {
        const retryAfter = Math.ceil((reset - Date.now()) / 1000);
        return {
          success: false,
          response: NextResponse.json(
            { error: 'Too many requests. Please try again later.' },
            {
              status: 429,
              headers: { 'Retry-After': String(retryAfter) },
            }
          ),
        };
      }
      return { success: true };
    } catch (e) {
      console.error('Error executing Upstash rate limit:', e);
    }
  }

  // Development mode: In-memory sliding window
  const now = Date.now();
  const record = memoryStore.get(key);

  if (!record || now > record.resetAt) {
    memoryStore.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true };
  }

  if (record.count >= maxAttempts) {
    const retryAfter = Math.ceil((record.resetAt - now) / 1000);
    return {
      success: false,
      response: NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: { 'Retry-After': String(retryAfter) },
        }
      ),
    };
  }

  record.count += 1;
  memoryStore.set(key, record);
  return { success: true };
}
