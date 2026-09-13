export interface FileValidationResult {
  valid: boolean;
  error?: string;
  detectedType?: string;
  sanitizedFilename?: string;
}

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * Inspects binary buffer magic bytes to determine actual file type.
 */
export function detectMagicBytesType(buffer: Buffer): string | null {
  if (buffer.length < 12) return null;

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return 'image/jpeg';
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return 'image/png';
  }

  // WEBP: RIFF (bytes 0..3 = 52 49 46 46) and WEBP (bytes 8..11 = 57 45 42 50)
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return 'image/webp';
  }

  return null;
}

/**
 * Validates uploaded image file buffer against file size, MIME type, magic bytes, and extension whitelist.
 * Explicitly rejects SVG (XSS vector), HTML, JS, PHP, and executable payloads.
 */
export function validateUploadedImage(
  buffer: Buffer,
  originalFilename: string,
  declaredMimeType: string
): FileValidationResult {
  // 1. Check file size
  if (buffer.length > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size exceeds maximum allowed limit of ${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB`,
    };
  }

  if (buffer.length === 0) {
    return { valid: false, error: 'Empty file provided' };
  }

  // 2. Reject SVG, HTML, or Script filenames explicitly
  const lowerName = originalFilename.toLowerCase();
  if (
    lowerName.endsWith('.svg') ||
    lowerName.endsWith('.html') ||
    lowerName.endsWith('.htm') ||
    lowerName.endsWith('.js') ||
    lowerName.endsWith('.php') ||
    lowerName.endsWith('.exe') ||
    lowerName.endsWith('.sh')
  ) {
    return { valid: false, error: 'File type not permitted for upload' };
  }

  // 3. Check declared MIME type
  if (!ALLOWED_MIME_TYPES.has(declaredMimeType.toLowerCase())) {
    return { valid: false, error: `Invalid MIME type '${declaredMimeType}'. Only JPEG, PNG, WEBP are allowed.` };
  }

  // 4. Verify Magic Bytes
  const magicType = detectMagicBytesType(buffer);
  if (!magicType) {
    return { valid: false, error: 'File content header does not match any allowed image format.' };
  }

  if (magicType !== declaredMimeType.toLowerCase()) {
    // Treat mismatch as spoofing attempt
    return {
      valid: false,
      error: `File content header (${magicType}) does not match declared content type (${declaredMimeType}).`,
    };
  }

  // 5. Sanitize extension and filename
  const lastDot = lowerName.lastIndexOf('.');
  const ext = lastDot !== -1 ? lowerName.substring(lastDot) : '.png';
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return { valid: false, error: `Invalid file extension '${ext}'.` };
  }

  const cleanBasename = originalFilename
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .substring(0, 50);
  const sanitizedFilename = `${cleanBasename}_${Date.now()}${ext}`;

  return {
    valid: true,
    detectedType: magicType,
    sanitizedFilename,
  };
}
