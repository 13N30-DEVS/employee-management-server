import { FastifyReply, FastifyRequest } from "fastify";
import { singleFileUpload } from "@interactors";
import { Logger, handleResponse, responseType } from "@helpers";

async function UploadFile(request: FastifyRequest, reply: FastifyReply) {
  try {
    // Request File
    const { file }: any = request.body;

    // Get Required Payload from Multipart Data
    let uploadedFile: object = {
      fileName: file?.filename,
      buffer: file?._buf,
      mimetype: file?.mimetype,
    };

    /* ---------- Interactors ---------- */
    // Calling Interactors to Upload File to S3 Bucket
    const res: any = await singleFileUpload({
      uploadedFile,
    });
    // -----------------------------
    //  RESPONSE
    // -----------------------------
    return handleResponse(request, reply, responseType?.OK, {
      data: res.responseData,
    });
  } catch (error: any) {
    Logger.error(request, error.message, error);
    return handleResponse(request, reply, responseType?.INTERNAL_SERVER_ERROR, {
      error: {
        message: responseType?.INTERNAL_SERVER_ERROR,
      },
    });
  }
}

export default { UploadFile };
