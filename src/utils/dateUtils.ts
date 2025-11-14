/**
 * Formats a Date object into a 'YYYY-MM-DD' string for API requests.
 * @param date The date to format.
 */
export const formatDateForApi = (date: Date): string => {
    return date.toISOString().split('T')[0];
};

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * Formats a Date object for display purposes.
 * - Omits the year if it's the current year (e.g., "13 Nov").
 * - Includes the year if it's not the current year (e.g., "13 Nov 2024").
 * @param date The date to format.
 */
export const formatDateForDisplay = (date: Date): string => {
    const today = new Date();
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    if (year === today.getFullYear()) {
        return `${day} ${month}`;
    } else {
        return `${day} ${month} ${year}`;
    }
};