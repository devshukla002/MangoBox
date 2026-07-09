import { v2 as cloudinary } from 'cloudinary';

let isConfigured = false;

export function getCloudinary() {
  const cloudinaryUrl = process.env.CLOUDINARY_URL;
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudinaryUrl && (!cloudName || !apiKey || !apiSecret)) {
    console.warn('Cloudinary credentials missing in environment variables. Uploads will run in mock mode.');
    return null;
  }

  if (!isConfigured) {
    if (cloudinaryUrl) {
      // Cloudinary SDK automatically parses process.env.CLOUDINARY_URL, but we can initialize it explicitly
      cloudinary.config();
    } else {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
      });
    }
    isConfigured = true;
  }

  return cloudinary;
}

export async function uploadToCloudinary(fileBuffer: Buffer, mimeType: string): Promise<string> {
  const client = getCloudinary();
  if (!client) {
    // Graceful fallback: return a placeholder data URI or local mock URL
    console.log('Mock uploading file to Cloudinary...');
    return `data:${mimeType};base64,${fileBuffer.toString('base64').substring(0, 100)}...mock_cloudinary_upload`;
  }

  return new Promise((resolve, reject) => {
    const uploadStream = client.uploader.upload_stream(
      {
        folder: 'mangobox',
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result?.secure_url || '');
      }
    );
    uploadStream.end(fileBuffer);
  });
}
