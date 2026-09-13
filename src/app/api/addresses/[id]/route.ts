import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { updateAddress, deleteAddress, setDefaultAddress } from '@/lib/addresses/addressService';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await req.json();

    if (body.action === 'setDefault') {
      const address = await setDefaultAddress(session.user.id, id);
      return NextResponse.json({ address });
    }

    const address = await updateAddress(session.user.id, id, body);
    return NextResponse.json({ address });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update address' }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const result = await deleteAddress(session.user.id, id);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete address' }, { status: 400 });
  }
}
