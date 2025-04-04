import * as moment from "moment";

/**
 * Converts a time string from 12-hour format to 24-hour format with seconds.
 *
 * @param {string} time - The time string in 12-hour format (e.g., "01:30 PM").
 * @returns {string} The time string converted to 24-hour format with seconds.
 */
export const convertTo24HourFormat = (time: string): string => {
  return moment(time, ["h:mm A"]).format("HH:mm:ss");
};

/**
 * Recursively processes nested objects and converts time properties to 24-hour format.
 *
 * @param {Record<string, any>} obj - The object to process.
 */
export const processNestedObjects = (obj: Record<string, any>): void => {
  for (const [key, value] of Object.entries(obj)) {
    if (
      typeof value === "string" &&
      value.match(/^(0[1-9]|1[0-2]):[0-5][0-9] [APMapm]{2}$/)
    ) {
      obj[key] = convertTo24HourFormat(value);
    } else if (typeof value === "object") {
      processNestedObjects(value);
    }
  }
};
