export interface IPickerElement {
    // a single element in a picker array
    id: string | number;
    title: string;
    subtitle: string | null;
    imageUrl: string | null;
}

export interface PickerProps {
    // The array of items to display in the picker list.
    pickerArray: IPickerElement[];
    // The title displayed at the top of the modal.
    pickerTitle: string;
    // Callback function executed when an item is selected from the list. Takes the ID of the selected item as an argument.
    pickerOnSelect: (id: number | string) => void;
    onClose: () => void | null;
    // Callback function executed when the "Add New" button is clicked. IN a modal it will flip the addNewFormActive boolean, in a page view it can trigger a navigation to the new item form
    pickerOnAddNewClicked?: () => void | null;
    pickerSubtitle?: string | null;
}


// interface for sending props to picker modal.  Extends standard pickerProps, which the modal will just pass through to the picker component
export interface IPickerModalConfig extends PickerProps {
    // Controls if the modal is currently visible.  Do i need this or should the modal controls be handled in a layer above the picker?
    isPickerModalActive: boolean;
    // If true, the modal displays the `addNewComponent` instead of the list.
    addNewFormActive: boolean;
    // A React component (as a JSX element) to render when `addNewFormActive` is true.  Only renders when `addNewFormActive` is true. and JSX has been passed, otherwise nothing is rendered.
    addNewComponent: React.ReactNode | null;

}

/**
 * Creates and returns a default, empty configuration object for the picker modal.
 * This ensures a consistent initial state and avoids duplicating the object.
 * @returns {IPickerModalConfig} A default configuration object.
 */
export const createDefaultPickerModalConfig = (): IPickerModalConfig => {
    return {
        isPickerModalActive: false,
        pickerArray: [],
        pickerTitle: '',
        pickerOnSelect: (id: number | string) => {
            // default function to warn if callback is called without being defined
            console.warn(`pickerOnSelect was called, but no handler was provided to handle id ${id}`);
        },
        addNewFormActive: false,
        pickerOnAddNewClicked: () => {
            // default function to warn if callback is called without being defined
            console.warn('pickerOnAddNewClicked was called, but no handler was provided.');
        },
        addNewComponent: null,  // default of null will cause conditional logic to show nothing
        pickerSubtitle: null
    };
};