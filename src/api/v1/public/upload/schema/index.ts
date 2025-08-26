import { makeResponseSchema } from '@helpers';
import Schema, { JSONSchema } from 'fluent-json-schema';

const createResponse: JSONSchema = Schema.object()
  .prop('fileName', Schema.string())
  .prop('filePath', Schema.string())
  .prop('fileURL', Schema.string())
  .prop('isPublic', Schema.boolean())
  .prop('uploadType', Schema.string())
  .additionalProperties(true)
  .prop('meta', Schema.object().prop('message', Schema.string()))
  .valueOf() as JSONSchema;

const requestBody = Schema.object()
  .prop('file', Schema.raw({ description: 'Multipart image file (JPEG, PNG, GIF, WebP)' }))
  .required(['file'])
  .valueOf() as JSONSchema;

const UPLOAD_WORKSPACE_LOGO = {
  description: 'Upload workspace logo without authentication. Accepts image files up to 2MB.',
  tags: ['UPLOADS', 'PUBLIC'],
  body: requestBody,
  response: makeResponseSchema(createResponse),
};

export default { UPLOAD_WORKSPACE_LOGO };
