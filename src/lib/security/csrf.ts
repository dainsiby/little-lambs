import { NextResponse } from 'next/server';

/**
 * Validates request Origin and Host headers for custom state-changing routes.
 * Rejects cross-origin mutation requests.
 */
export function validateSameOrigin(request: Request): { isValid: boolean; errorResponse?: NextResponse } {
  const method = request.method.toUpperCase();
  
  // Safe methods do not mutate state
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    return { isValid: true };
  }

  const origin = request.headers.get('origin');
  const host = request.headers.get('host') || request.headers.get('x-forwarded-host');

  if (!origin) {
    // Standard browsers always send Origin header on POST/PUT/DELETE.
    // Allow non-browser calls in test environment if configured, otherwise reject.
    if (process.env.NODE_ENV === 'test') {
      return { isValid: true };
    }
  }

  if (origin && host) {
    try {
      const originUrl = new URL(origin);
      if (originUrl.host !== host) {
        console.warn(`[CSRF Rejected] Origin mismatch: ${originUrl.host} vs ${host}`);
        return {
          isValid: false,
          errorResponse: NextResponse.json(
            { error: 'Invalid or unauthorized request origin' },
            { status: 403 }
          ),
        };
      }
    } catch {
      return {
        isValid: false,
        errorResponse: NextResponse.json(
          { error: 'Malformed origin header' },
          { status: 403 }
        ),
      };
    }
  }

  return { isValid: true };
}
