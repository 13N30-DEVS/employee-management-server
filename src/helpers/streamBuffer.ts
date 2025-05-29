import * as fs from "fs";

/**
 * Converts a stream to a buffer.
 *
 * @param {fs.ReadStream} stream A readable stream.
 *
 * @returns {Promise<Buffer>} A promise that resolves with the buffer.
 */
async function streamToBufferAsync(stream: fs.ReadStream): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];

    stream.on("data", (chunk: Buffer | string) => {
      if (typeof chunk === "string") {
        chunks.push(Buffer.from(chunk));
      } else {
        chunks.push(chunk);
      }
    });

    stream.on("end", () => {
      resolve(Buffer.concat(chunks));
    });

    stream.on("error", (error) => {
      reject(error);
    });
  });
}

export default { streamToBufferAsync };
