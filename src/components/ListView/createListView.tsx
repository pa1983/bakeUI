import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Picker from '../Picker/Picker';
import { useData } from '../../contexts/DataContext';
import type { ListViewConfig } from '../../config/listViewConfig';

/**
 * A factory function that creates a configured list view component, for use in simple list views such as brands,
 * buyable, supplier, ingredients etc.
 * @param {ListViewConfig} config - The configuration for the specific list view.
 * @returns A React component that renders a configured Picker.
 */
export function createListView(config: ListViewConfig) {
    const { title, endpoint, pickerArraySelector } = config;

    // factory returns a complete, new React component
    const ListViewComponent = () => {
        const dataContext = useData();
        const navigate = useNavigate();

        // Use selector function to get the correct array from the context
        const pickerArray = pickerArraySelector(dataContext);

        // when an element is selected from a list view, we always want to navigate to the element form
        const elementOnSelect = useCallback((id: number | string) => {
            navigate(`/${endpoint}/${id}`);
        }, [navigate]);

        // when the Add New button is clicked in a list view, we always want to create open a new element form
        const pickerOnAddNewClicked = useCallback(() => {
            navigate(`/${endpoint}/new`);
        }, [navigate]);

        return (
            <Picker
                pickerArray={pickerArray}
                pickerTitle={title}
                pickerOnSelect={elementOnSelect}
                onClose={() => {}} // onClose - no on close required in list view, only in modal, but here for clarity and this note
                pickerOnAddNewClicked={pickerOnAddNewClicked}
            />
        );
    };

    // Set a display name - will be visible in React devtools
    ListViewComponent.displayName = `${title}ListView`;

    return ListViewComponent;
}