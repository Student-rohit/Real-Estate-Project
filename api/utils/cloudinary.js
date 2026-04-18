import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Deletes a file from Cloudinary given its URL.
 * @param {string} fileUrl - The full Cloudinary URL of the image.
 */
export const deleteFileFromCloudinary = async (fileUrl) => {
  if (!fileUrl) return;

  try {
    // Cloudinary URL format: https://res.cloudinary.com/[cloud_name]/image/upload/v[version]/[public_id].[ext]
    // We need to extract the [public_id]
    const parts = fileUrl.split('/');
    const lastPart = parts[parts.length - 1]; // [public_id].[ext]
    const publicId = lastPart.split('.')[0];
    
    // If images are in folders, we might need more logic. 
    // Usually, it's everything after /upload/v[version]/ and before the extension.
    const uploadIndex = parts.indexOf('upload');
    if (uploadIndex !== -1) {
      // Skip 'upload' and the next part (version/transformations)
      const publicIdWithFolders = parts.slice(uploadIndex + 2).join('/').split('.')[0];
      await cloudinary.uploader.destroy(publicIdWithFolders);
      console.log(`Successfully deleted file from Cloudinary: ${publicIdWithFolders}`);
    } else {
      await cloudinary.uploader.destroy(publicId);
      console.log(`Successfully deleted file from Cloudinary: ${publicId}`);
    }
  } catch (error) {
    console.error('Error deleting file from Cloudinary:', error.message);
  }
};
