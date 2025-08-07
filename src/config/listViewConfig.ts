import type { IPickerElement } from '../models/picker';
import type { DataContextType } from '../contexts/DataContext'; // Assuming you export this type

export interface ListViewConfig {
    /** The title to display at the top of the list/picker. */
    title: string;

    /** The base API endpoint for navigation (e.g., 'buyable/brand'). */
    endpoint: string;

    /** A function that selects the correct picker array from the data context. */
    pickerArraySelector: (data: DataContextType) => IPickerElement[];
}