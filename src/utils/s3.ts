import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { readFileSync } from 'fs';

export interface S3Blob {
  region: string;
  bucket: string;
  key: string;
}

export interface S3UploadResult {
  success: boolean;
  location?: string;
  error?: string;
}

export async function uploadToS3(
  filePath: string,
  destination: S3Blob
): Promise<S3UploadResult> {
  try {
    // Create S3 client
    const client = new S3Client({
      region: destination.region,
      // AWS credentials should be provided via environment variables:
      // AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_SESSION_TOKEN (optional)
    });

    // Read the file
    const fileContent = readFileSync(filePath);

    // Create the upload command
    const command = new PutObjectCommand({
      Bucket: destination.bucket,
      Key: destination.key,
      Body: fileContent,
      ContentType: 'video/mp4',
      // Optional: Set public-read ACL if needed
      // ACL: 'public-read',
    });

    // Upload the file
    const response = await client.send(command);

    // Construct the S3 URL
    const location = `https://${destination.bucket}.s3.${destination.region}.amazonaws.com/${destination.key}`;

    console.log(`Successfully uploaded to S3: ${location}`);
    
    return {
      success: true,
      location: location
    };

  } catch (error) {
    console.error('S3 upload failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown S3 upload error'
    };
  }
}

export function validateS3Blob(blob: any): blob is S3Blob {
  return (
    typeof blob === 'object' &&
    blob !== null &&
    typeof blob.region === 'string' &&
    typeof blob.bucket === 'string' &&
    typeof blob.key === 'string' &&
    blob.region.length > 0 &&
    blob.bucket.length > 0 &&
    blob.key.length > 0
  );
} 