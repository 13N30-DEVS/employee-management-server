import Schema, { JSONSchema } from "fluent-json-schema";

import { makeResponseSchema } from "@helpers";
// BODY SCHEMA
// ============================================================
// Sign Up and Prevalidate Body Schema
const signUpBody = Schema.object()
  .prop("emailId", Schema.string().required())
  .prop("workspaceName", Schema.string().required())
  .prop("adminName", Schema.string().required())
  .prop("workspaceLogo", Schema.string().required())
  .prop("password", Schema.string().required())
  .prop("role", Schema.number().required())
  .prop("departments", Schema.array().items(Schema.number()).required())
  .prop("designations", Schema.array().items(Schema.number()).required())
  .prop(
    "shifts",
    Schema.array()
      .items(
        Schema.object()
          .prop("name", Schema.string().required())
          .prop("description", Schema.string())
          .prop("startTime", Schema.string().required())
          .prop("endTime", Schema.string().required())
      )
      .required()
  )
  .valueOf() as JSONSchema;

// RESPONSE SCHEMA
// ====================================================================
// Response Schema of Sign Up
const signUpResponse: JSONSchema = Schema.object()
  .prop("token", Schema.string())
  .prop(
    "workspace",
    Schema.object()
      .prop("id", Schema.string())
      .prop("workspaceName", Schema.string())
      .prop("workspaceLogo", Schema.string())
  )
  .prop(
    "user",
    Schema.object().prop("id", Schema.string()).prop("emailId", Schema.string())
  )
  .prop("meta", Schema.object().prop("message", Schema.string()))
  .valueOf() as JSONSchema;

// =========================================================
// SIGN UP
export const SIGN_UP = {
  description:
    "The purpose of this schema is to define the structure and constraints for an API endpoint that creates a new workspace with admin user.",
  tags: ["AUTH"],
  body: signUpBody,
  response: makeResponseSchema(signUpResponse),
};
