import { FastifyRequest, FastifyReply } from 'fastify';
import { singleFileUpload } from '@interactors';
import { Logger, handleResponse, responseType } from '@helpers';

export interface UploadOptions {
  isPublic?: boolean;
  allowedMimeTypes?: string[];
  maxFileSize?: number;
  requireWorkspaceId?: boolean;
}

export interface UploadedFile {
  fileName: string;
  buffer: Buffer;
  mimetype: string;
}

export class UploadService {
  private static readonly DEFAULT_MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  private static readonly DEFAULT_ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  /**
   * Upload a file with configurable options
   */
  static async uploadFile(
    request: FastifyRequest,
    reply: FastifyReply,
    options: UploadOptions = {}
  ) {
    try {
      const {
        isPublic = false,
        allowedMimeTypes = this.DEFAULT_ALLOWED_MIME_TYPES,
        maxFileSize = this.DEFAULT_MAX_FILE_SIZE,
        requireWorkspaceId = false,
      } = options;

      // Validate workspace ID if required
      if (requireWorkspaceId && !request.headers['x-workspace-id']) {
        return handleResponse(request, reply, responseType?.BAD_REQUEST, {
          error: {
            message: 'Workspace ID is required for this upload',
          },
        });
      }

      // Get file from request
      const { file }: any = request.body;

      if (!file) {
        return handleResponse(request, reply, responseType?.BAD_REQUEST, {
          error: {
            message: 'No file provided',
          },
        });
      }

      // Validate file size
      if (file.data && file.data.length > maxFileSize) {
        return handleResponse(request, reply, responseType?.BAD_REQUEST, {
          error: {
            message: `File size exceeds maximum allowed size of ${maxFileSize / (1024 * 1024)}MB`,
          },
        });
      }

      // Validate MIME type
      if (!allowedMimeTypes.includes(file.mimetype)) {
        return handleResponse(request, reply, responseType?.BAD_REQUEST, {
          error: {
            message: `File type ${file.mimetype} is not allowed. Allowed types: ${allowedMimeTypes.join(', ')}`,
          },
        });
      }

      // Prepare file data
      const uploadedFile: UploadedFile = {
        fileName: file.filename,
        buffer: file.data || file._buf,
        mimetype: file.mimetype,
      };

      // Upload to S3
      const res: any = await singleFileUpload({
        uploadedFile,
      });

      // Log upload activity
      Logger.info(request, `File uploaded successfully: ${file.filename}`, 'UploadService');

      return handleResponse(request, reply, responseType?.OK, {
        data: {
          ...res.responseData,
          isPublic,
          uploadType: isPublic ? 'public' : 'private',
        },
      });
    } catch (error: any) {
      Logger.error(request, `Upload failed: ${error.message}`, error);
      return handleResponse(request, reply, responseType?.INTERNAL_SERVER_ERROR, {
        error: {
          message: 'File upload failed',
        },
      });
    }
  }

  /**
   * Upload workspace logo (public upload)
   */
  static async uploadWorkspaceLogo(request: FastifyRequest, reply: FastifyReply) {
    return this.uploadFile(request, reply, {
      isPublic: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      maxFileSize: 2 * 1024 * 1024, // 2MB for logos
      requireWorkspaceId: false,
    });
  }

  /**
   * Upload private workspace file
   */
  static async uploadPrivateFile(request: FastifyRequest, reply: FastifyReply) {
    return this.uploadFile(request, reply, {
      isPublic: false,
      requireWorkspaceId: true,
    });
  }
}
