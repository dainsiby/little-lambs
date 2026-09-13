import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { getUserAddresses, createAddress } from '@/lib/addresses/addressService';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const addresses = await getUserAddresses(session.user.id);
    return NextResponse.json({ addresses });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch addresses' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const address = await createAddress(session.user.id, body);
    return NextResponse.json({ address }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Invalid address data' }, { status: 400 });
  }
}
