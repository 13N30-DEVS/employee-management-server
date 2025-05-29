import * as aws from "aws-sdk";
import { env } from "@config";

aws.config.update({
  endpoint: env.S3_URL,
  accessKeyId: env.AWS_ACCESS_KEY,
  secretAccessKey: env.AWS_SECRET,
} as any);

const s3 = new aws.S3();

/**
 * @function s3Upload
 * @description Uploads a file to the S3 Bucket and returns the file URL & Path
 * @param {Object} file - The file buffer to be uploaded
 * @return {Promise<Object>}
 * @throws {Error}
 */
export const s3Upload = (file: any): Promise<object> => {
  return new Promise(async (resolve, reject) => {
    try {
      // File Type
      const fileType: string =
        file?.mimetype?.toString()?.split("/")?.[1] ?? "";

      // s3 Params
      const s3Params: any = {
        Bucket: env.AWS_BUCKET_NAME,
        Key: Date.now().toString() + "." + fileType,
        Body: file?.buffer,
      };

      s3.putObject(s3Params)
        .promise()
        .then(() => {
          let url: string = `https://${env.AWS_BUCKET_NAME}.${env.S3_URL}/${s3Params.Key}`;
          resolve({
            status: 200,
            type: "Success",
            filePath: s3Params?.Key,
            fileURL: url,
          });
        })
        .catch((error) => {
          resolve({
            status: 500,
            type: "Error",
            errorData: error,
          });
        });
    } catch (error: any) {
      console.log("Error while uploading file to S3 : ", error);
      reject(new Error(error.message));
    }
  });
};
