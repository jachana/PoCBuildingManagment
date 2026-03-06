import { S3Client, CreateBucketCommand, HeadBucketCommand, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const MINIO_ENDPOINT = process.env.MINIO_ENDPOINT || 'localhost';
const MINIO_PORT = parseInt(process.env.MINIO_PORT || '9000');
const MINIO_ACCESS_KEY = process.env.MINIO_ACCESS_KEY || 'minioadmin';
const MINIO_SECRET_KEY = process.env.MINIO_SECRET_KEY || 'minioadmin';
const MINIO_BUCKET = process.env.MINIO_BUCKET || 'socialbuilding';
const MINIO_USE_SSL = process.env.MINIO_USE_SSL === 'true';

const s3 = new S3Client({
  endpoint: `${MINIO_USE_SSL ? 'https' : 'http'}://${MINIO_ENDPOINT}:${MINIO_PORT}`,
  region: 'us-east-1',
  credentials: {
    accessKeyId: MINIO_ACCESS_KEY,
    secretAccessKey: MINIO_SECRET_KEY,
  },
  forcePathStyle: true,
});

export async function ensureBucket(): Promise<void> {
  try {
    await s3.send(new HeadBucketCommand({ Bucket: MINIO_BUCKET }));
  } catch {
    await s3.send(new CreateBucketCommand({ Bucket: MINIO_BUCKET }));
    console.log(`Created bucket: ${MINIO_BUCKET}`);
  }
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZES: Record<string, number> = {
  post: 5 * 1024 * 1024,
  avatar: 2 * 1024 * 1024,
  entrepreneur: 5 * 1024 * 1024,
};

export async function generatePresignedUploadUrl(
  objectKey: string,
  contentType: string,
  context: string,
): Promise<string> {
  if (!ALLOWED_TYPES.includes(contentType)) {
    throw new Error(`Invalid content type: ${contentType}`);
  }
  const maxSize = MAX_SIZES[context];
  if (!maxSize) {
    throw new Error(`Invalid upload context: ${context}`);
  }

  const command = new PutObjectCommand({
    Bucket: MINIO_BUCKET,
    Key: objectKey,
    ContentType: contentType,
  });
  return getSignedUrl(s3, command, { expiresIn: 900 });
}

export async function generatePresignedGetUrl(objectKey: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: MINIO_BUCKET,
    Key: objectKey,
  });
  return getSignedUrl(s3, command, { expiresIn: 3600 });
}
