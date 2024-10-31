import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

export const setupCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
};

export const uploadToCloudinary = (fileBuffer: Buffer, filename: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: 'paymentProofs', resource_type: 'auto', public_id: filename },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error('Upload failed'));
        } else {
          resolve(result.secure_url);
        }
      }
    ).end(fileBuffer);
  });
};