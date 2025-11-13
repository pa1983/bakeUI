import {useMemo, useState} from 'react';
import ProductionList from './ProductionList';
import type {IProductionLog} from '../../models/IProductionLog';
import type {IPickerElement} from "../../models/picker.ts";
import {useDataFetcher} from "../../hooks/useDataFetcher.ts";
import {useData} from "../../contexts/DataContext.tsx";
import {DateRangePicker} from "../Utility/DateRangePicker.tsx";
import type {DateRange} from "react-day-picker";
import {formatDateForApi} from "../../utils/dateUtils.ts";

const ProductionListWrapper = () => {
    // --- State Management for Date Range ---
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    // State for the dates currently selected in the picker UI
    const [fromDate, setFromDate] = useState<Date>(sevenDaysAgo);
    const [toDate, setToDate] = useState<Date>(today);
    const [selectedRange, setSelectedRange] = useState<DateRange | undefined>({ from: fromDate, to: toDate });

    // State for controlling the displayed month in the calendar
    const [calendarMonth, setCalendarMonth] = useState<Date>(today);

    // State for the dates that have been applied and are used for fetching
    const [appliedFromDate, setAppliedFromDate] = useState<Date>(sevenDaysAgo);
    const [appliedToDate, setAppliedToDate] = useState<Date>(today);


    // --- Data Fetching ---
    // The hook now depends on the "applied" dates, so it only refetches when they change.
    const {
        data,
        loading,
        error,
    } = useDataFetcher<IProductionLog[]>('/production/all', {
        start_date: formatDateForApi(appliedFromDate),
        end_date: formatDateForApi(appliedToDate)
    });

    const {recipes} = useData();

    // --- Data Transformation ---
    const ProductionLogPickerArray = useMemo((): IPickerElement[] => {
        if (!data || !recipes) return []; // Ensure data and recipes are loaded

        return (data || []).map((production_log_entry): IPickerElement => {
            const foundRecipe = recipes.find(r => r.recipe_id === production_log_entry.recipe_id);
            const recipeTitle = foundRecipe ? foundRecipe.recipe_name : `Unknown Recipe (ID: ${production_log_entry.recipe_id})`;
            return {
                id: production_log_entry.id,
                title: recipeTitle,
                subtitle: `Quantity produced: ${production_log_entry.quantity}`,
                imageUrl: null
            };
        });
    }, [data, recipes]);

    // --- Event Handlers ---

    // Handles manual selection from the calendar. Updates UI state but does NOT fetch.
    const handleCalendarSelect = (dateRange: DateRange | undefined) => {
        setSelectedRange(dateRange);
        if (dateRange?.from && dateRange?.to) {
            setFromDate(dateRange.from);
            setToDate(dateRange.to);
            setCalendarMonth(dateRange.from); // Move calendar to the selected month
        }
    }

    // Handles shortcut clicks. Updates UI and "applied" state to FETCH immediately.
    const handleShortcutSelect = (dateRange: DateRange) => {
        setSelectedRange(dateRange);
        if (dateRange.from && dateRange.to) {
            setFromDate(dateRange.from);
            setToDate(dateRange.to);
            setAppliedFromDate(dateRange.from);
            setAppliedToDate(dateRange.to);
            setCalendarMonth(dateRange.from); // Move calendar to the selected month
        }
    }

    // Applies the selected date range and triggers a fetch.
    function applyDateFilter() {
        setAppliedFromDate(fromDate);
        setAppliedToDate(toDate);
    }

    // --- Render Logic ---
    if (loading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>Error loading production logs or recipes.</div>;
    }

    return    (<>
            <div className="mb-4">
                <DateRangePicker
                    range={selectedRange}
                    onRangeSelect={handleCalendarSelect}
                    onShortcutSelect={handleShortcutSelect}
                    month={calendarMonth} // Pass the new prop
                />
            </div>
            <div>
                <button className="is-primary button" onClick={applyDateFilter}>Apply</button>
            </div>
            <ProductionList pickerArray={ProductionLogPickerArray}/>
        </>
    )
}
export default ProductionListWrapper;