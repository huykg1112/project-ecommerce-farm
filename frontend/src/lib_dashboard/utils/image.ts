// Utility functions for image type detection and validation

export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/gif',
  'image/webp',
  'image/bmp'
] as const;

export type SupportedImageType = typeof SUPPORTED_IMAGE_TYPES[number];

export function isSupportedImageType(mimeType: string): mimeType is SupportedImageType {
  return SUPPORTED_IMAGE_TYPES.includes(mimeType as SupportedImageType);
}

export function getImageTypeFromExtension(filename: string): string {
  const extension = filename.toLowerCase().split('.').pop();
  
  const extensionMap: { [key: string]: string } = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'bmp': 'image/bmp',
    'svg': 'image/svg+xml',
    'ico': 'image/x-icon',
    'tiff': 'image/tiff',
    'tif': 'image/tiff'
  };

  return extensionMap[extension || ''] || 'image/jpeg';
}

export function validateImageFile(file: File): { isValid: boolean; error?: string } {
  // Check file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    return { isValid: false, error: 'Kích thước file quá lớn. Tối đa 10MB.' };
  }

  // Check if it's an image file
  if (!file.type.startsWith('image/')) {
    return { isValid: false, error: 'File không phải là hình ảnh.' };
  }

  // Check if the image type is supported
  if (!isSupportedImageType(file.type)) {
    return { 
      isValid: false, 
      error: `Định dạng ${file.type} không được hỗ trợ. Vui lòng sử dụng JPG, PNG, GIF, hoặc WebP.` 
    };
  }

  return { isValid: true };
}

// Base64 signature detection for additional validation
export function detectMimeTypeFromBase64(base64Data: string): string {
  const signatures: { [key: string]: string } = {
    '/9j/': 'image/jpeg',
    'iVBORw0KGgo': 'image/png',
    'R0lGOD': 'image/gif',
    'UklGR': 'image/webp',
    'Qk0': 'image/bmp',
    'AAAB': 'image/x-icon',
  };

  for (const [signature, mimeType] of Object.entries(signatures)) {
    if (base64Data.startsWith(signature)) {
      return mimeType;
    }
  }

  return 'image/jpeg'; // Default fallback
}

export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result?.toString().split(",")[1] || "");
    reader.onerror = (error) => reject(error);
  });
}
