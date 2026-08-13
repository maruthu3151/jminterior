// Storage service for handling image Base64 encoding / Supabase storage uploads

export const uploadImage = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    // If file size exceeds 5MB, warn or resolve Base64 directly
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to encode image'));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

export const isValidUrl = (url: string): boolean => {
  try {
    if (url.startsWith('data:image/')) return true;
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
