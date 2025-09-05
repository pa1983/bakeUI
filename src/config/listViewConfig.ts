import type { IPickerElement } from '../models/picker';
import type { DataContextType } from '../contexts/DataContext';

// utility type - Conditional Mapped Type -  looks at an object type `T`
// and returns a union of all its keys whose property values are of type `U`.
// in this case it is used to get all the elements in DataContextType which match the
// iPickerElement type
// ref: https://www.typescriptlang.org/docs/handbook/2/mapped-types.html
type KeysOfType<T, U> = { [K in keyof T]: T[K] extends U ? K : never }[keyof T];

export type PickerArrayName = KeysOfType<DataContextType, IPickerElement[]>;
export interface ListViewConfig {
    title: string;
    endpoint: string;
    pickerArray?: IPickerElement[]; // Optionally pass the array directly, prefilled in logic outside the context
    pickerArrayName?: PickerArrayName;   // OR - Optionally pass the name of the array in the context
    pickerArraySelector?: (dataContext: DataContextType) => IPickerElement[]; // Original method, now optional
    onSelectOverride?: (id: string|number) => void;  // default is to navigate to the detail page after selecting an item - override if needed
    onAddNewOverride?:() => void;   // Optionally allow for the override of the add new button to perform custom logic
}