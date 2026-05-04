import { v2 as cloudinary } from "cloudinary";
import { env } from "./env";
import { buildCloudinaryDeliveryUrl } from "./screenshot-store";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true
});

export async function uploadScreenshotToCloudinary(
  imageBuffer: Buffer,
  publicId: string
): Promise<string> {
  if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
    throw new Error("Cloudinary credentials are missing.");
  }
  const uploaded = await new Promise<{ secure_url: string }>((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      {
        public_id: publicId,
        overwrite: true,
        resource_type: "image",
        format: "png",
        folder: undefined
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed"));
          return;
        }
        resolve({ secure_url: result.secure_url });
      }
    );
    upload.end(imageBuffer);
  });
  return uploaded.secure_url;
}

export async function getCloudinaryScreenshotUrl(publicId: string): Promise<string | null> {
  if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
    return null;
  }
  try {
    const resource = await cloudinary.api.resource(publicId, { resource_type: "image" });
    return resource.secure_url ?? buildCloudinaryDeliveryUrl(env.CLOUDINARY_CLOUD_NAME, publicId);
  } catch {
    return null;
  }
}
