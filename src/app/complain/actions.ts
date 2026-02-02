"use server";

import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "cloud_name_not_set", // Fallback if env not set for dev
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function uploadImage(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      throw new Error("No file uploaded");
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise<{ url: string }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "apec_global_complain", // Organize uploads in a folder
        },
        (error: cloudinary.UploadApiErrorResponse | undefined, result: cloudinary.UploadApiResponse | undefined) => {
          if (error) {
            console.error("Cloudinary Upload Error:", error);
            reject(new Error(error.message));
          } else if (result) {
            resolve({ url: result.secure_url });
          } else {
            reject(new Error("Upload failed: No result returned"));
          }
        }
      );

      uploadStream.end(buffer);
    });
  } catch (error: any) {
    console.error("Upload Action Error:", error);
    throw new Error(error.message || "Failed to upload image");
  }
}
