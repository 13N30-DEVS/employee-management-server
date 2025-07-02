import { makeResponseSchema } from "@helpers";
import Schema, { JSONSchema } from "fluent-json-schema";

const getDesignationResponses: JSONSchema = Schema.object()
  .prop(
    "page",
    Schema.array().items(
      Schema.object()
        .prop("id", Schema.integer())
        .prop("name", Schema.string())
        .prop("description", Schema.string())
        .additionalProperties(true)
    )
  )
  .prop("count", Schema.integer())
  .prop("limit", Schema.integer())
  .prop("offset", Schema.integer())
  .prop("totalPages", Schema.integer())
  .prop("totalCount", Schema.integer())
  .prop("previousPage", Schema.anyOf([Schema.integer(), Schema.null()]))
  .prop("currentPage", Schema.integer())
  .prop("nextPage", Schema.anyOf([Schema.integer(), Schema.null()]))
  .prop("previousPageLink", Schema.anyOf([Schema.string(), Schema.null()]))
  .prop("currentPageLink", Schema.string())
  .prop("nextPageLink", Schema.anyOf([Schema.string(), Schema.null()]))
  .prop("firstPageLink", Schema.string())
  .prop("lastPageLink", Schema.string())
  .prop("meta", Schema.object().prop("message", Schema.string()))
  .valueOf() as JSONSchema;

export const GET_ALL = {
  description:
    "The purpose of this schema is to define the structure and constraints for an API endpoint that gets all designations.",
  tags: ["DESIGNATIONS"],
  headers: Schema.ref("commonHeaders").valueOf() as JSONSchema,
  query: Schema.ref("commonQuerys").valueOf() as JSONSchema,
  response: makeResponseSchema(getDesignationResponses),
};
