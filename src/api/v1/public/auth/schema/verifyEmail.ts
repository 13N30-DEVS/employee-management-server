import Schema, { JSONSchema } from 'fluent-json-schema';
import { makeResponseSchema } from '@helpers';

const emailRequestBody = Schema.object()
  .prop('emailId', Schema.string().format('email').required())
  .valueOf() as JSONSchema;

const emailResponse = Schema.object().prop('message', Schema.string()).valueOf() as JSONSchema;

export const CHECK_EMAIL = {
  description: 'Check if email exists',
  tags: ['AUTH'],
  body: emailRequestBody,
  response: makeResponseSchema(emailResponse),
};
