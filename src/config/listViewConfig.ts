import type { IPickerElement } from '../models/picker';
import type { DataContextType } from '../contexts/DataContext';

// utility type - Condotional Mapped Type -  looks at an object type `T`
// and returns a union of all its keys whose property values are of type `U`.
// in this case I'm using it to get all the elements in DataContextType which match the
// iPickerElement type
// ref: https://www.typescriptlang.org/docs/handbook/2/mapped-types.html
type KeysOfType<T, U> = { [K in keyof T]: T[K] extends U ? K : never }[keyof T];

export type PickerArrayName = KeysOfType<DataContextType, IPickerElement[]>;
// The selector is also now optional, allowing for pickerArray to be passed in by calling function,
// to allow for instances where the array required is not in the data context
export interface ListViewConfig {
    title: string;
    endpoint: string;
    pickerArray?: IPickerElement[]; // Optionally pass the array directly, prefilled in logic outside the context
    pickerArrayName?: PickerArrayName;   // Optionally pass the name of the array in the context
    pickerArraySelector?: (dataContext: DataContextType) => IPickerElement[]; // Original method, now optional
    onSelectOverride?: (id: string|number) => void;
    onAddNewOverride?:() => void;   // is this the signature i want here????
}