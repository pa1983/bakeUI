/**
 * Formats a number for display. If the number is an integer, it's displayed without decimal places.
 * Otherwise, it's displayed with its original decimal places.
 * @param value The number to format.
 * @returns A string representation of the formatted number.
 */
export const formatQuantity = (value: number|string|null|undefined): string => {
    if (value == null || value === '') {
        return '0';
    }
    if (typeof value === 'string') {
        value = parseInt(value, 10);
    }
    if (value % 1 === 0) {
        return value.toFixed(0); // Display as integer
    } else {
        return String(value); // Display with original decimal places
    }
};