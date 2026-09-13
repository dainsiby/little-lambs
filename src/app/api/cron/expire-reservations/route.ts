import { NextResponse } from 'next/server';
import { expireStaleReservations } from '@/lib/orders/expirationService';
import { auth } from '@/lib/auth/auth';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const authHeader = req.headers.get('authorization');
  const secretParam = url.searchParams.get('secret');

  const cronSecret = process.env.CRON_SECRET;
  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction && !cronSecret) {
    console.error('[CRON Guard Error] CRON_SECRET is unconfigured in production.');
    return NextResponse.json({ error: 'Cron secret unconfigured.' }, { status: 500 });
  }

  const activeSecret = cronSecret || 'dev_cron_secret_key';
  const isBearerValid = authHeader === `Bearer ${activeSecret}`;
  const isQueryValid = secretParam === activeSecret;

  // Allow authenticated ADMIN users
  const session = await auth();
  const isAdmin = (session?.user as { role?: string })?.role === 'ADMIN';

  if (!isBearerValid && !isQueryValid && !isAdmin) {
    return NextResponse.json({ error: 'Unauthorized cron execution.' }, { status: 401 });
  }

  try {
    const result = await expireStaleReservations();
    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Cron execution failed.' }, { status: 500 });
  }
}
