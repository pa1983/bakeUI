import {useMemo, useState} from 'react';
import ProductionList from './ProductionList';
import type {IProductionLog} from '../../models/IProductionLog';
import type {IPickerElement} from "../../models/picker.ts";
import {useDataFetcher} from "../../hooks/useDataFetcher.ts";
import {useData} from "../../contexts/DataContext.tsx";
import {DateRangePicker} from "../Utility/DateRangePicker.tsx";
import type {DateRange} from "react-day-picker";
import {formatDateForApi, formatDateForDisplay} from "../../utils/dateUtils.ts";
import {ProductionLogDetails} from "./ProductionLogDetails.tsx";

const ProductionListWrapper = () => {
    // --- State Management for Date Range ---
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    // State for the dates currently selected in the picker UI
    const [fromDate, setFromDate] = useState<Date>(sevenDaysAgo);
    const [toDate, setToDate] = useState<Date>(today);
    const [selectedRange, setSelectedRange] = useState<DateRange | undefined>({from: fromDate, to: toDate});

    // State for controlling the displayed month in the calendar
    const [calendarMonth, setCalendarMonth] = useState<Date>(today);

    // State for the dates that have been applied and are used for fetching
    const [appliedFromDate, setAppliedFromDate] = useState<Date>(sevenDaysAgo);
    const [appliedToDate, setAppliedToDate] = useState<Date>(today);

    // State for the label of the currently selected shortcut
    const [selectedShortcutLabel, setSelectedShortcutLabel] = useState<string | null>('Past 7 Days');


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

    const {recipes, productionTypes} = useData();

    // --- Data Transformation ---
    const ProductionLogPickerArray = useMemo((): IPickerElement[] => {
        if (!data || !recipes) return []; // Ensure data and recipes are loaded

        return (data || []).map((production_log_entry): IPickerElement => {
            const foundRecipe = recipes.find(r => r.recipe_id === production_log_entry.recipe_id);
            const recipeTitle = foundRecipe ? foundRecipe.recipe_name : `Unknown Recipe (ID: ${production_log_entry.recipe_id})`;
            const productionType = productionTypes.find(t => t.id === production_log_entry.production_type_id);
            return {
                id: production_log_entry.id,
                title: recipeTitle,
                subtitle: `Logged on: ${production_log_entry.created_at ?( new Date(production_log_entry.created_at)) : 'N/A'}`,
                body: (
                    <ProductionLogDetails
                        productionQuantity={parseInt(String(production_log_entry.quantity ?? 0))}
                        expectedQuantity={parseInt(String(foundRecipe?.recipe_quantity ?? 0))}
                        productionType = {productionType}
                    />
                ),
                imageUrl: null
            };
        });
    }, [data, recipes]);

    // --- Event Handlers ---

    // Handles manual selection from the calendar. Updates UI state but does NOT fetch.
    const handleCalendarSelect = (dateRange: DateRange | undefined) => {
        setSelectedRange(dateRange);
        setSelectedShortcutLabel(null); // A manual selection clears the shortcut label
        if (dateRange?.from && dateRange?.to) {
            setFromDate(dateRange.from);
            setToDate(dateRange.to);
            setCalendarMonth(dateRange.from); // Move calendar to the selected month
        }
    }

    // Handles shortcut clicks. Updates UI and "applied" state to FETCH immediately.
    const handleShortcutSelect = (dateRange: DateRange, label: string) => {
        setSelectedRange(dateRange);
        setSelectedShortcutLabel(label); // Set the shortcut label
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
        setSelectedShortcutLabel(null); // Applying a custom range clears the shortcut label
    }

    // --- Render Logic ---
    if (loading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>Error loading production logs or recipes.</div>;
    }

    const subtitleText = selectedShortcutLabel
        ? `Showing logs for ${selectedShortcutLabel} (${formatDateForDisplay(appliedFromDate)} to ${formatDateForDisplay(appliedToDate)})`
        : `Showing logs from ${formatDateForDisplay(appliedFromDate)} to ${formatDateForDisplay(appliedToDate)}`;

    return (<>
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
            <ProductionList pickerArray={ProductionLogPickerArray}
                            subtitle={subtitleText}/>
        </>
    )
}
export default ProductionListWrapper;