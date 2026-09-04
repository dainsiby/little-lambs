import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary from server environment
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo',
  api_key: process.env.CLOUDINARY_API_KEY || '1234567890',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'secret',
  secure: true,
});

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export interface UploadResult {
  imageUrl: string;
  storageKey: string;
}

/**
 * Validates binary file buffer magic bytes for JPEG, PNG, or WebP format
 */
export function validateImageBuffer(buffer: Buffer, mimeType: string): boolean {
  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    return false;
  }

  if (buffer.length === 0 || buffer.length > MAX_FILE_SIZE_BYTES) {
    return false;
  }

  // Magic Byte Inspections
  // JPEG: 0xFF 0xD8 0xFF
  if (mimeType === 'image/jpeg') {
    return buffer.length > 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }

  // PNG: 0x89 0x50 0x4E 0x47
  if (mimeType === 'image/png') {
    return (
      buffer.length > 4 &&
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47
    );
  }

  // WebP: RIFF ... WEBP
  if (mimeType === 'image/webp') {
    return (
      buffer.length > 12 &&
      buffer.toString('ascii', 0, 4) === 'RIFF' &&
      buffer.toString('ascii', 8, 12) === 'WEBP'
    );
  }

  return false;
}

/**
 * Uploads an image buffer to Cloudinary managed object storage
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  folder = 'little-lambs/books'
): Promise<UploadResult> {
  // Fallback / mock mode for local testing if Cloudinary is unconfigured
  if (!process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME === 'demo') {
    const mockId = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}`;
    return {
      imageUrl: '/books/little-lambs-activity-book/cover-front.jpg',
      storageKey: mockId,
    };
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
      },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error('Upload failed'));
        }
        resolve({
          imageUrl: result.secure_url,
          storageKey: result.public_id,
        });
      }
    );
    uploadStream.end(buffer);
  });
}

/**
 * Removes an image asset from Cloudinary managed object storage
 */
export async function deleteFromCloudinary(storageKey: string): Promise<boolean> {
  if (!process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME === 'demo') {
    return true;
  }

  try {
    const result = await cloudinary.uploader.destroy(storageKey);
    return result.result === 'ok';
  } catch (error) {
    console.error('Error deleting asset from Cloudinary:', error);
    return false;
  }
}
