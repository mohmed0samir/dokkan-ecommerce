/**
 * Image upload utilities for Dokkan E-Commerce Platform
 * Converts images to Data URLs and stores in Firestore
 * Based on dawaok reference implementation
 */

export interface ImageUploadOptions {
  maxSizeMB?: number;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  allowedTypes?: string[];
  name?: string;
  maxImages?: number;
}

export interface ImageUploadResult {
  dataUrl: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  width: number;
  height: number;
}

export interface ImageUploadError {
  code: string;
  message: string;
}

/**
 * Compresses and converts an image file to a Data URL
 */
export async function compressImageToDataUrl(
  file: File,
  options: ImageUploadOptions = {}
): Promise<ImageUploadResult> {
  const {
    maxSizeMB = 1,
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.8,
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  } = options;

  // Validate file type
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`Unsupported file type: ${file.type}. Allowed: ${allowedTypes.join(', ')}`);
  }

  // Validate file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    throw new Error(`File size exceeds ${maxSizeMB}MB limit`);
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };

    img.onload = () => {
      try {
        // Calculate new dimensions
        let { width, height } = img;
        const maxDimension = Math.max(maxWidth, maxHeight);

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        // Create canvas and draw compressed image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Failed to get canvas context');
        }

        // Draw image with white background for transparency handling
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to Data URL
        const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const finalQuality = mimeType === 'image/png' ? 1 : (options.quality ?? 0.8);
        const dataUrl = canvas.toDataURL(mimeType, finalQuality);

        // Check Data URL size (approximate)
        const dataUrlSizeBytes = Math.round((dataUrl.length * 3) / 4);
        const maxDataUrlSizeBytes = 1024 * 1024; // ~1MB limit for Firestore document

        if (dataUrlSizeBytes > maxDataUrlSizeBytes) {
          throw new Error(`Compressed image exceeds ${maxDataUrlSizeBytes / 1024 / 1024}MB limit for Firestore storage`);
        }

        resolve({
          dataUrl,
          originalName: file.name,
          mimeType,
          sizeBytes: dataUrlSizeBytes,
          width,
          height,
        });
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Validates an image file before upload
 */
export function validateImageFile(file: File, options: ImageUploadOptions = {}): ImageUploadError | null {
  const {
    maxSizeMB = 1,
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  } = options;

  if (!allowedTypes.includes(file.type)) {
    return {
      code: 'INVALID_TYPE',
      message: `Unsupported file type: ${file.type}. Allowed: JPEG, PNG, WebP`,
    };
  }

  const maxSizeBytes = options.maxSizeMB ? options.maxSizeMB * 1024 * 1024 : 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      code: 'FILE_TOO_LARGE',
      message: `File size exceeds ${options.maxSizeMB || 1}MB limit`,
    };
  }

  return null;
}

/**
 * Converts a Data URL back to a Blob for downloading
 */
export function dataUrlToBlob(dataUrl: string): Blob {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

/**
 * Generates a unique filename for the image
 */
export function generateImageFileName(originalName: string, prefix = 'product'): string {
  const ext = originalName.split('.').pop()?.toLowerCase() || 'jpg';
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}_${random}.${ext}`;
}

/**
 * Checks if a Data URL is valid
 */
export function isValidDataUrl(dataUrl: string): boolean {
  return /^data:image\/(jpeg|png|webp);base64,/.test(dataUrl);
}

/**
 * Gets image dimensions from a Data URL
 */
export function getImageDimensions(dataUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = dataUrl;
  });
}