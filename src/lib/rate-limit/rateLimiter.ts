import { NextResponse } from 'next/server';

interface RateLimitStoreEntry {
  tokens: number;
  lastReset: number;
}

// In-memory sliding window cache fallback for development and testing
const inMemoryStore = new Map<string, RateLimitStoreEntry>();

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
}

/**
 * Production-grade sliding window rate limiter supporting Upstash Redis when env is configured,
 * with resilient fallback to in-memory window checking.
 */
export async function checkRateLimit(
  identifier: string,
  limit: number = 10,
  windowSeconds: number = 60
): Promise<RateLimitResult> {
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  // 1. If Upstash Redis credentials exist in environment, use REST API
  if (upstashUrl && upstashToken) {
    try {
      const redisKey = `ratelimit:${identifier}`;
      const res = await fetch(`${upstashUrl}/pipeline`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${upstashToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          ['INCR', redisKey],
          ['EXPIRE', redisKey, windowSeconds],
          ['TTL', redisKey],
        ]),
      });

      if (res.ok) {
        const data = await res.json();
        const currentCount = data[0]?.result || 1;
        const ttl = data[2]?.result || windowSeconds;

        const remaining = Math.max(0, limit - currentCount);
        const success = currentCount <= limit;

        return {
          success,
          limit,
          remaining,
          resetSeconds: ttl > 0 ? ttl : windowSeconds,
        };
      }
    } catch (err) {
      console.warn('[RateLimiter] Upstash Redis request failed, falling back to local window store:', err);
    }
  }

  // 2. In-memory sliding window fallback
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const entry = inMemoryStore.get(identifier);

  if (!entry || now - entry.lastReset > windowMs) {
    inMemoryStore.set(identifier, { tokens: 1, lastReset: now });
    return {
      success: true,
      limit,
      remaining: limit - 1,
      resetSeconds: windowSeconds,
    };
  }

  entry.tokens += 1;
  const remaining = Math.max(0, limit - entry.tokens);
  const success = entry.tokens <= limit;
  const resetSeconds = Math.ceil((entry.lastReset + windowMs - now) / 1000);

  return {
    success,
    limit,
    remaining,
    resetSeconds: resetSeconds > 0 ? resetSeconds : windowSeconds,
  };
}

/**
 * Returns a secure HTTP 429 response with Retry-After header.
 * Omits internal stack traces, IP details, or Redis state.
 */
export function rateLimitResponse(resetSeconds: number): NextResponse {
  return new NextResponse(
    JSON.stringify({
      error: 'Too many requests. Please try again later.',
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': resetSeconds.toString(),
      },
    }
  );
}

/**
 * Utility to extract client IP safely for rate limiting identifier.
 */
export function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}
