import { parse, format } from 'date-fns';
import { constants } from '@config';

/**
 * Converts a time string from 12-hour format to 24-hour format with seconds.
 *
 * @param {string} time - The time string in 12-hour format (e.g., "01:30 PM" or "6 AM").
 * @returns {string} The time string converted to 24-hour format with seconds.
 */
export const convertTo24HourFormat = (time: string): string => {
  try {
    // Try parsing with "h:mm a" format first (e.g., "01:30 PM")
    try {
      const parsedTime = parse(time, constants.TIME_CONSTANTS.FORMATS.TIME_12H, new Date());
      return format(parsedTime, constants.TIME_CONSTANTS.FORMATS.TIME_24H);
    } catch {
      // If that fails, try parsing with "h a" format (e.g., "6 AM")
      const parsedTime = parse(time, constants.TIME_CONSTANTS.FORMATS.TIME_12H_SHORT, new Date());
      return format(parsedTime, constants.TIME_CONSTANTS.FORMATS.TIME_24H);
    }
  } catch (error) {
    // Fallback for invalid time format
    console.warn(`Invalid time format: ${time}, returning original`);
    return time;
  }
};

/**
 * Recursively processes nested objects and converts time properties to 24-hour format.
 *
 * @param {Record<string, any>} obj - The object to process.
 */
export const processNestedObjects = (obj: Record<string, any>): void => {
  const timeRegex = constants.TIME_CONSTANTS.REGEX.TIME_12H;
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string' && timeRegex.exec(value)) {
      obj[key] = convertTo24HourFormat(value);
    } else if (typeof value === 'object' && value !== null) {
      processNestedObjects(value);
    }
  }
};
