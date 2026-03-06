import { apiFetch } from './api';

interface PresignResponse {
  uploadUrl: string;
  objectKey: string;
  expiresIn: number;
}

export async function getPresignedUrl(
  filename: string,
  contentType: string,
  context: 'post' | 'avatar' | 'entrepreneur',
): Promise<PresignResponse> {
  return apiFetch<PresignResponse>('/uploads/presign', {
    method: 'POST',
    body: JSON.stringify({ filename, contentType, context }),
  });
}

export async function uploadImage(presignedUrl: string, uri: string, contentType: string): Promise<void> {
  const response = await fetch(uri);
  const blob = await response.blob();
  await fetch(presignedUrl, {
    method: 'PUT',
    headers: { 'Content-Type': contentType },
    body: blob,
  });
}
