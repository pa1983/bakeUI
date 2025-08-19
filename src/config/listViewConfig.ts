import type { IPickerElement } from '../models/picker';
import type { DataContextType } from '../contexts/DataContext';

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