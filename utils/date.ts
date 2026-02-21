/**
 * Formats a Date object according to the user's device locale.
 * 
 * This function is used to display transaction dates
 * in a short, localized format (e.g., 6 Dec. 2026).
 * 
 * @param date - Native JavaScript Date object.
 * @returns Formatted date string.
 */
/**
 * formatTransactionDate
 *
 * Formats a Date to a localized string including day, short month and year.
 *
 * @param date - JavaScript Date object to format
 * @returns Localized date string (e.g. "6 Feb 2026")
 */
export const formatTransactionDate = (date: Date): string => {
  return new Intl.DateTimeFormat(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

/**
 * formatTransactionDateSlim
 *
 * Formats a Date to a localized string without the year. Useful for
 * compact UI elements where the year is either implied or irrelevant.
 *
 * @param date - JavaScript Date object to format
 * @returns Localized date string without year (e.g. "6 Feb")
 */
export const formatTransactionDateSlim = (date: Date): string => {
  return new Intl.DateTimeFormat(undefined, {
    day: 'numeric',
    month: 'short',
  }).format(date);
};