import React, {useCallback, useMemo} from 'react';
import {useNavigate} from 'react-router-dom';
import Picker from '../Picker/Picker';
import {useData} from '../../contexts/DataContext';
import type {ListViewConfig} from '../../config/listViewConfig';


/**
 * A factory function that creates a configured list view component.
 * It can source its data directly, by name from a context, or via a selector function.
 * @param {ListViewConfig} config - The configuration for the specific list view.
 * @returns A React component that renders a configured Picker.
 */
export function createListView(config: ListViewConfig) {
    const {
        title, endpoint, pickerArray, pickerArrayName, pickerArraySelector,
        onSelectOverride,
        onAddNewOverride
    } = config;
// todo  - add handling for add new override
    const ListViewComponent = () => {
        const dataContext = useData();
        const navigate = useNavigate();

        // --> 2. Determine the data source with clear precedence.
        const itemsToRender = useMemo(() => {
            // Priority 1: Use the directly passed array if it exists.
            if (pickerArray) {
                return pickerArray;
            }

            // If a direct array isn't provided, we'll need the context.
            if (!dataContext) return [];

            // Priority 2: Use the array name to look up in the context.
            if (pickerArrayName) {
                // Safely access the property on the context data
                return dataContext[pickerArrayName] || [];
            }

            // Priority 3: Fallback to the selector function.
            if (pickerArraySelector) {
                return pickerArraySelector(dataContext);
            }

            // If no valid data source is configured, return an empty array.
            console.warn(`ListView for "${title}" has no valid data source configured.`);
            return [];
        }, [dataContext, pickerArray, pickerArrayName, pickerArraySelector]);


        /**
         * if an override exists, use it, else use a default of navigate to the selected item
         */
        const elementOnSelect = useCallback((id: number | string) => {
            if (onSelectOverride) {
                onSelectOverride(id);
            } else {

                navigate(`/${endpoint}/${id}`);
            }
        },
        [navigate, endpoint, onSelectOverride]
        );


        const pickerOnAddNewClicked = useCallback(() => {
            navigate(`/${endpoint}/new`);
        }, [navigate, endpoint]); // --> Added endpoint to dependency array

        return (
            <Picker
                pickerArray={itemsToRender}
                pickerTitle={title}
                pickerOnSelect={elementOnSelect}
                onClose={() => {
                }}
                pickerOnAddNewClicked={pickerOnAddNewClicked}
            />
        );
    };

    ListViewComponent.displayName = `${title.replace(/\s/g, '')}ListView`;

    return ListViewComponent;
}


// /**
//  * A factory function that creates a configured list view component, for use in simple list views such as brands,
//  * buyable, Supplier, ingredients etc.
//  * @param {ListViewConfig} config - The configuration for the specific list view.
//  * @returns A React component that renders a configured Picker.
//  */
// export function createListView(config: ListViewConfig) {
//     const {title, endpoint, pickerArraySelector} = config;
//
//     // factory returns a complete, new React component
//     const ListViewComponent = () => {
//         const dataContext = useData();
//         const navigate = useNavigate();
//
//         // Use selector function to get the correct array from the context
//         const pickerArray = pickerArraySelector(dataContext);
//
//         // when an element is selected from a list view, we always want to navigate to the element form
//         const elementOnSelect = useCallback((id: number | string) => {
//             navigate(`/${endpoint}/${id}`);
//         }, [navigate]);
//
//         // when the Add New button is clicked in a list view, we always want to create open a new element form
//         const pickerOnAddNewClicked = useCallback(() => {
//             navigate(`/${endpoint}/new`);
//         }, [navigate]);
//
//         return (
//             <Picker
//                 pickerArray={pickerArray}
//                 pickerTitle={title}
//                 pickerOnSelect={elementOnSelect}
//                 onClose={() => {
//                 }} // onClose - no on close required in list view, only in modal, but here for clarity and this note
//                 pickerOnAddNewClicked={pickerOnAddNewClicked}
//             />
//         );
//     };
//
//     // Set a display name - will be visible in React devtools
//     ListViewComponent.displayName = `${title}ListView`;
//
//     return ListViewComponent;
// }