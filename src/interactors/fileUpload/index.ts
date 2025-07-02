import { s3Upload } from "@helpers";

/**
 * @function singleFileUpload
 * @description Uploads a single file to the s3 Bucket and returns the file URL & Path
 * @param {Object} params
 * @param {any} params.uploadedFile - The file buffer to be uploaded
 * @return {Promise<Object>}
 * @throws {Error}
 */
export async function singleFileUpload({
  uploadedFile,
}: {
  uploadedFile: any;
}): Promise<object> {
  try {
    let fileURL: string = "";
    let filePath: string = "";

    // Uploading Single File To S3 Bucket & Genrate File URL & Path
    let uploadData: any = await s3Upload(uploadedFile);

    if (uploadData?.status === 200) {
      // If Uploading File to s3 Gets Success
      fileURL = uploadData?.fileURL;
      filePath = uploadData?.filePath;
      return {
        code: 200,
        responseData: { fileName: uploadedFile?.fileName, fileURL, filePath },
      };
    } else {
      // If Uploading File to s3 Gets Error
      console.log(
        "Error While Uploading Profile Picture",
        uploadData?.errorData
      );
      throw new Error(uploadData?.errorData);
    }
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
}
