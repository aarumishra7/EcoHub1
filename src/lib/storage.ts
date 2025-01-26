import { supabase } from './supabase';

const BUCKET_NAME = 'materials';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export interface UploadResult {
  url: string;
  error?: string;
}

export const uploadMaterialImages = async (
  files: File[],
  userId: string
): Promise<UploadResult[]> => {
  try {
    const results: UploadResult[] = [];

    // Process files in parallel with a limit of 3 concurrent uploads
    const chunks = chunk(files, 3);
    for (const chunk of chunks) {
      const uploadPromises = chunk.map(async (file) => {
        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
          return {
            url: '',
            error: `File ${file.name} exceeds 5MB limit`
          };
        }

        // Validate file type
        if (!ALLOWED_MIME_TYPES.includes(file.type)) {
          return {
            url: '',
            error: `File ${file.name} has invalid type. Only JPEG, PNG, and WebP images are allowed`
          };
        }

        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

        // Upload file
        const { error: uploadError, data } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(fileName);

        return { url: publicUrl };
      });

      const chunkResults = await Promise.all(uploadPromises);
      results.push(...chunkResults);
    }

    return results;
  } catch (error) {
    console.error('Error uploading images:', error);
    return [{
      url: '',
      error: error instanceof Error ? error.message : 'Failed to upload images'
    }];
  }
};

export const deleteMaterialImages = async (urls: string[]): Promise<{ error?: string }> => {
  try {
    const paths = urls.map(url => {
      const path = url.split(`${BUCKET_NAME}/`)[1];
      if (!path) throw new Error('Invalid file URL');
      return path;
    });

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove(paths);

    if (error) throw error;
    return {};
  } catch (error) {
    console.error('Error deleting images:', error);
    return {
      error: error instanceof Error ? error.message : 'Failed to delete images'
    };
  }
};

// Helper function to chunk array into smaller arrays
const chunk = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};