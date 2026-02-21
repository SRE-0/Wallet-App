/**
 * Formats a Date object according to the user's device locale.
 * 
 * This function is used to display transaction dates
 * in a short, localized format (e.g., 6 Dec. 2026).
 * 
 * @param date - Native JavaScript Date object.
 * @returns Formatted date string.
 */
export const formatTransactionDate = (date: Date): string => {
  return new Intl.DateTimeFormat(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export const formatTransactionDateSlim = (date: Date): string => {
  return new Intl.DateTimeFormat(undefined, {
    day: 'numeric',
    month: 'short',
  }).format(date);
};