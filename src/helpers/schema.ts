import Schema, { JSONSchema } from "fluent-json-schema";

export const commonHeaders = Schema.object()
  .id("commonHeaders")
  .prop(
    "authorization",
    Schema.string().description("The authorization token for authentication.")
  );

export const commonQuerys = Schema.object()
  .id("commonQuerys")
  .additionalProperties(false)
  .prop(
    "offset",
    Schema.number().description(
      "The starting point of the data to be retrieved in the paginated response."
    )
  )
  .prop(
    "limit",
    Schema.number().description(
      "The maximum number of items to be included in a single page of the paginated response."
    )
  )
  .prop(
    "search",
    Schema.string().description(
      "Based on the search value, the number of items will be retrieved in the paginated response."
    )
  );

/**
 * Generates a response schema object containing predefined JSON schemas for different HTTP status codes.
 *
 * @param {JSONSchema} response - The JSON schema representing the successful response body for the 200 status code.
 *
 * @returns {Record<string, JSONSchema>} - An object mapping HTTP status codes to their corresponding JSON schemas.
 *
 * The function returns an object with predefined response schemas for the following status codes:
 * - "200": Represents a successful response and uses the provided schema.
 * - "400": Represents a bad request with an error and message properties.
 * - "401": Represents an unauthorized response with additional properties allowed.
 * - "409": Represents a conflict error with additional properties allowed.
 * - "500": Represents an internal server error with additional properties allowed.
 */
export const makeResponseSchema = (
  response: JSONSchema
): Record<string, JSONSchema> => {
  const responseType: Record<string, JSONSchema> = {
    "200": response,
    "400": Schema.object()
      .description("Bad Request")
      .prop("error", Schema.boolean())
      .prop("message", Schema.string())
      .valueOf() as JSONSchema,
    "401": Schema.object()
      .description("Un Authorized response")
      .prop("error", Schema.boolean())
      .prop("message", Schema.string())
      .additionalProperties(true)
      .valueOf() as JSONSchema,
    "409": Schema.object()
      .description("Error Response")
      .prop("error", Schema.boolean())
      .prop("message", Schema.string())
      .additionalProperties(true)
      .valueOf() as JSONSchema,
    "422": Schema.object()
      .description("Validation Error Response")
      .prop("error", Schema.boolean())
      .prop("message", Schema.string())
      .additionalProperties(true)
      .valueOf() as JSONSchema,
    "500": Schema.object()
      .description("Internal Server Error Response")
      .prop("error", Schema.boolean())
      .prop("message", Schema.string())
      .additionalProperties(true)
      .valueOf() as JSONSchema,
  };
  return responseType;
};
