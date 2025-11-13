import type {ReactNode} from "react";

export interface IPickerElement {
    // ID is required and should be unique for each item in the picker array.  It is typically the primary key of
    // the related table entry.
    // a single element in a picker array.  The title can be any string the developer wants to use to
    // concisely describe the item.
    // The subtitle is optional and can be used to provide additional information about the item.
    // The imageUrl is optional and can be used to provide a thumbnail image for the item.
    // optionally allow a body attribute to be passed in so as to render a complex element if required, e.g. when displaying an invoice etc
    id: number;
    title: string;
    subtitle: string | null;

    imageUrl: string | null;
    body?: ReactNode;
}

export interface PickerProps {
    // The array of items to display in the picker list, conforming to the IPickerElement interface.
    pickerArray: IPickerElement[];
    // The title displayed at the top of the picker list.
    pickerTitle: string;
    // Callback function executed when an item is selected from the list.
    // Takes the ID of the selected item as an argument.
    // Typically used to pass the selected item's ID to a parent component for entry into a form.
    pickerOnSelect: (id: number) => void;
    // Optional callback function executed when the picker is closed.
    onClose: () => void | null;
    // Callback function executed when the "Add New" button is clicked.
    // IN a modal it is used to flip the addNewFormActive boolean to switch between picker and new entry form views
    // In a page view it can trigger a navigation to the new item, or any other required logic
    pickerOnAddNewClicked?: () => void | null;
    pickerSubtitle?: string | null;
    // Optional text to display on the "Add New" button - if the text is not provided, the default "Add New" will be used.
    // should be overridden if the pickerOnAddNewClicked is not the standard behaviour of opening an add new form
    addNewButtonText?: string;
    // Defaults to true.  If false, the search bar will not be displayed to keept the picker list clean.
    showSearch?: boolean;
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
        pickerSubtitle: null,
        onClose: () => {
            // default function to warn if callback is called without being defined todo - define this
            console.warn('onClose was called, but no handler was provided.');
        },

    };
};