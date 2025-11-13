/**
 * Formats a Date object into a 'YYYY-MM-DD' string for API requests.
 * @param date The date to format.
 */
export const formatDateForApi = (date: Date): string => {
    return date.toISOString().split('T')[0];
};