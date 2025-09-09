import * as aws from 'aws-sdk';
import { env } from '@config';
import { Logger } from './logger';

// Configure AWS SDK
const s3Config: aws.ConfigurationOptions = {
  accessKeyId: env.AWS_ACCESS_KEY,
  secretAccessKey: env.AWS_SECRET,
  region: env.AWS_REGION,
  signatureVersion: 'v4',
  s3ForcePathStyle: true, // For MinIO compatibility
};

// Set custom endpoint if provided
if (env.S3_URL && env.S3_URL !== 'https://s3.amazonaws.com') {
  (s3Config as any).endpoint = env.S3_URL;
}

aws.config.update(s3Config);

const s3 = new aws.S3();

// File validation constants
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
];

interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

interface S3UploadResult {
  status: number;
  type: 'Success' | 'Error';
  filePath?: string;
  fileURL?: string;
  errorData?: any;
}

/**
 * Validates file before upload
 * @param file - The file to validate
 * @returns FileValidationResult
 */
function validateFile(file: any): FileValidationResult {
  if (!file || !file.buffer) {
    return { isValid: false, error: 'No file provided' };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File size exceeds maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
    };
  }

  if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    return {
      isValid: false,
      error: `File type ${file.mimetype} is not allowed`,
    };
  }

  return { isValid: true };
}

/**
 * Generates a secure filename
 * @param _originalName - Original filename
 * @param fileType - File type
 * @returns string
 */
function generateSecureFilename(_originalName: string, fileType: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = fileType.split('/')[1] || 'bin';
  return `${timestamp}_${randomString}.${extension}`;
}

/**
 * Uploads a file to S3 Bucket with validation and security
 * @param file - The file buffer to be uploaded
 * @param request - Fastify request object for logging
 * @returns Promise<S3UploadResult>
 * @throws {Error}
 */
export const s3Upload = async (file: any, request?: any): Promise<S3UploadResult> => {
  try {
    // Validate file
    const validation = validateFile(file);
    if (!validation.isValid) {
      Logger.warning(request, `File validation failed: ${validation.error}`);
      return {
        status: 400,
        type: 'Error',
        errorData: { message: validation.error },
      };
    }

    // Generate secure filename
    const fileType = file.mimetype?.toString()?.split('/')?.[1] ?? 'bin';
    const fileName = generateSecureFilename(file.originalname || 'file', fileType);

    // S3 upload parameters
    const s3Params: aws.S3.PutObjectRequest = {
      Bucket: env.AWS_BUCKET_NAME,
      Key: `uploads/${fileName}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      Metadata: {
        originalName: file.originalname || 'unknown',
        uploadedAt: new Date().toISOString(),
        uploadedBy: (request?.user as any)?.id || 'anonymous',
      },
      // Security headers
      ServerSideEncryption: 'AES256',
      ACL: 'private', // Make files private by default
    };

    // Upload to S3
    await s3.putObject(s3Params).promise();

    // Generate file URL (consider using presigned URLs for private files)
    // Remove protocol from S3_URL to avoid double https://
    const s3Host = env.S3_URL.replace(/^https?:\/\//, '');
    const fileURL = `https://${env.AWS_BUCKET_NAME}.${s3Host}/${s3Params.Key}`;

    Logger.info(request, `File uploaded successfully: ${fileName}`);

    return {
      status: 200,
      type: 'Success',
      filePath: s3Params.Key,
      fileURL,
    };
  } catch (error: any) {
    Logger.error(request, `S3 upload failed: ${error.message}`, error);

    return {
      status: 500,
      type: 'Error',
      errorData: {
        message: 'File upload failed',
        error: error.message,
      },
    };
  }
};

/**
 * Deletes a file from S3 Bucket
 * @param filePath - The file path to delete
 * @param request - Fastify request object for logging
 * @returns Promise<boolean>
 */
export const s3Delete = async (filePath: string, request?: any): Promise<boolean> => {
  try {
    const deleteParams: aws.S3.DeleteObjectRequest = {
      Bucket: env.AWS_BUCKET_NAME,
      Key: filePath,
    };

    await s3.deleteObject(deleteParams).promise();

    Logger.info(request, `File deleted successfully: ${filePath}`);
    return true;
  } catch (error: any) {
    Logger.error(request, `S3 delete failed: ${error.message}`, error);
    return false;
  }
};

/**
 * Generates a presigned URL for private file access
 * @param filePath - The file path
 * @param expiresIn - Expiration time in seconds (default: 1 hour)
 * @returns Promise<string>
 */
export const generatePresignedURL = async (
  filePath: string,
  expiresIn: number = 3600
): Promise<string> => {
  try {
    const params = {
      Bucket: env.AWS_BUCKET_NAME,
      Key: filePath,
      Expires: expiresIn,
    };

    return s3.getSignedUrl('getObject', params);
  } catch (error: any) {
    throw new Error(`Failed to generate presigned URL: ${error.message}`);
  }
};

export { s3 };
