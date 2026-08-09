import { supabase } from './supabaseClient';

/**
 * Uploads an image to a Supabase Storage bucket and returns the public URL.
 * 
 * @param {File} file - The file object to upload
 * @param {string} folder - Optional folder name within the bucket (e.g., 'products', 'categories')
 * @param {string} bucket - The name of the storage bucket (default: 'public-images')
 * @returns {Promise<string>} The public URL of the uploaded image
 */
export const uploadImage = async (file, folder = 'general', bucket = 'public-images') => {
  if (!file) {
    throw new Error('No file provided for upload.');
  }

  // Create a unique file name to prevent collisions
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  // Upload the file
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Storage upload error:', error);
    throw new Error(error.message);
  }

  // Get the public URL
  const { data: publicUrlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
};
