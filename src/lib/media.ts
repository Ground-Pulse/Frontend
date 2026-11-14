/**
 * Media upload (photos/videos for checklist items, issues, repairs, covers).
 *
 * Real backend: ask the API for a pre-signed S3 URL, PUT the file straight to
 * S3, then store the returned public/CDN URL (TRD TR-006).
 *
 * Mock mode: images are downscaled in the browser and stored as data URLs so
 * the demo works offline and survives a reload.
 */
import { apiClient } from "./apiClient";
import { config } from "./config";
import { GroundPulseError } from "./errors";

export const MAX_UPLOAD_MB = 25;

function downscaleImage(file: File, maxSide = 900, quality = 0.72): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new GroundPulseError("VALIDATION_ERROR", "That image couldn't be read.", 400));
    };
    img.src = url;
  });
}

export async function uploadMedia(file: File): Promise<string> {
  if (file.size > MAX_UPLOAD_MB * 1024 * 1024) {
    throw new GroundPulseError("VALIDATION_ERROR", `Files must be under ${MAX_UPLOAD_MB} MB.`, 400);
  }
  const isImage = file.type.startsWith("image/");
  const isVideo = file.type.startsWith("video/");
  if (!isImage && !isVideo && file.type !== "application/pdf") {
    throw new GroundPulseError("VALIDATION_ERROR", "Only photos, videos or PDFs can be uploaded.", 400);
  }

  if (config.useMockApi) {
    if (isImage) return downscaleImage(file);
    // Videos/PDFs are too big for localStorage — keep a session-only blob URL.
    return URL.createObjectURL(file) + (isVideo ? "#video" : "#file");
  }

  const { uploadUrl, publicUrl } = await apiClient.post<{ uploadUrl: string; publicUrl: string }>(
    "/media/presign",
    { fileName: file.name, contentType: file.type, size: file.size }
  );
  const put = await fetch(uploadUrl, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
  if (!put.ok) throw new GroundPulseError("NETWORK_ERROR", "Upload failed. Please retry.", put.status);
  return publicUrl;
}

export const isVideoUrl = (url: string) =>
  /\.(mp4|webm|mov|m4v)(\?|$)/i.test(url) || url.startsWith("data:video") || url.includes("#video");
