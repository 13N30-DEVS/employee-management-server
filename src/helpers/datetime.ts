function now(type?: string) {
  return type !== 'unix' ? new Date() : Date.now;
}

/**
 * Calculates the number of days between two given dates.
 * @param {Date} date1 The first date.
 * @param {Date} date2 The second date.
 * @returns {number} The number of days between the two dates.
 */
function getDaysBetweenDates(date1: Date, date2: Date): number {
  const oneDay: number = 1000 * 60 * 60 * 24; // Milliseconds in one day
  const timeDiff: number = Math.abs(date2.getTime() - date1.getTime());
  return Math.floor(timeDiff / oneDay);
}
/**
 * Converts a given date to a string in the format HH:MM:SS.
 * @param {Date} date The date to convert.
 * @returns {string} A string representation of the given date in the format HH:MM:SS.
 */
function getTimeString(date: Date): string {
  const hours: number = date.getHours();
  const minutes: number = date.getMinutes();
  const seconds: number = date.getSeconds();
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
}
/**
 * Converts a given date to a string in the format "Sat Mar 28 2020".
 * @param {Date} date The date to convert.
 * @returns {string} A string representation of the given date in the format "Sat Mar 28 2020".
 */
function getShortDateString(date: Date): string {
  return date.toDateString();
}

/**
 * Converts a given date to a string in the ISO format "YYYY-MM-DDTHH:mm:ss.sssZ".
 * @param {Date} date The date to convert.
 * @returns {string} A string representation of the given date in the ISO format.
 */
function getISODateString(date: Date): string {
  return date.toISOString();
}

/**
 * Subtracts one day from a given date and returns the new date as a string
 * in the format "YYYY-MM-DD HH:MM:SS".
 * @param {Date} dates The date to subtract one day from.
 * @returns {string} A string representation of the new date.
 */
function subtractOneDay(dates: Date): string {
  let date = new Date(dates);
  date.setDate(date.getDate() - 1);

  // Get the date components
  let year = date.getFullYear();
  let month = String(date.getMonth() + 1).padStart(2, '0');
  let day = String(date.getDate()).padStart(2, '0');
  let hours = String(date.getHours()).padStart(2, '0');
  let minutes = String(date.getMinutes()).padStart(2, '0');
  let seconds = String(date.getSeconds()).padStart(2, '0');

  // Return the formatted date string
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export default {
  now,
  getDaysBetweenDates,
  getTimeString,
  getShortDateString,
  getISODateString,
  subtractOneDay,
};
