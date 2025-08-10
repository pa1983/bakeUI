import type { IPickerElement } from '../models/picker';
import type { DataContextType } from '../contexts/DataContext'; // Assuming you export this type

// export interface ListViewConfig {
//     /** The title to display at the top of the list/picker. */
//     title: string;
//
//     /** The base API endpoint for navigation (e.g., 'buyable/brand'). */
//     endpoint: string;
//
//     /** A function that selects the correct picker array from the data context. */
//     pickerArraySelector: (data: DataContextType) => IPickerElement[];
// }



// Update the config type to include the new optional properties.
// The selector is also now optional, allowing for pickerArray to be passed in by calling function,
// to allow for instances where the array required is not in the data context
export interface ListViewConfig {
    title: string;
    endpoint: string;
    pickerArray?: IPickerElement[]; // Optionally pass the array directly
    pickerArrayName?: string;   // Optionally pass the name of the array in the context
    pickerArraySelector?: (dataContext: any) => IPickerElement[]; // Original method, now optional
    onSelectOverride?: (id: string|number) => void;
    onAddNewOverride?:(id: string|number) => void;   // is this the signature i want here????
}