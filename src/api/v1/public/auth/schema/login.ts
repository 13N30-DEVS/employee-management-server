import Schema, { JSONSchema } from "fluent-json-schema";

import { makeResponseSchema } from "@helpers";
// BODY SCHEMA
// ============================================================
// Sign In and Prevalidate Body Schema
const signInBody = Schema.object()
  .prop("emailId", Schema.string().required())
  .prop("password", Schema.string().required())
  .valueOf() as JSONSchema;

// RESPONSE SCHEMA
// ====================================================================
// Response Schema of Sign In
const signInResponse: JSONSchema = Schema.object()
  .prop("token", Schema.string())
  .prop("meta", Schema.object().prop("message", Schema.string()))
  .valueOf() as JSONSchema;

// =========================================================
// SIGN IN
export const SIGN_IN = {
  description:
    "The purpose of this schema is to define the structure and constraints for an API endpoint that logs in a user.",
  tags: ["AUTH"],
  body: signInBody,
  response: makeResponseSchema(signInResponse),
};
