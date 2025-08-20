import { makeResponseSchema } from '@helpers';
import Schema, { JSONSchema } from 'fluent-json-schema';

const createResponse: JSONSchema = Schema.object()
  .prop('fileName', Schema.string())
  .prop('filePath', Schema.string())
  .prop('fileURL', Schema.string())
  .additionalProperties(true)
  .prop('meta', Schema.object().prop('message', Schema.string()))
  .valueOf() as JSONSchema;

const requestBody = Schema.object()
  .prop('file', Schema.raw({ description: 'Multipart file' }))
  .required(['file'])
  .valueOf() as JSONSchema;

const UPLOAD = {
  description:
    'The purpose of this schema is to define the structure and constraints for an API endpoint that uploads a file.',
  tags: ['UPLOADS'],
  headers: Schema.ref('commonHeaders').valueOf() as JSONSchema,
  body: requestBody,
  response: makeResponseSchema(createResponse),
};

export default { UPLOAD };
