import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { requireAdmin } from '@/lib/auth/guard';
import { validateSameOrigin } from '@/lib/security/csrf';
import { validateImageBuffer, uploadToCloudinary } from '@/lib/storage/cloudinary';
import { prisma } from '@/lib/db/prisma';
import { ImageType } from '@prisma/client';

export async function POST(request: Request) {
  // CSRF / Origin Header Check
  const csrfCheck = validateSameOrigin(request);
  if (!csrfCheck.isValid && csrfCheck.errorResponse) {
    return csrfCheck.errorResponse;
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  }

  // Direct DB Role Verification
  const admin = await requireAdmin(session.user.id);
  if (!admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const bookId = formData.get('bookId') as string | null;
    const altText = (formData.get('altText') as string) || 'Book Image';
    const type = ((formData.get('type') as string) || 'COVER_FRONT') as ImageType;

    if (!file || !bookId) {
      return NextResponse.json({ error: 'File and bookId are required' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Validate MIME, magic bytes, and file size (max 5 MB)
    if (!validateImageBuffer(buffer, file.type)) {
      return NextResponse.json(
        { error: 'Invalid file. Must be a JPEG, PNG, or WebP image under 5 MB.' },
        { status: 400 }
      );
    }

    // Upload to Cloudinary Managed Storage
    const uploadResult = await uploadToCloudinary(buffer);

    // Link DB BookImage Record
    const bookImage = await prisma.bookImage.create({
      data: {
        bookId,
        imageUrl: uploadResult.imageUrl,
        storageKey: uploadResult.storageKey,
        altText,
        type,
      },
    });

    // Record AuditLog
    await prisma.auditLog.create({
      data: {
        actorUserId: admin.id,
        action: 'IMAGE_UPLOAD',
        entityType: 'BookImage',
        entityId: bookImage.id,
        payload: { bookId, storageKey: uploadResult.storageKey },
      },
    });

    return NextResponse.json({ image: bookImage }, { status: 201 });
  } catch (error) {
    console.error('Error in image upload handler:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
