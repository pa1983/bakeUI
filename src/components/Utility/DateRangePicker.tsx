// src/components/DateRangeCallbackPicker.tsx

import { DayPicker, type DateRange } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

interface DateRangePickerProps {
    range: DateRange | undefined;
    onRangeSelect: (range: DateRange | undefined) => void;
    onShortcutSelect: (range: DateRange, label: string) => void;
    month?: Date; // New optional prop
}

// --- Date Range Calculation Helpers ---

const getTodayRange = (): DateRange => {
    const today = new Date();
    return { from: today, to: today };
};

const getPastDaysRange = (days: number): DateRange => {
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - days);
    return { from, to };
};

const getWeekToDateRange = (): DateRange => {
    const to = new Date();
    const from = new Date(to);
    // Assuming Sunday is the first day of the week (getDay() === 0)
    from.setDate(to.getDate() - to.getDay());
    return { from, to };
};

const getMonthToDateRange = (): DateRange => {
    const to = new Date();
    const from = new Date(to.getFullYear(), to.getMonth(), 1);
    return { from, to };
};

const getYearToDateRange = (): DateRange => {
    const to = new Date();
    const from = new Date(to.getFullYear(), 0, 1);
    return { from, to };
};

const getPreviousMonthRange = (): DateRange => {
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const to = new Date(now.getFullYear(), now.getMonth(), 0); // Day 0 of current month is last day of previous month
    return { from, to };
};

const getSameWeekLastYearRange = (): DateRange => {
    const today = new Date();
    const fromCurrentWeek = new Date(today);
    fromCurrentWeek.setDate(today.getDate() - today.getDay()); // Start of current week (Sunday)

    const toCurrentWeek = new Date(fromCurrentWeek);
    toCurrentWeek.setDate(fromCurrentWeek.getDate() + 6); // End of current week (Saturday)

    const from = new Date(fromCurrentWeek);
    from.setFullYear(from.getFullYear() - 1);

    const to = new Date(toCurrentWeek);
    to.setFullYear(to.getFullYear() - 1);

    return { from, to };
};

const getSameMonthLastYearRange = (): DateRange => {
    const now = new Date();
    const from = new Date(now.getFullYear() - 1, now.getMonth(), 1);
    const to = new Date(now.getFullYear() - 1, now.getMonth() + 1, 0); // Day 0 of next month is last day of current month
    return { from, to };
};

const shortcuts = [
    { label: 'Today', getRange: getTodayRange },
    { label: 'Past 7 Days', getRange: () => getPastDaysRange(7) },
    { label: 'Week to Date', getRange: getWeekToDateRange },
    { label: 'Month to Date', getRange: getMonthToDateRange },
    { label: 'Year to Date', getRange: getYearToDateRange },
    { label: 'Previous Month', getRange: getPreviousMonthRange },
    { label: 'This week last year', getRange: getSameWeekLastYearRange },
    { label: 'This month last year', getRange: getSameMonthLastYearRange },
];


export function DateRangePicker({
    range,
    onRangeSelect,
    onShortcutSelect,
    month // Destructure new prop
}: DateRangePickerProps) {

    // This handler is for the shortcut buttons. It calls the onShortcutSelect prop with the new range and label.
    const handleShortcutClick = (getRange: () => DateRange, label: string) => {
        const newRange = getRange();
        // Create new Date objects to ensure state updates correctly
        // using the non-null assertion (!) here as the function is only ever called by the range of pre-defined
        // shortcuts, so we can be certain that null values will bever be returned.
        onShortcutSelect({ from: new Date(newRange.from!), to: new Date(newRange.to!) }, label);
    };

    return (
        <div className="is-flex is-align-items-flex-start" style={{ gap: '1.5rem' }}>
            <div className="is-flex is-flex-direction-column" style={{ gap: '0.5rem' }}>
                {shortcuts.map(({ label, getRange }) => (
                    <button
                        key={label}
                        className="button is-small is-fullwidth"
                        onClick={() => handleShortcutClick(getRange, label)}
                    >
                        {label}
                    </button>
                ))}
            </div>
            <DayPicker
                mode="range"
                selected={range}
                onSelect={onRangeSelect}
                numberOfMonths={2} // Changed from 1 to 2
                month={month} // Pass the month prop
            />
        </div>
    );
}
