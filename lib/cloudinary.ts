import { v2 as cloudinary } from "cloudinary";
import { env } from "./env";

let configured = false;

function ensureCloudinaryConfigured(): void {
  if (configured) return;
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true
  });
  configured = true;
}

function assertValidCloudinaryCloudName(cloudName: string | undefined): void {
  if (!cloudName) return;
  if (cloudName.toLowerCase() === "portfolio") {
    throw new Error(
      "CLOUDINARY_CLOUD_NAME is set to \"portfolio\", but that is the folder prefix inside public IDs (portfolio/…), not your Cloudinary account cloud name. Copy the Cloud name from your Cloudinary dashboard (Settings) into CLOUDINARY_CLOUD_NAME."
    );
  }
}

function formatCloudinaryUploadError(error: unknown): Error {
  const base = error instanceof Error ? error : new Error(String(error));
  if (base.message.toLowerCase().includes("cloud_name")) {
    return new Error(
      `${base.message} — Check CLOUDINARY_CLOUD_NAME: it must be your account cloud name from the Cloudinary dashboard, not the "portfolio" folder used in image public IDs.`
    );
  }
  return base;
}

export async function uploadScreenshotToCloudinary(
  imageBuffer: Buffer,
  publicId: string
): Promise<string> {
  if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
    throw new Error("Cloudinary credentials are missing.");
  }
  assertValidCloudinaryCloudName(env.CLOUDINARY_CLOUD_NAME);
  ensureCloudinaryConfigured();

  const uploaded = await new Promise<{ secure_url: string }>((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      {
        public_id: publicId,
        overwrite: true,
        resource_type: "image",
        format: "png"
      },
      (error, result) => {
        if (error || !result) {
          reject(formatCloudinaryUploadError(error ?? new Error("Cloudinary upload failed")));
          return;
        }
        resolve({ secure_url: result.secure_url });
      }
    );
    upload.end(imageBuffer);
  });
  return uploaded.secure_url;
}
