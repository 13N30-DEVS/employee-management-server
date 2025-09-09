import { processNestedObjects } from '@helpers';

/**
 * Extracts relevant parameters from a FastifyRequest object.
 *
 * @param {FastifyRequest} request - The FastifyRequest object containing body parameters and URL.
 * @returns An object containing extracted parameters.
 * @throws {Error} Throws an error if there's an issue extracting parameters.
 */
function postRequestInfo(request: any) {
  try {
    const body = request.body;

    processNestedObjects(body);

    return {
      ...body,
    };
  } catch (error: any) {
    console.error('PostRequest mapper error:', error.message, error);
    throw new Error('Failed to extract request parameters.');
  }
}

export { postRequestInfo };
